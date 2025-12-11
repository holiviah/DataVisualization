import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {
  SCENES,
  EMOTION_COLORS,
  EMOTION_GROUPS,
  getEmotionGroupFor,
  getEmotionColor
} from './scenes.js';

let scene;
let camera;
let renderer;
let controls;
let raycaster;
let hoveredGroup = null;
let bgParticles = null;
let intro;
let infoDiv;
let legendContent;
let introDismissed = false;
let clock = new THREE.Clock();
let mouse = new THREE.Vector2();
let hoverableMeshes = [];
let emotionGroups = [];
let sceneNodes = [];
let spineReady = false;
let chronoLines = null;
let characterLines = [];
let spineCenter = new THREE.Vector3(0, 0, 0);

// Scene data schema produced from the CSV file
// id: 1-33, mainEmotion: string, intensity10: number 1-10,
// secondaryEmotions: string[], sceneContext: string, quote: string, speaker: string
function parseCsv(text) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  let lines = text.split('\n');
  
  // Skip header
  lines = lines.slice(1);
  
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      const nextCh = line[i + 1];
      
      if (ch === '"') {
        if (inQuotes && nextCh === '"') {
          // Escaped quote
          currentField += '"';
          i++;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        // Field separator
        currentRow.push(currentField.trim());
        currentField = '';
      } else {
        currentField += ch;
      }
    }
    
    // Check if we're still in quotes (multi-line field)
    if (!inQuotes && currentRow.length > 0) {
      // End of row
      currentRow.push(currentField.trim());
      
      if (currentRow.length >= 7) {
        const id = parseInt(currentRow[0], 10);
        if (Number.isFinite(id)) {
          const mainEmotion = (currentRow[2] || 'other').trim().toLowerCase();
          const intensity10 = parseIntensity(currentRow[3]);
          const secondaryEmotions = parseSecondary(currentRow[4]);
          const sceneContext = (currentRow[5] || '').trim();
          const rawQuote = currentRow[6] || '';
          const { quote, speaker } = splitQuote(rawQuote);
          
          rows.push({
            id,
            vertebraIndex: id,
            mainEmotion,
            intensity10,
            secondaryEmotions,
            sceneContext,
            quote,
            speaker
          });
        }
      }
      
      currentRow = [];
      currentField = '';
    } else if (inQuotes) {
      // Continue multi-line field
      currentField += '\n';
    }
  }
  
  // Handle last row if not already added
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.length >= 7) {
      const id = parseInt(currentRow[0], 10);
      if (Number.isFinite(id)) {
        const mainEmotion = (currentRow[2] || 'other').trim().toLowerCase();
        const intensity10 = parseIntensity(currentRow[3]);
        const secondaryEmotions = parseSecondary(currentRow[4]);
        const sceneContext = (currentRow[5] || '').trim();
        const rawQuote = currentRow[6] || '';
        const { quote, speaker } = splitQuote(rawQuote);
        
        rows.push({
          id,
          vertebraIndex: id,
          mainEmotion,
          intensity10,
          secondaryEmotions,
          sceneContext,
          quote,
          speaker
        });
      }
    }
  }
  
  return rows.sort((a, b) => a.id - b.id);
}

