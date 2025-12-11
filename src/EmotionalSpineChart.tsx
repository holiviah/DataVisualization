/*
Goal:

Create an interactive emotional visualization inspired by the Nature immersive project.
https://www.nature.com/immersive/d41586-019-03165-4/index.html

Data model (one row per scene):

scene: number (1 to 33)
emotionCluster: string (e.g. "fear", "sadness", "hope", etc.)
intensity: number (1 to 10) // how strong the main emotion felt
secondaryEmotions: string[] or a comma separated string (e.g. "tension,dread,suspense")
character: string // who says the quote for that scene
sceneContext: string // short description of what happens in the scene
quote: string // quote spoken by the character in that scene

Layout:

Use the spine.glb

Place 33 main particles around this spine in chronological order:

scene 1 should start near the top of the spine
scene 33 should end near the bottom of the spine
scenes in between should be evenly spaced along the spine path

For each scene:

Compute a position along the spine based on the scene number (1–33).
Slightly offset the particle from the spine (left/right or radial) so clusters do not sit directly on the line.

Main emotion particle:

For each scene, create one main particle (a circle).

The color of this particle is determined by the emotionCluster (use a fixed color scale, e.g. a mapping from cluster name to color).

The radius of the particle is based on the intensity (1–10):

Define a radius scale, for example:

- minRadius = 6
- maxRadius = 24
- radius = minRadius + (intensity / 10) * (maxRadius - minRadius)


Secondary emotion particles:

Each main emotion cluster can have additional smaller, fainter particles around it.

These are based on the secondaryEmotions for that scene.

For example: scene 1 has emotionCluster = "fear" and secondaryEmotions = ["tension", "dread", "suspense"].

For each secondary emotion:

Draw a smaller circle near the main particle (orbiting or clustered around it).

The radius should be smaller than the main particle, for example mainRadius * 0.4.

Use a more transparent version of the main cluster color or a lighter tint.

Arrange the secondary particles in a small ring or fan shape around the main node so they do not overlap each other.

Hover interaction:

When the user hovers over a main particle:

Show a tooltip near the cursor.

The tooltip should display:

- scene number
- sceneContext
- character name
- quote


Highlight the hovered main particle (e.g. increase stroke, brighten color, or slightly increase radius).

Optionally dim other particles in the background while one is active.

Connections:

There are two kinds of connections between particles:

Chronological connections:

 - Connect each scene to the next scene using a subtle line (scene 1 -> scene 2 -> ... -> scene 33).

 - This should form a continuous path following the spine, showing the narrative timeline.


Character connections:

 - For each character, connect all scenes where that character speaks the quote.

 - These lines should be visually distinct from the chronological line:

   - e.g. thinner, dashed, different color or lower opacity.

 - Only connect nodes that share the same character, in the order of their scene numbers.


Interaction with connections:

When a main particle is hovered:

Highlight:

- the line to the previous and next scene (chronological neighbors)

- all links that involve the same character


Optionally highlight other particles that share the same character.

Rendering details:

Use a fixed color mapping for emotionCluster, for example:

fear -> purple
sadness -> deep blue
anger -> red
hope -> warm yellow
curiosity -> teal
etc.

Make sure the background is dark enough for the particles and lines to read clearly.

Use requestAnimationFrame or a simple render loop if we decide to animate subtle drifting of particles.

Steps for implementation:

Load the CSV and parse it into an array of SceneNodes with the fields described above.

Create scales:

yScale: maps scene (1–33) to vertical position along the spine.
radiusScale: maps intensity (1–10) to radius.
colorScale: maps emotionCluster to color.

Compute layout positions for each scene (x, y), plus offset positions for secondary particles.

Render:

the spine
chronological connections (lines between consecutive scenes)
character connections (lines grouped by character)
main particles
secondary particles

Add hover interactions for main particles with tooltip and highlighting.

Please implement this visualization in React + TypeScript using either SVG + D3 or HTML Canvas. Start by defining the SceneNode type and some example mock data, then build the layout and rendering step by step.
*/

// TypeScript data shape for scene nodes
export type EmotionCluster =
  | 'fear'
  | 'sadness'
  | 'hope'
  | 'anger'
  | 'curiosity'
  | 'tenderness'
  | 'longing'
  | 'other';

