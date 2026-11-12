export interface DailyLogItem {
  id: string;
  date: string;
  time: string;
  title: string;
  category: 'Practical Life' | 'Sensorial' | 'Mathematics' | 'Language' | 'Nature & Ecology' | 'Social Grace';
  description: string;
  teacherObservations: string;
  photoUrl: string;
  childParticipation: 'Independent Focus' | 'Collaborative Mentorship' | 'Guided Exploration' | 'Creative Mastery';
  skillsDeveloped: string[];
  materialsUsed: string;
  guideName: string;
  comments?: {
    id: string;
    authorName: string;
    authorRole: string;
    text: string;
    createdAt: string;
  }[];
}

export interface TeacherReportItem {
  id: string;
  reportTitle: string;
  term: string;
  reportDate: string;
  teacherName: string;
  teacherRole: string;
  teacherCredentials: string;
  overallProgress: string;
  progressGrade: 'Exceeding Expectations' | 'Strong Consistent Growth' | 'Developing Steadily';
  strengths: string[];
  areasForImprovement: string[];
  socialObservations: string;
  languageDevelopment: string;
  mathematicalDevelopment: string;
  practicalLifeObservations: string;
  sensorialRefinement: string;
  teacherComments: string;
  recommendedHomeActivities: string[];
  chartMetrics: {
    area: string;
    score: number; // 0 - 100
    target: number;
  }[];
}

export interface PaymentItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  paymentMethod?: string;
  receiptNumber: string;
}