function parseCsvLine(line = '') {
  const regex = /([^,"]+|"([^"]|\\")*")(?=,|$)/g;
  const cols = [];
  let match;
  while ((match = regex.exec(line)) !== null) {
    cols.push(match[0].replace(/^"|"$/g, ''));
  }
  return cols;
}

function parseIntensity(raw = '') {
  if (!raw) return 5;
  const parts = raw.split('/');
  const num = parseFloat(parts[0]);
  return Number.isFinite(num) ? Math.max(1, Math.min(10, num)) : 5;
}

function parseSecondary(raw = '') {
  return raw
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitQuote(raw = '') {
  // Clean up whitespace first
  raw = raw.replace(/\n\s*/g, ' ').trim();
  
  // Look for pattern: "quote text" - Speaker
  const match = raw.match(/^(.+?)\s*-\s*(.+)$/);
  if (match) {
    let quote = match[1].trim();
    const speaker = match[2].trim();
    
    // Remove surrounding quotes if present
    if (quote.startsWith('"') && quote.endsWith('"')) {
      quote = quote.slice(1, -1);
    }
    
    return { quote, speaker };
  }
  
  return { quote: raw, speaker: 'Unknown' };
}

async function loadSceneData() {
  try {
    const res = await fetch('src/data/frankenstein.csv');
    if (!res.ok) throw new Error('CSV fetch failed');
    const text = await res.text();
    const parsed = parseCsv(text);
    if (parsed.length) return parsed;
  } catch (err) {
    console.warn('Falling back to bundled scene data:', err?.message || err);
  }

  // Fallback: convert legacy SCENES to the new shape
  return SCENES.map((s) => ({
    id: s.id,
    vertebraIndex: s.vertebraIndex,
    mainEmotion: (s.mainEmotion || 'other').toLowerCase(),
    intensity10: Math.round(Math.max(1, Math.min(10, (s.intensity || 0.5) * 10))),
    secondaryEmotions: Array.isArray(s.emotions) ? s.emotions.slice(0, 3) : [],
    sceneContext: s.notes || '',
    quote: s.scene || '',
    speaker: 'Narrator'
  })).sort((a, b) => a.id - b.id);
}

function lightenColor(hex, factor = 0.55) {
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  const mix = (c) => Math.round(c + (255 - c) * factor);
  return new THREE.Color(`rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`);
}

init();

function init() {
  intro = document.getElementById('intro');
  infoDiv = document.getElementById('info');
  legendContent = document.getElementById('legendContent');
  const container = document.getElementById('canvas-container');

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05060a);
  scene.fog = new THREE.Fog(0x05060a, 12, 45);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.4, 6);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 0.8;
  controls.maxDistance = 12;
  controls.target.set(0, 0, 0);

  const ambient = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 0.55);
  dir.position.set(5, 8, 5);
  dir.castShadow = true;
  scene.add(dir);

  const grid = new THREE.GridHelper(16, 24, 0x20232f, 0x12141d);
  grid.material.opacity = 0.12;
  grid.material.transparent = true;
  scene.add(grid);

  raycaster = new THREE.Raycaster();
  raycaster.params.Points = { threshold: 0.18 };

  buildLegend();
  resetInfo();

  const dataPromise = loadSceneData().then((nodes) => {
    sceneNodes = nodes;
    maybeBuildScene();
  });

  loadSpineModel();

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('scroll', handleBegin);
  window.addEventListener('wheel', handleBegin, { passive: true });
  window.addEventListener('click', handleBegin);
  window.addEventListener('touchstart', handleBegin, { passive: true });

  animate();
}

function createCircleTexture(blurAmount = 0) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Create a solid white circle - the blur effect will be created via size scaling in the vertex
  const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size * 0.5);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.85, 'rgba(255,255,255,1)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function createBackgroundParticles() {
  const count = 1800;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const seeds = new Float32Array(count * 3);
  const palette = Object.values(EMOTION_COLORS);

  for (let i = 0; i < count; i++) {
    const radius = 7 + Math.random() * 3.5;
    const theta = Math.acos(2 * Math.random() - 1);
    const phi = Math.random() * Math.PI * 2;
    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.cos(theta);
    const z = radius * Math.sin(theta) * Math.sin(phi);

    positions[i * 3 + 0] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const colorHex = palette[Math.floor(Math.random() * palette.length)] || 0xffffff;
    colors[i * 3 + 0] = ((colorHex >> 16) & 255) / 255;
    colors[i * 3 + 1] = ((colorHex >> 8) & 255) / 255;
    colors[i * 3 + 2] = (colorHex & 255) / 255;

    seeds[i * 3 + 0] = Math.random() * 10;
    seeds[i * 3 + 1] = Math.random() * 10;
    seeds[i * 3 + 2] = Math.random() * 10;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('seed', new THREE.BufferAttribute(seeds, 3));

  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.32,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  bgParticles = new THREE.Points(geometry, material);
  bgParticles.userData.basePositions = positions.slice();
  scene.add(bgParticles);
}

