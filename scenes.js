/**
 * Copilot: This file defines the 33 scenes of Frankenstein (2025)
 * mapped to the 33 vertebrae of the spinal cord.
 *
 * Use this structure for every scene:
 * {
 *   id: Number,                 // 1–33, in story order
 *   scene: String,              // short scene title
 *   section: "A"|"B"|"C"|"D"|"E",
 *   sectionLabel: String,       // e.g. "Exposition / Cervical"
 *   vertebraIndex: Number,      // 1–33, same as id for now
 *   mainEmotion: String,        // single word: "dread", "grief", "hope", etc.
 *   intensity: Number,          // 0–1 scale, how strongly the emotion is felt
 *   notes: String               // short qualitative description from my notes
 * }
 *
 * The five sections are:
 * A – Cervical – Exposition – scenes 1–7
 * B – Thoracic – Rising Action – scenes 8–14
 * C – Lumbar – Climax – scenes 15–21
 * D – Sacral – Falling Action – scenes 22–28
 * E – Coccygeal – Resolution – scenes 29–33
 */

const SCENES = [
  {
    id: 1,
    scene: "Arctic prologue, ice-trapped ship",
    section: "A",
    sectionLabel: "Exposition / Cervical",
    vertebraIndex: 1,
    mainEmotion: "dread",
    intensity: 0.95,
    notes: "Confusion, tension, immediate danger, trying to find out who the shadow is."
  },
  {
    id: 2,
    scene: "Victor on the brink, agreeing to tell his story",
    section: "A",
    sectionLabel: "Exposition / Cervical",
    vertebraIndex: 2,
    mainEmotion: "foreboding",
    intensity: 0.8,
    notes: "Curiosity about what he did, sense of doom as he begins his confession."
  },
  {
    id: 3,
    scene: "Mother's death during William's birth",
    section: "A",
    sectionLabel: "Exposition / Cervical",
    vertebraIndex: 3,
    mainEmotion: "grief",
    intensity: 1.0,
    notes: "Sadness and unfairness; sympathy for young Victor as he is emotionally sidelined."
  },
  {
    id: 4,
    scene: "Young Victor at medical school",
    section: "A",
    sectionLabel: "Exposition / Cervical",
    vertebraIndex: 4,
    mainEmotion: "unease",
    intensity: 0.75,
    notes: "Unease and fascination as he lingers on cadavers with obsessive focus."
  },
  {
    id: 5,
    scene: "The reanimation tribunal in Edinburgh",
    section: "A",
    sectionLabel: "Exposition / Cervical",
    vertebraIndex: 5,
    mainEmotion: "shock",
    intensity: 0.85,
    notes: "Shock at the experiment and secondhand embarrassment as he is expelled as a blasphemer."
  },
  {
    id: 6,
    scene: "Victor's obsessive lab work begins",
    section: "A",
    sectionLabel: "Exposition / Cervical",
    vertebraIndex: 6,
    mainEmotion: "curiosity",
    intensity: 0.9,
    notes: "Fascination mixed with discomfort as Victor isolates himself in pursuit of forbidden knowledge."
  },
  {
    id: 7,
    scene: "The creature awakens",
    section: "A",
    sectionLabel: "Exposition / Cervical",
    vertebraIndex: 7,
    mainEmotion: "shock",
    intensity: 1.0,
    notes: "Visceral horror and immediate regret as the creature takes its first breath."
  },
  {
    id: 8,
    scene: "Victor flees in terror",
    section: "B",
    sectionLabel: "Rising Action / Thoracic",
    vertebraIndex: 8,
    mainEmotion: "dread",
    intensity: 0.9,
    notes: "Panic and shame as Victor abandons his creation, running from responsibility."
  },
  {
    id: 9,
    scene: "Creature's first confused wanderings",
    section: "B",
    sectionLabel: "Rising Action / Thoracic",
    vertebraIndex: 9,
    mainEmotion: "loneliness",
    intensity: 0.7,
    notes: "Sympathy for the creature's innocent confusion and immediate rejection by the world."
  },
  {
    id: 10,
    scene: "William's murder",
    section: "B",
    sectionLabel: "Rising Action / Thoracic",
    vertebraIndex: 10,
    mainEmotion: "grief",
    intensity: 0.95,
    notes: "Shock and sorrow as an innocent child becomes the first casualty of Victor's hubris."
  },
  {
    id: 11,
    scene: "Justine's false accusation and execution",
    section: "B",
    sectionLabel: "Rising Action / Thoracic",
    vertebraIndex: 11,
    mainEmotion: "anger",
    intensity: 0.85,
    notes: "Rage at injustice and Victor's cowardice in letting an innocent woman die."
  },
  {
    id: 12,
    scene: "Victor's mountain retreat, haunted by guilt",
    section: "B",
    sectionLabel: "Rising Action / Thoracic",
    vertebraIndex: 12,
    mainEmotion: "despair",
    intensity: 0.8,
    notes: "Overwhelming guilt and isolation as Victor tries to escape his conscience."
  },
  {
    id: 13,
    scene: "First confrontation with the creature",
    section: "B",
    sectionLabel: "Rising Action / Thoracic",
    vertebraIndex: 13,
    mainEmotion: "dread",
    intensity: 0.95,
    notes: "Tension and fear mixed with unwilling recognition as creator faces creation."
  },
  {
    id: 14,
    scene: "Creature tells his story: learning language",
    section: "B",
    sectionLabel: "Rising Action / Thoracic",
    vertebraIndex: 14,
    mainEmotion: "tenderness",
    intensity: 0.65,
    notes: "Unexpected empathy as we witness the creature's capacity for learning and feeling."
  },
  {
    id: 15,
    scene: "Creature watches the De Lacey family",
    section: "C",
    sectionLabel: "Climax / Lumbar",
    vertebraIndex: 15,
    mainEmotion: "loneliness",
    intensity: 0.9,
    notes: "Heartbreaking longing as the creature observes warmth and connection he cannot have."
  },
  {
    id: 16,
    scene: "Creature's violent rejection by the family",
    section: "C",
    sectionLabel: "Climax / Lumbar",
    vertebraIndex: 16,
    mainEmotion: "anger",
    intensity: 1.0,
    notes: "Rage and betrayal as the creature's hope for acceptance is brutally crushed."
  },
  {
    id: 17,
    scene: "Creature demands a companion",
    section: "C",
    sectionLabel: "Climax / Lumbar",
    vertebraIndex: 17,
    mainEmotion: "desperation",
    intensity: 0.95,
    notes: "Uncomfortable understanding of the creature's impossible position and desperate plea."
  },
  {
    id: 18,
    scene: "Victor begins creating the bride",
    section: "C",
    sectionLabel: "Climax / Lumbar",
    vertebraIndex: 18,
    mainEmotion: "unease",
    intensity: 0.8,
    notes: "Dread and moral uncertainty as Victor repeats his mistake under duress."
  },
  {
    id: 19,
    scene: "Victor destroys the bride",
    section: "C",
    sectionLabel: "Climax / Lumbar",
    vertebraIndex: 19,
    mainEmotion: "dread",
    intensity: 1.0,
    notes: "Horror at the implications and the terrible choice Victor makes in that moment."
  },
  {
    id: 20,
    scene: "Creature's vow of revenge",
    section: "C",
    sectionLabel: "Climax / Lumbar",
    vertebraIndex: 20,
    mainEmotion: "foreboding",
    intensity: 0.95,
    notes: "Chilling certainty that worse is coming. The point of no return."
  },
  {
    id: 21,
    scene: "Henry Clerval's murder",
    section: "C",
    sectionLabel: "Climax / Lumbar",
    vertebraIndex: 21,
    mainEmotion: "grief",
    intensity: 1.0,
    notes: "Devastating loss of innocence and friendship. The cost keeps mounting."
  },
  {
    id: 22,
    scene: "Victor's arrest and breakdown",
    section: "D",
    sectionLabel: "Falling Action / Sacral",
    vertebraIndex: 22,
    mainEmotion: "despair",
    intensity: 0.9,
    notes: "Complete psychological unraveling as Victor faces the consequences of his actions."
  },
  {
    id: 23,
    scene: "Return to Geneva, wedding preparations",
    section: "D",
    sectionLabel: "Falling Action / Sacral",
    vertebraIndex: 23,
    mainEmotion: "hope",
    intensity: 0.6,
    notes: "Brief, fragile hope undercut by the audience's knowledge of the creature's promise."
  },
  {
    id: 24,
    scene: "Wedding night: Elizabeth's murder",
    section: "D",
    sectionLabel: "Falling Action / Sacral",
    vertebraIndex: 24,
    mainEmotion: "grief",
    intensity: 1.0,
    notes: "Absolute devastation. The creature's revenge is complete and Victor is utterly broken."
  },
  {
    id: 25,
    scene: "Father dies of accumulated grief",
    section: "D",
    sectionLabel: "Falling Action / Sacral",
    vertebraIndex: 25,
    mainEmotion: "grief",
    intensity: 0.85,
    notes: "Final familial loss. Victor is now completely alone in the world."
  },
  {
    id: 26,
    scene: "Victor vows pursuit unto death",
    section: "D",
    sectionLabel: "Falling Action / Sacral",
    vertebraIndex: 26,
    mainEmotion: "desperation",
    intensity: 0.9,
    notes: "Obsessive determination replacing all other emotions. Victor becomes the monster he created."
  },
  {
    id: 27,
    scene: "The chase across Europe",
    section: "D",
    sectionLabel: "Falling Action / Sacral",
    vertebraIndex: 27,
    mainEmotion: "desperation",
    intensity: 0.85,
    notes: "Mounting exhaustion and single-minded pursuit. Both hunter and hunted are consumed."
  },
  {
    id: 28,
    scene: "Into the Arctic wastes",
    section: "D",
    sectionLabel: "Falling Action / Sacral",
    vertebraIndex: 28,
    mainEmotion: "desperation",
    intensity: 0.95,
    notes: "The chase becomes existential. Two beings locked in mutual destruction."
  },
  {
    id: 29,
    scene: "Victor's final confession to Walton",
    section: "E",
    sectionLabel: "Resolution / Coccygeal",
    vertebraIndex: 29,
    mainEmotion: "bittersweet",
    intensity: 0.7,
    notes: "Resignation mixed with regret. Victor understands but cannot undo his tragedy."
  },
  {
    id: 30,
    scene: "Victor dies aboard the ship",
    section: "E",
    sectionLabel: "Resolution / Coccygeal",
    vertebraIndex: 30,
    mainEmotion: "grief",
    intensity: 0.8,
    notes: "Sadness at a wasted life and the human cost of unchecked ambition."
  },
  {
    id: 31,
    scene: "Creature appears at Victor's deathbed",
    section: "E",
    sectionLabel: "Resolution / Coccygeal",
    vertebraIndex: 31,
    mainEmotion: "bittersweet",
    intensity: 0.9,
    notes: "Complex grief and recognition. The creature mourns his creator and tormentor."
  },
  {
    id: 32,
    scene: "Creature's final lament",
    section: "E",
    sectionLabel: "Resolution / Coccygeal",
    vertebraIndex: 32,
    mainEmotion: "grief",
    intensity: 1.0,
    notes: "Profound sorrow for all that could have been. The creature's humanity revealed too late."
  },
  {
    id: 33,
    scene: "Creature disappears into the Arctic night",
    section: "E",
    sectionLabel: "Resolution / Coccygeal",
    vertebraIndex: 33,
    mainEmotion: "bittersweet",
    intensity: 0.75,
    notes: "Ambiguous ending. Questions about responsibility, humanity, and what we owe our creations linger."
  }
];