export interface TuitionSummary {
  totalTuitionFee: number;
  amountPaid: number;
  outstandingBalance: number;
  nextPaymentDueDate: string;
  paymentPlan: string;
  tuitionCycle: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'log' | 'report' | 'tuition' | 'event' | 'announcement';
  date: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface ChildProfileData {
  name: string;
  age: string;
  birthDate: string;
  program: string;
  classroom: string;
  enrollmentDate: string;
  assignedTeachers: {
    name: string;
    role: string;
    email: string;
  }[];
  attendanceStats: {
    totalDays: number;
    presentDays: number;
    excusedAbsences: number;
    unexcusedAbsences: number;
    tardyCount: number;
    attendancePercentage: number;
    consecutivePresentStreak: number;
  };
  learningAreas: {
    area: string;
    category: string;
    progressPercentage: number;
    skillsMastered: number;
    totalSkills: number;
    description: string;
    color: string;
    recentMilestones: string[];
  }[];
}

/* =========================================================
   1. DAILY LEARNING LOGS (Extensive, Realistic Sample Data)
   ========================================================= */
export const initialDailyLogs: DailyLogItem[] = [
  {
    id: 'log-1',
    date: 'Today, Nov 5, 2026',
    time: '10:15 AM',
    title: 'Counting Wooden Golden Beads & Decimal Hierarchies',
    category: 'Mathematics',
    description: 'Oliver worked with the Golden Bead apparatus, systematically exchanging ten unit beads for a ten-bar, and ten ten-bars for a hundred-square.',
    teacherObservations: 'Oliver displayed uninterrupted concentration for 44 continuous minutes. When calculating 2,430 + 1,245, he independently verified his decimal exchanges without asking for adult verification. His physical handling of the brass thousand cube demonstrates deep tactile internalization of place values.',
    photoUrl: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&q=80&w=800',
    childParticipation: 'Independent Focus',
    skillsDeveloped: ['Decimal Place Value (1–9,999)', 'Concrete Arithmetic', 'Bilateral Hand Coordination', 'Self-Verification'],
    materialsUsed: 'Montessori Golden Bead Material, Decimal Number Cards, Green Felt Mat',
    guideName: 'Amina Al-Khatib'
  },
  {
    id: 'log-2',
    date: 'Yesterday, Nov 4, 2026',
    time: '1:30 PM',
    title: 'Sorting Color Tablets (Box III: Chromatic Shades)',
    category: 'Sensorial',
    description: 'Grading 63 color tablets across seven distinct hues, systematically ordering shades from palest pastel tint to deepest saturated hue.',
    teacherObservations: 'Oliver selected the blue and terracotta tablets today. He held each tablet at arms length under natural window light to discern subtle chromatic gradations. When he hesitated between shades 4 and 5, he gently paired them against white silk to isolate the value.',
    photoUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
    childParticipation: 'Independent Focus',
    skillsDeveloped: ['Visual Discrimination of Hue & Value', 'Orderly Sequencing', 'Aesthetic Sensitivity', 'Pincer Grasp Control'],
    materialsUsed: 'Montessori Color Box III (Lacquered Birch & Silk Threads)',
    guideName: 'Mateo Rossi'
  },
  {
    id: 'log-3',
    date: 'Nov 3, 2026',
    time: '11:00 AM',
    title: 'Planting Heirloom Sweet Pea Seeds & Garden Composting',
    category: 'Nature & Ecology',
    description: 'Measuring organic potting soil into biodegradable peat pots, carefully planting sweet pea seeds, and recording moisture levels in the garden log.',
    teacherObservations: 'In the greenhouse courtyard, Oliver showed great care handling the delicate seedlings. He carefully poured exactly 50ml of rainwater from the child-sized zinc watering can. He invited younger peer Sophia to smell the damp soil and demonstrated how to pat the soil bed gently.',
    photoUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800',
    childParticipation: 'Collaborative Mentorship',
    skillsDeveloped: ['Ecological Stewardship', 'Measurement & Volume', 'Botanical Life Cycles', 'Empathetic Peer Tutoring'],
    materialsUsed: 'Organic Soil, Peat Pots, Miniature Trowels, Rainwater Pitcher',
    guideName: 'Sora Tanaka'
  },
  {
    id: 'log-4',
    date: 'Nov 2, 2026',
    time: '9:30 AM',
    title: 'Letter Recognition & Cursive Sandpaper Tracing',
    category: 'Language',
    description: 'Tactile tracing of phonograms "sh", "ch", and "th" on emery sandpaper cards while vocalizing phonetic sounds.',
    teacherObservations: 'Oliver practiced tracing with the index and middle fingers of his dominant hand. After tracing the letters, he spontaneously moved to the Large Moveable Alphabet and composed words: "ship", "chin", and "moth". He then read his words aloud with joyful pride.',
    photoUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
    childParticipation: 'Creative Mastery',
    skillsDeveloped: ['Phonemic Awareness', 'Muscle Memory for Cursive Script', 'Word Synthesis', 'Auditory-Visual Integration'],
    materialsUsed: 'Cursive Sandpaper Letters, Moveable Alphabet Wooden Box',
    guideName: 'Amina Al-Khatib'
  },
  {
    id: 'log-5',
    date: 'Oct 31, 2026',
    time: '2:00 PM',
    title: 'Practical Life: Handwashing & Citrus Slicing for Snack',
    category: 'Practical Life',
    description: 'Setting up the porcelain washstand, washing hands methodically, peeling and slicing organic clementines for morning communal snack.',
    teacherObservations: 'Oliver carried the heavy ceramic basin with two hands, walking slowly with exquisite physical equilibrium. He peeled three whole clementines, arranged the segments radially on the bamboo serving tray, and offered snack to each classmate before sitting down to enjoy his own portion.',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
    childParticipation: 'Independent Focus',
    skillsDeveloped: ['Grace & Courtesy', 'Fine Motor Dexterity', 'Sequential Order (4-Step Restorations)', 'Community Care'],
    materialsUsed: 'Hand-thrown Porcelain Basin, Organic Citrus, Wavy Slicer, Bamboo Tray',
    guideName: 'Mateo Rossi'
  },
  {
    id: 'log-6',
    date: 'Oct 29, 2026',
    time: '10:00 AM',
    title: 'Continent Wooden Puzzle Map: Africa & Biome Wildlife',
    category: 'Social Grace',
    description: 'Dismantling and assembling the continent puzzle map of Africa, matching animal miniature replicas to the Sahara, Congo Basin, and Savannah.',
    teacherObservations: 'Oliver recognized the Nile River and Madagascar immediately. He worked collaboratively with his friend Leo for 35 minutes, sharing the country pieces peacefully and referring to the control map to check accuracy.',
    photoUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800',
    childParticipation: 'Collaborative Mentorship',
    skillsDeveloped: ['Global Geography', 'Spatial Reasoning', 'Fine Motor Knob Grip', 'Collaborative Problem-Solving'],
    materialsUsed: 'Wooden Africa Continent Map, Wildlife Replicas, Felt Biome Mat',
    guideName: 'Julian Montgomery'
  }
];

/* =========================================================
   2. TEACHER REPORTS (Comprehensive & Printable)
   ========================================================= */
export const initialTeacherReports: TeacherReportItem[] = [
  {
    id: 'rep-fall-2026',
    reportTitle: 'Fall Term Comprehensive Developmental Progress Report',
    term: 'Fall Term (Sep – Nov 2026)',
    reportDate: 'October 30, 2026',
    teacherName: 'Amina Al-Khatib',
    teacherRole: 'Lead Guide – Primary Community (Casa dei Bambini II)',
    teacherCredentials: 'AMS Early Childhood Credential, M.Ed. Montessori Education',
    overallProgress: 'Oliver has demonstrated remarkable cognitive stamina, authentic independence, and compassionate social poise throughout the Fall Term. His concentration periods now regularly exceed 45 minutes.',
    progressGrade: 'Exceeding Expectations',
    strengths: [
      'Profound concentration during multi-step mathematical operations using the Golden Beads and Stamp Game.',
      'Exceptional phonetic awareness and spontaneous creative writing with the Moveable Alphabet.',
      'Gentle community mentorship: frequently helps younger 3-year-olds carry trays and choose floor rugs.',
      'Impeccable care for the prepared environment, consistently restoring materials to their exact shelf location.'
    ],
    areasForImprovement: [
      'Encourage patience when transitioning from high-focus indoor work cycles to group outdoor cleanup.',
      'Expand confidence with cursive pencil grip when transferring thoughts from the Moveable Alphabet to paper.'
    ],
    socialObservations: 'Oliver is a calming, anchor presence in Casa II. He gravitates toward cooperative partnerships and uses the Peace Rose spontaneously to resolve minor differences with peers.',
    languageDevelopment: 'Oliver has mastered all single-letter cursive sandpaper phonograms and is currently synthesizing 4-letter blends. He reads phonetic readers with expression and enjoys dictating nature poems.',
    mathematicalDevelopment: 'Solid conceptual understanding of decimal place values up to 9,999. He has mastered static addition and is enthusiastically exploring dynamic addition with exchanges.',
    practicalLifeObservations: 'High dexterity in fine motor activities including sewing buttons, citrus squeezing, and folding linen napkins. His bodily coordination is fluid and purposeful.',
    sensorialRefinement: 'Grading Color Tablets Box III with 100% visual accuracy. He demonstrates keen interest in the Geometric Cabinet, accurately identifying trapezoids, rhombuses, and ovals.',
    teacherComments: 'It is an absolute joy to guide Oliver. His natural curiosity is boundless, and his respect for materials reflects deep inner peace. We look forward to introducing long division with bead skittles in the coming term.',
    recommendedHomeActivities: [
      'Invite Oliver to measure ingredients during family baking (e.g. measuring cups, level spoons).',
      'Provide unlined sketchbooks and quality colored pencils for spontaneous storytelling.',
      'Engage in family outdoor nature walks collecting and classifying seasonal botanical specimens.'
    ],
    chartMetrics: [
      { area: 'Practical Life', score: 94, target: 85 },
      { area: 'Sensorial Education', score: 96, target: 85 },
      { area: 'Mathematics', score: 92, target: 80 },
      { area: 'Language & Literacy', score: 88, target: 80 },
      { area: 'Nature & Cultural', score: 90, target: 80 },
      { area: 'Social Grace', score: 95, target: 85 }
    ]
  },
  {
    id: 'rep-spring-2026',
    reportTitle: 'Mid-Year Sensitive Periods & Social Horizon Assessment',
    term: 'Spring Term 2026',
    reportDate: 'May 15, 2026',
    teacherName: 'Mateo Rossi',
    teacherRole: 'Co-Lead Guide & Toddler-to-Primary Transition Specialist',
    teacherCredentials: 'AMI Certified (0–3 & 3–6), RIE Certified Educator',
    overallProgress: 'Oliver completed a seamless transition from the Toddler Community into the full 3–6 Casa environment, displaying eagerness to explore concrete mathematical apparatus.',
    progressGrade: 'Strong Consistent Growth',
    strengths: [
      'Rapid mastery of physical classroom boundaries and grace & courtesy rituals.',
      'Deep enthusiasm for sensorial dimension materials (Pink Tower, Broad Stair, Knobbed Cylinders).',
      'Warm and polite communication with guides and peers.'
    ],
    areasForImprovement: [
      'Developing sustained focus on longer spoken-language group discussions.',
      'Gentle reinforcement of putting work rugs away neatly rolled rather than folded.'
    ],
    socialObservations: 'Adapted effortlessly to older peers in the multi-age setting, often observing 5-year-olds working with complex fraction skittles with rapt attention.',
    languageDevelopment: 'Rich spoken vocabulary and excellent phonetic sound isolation for starting consonants.',
    mathematicalDevelopment: 'Mastered counting 1–10 with Number Rods and Spindle Boxes with zero error.',
    practicalLifeObservations: 'Enjoys wet pouring, mirror polishing, and dressing frames with large wooden buttons.',
    sensorialRefinement: 'Exceptional tactile perception with rough/smooth boards and thermic bottles.',
    teacherComments: 'Oliver has established strong roots in our pod. His gentle disposition makes him a beloved friend in the classroom.',
    recommendedHomeActivities: [
      'Encourage dressing independence (zippers, coat flip method, shoe fasteners).',
      'Sing rhythmic poetry and rhyming games together.'
    ],
    chartMetrics: [
      { area: 'Practical Life', score: 88, target: 80 },
      { area: 'Sensorial Education', score: 90, target: 80 },
      { area: 'Mathematics', score: 84, target: 75 },
      { area: 'Language & Literacy', score: 82, target: 75 },
      { area: 'Nature & Cultural', score: 85, target: 75 },
      { area: 'Social Grace', score: 89, target: 80 }
    ]
  }
];

/* =========================================================
   3. TUITION & PAYMENTS DATA
   ========================================================= */
export const initialTuitionSummary: TuitionSummary = {
  totalTuitionFee: 14800,
  amountPaid: 11840,
  outstandingBalance: 1480,
  nextPaymentDueDate: 'December 1, 2026',
  paymentPlan: '10-Month Academic Schedule ($1,480 / month)',
  tuitionCycle: 'Academic Year 2026–2027 (Primary Pod Casa II)'
};

export const initialPaymentHistory: PaymentItem[] = [
  {
    id: 'PAY-2026-1101',
    date: 'Nov 1, 2026',
    description: 'November 2026 Primary Program Tuition',
    amount: 1480,
    status: 'Paid',
    paymentMethod: 'Bank ACH (•••• 4921)',
    receiptNumber: 'RCP-2026-8491'
  },
  {
    id: 'PAY-2026-1001',
    date: 'Oct 1, 2026',
    description: 'October 2026 Primary Program Tuition',
    amount: 1480,
    status: 'Paid',
    paymentMethod: 'Visa Debit (•••• 8192)',
    receiptNumber: 'RCP-2026-7312'
  },
  {
    id: 'PAY-2026-0915',
    date: 'Sep 15, 2026',
    description: 'Annual Forest School & Organic Snack Material Fee',
    amount: 450,
    status: 'Paid',
    paymentMethod: 'Bank ACH (•••• 4921)',
    receiptNumber: 'RCP-2026-6804'
  },
  {
    id: 'PAY-2026-0901',
    date: 'Sep 1, 2026',
    description: 'September 2026 Primary Program Tuition & Deposit',
    amount: 2480,
    status: 'Paid',
    paymentMethod: 'Bank ACH (•••• 4921)',
    receiptNumber: 'RCP-2026-6201'
  },
  {
    id: 'PAY-2026-1201',
    date: 'Dec 1, 2026',
    description: 'December 2026 Primary Program Tuition',
    amount: 1480,
    status: 'Pending',
    paymentMethod: 'Scheduled Auto-Debit (Dec 1)',
    receiptNumber: 'INV-2026-9042'
  }
];

/* =========================================================
   4. NOTIFICATIONS DATA (Categorized & Interactive)
   ========================================================= */
export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Daily Learning Log Published',
    message: 'Guide Amina posted an observation log: "Counting Wooden Golden Beads & Decimal Hierarchies".',
    type: 'log',
    date: 'Today, 10:30 AM',
    timestamp: '2026-11-05T10:30:00Z',
    isRead: false,
    actionUrl: '/dashboard/logs'
  },
  {
    id: 'notif-2',
    title: 'Fall Term Pedagogical Report Available',
    message: 'Oliver’s comprehensive Fall Term developmental progress evaluation has been published by Lead Guide Amina.',
    type: 'report',
    date: 'Yesterday, 3:45 PM',
    timestamp: '2026-11-04T15:45:00Z',
    isRead: false,
    actionUrl: '/dashboard/reports'
  },
  {
    id: 'notif-3',
    title: 'Tuition Statement Reminder',
    message: 'Your December 2026 tuition statement ($1,480.00) is generated. Due date: December 1, 2026.',
    type: 'tuition',
    date: 'Nov 2, 2026',
    timestamp: '2026-11-02T09:00:00Z',
    isRead: true,
    actionUrl: '/dashboard/tuition'
  },
  {
    id: 'notif-4',
    title: 'Autumn Harvest Soup & Bread Feast',
    message: 'Reminder: Family Community gathering this Friday, Nov 8 at 9:00 AM in the Pod Kitchen & Courtyard.',
    type: 'event',
    date: 'Oct 31, 2026',
    timestamp: '2026-10-31T14:15:00Z',
    isRead: true,
    actionUrl: '/dashboard'
  },
  {
    id: 'notif-5',
    title: 'Seasonal Outdoor Clothing Guidelines',
    message: 'As chilly mornings arrive, please pack extra wool socks, waterproof mud boots, and layered outdoor gear.',
    type: 'announcement',
    date: 'Oct 28, 2026',
    timestamp: '2026-10-28T11:00:00Z',
    isRead: true,
    actionUrl: '/dashboard'
  }
];