function updateBackgroundParticles(elapsed) {
  if (!bgParticles) return;
  const positions = bgParticles.geometry.attributes.position.array;
  const seeds = bgParticles.geometry.attributes.seed.array;
  const base = bgParticles.userData.basePositions;
  for (let i = 0; i < positions.length / 3; i++) {
    const bx = base[i * 3 + 0];
    const by = base[i * 3 + 1];
    const bz = base[i * 3 + 2];
    positions[i * 3 + 0] = bx + Math.sin(elapsed * 0.18 + seeds[i * 3 + 0]) * 0.18;
    positions[i * 3 + 1] = by + Math.cos(elapsed * 0.2 + seeds[i * 3 + 1]) * 0.22;
    positions[i * 3 + 2] = bz + Math.sin(elapsed * 0.16 + seeds[i * 3 + 2]) * 0.18;
  }
  bgParticles.geometry.attributes.position.needsUpdate = true;
}

function loadSpineModel() {
  const fbxLoader = new FBXLoader();
  fbxLoader.load(
    'spine.fbx',
    (fbx) => handleSpine(fbx),
    undefined,
    () => {
      console.warn('FBX load failed or missing; falling back to spine.glb');
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        'spine.glb',
        (gltf) => handleSpine(gltf.scene),
        undefined,
        (err) => {
          console.error('Spine load failed:', err);
          // Proceed without spine model so particles/legend still render
          spineReady = true;
          maybeBuildScene();
        }
      );
    }
  );
}

function handleSpine(spine) {
  spine.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.material = new THREE.MeshStandardMaterial({
        color: 0xf0e8f5,
        metalness: 0.08,
        roughness: 0.5,
        emissive: 0x1a1a25,
        emissiveIntensity: 0.16,
        transparent: true,
        opacity: 0.78
      });
    }
  });

  fitSpineHeight(spine, 2.5);
  scene.add(spine);
  spineReady = true;
  maybeBuildScene();
}

function fitSpineHeight(object, targetHeight = 2.5) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);
  const scale = targetHeight / size.y;
  object.scale.setScalar(scale);

  const center = new THREE.Vector3();
  box.getCenter(center);
  object.position.sub(center.multiplyScalar(scale));
  object.position.y -= 0.05;
}

function createEmotionStreams() {
  if (!sceneNodes.length) return;

  // Clear previous nodes/lines
  emotionGroups.forEach((g) => scene.remove(g));
  if (chronoLines) scene.remove(chronoLines);
  characterLines.forEach((l) => scene.remove(l));

  emotionGroups = [];
  hoverableMeshes = [];
  characterLines = [];
  chronoLines = null;

  const radialBase = 1.3;
  const radialJitter = 0.25;
  const yTop = 1.4;
  const yBottom = -1.4;
  const angleStep = Math.PI * 0.38;

  sceneNodes.forEach((sceneData, idx) => {
    const t = sceneNodes.length === 1 ? 0 : idx / (sceneNodes.length - 1);
    const y = yTop - t * (yTop - yBottom);
    const angle = angleStep * idx;
    const radius = radialBase + Math.sin(idx * 0.75) * radialJitter;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const pos = new THREE.Vector3(x, y, z);

    const colorHex = getEmotionColor(sceneData.mainEmotion) || 0xffffff;
    const color = new THREE.Color(colorHex);

    const intensityNorm = Math.max(1, Math.min(10, sceneData.intensity10 || 5)) / 10;
    // Quartic scaling for extremely dramatic size differences
    // 50% intensity = 0.0625x, 70% = 0.24x, 100% = 1x (16x difference between min and max)
    const intensityFactor = Math.pow(intensityNorm, 4);
    const size = 0.02 + intensityFactor * 0.38;
    // Opacity scales from 0 (0% intensity) to 1 (100% intensity)
    const opacityValue = intensityNorm;
    // Blur only applies below 70% intensity threshold
    const intensityThreshold = 0.7;
    const blurAmount = intensityNorm < intensityThreshold ? ((intensityThreshold - intensityNorm) / intensityThreshold) * 30 : 0;
    // For blur effect: low intensity particles get larger and more transparent to appear "blurred"
    // 100% intensity particles stay fully solid with no blur
    const is100Percent = intensityNorm >= 0.99;
    const blurSizeScale = !is100Percent && intensityNorm < intensityThreshold ? 1 + (blurAmount / 30) * 1.5 : 1;
    const blurredSize = size * blurSizeScale;
    const blurOpacity = is100Percent ? 1.0 : (intensityNorm < intensityThreshold ? opacityValue * (0.5 + (blurAmount / 30) * 0.5) : opacityValue);
    const sizeAttr = new Float32Array([blurredSize]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([x, y, z]), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array([color.r, color.g, color.b]), 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizeAttr, 1));

    const material = new THREE.PointsMaterial({
      size: blurredSize,
      vertexColors: true,
      transparent: true,
      opacity: blurOpacity,
      depthWrite: false,
      alphaTest: 0,
      alphaWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      map: createCircleTexture(blurAmount)
    });

    const mainParticle = new THREE.Points(geometry, material);
    mainParticle.userData.particleSizes = sizeAttr;

    const group = new THREE.Group();
    group.add(mainParticle);
    group.userData.scene = sceneData;
    group.userData.position = pos;
    group.userData.group = getEmotionGroupFor(sceneData.mainEmotion);

    // Secondary emotion satellites
    if (Array.isArray(sceneData.secondaryEmotions) && sceneData.secondaryEmotions.length) {
      const count = sceneData.secondaryEmotions.length;
      const ringRadius = size * 1.8;
      const baseAngle = angle + Math.PI * 0.25;
      sceneData.secondaryEmotions.forEach((label, i) => {
        const theta = baseAngle + (i / Math.max(1, count)) * Math.PI * 1.6;
        const sx = x + Math.cos(theta) * ringRadius;
        const sy = y + Math.sin(theta) * ringRadius;
        const sz = z + Math.sin(theta * 0.8) * 0.08;
        const sGeom = new THREE.BufferGeometry();
        sGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array([sx, sy, sz]), 3));
        const faded = lightenColor(colorHex, 0.65);
        sGeom.setAttribute('color', new THREE.BufferAttribute(new Float32Array([faded.r, faded.g, faded.b]), 3));
        const sSize = size * 0.45;
        const sMat = new THREE.PointsMaterial({
          size: sSize,
          vertexColors: true,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          map: createCircleTexture()
        });
        const sParticle = new THREE.Points(sGeom, sMat);
        group.add(sParticle);
      });
    }

    emotionGroups.push(group);
    hoverableMeshes.push(mainParticle);
    scene.add(group);
  });

  buildChronologicalLines();
  buildCharacterLines();
  buildEmotionLines();
}

