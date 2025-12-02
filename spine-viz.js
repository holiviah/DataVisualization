/**
 * Frankenstein 2025 – Emotional Spine Visualization
 *
 * Copilot instructions:
 * ----------------------
 * We are drawing an SVG-based chart where:
 * - The X-axis is essentially fixed (a single vertical "spine").
 * - The Y-axis represents the 33 vertebrae (and 33 scenes).
 * - Each scene is one circle positioned on the spine.
 *
 * Visual mapping:
 * - y position = vertebraIndex mapped linearly from top to bottom.
 * - x position = center of the spine with a small horizontal wobble so it feels anatomical.
 * - radius = intensity (0–1) mapped to 4–18 pixels.
 * - fill color = mainEmotion, via a small categorical color scale.
 *
 * Interaction:
 * - Hovering a scene circle shows a tooltip with:
 *    - Scene number and title
 *    - Section label
 *    - Main emotion and numeric intensity
 *    - Qualitative notes text
 *
 * Base layout:
 * - Use the SVG element with id "spineChart" that exists in index.html.
 * - Add a group <g> with margins for plot content.
 * - Draw translucent vertical bands for each anatomical section (A–E),
 *   using vertebra ranges:
 *     A: 1–7   (Cervical / Exposition)
 *     B: 8–14  (Thoracic / Rising Action)
 *     C: 15–21 (Lumbar / Climax)
 *     D: 22–28 (Sacral / Falling Action)
 *     E: 29–33 (Coccygeal / Resolution)
 * - Draw a slightly curved path for the spine.
 * - Then draw small neutral circles for each vertebra.
 * - Finally draw scene circles on top, colored and sized by data.
 */

// 1. Basic SVG + layout setup
const svg = d3.select("#spineChart");
const width = +svg.attr("width");
const height = +svg.attr("height");

