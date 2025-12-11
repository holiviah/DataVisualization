// Frankenstein 2025 – Emotional Spine data for 3D streamline chart
// All 33 scenes with emotions, intensities, and rich qualitative notes

const SCENES = [
  // ===== Section A – Cervical – Exposition (Scenes 1–7) =====
  {
    id: 1,
    vertebraIndex: 1,
    scene: "Arctic prologue, the ice-trapped ship",
    section: "A",
    sectionLabel: "Exposition / Cervical",
    mainEmotion: "dread",
    intensity: 0.90,
    emotions: ["confusion", "tension", "danger", "suspense", "dread"],
    notes: "Ship stuck in ice, Victor half-frozen, shadowy creature attacking from the blizzard."
  },
  {
    id: 2,
    vertebraIndex: 2,
    scene: "Victor on the brink, agreeing to tell his story",
    section: "A",
    sectionLabel: "Exposition / Cervical",
    mainEmotion: "foreboding",
    intensity: 0.70,
    emotions: ["curiosity", "doom"],
    notes: "Victor, mangled and hollow-eyed, admits he created the Creature and begins his confession."
  },
  {
    id: 3,
    vertebraIndex: 3,
    scene: "Mother's death caused by William's birth",
    section: "A",
    sectionLabel: "Exposition / Cervical",
    mainEmotion: "grief",
    intensity: 1.00,
    emotions: ["sadness", "unfairness", "sympathy", "grief"],
    notes: "Victor's mother dies in childbirth; father's affection shifts to William and Victor is pushed aside."
  },
  {
    id: 4,
    vertebraIndex: 4,
    scene: "Young Victor at medical school",
    section: "A",
    sectionLabel: "Exposition / Cervical",
    mainEmotion: "unease",
    intensity: 0.75,
    emotions: ["unease", "fascination", "discomfort"],
    notes: "Victor excels at anatomy, lingers too long over cadavers with an obsessive, bright-eyed focus."
  },
  {
    id: 5,
    vertebraIndex: 5,
    scene: "The reanimation tribunal in Edinburgh",
    section: "A",
    sectionLabel: "Exposition / Cervical",
    mainEmotion: "shock",
    intensity: 0.85,
    emotions: ["shock", "embarrassment"],
    notes: "Victor's reanimation demo horrifies the board; he is expelled as a blasphemer in front of everyone."
  },
  {
    id: 6,
    vertebraIndex: 6,
    scene: "Father's rejection",
    section: "A",
    sectionLabel: "Exposition / Cervical",
    mainEmotion: "humiliation",
    intensity: 0.85,
    emotions: ["anger", "empathy", "humiliation"],
    notes: "At home, his father denounces him as a failure and moral disgrace while William remains the golden child."
  },
  {
    id: 7,
    vertebraIndex: 7,
    scene: "Dinner with Harlander, first intro of Elizabeth",
    section: "A",
    sectionLabel: "Exposition / Cervical",
    mainEmotion: "anticipation",
    intensity: 0.60,
    emotions: ["intrigue", "romantic tension", "unease", "anticipation"],
    notes: "Harlander offers Victor an isolated tower lab; Victor meets Elizabeth, William's fiancée, and the triangle is seeded."
  },

  // ===== Section B – Thoracic – Rising Action (Scenes 8–14) =====
  {
    id: 8,
    vertebraIndex: 8,
    scene: "Constructing the tower lab",
    section: "B",
    sectionLabel: "Rising Action / Thoracic",
    mainEmotion: "awe",
    intensity: 0.80,
    emotions: ["awe", "loss of control"],
    notes: "Montage of brothers building the lab, lightning rods, anatomical sketches, spine diagrams that echo the project."
  },
  {
    id: 9,
    vertebraIndex: 9,
    scene: "Victor's awkward advance toward Elizabeth",
    section: "B",
    sectionLabel: "Rising Action / Thoracic",
    mainEmotion: "tension",
    intensity: 0.75,
    emotions: ["discomfort", "embarrassment", "tension"],
    notes: "Victor's feelings slip in the lab; Elizabeth senses it, and the air becomes thick with secondhand embarrassment."
  },
  {
    id: 10,
    vertebraIndex: 10,
    scene: "Harvesting body parts",
    section: "B",
    sectionLabel: "Rising Action / Thoracic",
    mainEmotion: "revulsion",
    intensity: 0.90,
    emotions: ["revulsion", "moral unease", "pity", "disgust"],
    notes: "Rain, mud, gallows, battlefields; Victor collects limbs and organs while trying to stay emotionally numb."
  },
  {
    id: 11,
    vertebraIndex: 11,
    scene: "Harlander's demand and death",
    section: "B",
    sectionLabel: "Rising Action / Thoracic",
    mainEmotion: "horror",
    intensity: 0.85,
    emotions: ["horror", "panic", "relief", "moral confusion"],
    notes: "Harlander demands his brain be used; he and Victor struggle and Harlander falls to his death from a high ledge."
  },
  {
    id: 12,
    vertebraIndex: 12,
    scene: "The storm and apparent failure",
    section: "B",
    sectionLabel: "Rising Action / Thoracic",
    mainEmotion: "despair",
    intensity: 0.85,
    emotions: ["dread", "despair", "anticlimax", "pity"],
    notes: "On the stormy night, lightning surges through the stitched body, but it appears lifeless; Victor collapses in despair."
  },
  {
    id: 13,
    vertebraIndex: 13,
    scene: "First awakening at dawn",
    section: "B",
    sectionLabel: "Rising Action / Thoracic",
    mainEmotion: "awe",
    intensity: 0.80,
    emotions: ["surprise", "fear", "awe"],
    notes: "In quiet morning light, a hand twitches and an eye opens; the Creature is alive and unnervingly present."
  },
  {
    id: 14,
    vertebraIndex: 14,
    scene: "Training the Creature",
    section: "B",
    sectionLabel: "Rising Action / Thoracic",
    mainEmotion: "anxiety",
    intensity: 0.80,
    emotions: ["anxiety", "sympathy", "disgust with Victor"],
    notes: "Victor keeps the Creature chained, forcing speech drills and lashing out when he fails; the Creature is confused and sad."
  },

  // ===== Section C – Lumbar – Climax (Scenes 15–21) =====
  {
    id: 15,
    vertebraIndex: 15,
    scene: "Elizabeth's kindness",
    section: "C",
    sectionLabel: "Climax / Lumbar",
    mainEmotion: "hope",
    intensity: 0.80,
    emotions: ["hope", "warmth", "fear"],
    notes: "Elizabeth approaches gently, introduces herself, and gets the Creature to repeat her name; a fragile bond forms under Victor's shadow."
  },
  {
    id: 16,
    vertebraIndex: 16,
    scene: "Victor's lie",
    section: "C",
    sectionLabel: "Climax / Lumbar",
    mainEmotion: "betrayal",
    intensity: 0.95,
    emotions: ["betrayal", "anger", "impending doom", "outrage"],
    notes: "Victor lies that the Creature killed Harlander, sends William and Elizabeth away, and secretly plans to destroy the lab with the Creature inside."
  },
  {
    id: 17,
    vertebraIndex: 17,
    scene: "Tower fire and explosion",
    section: "C",
    sectionLabel: "Climax / Lumbar",
    mainEmotion: "horror",
    intensity: 0.95,
    emotions: ["horror", "regret", "shock"],
    notes: "The lab burns as the Creature cries \"Victor\"; Victor hesitates before the tower explodes, mangling his leg and scattering his experiment."
  },
  {
    id: 18,
    vertebraIndex: 18,
    scene: "Creature boards the ship",
    section: "C",
    sectionLabel: "Climax / Lumbar",
    mainEmotion: "curiosity",
    intensity: 0.70,
    emotions: ["surprise", "curiosity", "intrigue"],
    notes: "The narrative catches up; the Creature climbs aboard and asserts his right to tell his side in front of the crew."
  },
  {
    id: 19,
    vertebraIndex: 19,
    scene: "The escape",
    section: "C",
    sectionLabel: "Climax / Lumbar",
    mainEmotion: "anxiety",
    intensity: 0.80,
    emotions: ["empathy", "anxiety", "survival instinct"],
    notes: "He escapes the ruins through smoke and ash into a dark forest, wounded but alive and driven by survival."
  },
  {
    id: 20,
    vertebraIndex: 20,
    scene: "First contact with the hunter's family (unseen)",
    section: "C",
    sectionLabel: "Climax / Lumbar",
    mainEmotion: "loneliness",
    intensity: 0.85,
    emotions: ["melancholy", "yearning", "curiosity", "loneliness"],
    notes: "Hiding in the mill's gears, he watches the family argue, eat, and laugh, feeling what he lacks through cracks in the wall."
  },
  {
    id: 21,
    vertebraIndex: 21,
    scene: "Spirit of the forest",
    section: "C",
    sectionLabel: "Climax / Lumbar",
    mainEmotion: "bittersweet",
    intensity: 0.80,
    emotions: ["bittersweet warmth", "pride", "fear"],
    notes: "He chops wood and repairs things at night; the family thanks their unseen guardian, unaware their 'spirit' is the Creature."
  },

  // ===== Section D – Sacral – Falling Action (Scenes 22–28) =====
  {
    id: 22,
    vertebraIndex: 22,
    scene: "Learning language through the wall",
    section: "D",
    sectionLabel: "Falling Action / Sacral",
    mainEmotion: "wonder",
    intensity: 0.80,
    emotions: ["wonder", "tenderness", "admiration", "hope"],
    notes: "He mimics the blind grandfather's reading lessons with the granddaughter, slowly sounding out words in the dark."
  },
  {
    id: 23,
    vertebraIndex: 23,
    scene: "First direct meeting with the grandpa",
    section: "D",
    sectionLabel: "Falling Action / Sacral",
    mainEmotion: "anxiety",
    intensity: 0.75,
    emotions: ["anxiety", "relief", "nervousness", "joy"],
    notes: "After the family leaves for winter, the Creature steps out; the blind man accepts him by the fire, and tension melts into cautious joy."
  },
  {
    id: 24,
    vertebraIndex: 24,
    scene: "The blind man's touch",
    section: "D",
    sectionLabel: "Falling Action / Sacral",
    mainEmotion: "relief",
    intensity: 0.90,
    emotions: ["emotional release", "empathy", "warmth", "hope"],
    notes: "The blind man touches his face, speaks to him as a person, and gives him language to name his pain."
  },
  {
    id: 25,
    vertebraIndex: 25,
    scene: "Discovering the ruins of the lab and Victor's notes",
    section: "D",
    sectionLabel: "Falling Action / Sacral",
    mainEmotion: "dread",
    intensity: 0.90,
    emotions: ["dread", "empathy", "anxiety", "shock"],
    notes: "He finds the destroyed tower and Victor's journals, realizing he was assembled, labeled, and abandoned like a project."
  },
  {
    id: 26,
    vertebraIndex: 26,
    scene: "Wolves and the blind man's death",
    section: "D",
    sectionLabel: "Falling Action / Sacral",
    mainEmotion: "devastation",
    intensity: 1.00,
    emotions: ["heartbreak", "rage", "grief", "devastation"],
    notes: "He fights wolves to protect the blind man, holds him as he dies, and is then driven away in terror by the returning family."
  },
  {
    id: 27,
    vertebraIndex: 27,
    scene: "Failed attempts to die",
    section: "D",
    sectionLabel: "Falling Action / Sacral",
    mainEmotion: "despair",
    intensity: 1.00,
    emotions: ["existential horror", "claustrophobia", "deep sorrow", "despair"],
    notes: "He tries to freeze, drown, fall—yet his body refuses to die; immortality becomes a prison without companionship."
  },
  {
    id: 28,
    vertebraIndex: 28,
    scene: "Night of the wedding",
    section: "D",
    sectionLabel: "Falling Action / Sacral",
    mainEmotion: "desperation",
    intensity: 0.90,
    emotions: ["conflict", "tension", "desperation"],
    notes: "At William and Elizabeth's wedding, the Creature confronts Victor, begging for a companion amid the decadence."
  },

  // ===== Section E – Coccygeal – Resolution (Scenes 29–33) =====
  {
    id: 29,
    vertebraIndex: 29,
    scene: "Elizabeth's death",
    section: "E",
    sectionLabel: "Resolution / Coccygeal",
    mainEmotion: "grief",
    intensity: 1.00,
    emotions: ["shock", "grief", "anger", "pity", "sadness", "lost hope"],
    notes: "Victor calls the Creature an abomination and fires; Elizabeth steps between them and is shot."
  },
  {
    id: 30,
    vertebraIndex: 30,
    scene: "Wedding chaos",
    section: "E",
    sectionLabel: "Resolution / Coccygeal",
    mainEmotion: "guilt",
    intensity: 0.85,
    emotions: ["moral clarity", "sorrow", "guilt"],
    notes: "Violence erupts at the celebration; in his last moments, William calls Victor the real monster."
  },
  {
    id: 31,
    vertebraIndex: 31,
    scene: "Cave of mourning with Elizabeth",
    section: "E",
    sectionLabel: "Resolution / Coccygeal",
    mainEmotion: "grief",
    intensity: 1.00,
    emotions: ["unbearable sadness", "sympathy", "grief", "sorrow"],
    notes: "The Creature carries Elizabeth into a cave, trying to comfort her as she dies, cradling her body in the cold."
  },
  {
    id: 32,
    vertebraIndex: 32,
    scene: "Long pursuit across the Arctic",
    section: "E",
    sectionLabel: "Resolution / Coccygeal",
    mainEmotion: "revenge",
    intensity: 0.80,
    emotions: ["fatigue", "revenge", "emptiness"],
    notes: "Victor hunts the Creature across the Arctic with dynamite; both are exhausted shadows driven only by obsession."
  },
  {
    id: 33,
    vertebraIndex: 33,
    scene: "Final reconciliation",
    section: "E",
    sectionLabel: "Resolution / Coccygeal",
    mainEmotion: "bittersweet",
    intensity: 0.80,
    emotions: ["bittersweet", "lingering sadness", "melancholy", "closure"],
    notes: "Back on the ship, Victor apologizes and dies; the Creature forgives him and frees the ship from the ice, ending the cycle of revenge."
  }
];

