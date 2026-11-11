export interface CurriculumArea {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  image: string;
  colorTheme: string;
  explanation: string;
  quote: string;
  learningObjectives: string[];
  exampleActivities: {
    name: string;
    description: string;
    materials: string;
  }[];
}

export const curriculumAreas: CurriculumArea[] = [
  {
    id: 'practical-life',
    title: 'Practical Life',
    subtitle: 'Nurturing self-reliance, concentration, coordination, and community care',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1200',
    colorTheme: 'sage',
    explanation: 'Practical Life activities form the foundational cornerstone of all Montessori learning. Through purposeful, everyday physical actions—such as pouring liquids, polishing brass, preparing fruits, and dressing—children master fine motor dexterity, internalize physical sequence, and develop a calm, sustained power of concentration.',
    quote: 'The child can only develop fully through means of experience on his environment. We call such experience "work". — Dr. Maria Montessori',
    learningObjectives: [
      'Refine bilateral hand coordination, pincer grasp, and spatial awareness',
      'Lengthen the duration of focused, self-initiated concentration',
      'Cultivate authentic autonomy in self-care (buttoning, zipping, washing, nutrition)',
      'Instill deep respect and stewardship for shared classroom spaces',
      'Internalize four-step logical order (retrieve work, set workspace, execute, restore)'
    ],
    exampleActivities: [
      {
        name: 'Water Transfer & Wet Sponging',
        description: 'Using natural sea sponges to transfer measured water between porcelain bowls without spilling.',
        materials: 'Hand-thrown ceramic bowls, organic sea sponge, wooden tray'
      },
      {
        name: 'Culinary Preparation & Apple Slicing',
        description: 'Washing, cutting, and plating organic fruit for peers using child-safe wavy knives.',
        materials: 'Mini wooden cutting board, crinkle cutter, serving tongs, porcelain plate'
      },
      {
        name: 'Dressing Frames & Textile Fasteners',
        description: 'Practicing intricate everyday closures: wooden buttons, velvet bows, brass snaps, and boot laces.',
        materials: 'Solid birch dressing frames with natural linen fabric'
      },
      {
        name: 'Flower Arranging & Table Decor',
        description: 'Selecting stems, cutting stalks at an angle under water, measuring water into ceramic vases for dining tables.',
        materials: 'Pruning shears, small metal pitcher, glass bud vases, fresh seasonal blooms'
      }
    ]
  },
  {
    id: 'sensorial-education',
    title: 'Sensorial Education',
    subtitle: 'Refining the senses to categorize and perceive subtle nuances of the physical universe',
    iconName: 'Eye',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200',
    colorTheme: 'terracotta',
    explanation: 'Sensorial materials are materialized abstractions. Each apparatus isolates a single physical quality—such as dimension, color, weight, texture, sound, or scent—allowing the young mind to explore, grade, match, and categorize sensory input with scientific precision.',
    quote: 'Our sensorial materials provide a kind of guide to observation; they clarify what the child has previously seen in the world. — Dr. Maria Montessori',
    learningObjectives: [
      'Isolate and categorize specific sensory stimuli (visual dimension, pitch, tactile texture, thermic temperature)',
      'Acquire sophisticated descriptive vocabulary (comparative and superlative adjectives: thickest, narrowest, warmest)',
      'Build neurological precursors for geometry, architecture, and scientific classification',
      'Sharpen visual acuity and stereognostic awareness (recognizing shapes purely by touch)'
    ],
    exampleActivities: [
      {
        name: 'The Pink Tower & Broad Stairs',
        description: 'Constructing ten three-dimensional cubes varying systematically from 1cm³ to 10cm³ to understand cubic volume.',
        materials: 'Ten pink beechwood cubes, graded hardwood prisms'
      },
      {
        name: 'Color Tablets (Box III)',
        description: 'Grading 63 color tablets across nine distinct hues from palest tint to deepest shade.',
        materials: 'Lacquered wooden tablets with silk chromatic threads'
      },
      {
        name: 'Montessori Bells & Sound Cylinders',
        description: 'Matching pairs of wooden bells tuned to the diatonic scale and ordering them from low C to high C.',
        materials: 'Chromed brass bells on wooden stands with mallets and damper'
      },
      {
        name: 'Fabric Matching & Rough/Smooth Boards',
        description: 'Matching swatches of silk, wool, velvet, burlap, and cotton while wearing an eye blindfold.',
        materials: 'Polished wooden box with paired textile swatches and blindfold'
      }
    ]
  },
  {
    id: 'language-development',
    title: 'Language Development',
    subtitle: 'From joyful phonemic sounds to expressive creative writing and deep literary analysis',
    iconName: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1200',
    colorTheme: 'forest',
    explanation: 'In our Montessori Pod, language is treated as a living human marvel. We bridge spoken expression, phonetic awareness, tactile sandpaper letters, and the famous Moveable Alphabet. Because writing precedes reading in Montessori, children compose their own creative thoughts before effortlessly reading the thoughts of others.',
    quote: 'To read without thinking is like eating without digesting. Language is the instrument of human communion. — Dr. Maria Montessori',
    learningObjectives: [
      'Master phonemic segmentation (identifying beginning, middle, and ending sounds)',
      'Develop muscular memory for handwriting via textured Sandpaper Letters',
      'Synthesize thoughts into written words and poetry using the Moveable Alphabet',
      'Understand syntax, grammar families, and sentence diagrams through colorful 3D symbols',
      'Engage in reflective literature seminars and expressive public oration'
    ],
    exampleActivities: [
      {
        name: 'Sandpaper Letter Tracing',
        description: 'Tracing fine emery-paper letters in cursive while saying phonetic sounds, cementing visual, auditory, and kinesthetic pathways.',
        materials: 'Wood cards with green cursive consonants and pink vowels'
      },
      {
        name: 'The Large Moveable Alphabet (LMA)',
        description: 'Composing original stories, labels, and observations on floor rugs before fine motor pencil grip is finalized.',
        materials: 'Compartmentalized wooden case with 100+ wooden cursive letters'
      },
      {
        name: 'Grammar Farm & Function of Words',
        description: 'Placing physical 3D geometric symbols (noun black pyramid, verb red sphere) onto farm animals and dynamic actions.',
        materials: 'Handmade wooden farm miniature with grammatical labels'
      },
      {
        name: 'Creative Socratic Book Seminars',
        description: 'Collaborative analysis of classic world mythology, environmental non-fiction, and student poetry.',
        materials: 'Curated multicultural library, reflective journals'
      }
    ]
  },
  {
    id: 'mathematics',
    title: 'Mathematics',
    subtitle: 'Discovering numerical order through tactile bead hierarchies and joyful mathematical proof',
    iconName: 'Binary',
    image: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&q=80&w=1200',
    colorTheme: 'terracotta',
    explanation: 'Montessori math begins with concrete physical materials that make abstract numbers tangible. Children hold a single unit bead in one hand and a thousand cube of 1,000 beads in the other, feeling the literal weight of decimal orders of magnitude. Addition, subtraction, multiplication, and long division become tactile discoveries rather than rote memorization.',
    quote: 'The hands are the instruments of man’s intelligence. What the hand does, the mind remembers. — Dr. Maria Montessori',
    learningObjectives: [
      'Develop deep mental clarity on decimal place value (Units, Tens, Hundreds, Thousands)',
      'Conduct multi-digit arithmetic operations with tangible materials',
      'Discover square numbers, cube roots, and fraction equivalence visually and kinesthetically',
      'Foster spontaneous joy and self-confidence in analytical problem solving'
    ],
    exampleActivities: [
      {
        name: 'The Golden Bead Bank Game',
        description: 'Exchanging ten unit beads for a ten-bar, ten ten-bars for a hundred-square, and calculating sums up to 9,999.',
        materials: 'Glass and brass golden bead materials, wooden numerical cards'
      },
      {
        name: 'The Stamp Game',
        description: 'Moving toward higher abstraction by performing arithmetic equations with small color-coded wooden tiles.',
        materials: 'Sectioned wooden box with green (1s), blue (10s), red (100s), green (1000s) tiles'
      },
      {
        name: 'Fraction Skittles & Metal Insets',
        description: 'Visually dividing whole circles into halves, thirds, tenths, and discovering equivalent fractions by superposition.',
        materials: 'Enameled metal fraction inserts on beechwood stands'
      },
      {
        name: 'Checkerboard Long Multiplication',
        description: 'Multiplying multi-digit factors using hierarchical colored squares and glass beads.',
        materials: 'Quilted checkerboard cloth, colored bead bars, number tiles'
      }
    ]
  },
  {
    id: 'cultural-studies',
    title: 'Cultural Studies (Geography & History)',
    subtitle: 'Cultivating global empathy, planetary wonder, and deep respect for human diversity',
    iconName: 'Globe',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1200',
    colorTheme: 'sage',
    explanation: 'Cultural studies unite physical geography, political geography, human anthropology, and history. Children study the continents not as abstract outlines on paper, but through tactile wooden puzzle maps, authentic artifacts, global folk music, traditional culinary recipes, and stories of human ingenuity across epochs.',
    quote: 'We must help the child to realize that he is part of a great harmony, connected to all living creatures. — Dr. Maria Montessori',
    learningObjectives: [
      'Locate continents, oceans, biomes, and countries on globe and puzzle maps',
      'Appreciate diverse cultures, indigenous traditions, languages, and celebrations',
      'Understand the cosmic timeline of Earth and human milestones of innovation',
      'Foster ecological empathy as responsible citizens of our shared planet'
    ],
    exampleActivities: [
      {
        name: 'Wooden Continent Puzzle Maps',
        description: 'Dismantling and assembling maps of Africa, Asia, the Americas, Europe, and Oceania using small brass knobs placed on capital cities.',
        materials: 'Laser-cut birch maps with standard Montessori continent colors'
      },
      {
        name: 'Land & Water Form Models',
        description: 'Pouring tinted water into clay representations of islands, lakes, peninsulas, gulfs, isthmuses, and straits.',
        materials: 'Molded waterproof trays, colored water, descriptive nomenclature cards'
      },
      {
        name: 'The Clock of Eras & Timeline of Life',
        description: 'Unrolling an 18-foot visual silk scroll charting the Paleozoic, Mesozoic, and Cenozoic eras with fossil replicas.',
        materials: 'Hand-illustrated timeline banner, real trilobite and ammonite fossils'
      },
      {
        name: 'Continent Artifact Baskets',
        description: 'Handling authentic textiles, musical instruments, currency, and photographs from community families worldwide.',
        materials: 'Woven wicker baskets curated with global cultural artifacts'
      }
    ]
  },
  {
    id: 'arts-and-creativity',
    title: 'Arts and Creativity',
    subtitle: 'Expressing authentic inner imagination through fine art media, sculpture, and musical harmony',
    iconName: 'Palette',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200',
    colorTheme: 'terracotta',
    explanation: 'Art in our learning pod is process-oriented rather than product-driven. Instead of following rigid templates, children are taught how to master real artistic tools—natural pigments, watercolor wet-on-wet techniques, ceramic clay wheel work, weaving looms, and orchestral pitch. True creativity flourishes when children have technical command of their medium.',
    quote: 'The child who has free choice will express his deep personal aesthetic sensibility with unexpected clarity. — Dr. Maria Montessori',
    learningObjectives: [
      'Learn classical techniques: watercolor wash, oil pastel blending, terracotta sculpting, and textile weaving',
      'Develop sensory appreciation for color theory, contrast, negative space, and rhythm',
      'Channel emotional self-expression and peaceful storytelling into visual art',
      'Experience music actively through vocal harmonization, percussion rhythm, and pitch discrimination'
    ],
    exampleActivities: [
      {
        name: 'Natural Mineral Pigment Painting',
        description: 'Grinding ochre, lapis lazuli, and terracotta stones with pestle and mortar to mix botanical tempera paint.',
        materials: 'Raw earth pigments, gum arabic, ceramic mixing wells, goat hair brushes'
      },
      {
        name: 'Terracotta Hand Sculpture & Coil Pots',
        description: 'Kneading moist stoneware clay, building pinch pots, and carving botanical leaf prints before kiln firing.',
        materials: 'Non-toxic natural clay, boxwood modeling tools, sponge and rolling pins'
      },
      {
        name: 'Wooden Table Loom Weaving',
        description: 'Threading naturally dyed sheep wool, organic cotton yarn, and dried botanical grasses into textured wall tapestries.',
        materials: 'Birch hand looms, wooden shuttles, vegetable-dyed wool skeins'
      },
      {
        name: 'Eurhythmics & Pentatonic Metallophone',
        description: 'Translating body movement into rhythm and composing melodies on tuned pentatonic chimes.',
        materials: 'Studio Glockenspiels, wooden rhythm claves, silk dancing scarves'
      }
    ]
  },
  {
    id: 'nature-and-environmental',
    title: 'Nature & Environmental Learning',
    subtitle: 'Immersing in living ecosystems through forest school, organic permaculture, and wildlife care',
    iconName: 'Sprout',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=1200',
    colorTheme: 'forest',
    explanation: 'The outdoors is not merely a playground; it is an outdoor classroom where children connect deeply with the natural world. Our Pod integrates a flourishing permaculture raised-bed garden, pollinator meadows, weather observation stations, and daily forest exploration. Children compost scraps, germinate heirloom seeds, harvest produce for snack time, and observe wildlife cycles firsthand.',
    quote: 'There must be provision for the child to have contact with nature; to understand and appreciate the order, the harmony and the beauty in nature. — Dr. Maria Montessori',
    learningObjectives: [
      'Understand life cycles of plants, pollinators, and beneficial microorganisms',
      'Practice hands-on conservation: rain collection, vermicomposting, soil enrichment',
      'Cultivate scientific observational stamina through field sketching and weather journaling',
      'Foster a lifelong reverence for ecology and planetary preservation'
    ],
    exampleActivities: [
      {
        name: 'Heirloom Seed Germination & Garden Beds',
        description: 'Planting heritage tomatoes, sweet peas, and herbs in peat pots, measuring growth charts daily, and transplanting outdoors.',
        materials: 'Organic soil blends, cedar seedling flats, bamboo plant markers'
      },
      {
        name: 'Vermicomposting & Soil Ecology Lab',
        description: 'Feeding fruit cuttings to red wiggler worms, testing compost pH, and observing microscopic soil organisms.',
        materials: 'Observation vermicompost bin, child-friendly optical microscopes, soil test kits'
      },
      {
        name: 'Field Sketching & Botany Botany Pressing',
        description: 'Collecting fallen leaves and flower specimens on nature walks and pressing them in wooden flower presses for botanical classification.',
        materials: 'Hardcover sketchbooks, pressed birch botanic presses, watercolor travel tins'
      },
      {
        name: 'Weather Station & Solar Observations',
        description: 'Measuring daily rainfall in rain gauges, tracking wind direction with anemometers, and charting cloud formations.',
        materials: 'Barometer, dual thermometer, cup anemometer, cloud identification discs'
      }
    ]
  }
];