// Margins control space for labels+legend
const margin = { top: 40, right: 180, bottom: 40, left: 120 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const g = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// 2. Constants and scales
const vertebraCount = 33;

// y scale maps vertebra index (1–33) to vertical space
const yScale = d3.scaleLinear()
  .domain([1, vertebraCount])
  .range([0, innerHeight]);

// x position for the spine center
const spineX = innerWidth * 0.35;

// intensity scale to radius in pixels
const radiusScale = d3.scaleLinear()
  .domain([0, 1])       // intensity range
  .range([4, 18]);      // min/max circle radius

// anatomical + narrative section ranges
const sectionRanges = [
  { key: "A", label: "Exposition / Cervical",    start: 1,  end: 7  },
  { key: "B", label: "Rising Action / Thoracic", start: 8,  end: 14 },
  { key: "C", label: "Climax / Lumbar",          start: 15, end: 21 },
  { key: "D", label: "Falling Action / Sacral",  start: 22, end: 28 },
  { key: "E", label: "Resolution / Coccygeal",   start: 29, end: 33 }
];

/**
 * Copilot: The emotionColors scale should include all mainEmotion values
 * used in SCENES (dread, foreboding, grief, unease, shock, hope, etc.).
 * Use a visually distinct but cohesive palette.
 */
const emotionColors = d3.scaleOrdinal()
  .domain([
    "dread", "foreboding", "grief", "unease", "shock",
    "hope", "tenderness", "anger", "despair", "curiosity",
    "warmth", "loneliness", "desperation", "bittersweet"
  ])
  .range([
    "#ff4f5a", "#ff9b54", "#a070ff", "#4fd4ff", "#ffd447",
    "#7ae582", "#ff92d0", "#ff6b6b", "#6930c3", "#4ea8de",
    "#ffcf99", "#b388eb", "#ff5d8f", "#9b9ece"
  ]);

// 3. Section background bands
const sectionGroup = g.append("g").attr("class", "sections");

sectionGroup.selectAll("rect.section-band")
  .data(sectionRanges)
  .join("rect")
  .attr("class", "section-band")
  .attr("x", spineX - 70)
  .attr("width", 140)
  .attr("y", d => yScale(d.start))
  .attr("height", d => yScale(d.end) - yScale(d.start))
  .attr("fill", (d, i) => d3.interpolateRainbow(i / sectionRanges.length))
  .attr("opacity", 0.08);

// labels on the right side for each section
sectionGroup.selectAll("text.section-label")
  .data(sectionRanges)
  .join("text")
  .attr("class", "section-label")
  .attr("x", spineX + 80)
  .attr("y", d => (yScale(d.start) + yScale(d.end)) / 2)
  .attr("dy", "0.35em")
  .text(d => d.label)
  .attr("text-anchor", "start")
  .attr("fill", "#b0b0c5")
  .style("font-size", "10px")
  .style("letter-spacing", "0.06em")
  .style("text-transform", "uppercase");

// 4. Stylized spine path
const spinePoints = d3.range(1, vertebraCount + 1).map(i => ([
  spineX + Math.sin(i / 3) * 8,   // small horizontal wiggle
  yScale(i)
]));

g.append("path")
  .attr("d", d3.line()(spinePoints))
  .attr("fill", "none")
  .attr("stroke", "#e0e0f0")
  .attr("stroke-width", 4)
  .attr("stroke-linecap", "round")
  .attr("opacity", 0.9);

// 5. Vertebra base markers
const allVertebrae = d3.range(1, vertebraCount + 1);

g.selectAll("circle.vertebra-base")
  .data(allVertebrae)
  .join("circle")
  .attr("class", "vertebra-base")
  .attr("cx", d => spineX + Math.sin(d / 3) * 8)
  .attr("cy", d => yScale(d))
  .attr("r", 5)
  .attr("fill", "#151520")
  .attr("stroke", "#a0a0c5")
  .attr("stroke-width", 1);

// 6. Tooltip logic
const tooltip = d3.select("#tooltip");

function showTooltip(event, d) {
  tooltip
    .style("opacity", 1)
    .html(`
      <strong>Scene ${d.id}</strong><br>
      <em>${d.scene}</em><br><br>
      <strong>Section:</strong> ${d.sectionLabel}<br>
      <strong>Main emotion:</strong> ${d.mainEmotion}<br>
      <strong>Intensity:</strong> ${d.intensity.toFixed(2)}<br><br>
      ${d.notes}
    `);

  const [x, y] = d3.pointer(event);
  tooltip
    .style("left", `${x + 40}px`)
    .style("top", `${y + 40}px`);
}

function hideTooltip() {
  tooltip.style("opacity", 0);
}

// 7. Scene circles based on SCENES data
/**
 * Copilot:
 * - SCENES is defined in scenes.js as a global array.
 * - Use SCENES as the data source for the visual marks.
 */
g.selectAll("circle.scene-circle")
  .data(SCENES)
  .join("circle")
  .attr("class", "scene-circle")
  .attr("cx", d => spineX + Math.sin(d.vertebraIndex / 3) * 8)
  .attr("cy", d => yScale(d.vertebraIndex))
  .attr("r", d => radiusScale(d.intensity))
  .attr("fill", d => emotionColors(d.mainEmotion))
  .attr("opacity", 0.95)
  .attr("stroke", "#ffffff")
  .attr("stroke-width", 1.4)
  .on("mousemove", showTooltip)
  .on("mouseleave", hideTooltip);

// 8. Emotion legend
/**
 * Copilot: Build a compact legend on the right side that shows
 * each used mainEmotion and its color. Place it near the top.
 */
const usedEmotions = Array.from(new Set(SCENES.map(d => d.mainEmotion)));

const legend = g.append("g")
  .attr("class", "emotion-legend")
  .attr("transform", `translate(${innerWidth + 10}, 0)`);

legend.append("text")
  .text("Emotion color")
  .attr("y", 0)
  .attr("fill", "#f5f5f5")
  .style("font-size", "12px");

legend.selectAll("g.legend-row")
  .data(usedEmotions)
  .join("g")
  .attr("class", "legend-row")
  .attr("transform", (d, i) => `translate(0, ${16 + i * 20})`)
  .each(function(d) {
    const row = d3.select(this);
    row.append("rect")
      .attr("width", 14)
      .attr("height", 14)
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("fill", emotionColors(d));
    row.append("text")
      .attr("x", 20)
      .attr("y", 11)
      .attr("fill", "#f5f5f5")
      .style("font-size", "11px")
      .text(d);
  });
