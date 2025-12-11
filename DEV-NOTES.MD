# Project: Frankenstein (2025) – Emotional Spine

## High-level concept

We are building an **interactive data visualization** that translates my **qualitative emotions** from watching Guillermo del Toro’s *Frankenstein (2025)* into a **3D emotional storm around a spine**.

Core ideas:
- Use a **3D human spine** (from an FBX or GLB model) as the **central axis**.
- Represent **33 scenes** as **33 emotional “streams”** or tubes that swirl around the spine.
- Use bright **emotion colors** and particle clusters to show intensity / “flurries” of feelings.
- Layout and storytelling are **loosely inspired** by this piece: https://pudding.cool/2025/11/democracy/

The visualization should:
1. Display **emotions I felt** per scene.
2. Show **connections between scenes** (all 33 along the spine).
3. Provide **scene descriptions and my own thoughts** on hover / click.
4. Have a **busy, messy, organic** visual style (not rigid grid lines) similar to:
   - 3D streamline plots
   - colorful particle swarms
   - atmospheric data maps

We are NOT building a static page. This is a **WebGL/Three.js interactive canvas** with HTML overlays.

---

## Tech stack

- **Three.js** for 3D rendering.
- **FBXLoader** or **GLTFLoader** for the spine model.
- **Vanilla JS** modules (no framework needed at first).
- Optional later: GSAP / ScrollTrigger for scroll-based camera moves.

Files:

- `index.html`
- `styles.css`
- `scenes.js`  → contains the 33-scene data (already defined as `SCENES`).
- `main.js`    → main Three.js visualization + UI.
- `spine.fbx`  → 3D model of the spine (no skull).

---

## Data model

Use the `SCENES` array (33 entries, one per scene). Each object looks like:

```js
{
  id: 1,                       // 1–33
  vertebraIndex: 1,            // 1–33, maps to vertical position on spine
  scene: "Arctic prologue...",
  section: "A",                // A–E
  sectionLabel: "Exposition / Cervical",
  mainEmotion: "dread",        // single dominant emotion
  intensity: 0.90,             // 0–1 scale, emotional strength
  emotions: [ "confusion", "tension", ... ],  // extra tags
  notes: "Short paragraph of my qualitative impression."
}