export interface SceneNode {
  scene: number; // 1–33
  emotionCluster: EmotionCluster;
  intensity: number; // 1–10
  secondaryEmotions: string[];
  character: string;
  sceneContext: string;
  quote: string;
}

type SceneNodeWithLayout = SceneNode & {
  x: number;
  y: number;
  radius: number;
  secondaryNodes: { label: string; x: number; y: number; radius: number; color: string }[];
};

import React, { useEffect, useMemo, useState } from 'react';

const EMOTION_COLORS: Record<EmotionCluster | 'other', string> = {
  fear: '#9b5de5',
  sadness: '#4361ee',
  hope: '#ffb703',
  anger: '#ef476f',
  curiosity: '#06d6a0',
  tenderness: '#ffb4a2',
  longing: '#7c6fbb',
  other: '#cccccc'
};

const MIN_RADIUS = 6;
const MAX_RADIUS = 24;
const GOLDEN_ANGLE = 137.508; // degrees

function clampIntensity(intensity: number) {
  return Math.max(1, Math.min(10, intensity));
}

function radiusScale(intensity: number) {
  const t = clampIntensity(intensity) / 10;
  return MIN_RADIUS + t * (MAX_RADIUS - MIN_RADIUS);
}

function getEmotionColor(cluster: string) {
  const key = cluster.toLowerCase() as EmotionCluster;
  return EMOTION_COLORS[key] ?? EMOTION_COLORS.other;
}

function lighten(color: string, factor = 0.45) {
  const c = color.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const mix = (chan: number) => Math.round(chan + (255 - chan) * factor);
  return `rgba(${mix(r)}, ${mix(g)}, ${mix(b)}, 0.55)`;
}

function extractCharacter(quote: string): string {
  const dashIdx = quote.lastIndexOf(' - ');
  if (dashIdx !== -1) return quote.slice(dashIdx + 3).trim();
  return 'Unknown';
}

function stripSpeaker(quote: string): string {
  const dashIdx = quote.lastIndexOf(' - ');
  if (dashIdx !== -1) return quote.slice(0, dashIdx).trim();
  return quote.trim();
}

function parseIntensity(raw: string): number {
  if (!raw) return 5;
  const parts = raw.split('/');
  const num = parseFloat(parts[0]);
  return Number.isFinite(num) ? num : 5;
}