/* =========================================================
   5. CHILD DETAILED PROFILE
   ========================================================= */
export const initialChildProfile: ChildProfileData = {
  name: 'Oliver Jenkins',
  age: '4 Years, 6 Months',
  birthDate: 'May 12, 2022',
  program: 'Primary Program (Casa dei Bambini)',
  classroom: 'Casa Studio II (East Garden Wing)',
  enrollmentDate: 'September 1, 2025',
  assignedTeachers: [
    {
      name: 'Amina Al-Khatib',
      role: 'Lead Guide (AMS Early Childhood)',
      email: 'amina@montessorilearningpod.edu'
    },
    {
      name: 'Mateo Rossi',
      role: 'Co-Guide (AMI Certified 0–3 & 3–6)',
      email: 'mateo@montessorilearningpod.edu'
    }
  ],
  attendanceStats: {
    totalDays: 45,
    presentDays: 43,
    excusedAbsences: 2,
    unexcusedAbsences: 0,
    tardyCount: 1,
    attendancePercentage: 95.6,
    consecutivePresentStreak: 16
  },
  learningAreas: [
    {
      area: 'Practical Life',
      category: 'Coordination & Independence',
      progressPercentage: 94,
      skillsMastered: 18,
      totalSkills: 20,
      description: 'Mastery of everyday physical tasks, bodily self-reliance, graceful movement, and classroom stewardship.',
      color: 'bg-sage-500',
      recentMilestones: ['Water transfer without spillage', 'Table setting with porcelain dishes', 'Sewing buttons on linen']
    },
    {
      area: 'Sensorial Education',
      category: 'Perceptual Refinement',
      progressPercentage: 96,
      skillsMastered: 19,
      totalSkills: 20,
      description: 'Refining the five senses through materialized abstractions of dimension, weight, pitch, and chromatic color.',
      color: 'bg-terracotta',
      recentMilestones: ['Color Tablets Box III chromatic grading', 'Pink Tower & Broad Stair cross-construction', 'Bells diatonic matching']
    },
    {
      area: 'Mathematics',
      category: 'Decimal Place Value & Arithmetic',
      progressPercentage: 90,
      skillsMastered: 16,
      totalSkills: 18,
      description: 'Concrete hands-on exploration of place value hierarchies, golden beads, and early dynamic operations.',
      color: 'bg-forest-600',
      recentMilestones: ['Golden Bead bank game exchanges', 'Stamp Game 4-digit dynamic addition', 'Teen board bead counting']
    },
    {
      area: 'Language Development',
      category: 'Phonetics, Writing & Literacy',
      progressPercentage: 88,
      skillsMastered: 15,
      totalSkills: 18,
      description: 'Moving from phonemic sound segmentation to cursive sandpaper letters, Moveable Alphabet composing, and early reading.',
      color: 'bg-forest-800',
      recentMilestones: ['Moveable alphabet word building', 'Tracing 26 cursive sandpaper letters', 'Phonetic object baskets']
    },
    {
      area: 'Creativity & Arts',
      category: 'Fine Art, Music & Clay',
      progressPercentage: 86,
      skillsMastered: 13,
      totalSkills: 16,
      description: 'Expressive fine art using natural earth pigments, clay sculpting, table loom weaving, and musical rhythm.',
      color: 'bg-softbrown-400',
      recentMilestones: ['Natural mineral tempera painting', 'Coil pot clay sculpting', 'Pentatonic metallophone rhythm']
    },
    {
      area: 'Social Development',
      category: 'Grace, Courtesy & Empathy',
      progressPercentage: 95,
      skillsMastered: 17,
      totalSkills: 18,
      description: 'Cultivating peaceful conflict resolution, welcoming community guests, and nurturing multi-age friendships.',
      color: 'bg-sage-600',
      recentMilestones: ['Peace Rose dispute resolution', 'Mentoring 3-year-old peers in work cycle', 'Snack host responsibilities']
    }
  ]
};
