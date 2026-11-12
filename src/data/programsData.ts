export interface ProgramItem {
  id: string;
  title: string;
  ageGroup: string;
  tagline: string;
  description: string;
  detailedOverview: string;
  ratio: string;
  hours: string;
  image: string;
  badgeColor: string;
  keyActivities: string[];
  learningPillars: {
    title: string;
    description: string;
  }[];
  sampleSchedule: {
    time: string;
    activity: string;
  }[];
  tuition: string;
}

export const programsData: ProgramItem[] = [
  {
    id: 'toddler-program',
    title: 'Toddler Community',
    ageGroup: '18 Months – 3 Years',
    tagline: 'Fostering bodily independence, spoken language, and coordinated movement in a gentle sanctuary.',
    description: 'A nurturing environment designed specifically for the rapidly unfolding motor, sensory, and language capacities of toddlers, emphasizing gentle autonomy and sensory joy.',
    detailedOverview: 'In our Toddler Community, children transition from the home environment into their first cooperative social sphere. Shelves are at child-eye level, featuring beautifully crafted natural wooden items, dressing frames, child-sized washing stations, and organic materials that welcome little hands into meaningful, purposeful work.',
    ratio: '1 Guide : 4 Toddlers',
    hours: '8:30 AM – 12:30 PM (Half-Day) / 3:00 PM (Full-Day Option)',
    image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&crop=entropy&q=80&w=1200&h=750',
    badgeColor: 'bg-sage-100 text-forest-700 border-sage-200',
    keyActivities: [
      'Sensory exploration with natural textures, waterscapes, and clay',
      'Vocabulary enrichment and receptive language through songs, storytelling, and 3-part cards',
      'Practical life independence: handwashing, table setting, flower arranging, and self-dressing',
      'Social grace, peaceful turn-taking, and peer empathy exercises'
    ],
    learningPillars: [
      {
        title: 'Sensory Exploration',
        description: 'Refining the five senses through touch fabrics, sound cylinders, and sensory basins made from cedar and river stones.'
      },
      {
        title: 'Spoken Language Immersion',
        description: 'Cultivating expressive vocabulary through rich nomenclature cards, rhythm poems, and individualized guided conversations.'
      },
      {
        title: 'Practical Life Foundations',
        description: 'Empowering children to care for themselves and their space: pouring water, peeling fruit, sweeping with miniature brooms.'
      },
      {
        title: 'Social Harmony & Grace',
        description: 'Guiding toddlers through sharing physical boundaries, welcoming friends, and expressing emotions peacefully.'
      }
    ],
    sampleSchedule: [
      { time: '8:30 AM', activity: 'Warm Arrival & Morning Greetings' },
      { time: '9:00 AM', activity: 'Uninterrupted Montessori Work Cycle (Practical Life & Sensory)' },
      { time: '10:30 AM', activity: 'Communal Organic Snack Preparation & Sharing' },
      { time: '11:00 AM', activity: 'Outdoor Nature Walk & Garden Exploration' },
      { time: '11:45 AM', activity: 'Music, Movement & Story Circle' },
      { time: '12:30 PM', activity: 'Half-Day Dismissal / Rest & Lunch for Full-Day' }
    ],
    tuition: '$1,250 / month'
  },
  {
    id: 'primary-program',
    title: 'Primary Program (Children’s House)',
    ageGroup: '3 – 6 Years',
    tagline: 'Unlocking abstract conceptual thinking, joyful literacy, and self-directed concentration.',
    description: 'The iconic Casa dei Bambini multi-age community. Children progress through hands-on sensorial, mathematical, language, and cultural material during uninterrupted 3-hour work cycles.',
    detailedOverview: 'The Primary environment brings together 3-to-6 year olds in a harmonious family-style learning ecosystem. Older children naturally mentor younger peers, while younger children observe complex activities with awe and anticipation. Mathematical concepts transform from physical golden bead cubes into internalized arithmetic, and cursive sandpaper letters awaken a passionate love of reading.',
    ratio: '1 Guide : 10 Children (2 Certified Lead Guides per pod)',
    hours: '8:15 AM – 3:15 PM (Extended Day available to 5:30 PM)',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&crop=entropy&q=80&w=1200&h=750',
    badgeColor: 'bg-terracotta-100 text-terracotta-700 border-terracotta-200',
    keyActivities: [
      'Early mathematics with concrete Golden Bead Material and Stamp Games',
      'Phonetic language & literacy using Sandpaper Letters and Moveable Alphabet',
      'Sensorial refinement with the Pink Tower, Broad Stair, and Color Tablets',
      'Advanced practical life, bread baking, botanical care, and sewing',
      'Cultural studies: puzzle maps, continent folders, and physical biomes'
    ],
    learningPillars: [
      {
        title: 'Concrete-to-Abstract Math',
        description: 'Children physically handle units, tens, hundreds, and thousands beads, developing profound conceptual intuition before writing numbers.'
      },
      {
        title: 'Organic Literacy Pathway',
        description: 'Sound-based phonetic awareness leads naturally to spontaneously building words with the Moveable Alphabet, followed quickly by reading fluency.'
      },
      {
        title: 'Sensorial Categorization',
        description: 'Refining perception of dimension, weight, texture, pitch, and chromatic shades, creating an orderly mental blueprint for scientific inquiry.'
      },
      {
        title: 'Cultural Geography & Ecology',
        description: 'Exploring human world cultures, global animals, ecosystems, and hands-on botanical dissection with microscopy.'
      }
    ],
    sampleSchedule: [
      { time: '8:15 AM', activity: 'Individual Entry & Personal Work Selection' },
      { time: '8:45 AM', activity: '3-Hour Deep Concentration Work Period' },
      { time: '11:45 AM', activity: 'Communal Table Setting & Family-Style Lunch' },
      { time: '12:45 PM', activity: 'Outdoor Free Play, Forest Trails & Gardening' },
      { time: '2:00 PM', activity: 'Cultural Presentations, Foreign Language & Art Studio' },
      { time: '3:15 PM', activity: 'Daily Reflection & Dismissal' }
    ],
    tuition: '$1,480 / month'
  },
  {
    id: 'early-elementary',
    title: 'Early Elementary Pod',
    ageGroup: '6 – 9 Years',
    tagline: 'Cosmic education, collaborative moral inquiry, and deep scientific exploration for young thinkers.',
    description: 'Entering the second plane of development: a transition from "What is that?" to "Why does it happen?" Children embark on Dr. Montessori’s Great Lessons spanning astronomy, biology, history, and advanced mathematics.',
    detailedOverview: 'At age six, a dramatic metamorphosis occurs. Children develop a hunger for reason, justice, social belonging, and understanding the vast universe. In our Early Elementary pod, learning expands beyond the classroom walls through student-planned "Going Out" expeditions, deep cross-disciplinary research notebooks, mathematical bead frames, and student-run community committees.',
    ratio: '1 Guide : 12 Students',
    hours: '8:15 AM – 3:30 PM',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&crop=entropy&q=80&w=1200&h=750',
    badgeColor: 'bg-beige-200 text-forest-800 border-beige-300',
    keyActivities: [
      'Advanced mathematics: checkerboard multiplication, fraction circles, and decimal hierarchies',
      'Literacy & creative writing: grammatical symbolism, etymology, and literature seminars',
      'The Five Great Lessons: Creation of the Universe, Coming of Life, Story of Writing, Story of Numbers',
      'Collaborative team projects, lab science experiments, and field research notebooks',
      'Student-organized "Going Out" expeditions and civic responsibility'
    ],
    learningPillars: [
      {
        title: 'Cosmic Curriculum',
        description: 'An integrated worldview demonstrating how geology, biology, history, and human innovation are intricately linked.'
      },
      {
        title: 'Social Collaboration & Ethics',
        description: 'Children collaborate in self-chosen project teams, resolving social friction through restorative peace tables and democratic community meetings.'
      },
      {
        title: 'Advanced Scientific Inquiry',
        description: 'Hands-on hypotheses testing, botanical classification keys, celestial orbits, and environmental stewardship.'
      },
      {
        title: 'Self-Organized Expeditionary Learning',
        description: 'Students conduct research, make phone calls, calculate budgets, and organize outings to botanical conservatories and science museums.'
      }
    ],
    sampleSchedule: [
      { time: '8:15 AM', activity: 'Classroom Council & Planning Agendas' },
      { time: '8:45 AM', activity: 'In-Depth Research & Math Work Cycles' },
      { time: '11:30 AM', activity: 'Literature Circle / Socratic Discussion' },
      { time: '12:15 PM', activity: 'Community Lunch, Garden Harvesting & Culinary Work' },
      { time: '1:15 PM', activity: 'Outdoor Physical Education & Environmental Science' },
      { time: '2:15 PM', activity: 'Art Studio, Music Theory & Project Exhibition Prep' },
      { time: '3:30 PM', activity: 'Classroom Care, Gratitude Circle & Dismissal' }
    ],
    tuition: '$1,620 / month'
  }
];