function parseSecondary(raw: string): string[] {
  return raw
    .replace(/^"|"$/g, '')
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseCsvLine(line: string): string[] {
  // Simple CSV splitter handling quoted fields
  const regex = /([^,\"]+|\"([^\"]|\\\")*\")(?=,|$)/g;
  const cols: string[] = [];
  let match;
  while ((match = regex.exec(line)) !== null) {
    cols.push(match[0].replace(/^\"|\"$/g, ''));
  }
  return cols;
}

export function parseCsvToSceneNodes(csv: string): SceneNode[] {
  const lines = csv.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
  const header = lines.shift();
  if (!header) return [];
  const nodes: SceneNode[] = [];
  for (const line of lines) {
    const cols = parseCsvLine(line);
    if (cols.length < 7) continue;
    const scene = parseInt(cols[0], 10);
    if (!Number.isFinite(scene)) continue;

    const emotionCluster = (cols[2] || 'other').toLowerCase() as EmotionCluster;
    const intensity = parseIntensity(cols[3]);
    const secondaryEmotions = parseSecondary(cols[4] || '');
    const sceneContext = cols[5] || '';
    const rawQuote = cols[6] || '';
    const character = extractCharacter(rawQuote);
    const quote = stripSpeaker(rawQuote);

    nodes.push({
      scene,
      emotionCluster,
      intensity,
      secondaryEmotions,
      character,
      sceneContext,
      quote
    });
  }
  return nodes.sort((a, b) => a.scene - b.scene);
}

function computeLayout(nodes: SceneNode[], width: number, height: number): SceneNodeWithLayout[] {
  const top = height * 0.08;
  const bottom = height * 0.92;
  const cx = width * 0.5;
  const radialBase = Math.min(width, height) * 0.07;
  const radialJitter = Math.min(width, height) * 0.04;

  return nodes.map((n, idx) => {
    const t = nodes.length === 1 ? 0 : (n.scene - 1) / (nodes.length - 1);
    const y = top + t * (bottom - top);
    const angle = ((n.scene * GOLDEN_ANGLE) % 360) * (Math.PI / 180);
    const mainRadius = radiusScale(n.intensity);
    const offset = radialBase + radialJitter * Math.sin(idx * 0.7);
    const x = cx + Math.cos(angle) * offset;

    const secondaryNodes = (n.secondaryEmotions || []).map((label, i, arr) => {
      const theta = angle + (i / Math.max(1, arr.length)) * Math.PI * 1.8 + 0.4;
      const r = mainRadius * 1.4;
      return {
        label,
        x: x + Math.cos(theta) * r,
        y: y + Math.sin(theta) * r,
        radius: mainRadius * 0.45,
        color: lighten(getEmotionColor(n.emotionCluster), 0.6)
      };
    });

    return {
      ...n,
      x,
      y,
      radius: mainRadius,
      secondaryNodes
    };
  });
}

function groupCharacterLinks(nodes: SceneNodeWithLayout[]) {
  const byChar = new Map<string, SceneNodeWithLayout[]>();
  nodes.forEach((n) => {
    const key = n.character.toLowerCase();
    if (!byChar.has(key)) byChar.set(key, []);
    byChar.get(key)!.push(n);
  });
  const links: { character: string; points: SceneNodeWithLayout[] }[] = [];
  byChar.forEach((list, char) => {
    if (list.length < 2) return;
    links.push({ character: char, points: list.sort((a, b) => a.scene - b.scene) });
  });
  return links;
}

export const EmotionalSpineChart: React.FC<{
  data: SceneNode[];
  width?: number;
  height?: number;
}> = ({ data, width = 960, height = 1400 }) => {
  const [hovered, setHovered] = useState<SceneNodeWithLayout | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: SceneNodeWithLayout } | null>(null);

  const layout = useMemo(() => computeLayout(data, width, height), [data, width, height]);
  const characterLinks = useMemo(() => groupCharacterLinks(layout), [layout]);

  const chronologicalPoints = useMemo(
    () => layout.map((n) => `${n.x},${n.y}`).join(' '),
    [layout]
  );

  const neighborScenes = useMemo(() => {
    const map = new Map<number, { prev: number | null; next: number | null }>();
    layout.forEach((n, i) => {
      map.set(n.scene, {
        prev: i > 0 ? layout[i - 1].scene : null,
        next: i < layout.length - 1 ? layout[i + 1].scene : null
      });
    });
    return map;
  }, [layout]);

  const handleEnter = (node: SceneNodeWithLayout) => setHovered(node);
  const handleLeave = () => {
    setHovered(null);
    setTooltip(null);
  };

  const handleMove = (node: SceneNodeWithLayout, evt: React.MouseEvent<SVGGElement, MouseEvent>) => {
    setTooltip({ x: evt.clientX + 12, y: evt.clientY + 12, node });
  };

  const bg = '#05060a';

  return (
    <div style={{ position: 'relative', width, height, background: bg, borderRadius: 12, overflow: 'hidden' }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="spineGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1b1f2f" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#1b1f2f" stopOpacity={0.7} />
          </linearGradient>
        </defs>

        {/* Spine */}
        <line
          x1={width * 0.5}
          x2={width * 0.5}
          y1={height * 0.06}
          y2={height * 0.94}
          stroke="url(#spineGradient)"
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Chronological path */}
        <polyline
          points={chronologicalPoints}
          fill="none"
          stroke="#7cd2f0"
          strokeOpacity={hovered ? 0.25 : 0.4}
          strokeWidth={2}
        />

        {/* Character connections */}
        {characterLinks.map((link, idx) => {
          const stroke = '#7a7a8c';
          const isActive = hovered && link.character === hovered.character.toLowerCase();
          const pts = link.points.map((p) => `${p.x},${p.y}`).join(' ');
          return (
            <polyline
              key={`${link.character}-${idx}`}
              points={pts}
              fill="none"
              stroke={stroke}
              strokeWidth={isActive ? 2.4 : 1.4}
              strokeOpacity={isActive ? 0.9 : 0.18}
              strokeDasharray="6 6"
            />
          );
        })}

        {/* Particles */}
        {layout.map((node) => {
          const isHovered = hovered?.scene === node.scene;
          const neighbors = neighborScenes.get(node.scene);
          const isNeighbor = hovered && (hovered.scene === neighbors?.prev || hovered.scene === neighbors?.next);
          const sameCharacter = hovered && hovered.character.toLowerCase() === node.character.toLowerCase();
          const dim = Boolean(hovered) && !isHovered && !isNeighbor && !sameCharacter;
          const baseColor = getEmotionColor(node.emotionCluster);

          return (
            <g
              key={node.scene}
              onMouseEnter={() => handleEnter(node)}
              onMouseLeave={handleLeave}
              onMouseMove={(evt) => handleMove(node, evt)}
              style={{ cursor: 'pointer' }}
            >
              {node.secondaryNodes.map((s, i) => (
                <circle
                  key={`${node.scene}-secondary-${i}`}
                  cx={s.x}
                  cy={s.y}
                  r={s.radius}
                  fill={s.color}
                  stroke={baseColor}
                  strokeOpacity={0.4}
                  opacity={dim ? 0.18 : 0.55}
                />
              ))}

              <circle
                cx={node.x}
                cy={node.y}
                r={node.radius * (isHovered ? 1.15 : 1)}
                fill={baseColor}
                stroke="white"
                strokeWidth={isHovered ? 2.4 : 1.2}
                opacity={dim ? 0.25 : 0.95}
              />

              <circle
                cx={node.x}
                cy={node.y}
                r={node.radius * 0.35}
                fill="rgba(0,0,0,0.4)"
                stroke="none"
                opacity={dim ? 0.2 : 0.7}
              />
            </g>
          );
        })}
      </svg>

      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            background: 'rgba(15,16,24,0.95)',
            color: '#f5f6fb',
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #2f3240',
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
            maxWidth: 360,
            pointerEvents: 'none'
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.75 }}>Scene {tooltip.node.scene} · {tooltip.node.character}</div>
          <div style={{ fontWeight: 700, margin: '4px 0 6px' }}>{tooltip.node.sceneContext}</div>
          <div style={{ fontSize: 13, lineHeight: 1.4 }}>
            “{tooltip.node.quote}”
          </div>
        </div>
      )}
    </div>
  );
};