function buildChronologicalLines() {
  if (sceneNodes.length < 2) return;
  const segCount = sceneNodes.length - 1;
  const positions = new Float32Array(segCount * 2 * 3);
  const colors = new Float32Array(segCount * 2 * 3);

  for (let i = 0; i < segCount; i++) {
    const a = emotionGroups[i].userData.position;
    const b = emotionGroups[i + 1].userData.position;
    const colorHex = getEmotionColor(sceneNodes[i].mainEmotion) || 0xffffff;
    const color = new THREE.Color(colorHex);

    positions.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
    colors.set([color.r, color.g, color.b, color.r, color.g, color.b], i * 6);
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.35 });
  chronoLines = new THREE.LineSegments(geom, mat);
  scene.add(chronoLines);
}

function buildCharacterLines() {
  if (!sceneNodes.length) return;
  const bySpeaker = new Map();
  sceneNodes.forEach((node, idx) => {
    const key = (node.speaker || 'Unknown').toLowerCase();
    if (!bySpeaker.has(key)) bySpeaker.set(key, []);
    bySpeaker.get(key).push({ node, idx });
  });

  bySpeaker.forEach((list, speaker) => {
    if (list.length < 2) return;
    const segCount = list.length - 1;
    const positions = new Float32Array(segCount * 2 * 3);
    const colors = new Float32Array(segCount * 2 * 3);
    for (let i = 0; i < segCount; i++) {
      const curr = emotionGroups[list[i].idx].userData.position;
      const next = emotionGroups[list[i + 1].idx].userData.position;
      const colorHex = getEmotionColor(list[i].node.mainEmotion) || 0xffffff;
      const c = lightenColor(colorHex, 0.7);
      positions.set([curr.x, curr.y, curr.z, next.x, next.y, next.z], i * 6);
      colors.set([c.r, c.g, c.b, c.r, c.g, c.b], i * 6);
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.28 });
    const line = new THREE.LineSegments(geom, mat);
    line.userData.speaker = speaker;
    characterLines.push(line);
    scene.add(line);
  });
}