// ===== Emotion color palette (horror-tuned for Frankenstein) =====
// Clustered into dark, rich, slightly desaturated colors that feel gothic and melancholic
const EMOTION_COLORS = {
  // Reds + Magentas (fear, horror, anger, betrayal, revenge)
  dread:       0xc41e3a,  // Deep blood red
  horror:      0xff1744,  // Vivid red
  betrayal:    0xd32f2f,  // Bold red
  anger:       0xf57c00,  // Deep orange-red
  revenge:     0xb71c1c,  // Very dark red
  revulsion:   0xa81a4a,  // Dark wine
  humiliation: 0xc2185b,  // Deep pink-red

  // Purples + Blues (grief, despair, dread, melancholy)
  grief:       0x7b1fa2,  // Deep purple
  despair:     0x512da8,  // Darker purple
  loneliness:  0x673ab7,  // Medium-dark purple
  foreboding:  0x1a237e,  // Deep blue-black
  unease:      0x0277bd,  // Deep cyan-blue
  anxiety:     0x01579b,  // Very dark blue

  // Cool violets (sadness, melancholy, bittersweet)
  bittersweet: 0x6a1b9a,  // Dark magenta-purple
  desperation: 0x4527a0,  // Deep indigo

  // Cooler tones (wonder, hope, anticipation, relief, calm moments)
  hope:        0x00695c,  // Dark teal
  wonder:      0x00838f,  // Dark cyan
  relief:      0x0288d1,  // Medium blue
  anticipation:0x0097a7,  // Teal-blue
  curiosity:   0x1976d2,  // Royal blue

  // Muted warm (awe, tension, discomfort)
  awe:         0x8b6f47,  // Muted brown-gold
  tension:     0x9c6c27,  // Dark bronze
  shock:       0xf9a825,  // Muted gold (stands out)

  // Warm lighter (warmth for gentler moments)
  warmth:      0xd4863e   // Warm burnt sienna
};