// Convenience wrapper to load CSV at runtime (e.g., /src/data/frankenstein.csv) and render the chart
export const EmotionalSpineChartFromCsv: React.FC<{
  src: string;
  width?: number;
  height?: number;
}> = ({ src, width = 960, height = 1400 }) => {
  const [data, setData] = useState<SceneNode[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(`Failed to load CSV: ${res.status}`);
        const text = await res.text();
        const nodes = parseCsvToSceneNodes(text);
        if (!cancelled) setData(nodes);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (error) {
    return <div style={{ color: 'tomato' }}>Error: {error}</div>;
  }
  if (!data.length) {
    return <div style={{ color: '#bbb' }}>Loading emotional spine...</div>;
  }
  return <EmotionalSpineChart data={data} width={width} height={height} />;
};

// Lightweight mock data (first five rows from the provided CSV) for quick rendering
const MOCK_CSV = `SCENE,ANATOMY,EMOTION_CLUSTER,INTENSITY,SECONDARY_EMOTION,SCENE_CONTEXT,QUOTES
1,Cervical,Fear,7/10,"Tension, Dread, Suspension",The ship is stuck in the ice as the half-frozen Victor is hauled aboard and a shadowy creature attacks from the blizzard,"Something out there is hunting him... and now it knows we're here too." - Walton
2,Cervical,Curiosity,6/10,Doom,Victor tells the captain he created the Creature and starts his confession,"Do not follow the thing that hunts me. Turn back while you still can." - Victor
3,Cervical,Sadness,10/10,"Sympathy, Grief",Victor's mother dies in childbirth while William survives,"She was the first life I loved, and the first life I watched disappear." - Victor
4,Cervical,Hope,5/10,"Unease, Discomfort",Victor excels at anatomy, lingering on cadavers with obsession,"If I can read the body like a book, perhaps I can rewrite its ending." - Victor
5,Cervical,Curiosity,6/10,"Shock, Embarrassment",Victor demonstrates reanimation in class and is expelled,"They call it blasphemy, but tell me… isn't it natural to ask why a heart must ever stop?" - Victor`;

export const MOCK_DATA: SceneNode[] = parseCsvToSceneNodes(MOCK_CSV);

// Example usage:
// <EmotionalSpineChart data={MOCK_DATA} width={960} height={1200} />
// <EmotionalSpineChartFromCsv src="/src/data/frankenstein.csv" width={960} height={1200} />