function buildEmotionLines() {
  if (!sceneNodes.length) return;
  const byEmotion = new Map();
  sceneNodes.forEach((node, idx) => {
    const emotion = node.mainEmotion.toLowerCase();
    if (!byEmotion.has(emotion)) byEmotion.set(emotion, []);
    byEmotion.get(emotion).push({ node, idx });
  });

  byEmotion.forEach((list, emotion) => {
    if (list.length < 2) return;
    
    // Connect each particle to every other particle with same emotion (creates web effect)
    const positions = [];
    const colors = [];
    
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const posA = emotionGroups[list[i].idx].userData.position;
        const posB = emotionGroups[list[j].idx].userData.position;
        const colorHex = getEmotionColor(list[i].node.mainEmotion) || 0xffffff;
        const c = new THREE.Color(colorHex);
        
        positions.push(posA.x, posA.y, posA.z, posB.x, posB.y, posB.z);
        colors.push(c.r, c.g, c.b, c.r, c.g, c.b);
      }
    }
    
    if (positions.length === 0) return;
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geom.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    const mat = new THREE.LineBasicMaterial({ 
      vertexColors: true, 
      transparent: true, 
      opacity: 0.12,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const line = new THREE.LineSegments(geom, mat);
    line.userData.emotion = emotion;
    scene.add(line);
  });
}

function buildLegend() {
  if (!legendContent) return;
  legendContent.innerHTML = '';
  
  // Emotion colors section
  const emotionSection = document.createElement('div');
  emotionSection.className = 'legend-section';
  
  const emotionTitle = document.createElement('h4');
  emotionTitle.textContent = 'Emotion';
  emotionSection.appendChild(emotionTitle);
  
  const emotionSimple = [
    { color: '#ff3ead', label: 'Anger' },
    { color: '#ffab56', label: 'Hope' },
    { color: '#68ffa2', label: 'Fear' },
    { color: '#47f2ff', label: 'Sadness' },
    { color: '#c444ff', label: 'Curiosity' }
  ];
  
  emotionSimple.forEach((emotion) => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    
    const swatch = document.createElement('span');
    swatch.className = 'legend-swatch';
    swatch.style.backgroundColor = emotion.color;
    
    const label = document.createElement('span');
    label.className = 'legend-label';
    label.textContent = emotion.label;
    
    item.appendChild(swatch);
    item.appendChild(label);
    emotionSection.appendChild(item);
  });
  
  legendContent.appendChild(emotionSection);
  
  // Intensity scale section
  const intensitySection = document.createElement('div');
  intensitySection.className = 'legend-section';
  
  const intensityTitle = document.createElement('h4');
  intensityTitle.textContent = 'Intensity';
  intensitySection.appendChild(intensityTitle);
  
  // Create gradient bar with labels
  const scaleContainer = document.createElement('div');
  scaleContainer.className = 'intensity-scale-range';
  
  const gradientBar = document.createElement('div');
  gradientBar.className = 'intensity-gradient';
  
  // Add visual representation with 5 dots showing progression
  const dotsContainer = document.createElement('div');
  dotsContainer.style.display = 'flex';
  dotsContainer.style.justifyContent = 'space-between';
  dotsContainer.style.alignItems = 'center';
  dotsContainer.style.marginBottom = '8px';
  dotsContainer.style.gap = '4px';
  
  for (let i = 0; i < 5; i++) {
    const intensity = (i + 1) * 0.2; // 0.2, 0.4, 0.6, 0.8, 1.0
    const blur = (1 - intensity) * 20;
    // Size increases dramatically: 4px at 20%, 28px at 100%
    const size = 4 + Math.pow(intensity, 3) * 24;
    
    const dot = document.createElement('div');
    dot.style.width = size + 'px';
    dot.style.height = size + 'px';
    dot.style.borderRadius = '50%';
    dot.style.backgroundColor = '#ffffff';
    dot.style.opacity = intensity.toString();
    dot.style.filter = blur > 0 ? `blur(${blur * 0.5}px)` : 'none';
    dot.style.flexShrink = '0';
    dotsContainer.appendChild(dot);
  }
  
  const labelsContainer = document.createElement('div');
  labelsContainer.className = 'intensity-labels';
  
  const lowLabel = document.createElement('span');
  lowLabel.textContent = '0%';
  
  const highLabel = document.createElement('span');
  highLabel.textContent = '100%';
  
  labelsContainer.appendChild(lowLabel);
  labelsContainer.appendChild(highLabel);
  
  scaleContainer.appendChild(dotsContainer);
  scaleContainer.appendChild(labelsContainer);
  intensitySection.appendChild(scaleContainer);
  
  legendContent.appendChild(intensitySection);
}

