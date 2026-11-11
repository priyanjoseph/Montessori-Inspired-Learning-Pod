export interface PhilosophyPillar {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  quote?: string;
  coreHighlights: string[];
  classroomApplication: string;
}

export const philosophyPillars: PhilosophyPillar[] = [
  {
    id: 'child-centered',
    title: 'Child-Centered Learning',
    subtitle: 'Following the child rather than forcing a rigid standardized mold',
    iconName: 'HeartHandshake',
    description: 'Every child arrives with an innate blueprint for intellectual and moral growth. In our pod, education bends around the individual learner rather than expecting the child to fit an artificial industrial timetable.',
    quote: 'Follow the child, but follow the child as his leader. — Dr. Maria Montessori',
    coreHighlights: [
      'Self-selected work from carefully prepared shelf arrangements',
      'Freedom of movement within structured, peaceful community boundaries',
      'Deep engagement fueled by intrinsic motivation rather than external gold stars'
    ],
    classroomApplication: 'Children choose their working stations—at low wooden tables or on individual wool floor rugs—working uninterrupted as long as their focus endures.'
  },
  {
    id: 'exploration',
    title: 'Learning Through Exploration',
    subtitle: 'Active investigation over passive memorization',
    iconName: 'Compass',
    description: 'Curiosity is an intellectual engine. Rather than telling children abstract conclusions, our guides present materials that allow children to discover physical truths, mathematical relationships, and natural laws through their own senses.',
    quote: 'Education is a natural process carried out by the child and is not acquired by listening to words but by experiences in the environment.',
    coreHighlights: [
      'Self-correcting apparatus that provides instant, shame-free feedback',
      'Open-ended inquiry fostering scientific reasoning from toddlerhood',
      'Daily outdoor exploration bridging nature and classroom work'
    ],
    classroomApplication: 'If a cylinder does not fit into a wooden block, the child notices immediately without adult intervention, calibrating their own understanding.'
  },
  {
    id: 'hands-on',
    title: 'Hands-On Tangible Materials',
    subtitle: 'The intelligence is constructed through physical manipulation',
    iconName: 'HandMetal',
    description: 'Dr. Montessori famously remarked that what the hand does, the mind remembers. Every concept—from grammatical syntax to algebraic squaring—is embodied in sensorial, beautifully weighted wooden and brass objects.',
    quote: 'The hands are the instruments of man\'s intelligence.',
    coreHighlights: [
      'Sensory materials crafted from natural sustainably harvested beechwood, silk, and stone',
      'Tactile progression from concrete manipulatives to purely mental calculations',
      'Fine-motor strengthening that prepares small fingers effortlessly for cursive writing'
    ],
    classroomApplication: 'Children hold golden beads representing thousands, hundreds, and units, physically feeling mathematical weight before writing numerical symbols.'
  },
  {
    id: 'independent-thinking',
    title: 'Independent Thinking & Autonomy',
    subtitle: 'Empowering children to choose, question, and resolve challenges',
    iconName: 'Brain',
    description: 'True autonomy is not chaos; it is the joyful ability to govern oneself. Children learn to identify their own interests, seek answers through research, and resolve interpersonal differences with mutual dignity.',
    quote: 'Never help a child with a task at which he feels he can succeed. — Dr. Maria Montessori',
    coreHighlights: [
      'Cultivation of executive function and metacognitive awareness',
      'Conflict resolution guided by the Peace Rose and peaceful communication protocols',
      'Ownership of one\'s daily learning commitments and schedule'
    ],
    classroomApplication: 'Children plan their daily goals in personal learning logs, holding reflective check-ins with their guide to assess progress.'
  },
  {
    id: 'individual-pace',
    title: 'Respect for Individual Learning Pace',
    subtitle: 'Honoring sensitive periods without pressure or artificial benchmarking',
    iconName: 'Hourglass',
    description: 'Human development does not proceed along a uniform linear conveyor belt. Children pass through heightened periods of fascination—sensitive periods for order, language, small objects, or social harmony—and thrive when these windows are cherished.',
    quote: 'Our care of the child should be governed not by the desire to make him learn things, but by the endeavor always to keep burning within him that light which is called intelligence.',
    coreHighlights: [
      'No comparative grading or public scoreboards that induce anxiety',
      'Advanced learners soar without ceilings while foundational skills are nurtured patiently',
      'Multi-age classrooms that remove arbitrary grade-level stigmas'
    ],
    classroomApplication: 'A 4-year-old fascinated by reading can read chapter books freely, while a peer delving deeply into geometric patterning spends hours with the geometric cabinet.'
  },
  {
    id: 'practical-skills',
    title: 'Practical Life & Real-World Mastery',
    subtitle: 'Grounding intellectual capability in functional, self-sufficient life skills',
    iconName: 'UtensilsCrossed',
    description: 'We believe education must empower the whole human being. Cooking wholesome meals, caring for living plants, sewing garments, polishing wood, and balancing a ledger are as vital as theoretical scholarship.',
    quote: 'To give a child a job is to give him dignity. When he accomplishes it, he enters into communion with his fellow human beings.',
    coreHighlights: [
      'Real tools of real utility sized proportionally for growing bodies',
      'Coordination of physical movement, balance, and purposeful grace',
      'Deep pride in serving healthy organic food to classmates daily'
    ],
    classroomApplication: 'Children grind whole wheat berries, knead sourdough, peel seasonal organic fruits, and manage classroom recycling and compost routines.'
  },
  {
    id: 'prepared-environment',
    title: 'The Prepared Learning Environment',
    subtitle: 'A serene, orderly sanctuary designed to inspire peace and focus',
    iconName: 'Building2',
    description: 'The physical space is the "third teacher." Every shelf, window ledge, plant, and piece of artwork is intentionally positioned to invite tranquility, aesthetic beauty, and effortless access to learning tools.',
    quote: 'The environment must be rich in motives which lend interest to activity and invite the child to conduct his own experiences.',
    coreHighlights: [
      'Abundant natural sunlight, living houseplants, and soothing earth-tone acoustics',
      'Low, uncluttered open wooden shelves with one complete set of each material',
      'Direct indoor-outdoor flow opening into gardens, orchards, and reading courtyards'
    ],
    classroomApplication: 'Lightweight child-proportioned solid wood furniture allows children to arrange their seating, while clear pathways prevent chaotic disruption.'
  },
  {
    id: 'peace-education',
    title: 'Peace Education & Graceful Community',
    subtitle: 'Building empathy, respect, emotional intelligence, and a peaceful learning community.',
    iconName: 'Handshake',
    description: 'We believe that education should develop not only intellectual abilities but also kindness, empathy, and respect for others. Children learn to communicate peacefully, understand different perspectives, resolve conflicts independently, and contribute positively to their community.',
    coreHighlights: [
      'Developing empathy, kindness, and mutual respect.',
      'Learning peaceful conflict resolution and effective communication.',
      'Building responsibility, cooperation, and a strong sense of community.'
    ],
    classroomApplication: 'Children participate in collaborative activities, practice grace and courtesy, care for their classmates, and learn to solve everyday disagreements through respectful communication.'
  }
];

export const montessoriPlanes = [
  {
    plane: 'First Plane (0 – 6 Years)',
    title: 'The Absorbent Mind & Physical Independence',
    subtitle: '"Help me do it by myself"',
    characteristics: 'Rapid sensory absorption, development of language, fine/gross motor coordination, and internal order. Learning occurs effortlessly through physical interaction with the prepared environment.'
  },
  {
    plane: 'Second Plane (6 – 12 Years)',
    title: 'The Reasoning Mind & Intellectual Independence',
    subtitle: '"Help me think for myself"',
    characteristics: 'Shift toward imagination, moral justice, abstract logic, and cosmic exploration. Children crave collaborative social interactions, deep cross-disciplinary projects, and exploring the wider universe.'
  },
  {
    plane: 'Third Plane (12 – 18 Years)',
    title: 'The Humanistic Mind & Social Independence',
    subtitle: '"Help me stand with others"',
    characteristics: 'Adolescent transformation, quest for identity, economic independence, ethical contribution, and understanding one\'s role in human society.'
  }
];