function resetInfo() {
  if (!infoDiv) return;
  infoDiv.style.background = 'rgba(8, 8, 16, 0.75)';
  infoDiv.innerHTML = `<strong>Frankenstein: An Emotional Spine</strong>
    <div class="meta">Hover a particle to read the scene</div>
    <div class="notes">Drag to rotate and hover over particles for specific details. Each particle represents one scene's emotion.</div>`;
}

function updateInfo(sceneData) {
  if (!infoDiv) return;
  const group = getEmotionGroupFor(sceneData.mainEmotion);
  const emotionColorHex = getEmotionColor(sceneData.mainEmotion);
  
  // Convert hex number to rgb for opacity control
  const r = (emotionColorHex >> 16) & 255;
  const g = (emotionColorHex >> 8) & 255;
  const b = emotionColorHex & 255;
  const bgColor = `rgba(${r}, ${g}, ${b}, 0.15)`;
  
  infoDiv.style.background = `linear-gradient(135deg, ${bgColor}, rgba(8, 8, 16, 0.75))`;
  
  infoDiv.innerHTML = `
    <strong>Scene ${sceneData.id}</strong>
    <div class="meta">${group.label} · Intensity ${(Math.max(1, Math.min(10, sceneData.intensity10)) / 10 * 100).toFixed(0)}%</div>
    <div class="notes">${sceneData.sceneContext || 'No context provided.'}</div>
    <br>
    <div class="quotes">${sceneData.quote ? '“' + sceneData.quote + '” — ' + (sceneData.speaker || 'Unknown') : ''}</div>
  `;
}

function onPointerMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function updateHover() {
  if (!hoverableMeshes.length) return;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(hoverableMeshes, true);

  if (intersects.length > 0) {
    const mesh = intersects[0].object;
    const group = emotionGroups.find((g) => g.children.includes(mesh));
    if (group && group !== hoveredGroup) {
      hoveredGroup = group;
      highlightGroup(group);
      updateInfo(group.userData.scene);
    }
  } else if (hoveredGroup) {
    hoveredGroup = null;
    highlightGroup(null);
    resetInfo();
  }
}

function highlightGroup(target) {
  emotionGroups.forEach((g) => {
    const particles = g.children[0];
    // Keep particles static; no size or opacity changes on hover.
    particles.material.size = particles.userData.particleSizes[0];
    particles.material.opacity = 0.95;
  });
}

function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();

  updateBackgroundParticles(elapsed);
  updateHover();
  updateCameraFrustum();

  controls.update();
  renderer.render(scene, camera);
}

function updateCameraFrustum() {
  // Update fog based on camera distance from spine center
  const distFromSpine = camera.position.distanceTo(spineCenter);
  const fogNear = Math.max(0.5, distFromSpine * 0.3);
  const fogFar = distFromSpine * 3.5;
  
  if (Math.abs(scene.fog.near - fogNear) > 0.1 || Math.abs(scene.fog.far - fogFar) > 0.1) {
    scene.fog.near = fogNear;
    scene.fog.far = fogFar;
  }

  // Ensure particles remain in view by updating controls target
  if (!controls.target.equals(spineCenter)) {
    controls.target.lerp(spineCenter, 0.15);
  }
}

function pulseEmotionGroups(elapsed) {
  // Disabled: keep particles fully static (no pulsing or size changes).
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function handleBegin() {
  if (introDismissed) return;
  introDismissed = true;
  intro?.classList.add('hide');

  const startPos = camera.position.clone();
  const endPos = new THREE.Vector3(0, 0, 5.2);
  const startTarget = controls.target.clone();
  const endTarget = new THREE.Vector3(0, 0, 0);
  const duration = 1200;
  const startTime = performance.now();

  function tween() {
    const now = performance.now();
    const t = Math.min(1, (now - startTime) / duration);
    camera.position.lerpVectors(startPos, endPos, easeOutCubic(t));
    controls.target.lerpVectors(startTarget, endTarget, easeOutCubic(t));
    if (t < 1) requestAnimationFrame(tween);
  }
  tween();
}

function maybeBuildScene() {
  if (!spineReady || !sceneNodes.length) return;
  createEmotionStreams();
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
