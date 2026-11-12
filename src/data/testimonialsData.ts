export interface Testimonial {
  id: string;
  parentName: string;
  role: string;
  childInfo: string;
  rating: number;
  quote: string;
  story: string;
  program: string;
}

export const testimonialsData: Testimonial[] = [
  {
    id: 't-1',
    parentName: 'Evelyn Vance & Marcus Vance',
    role: 'Parents of Leo (Age 4.5)',
    childInfo: 'Enrolled for 2.5 Years in Toddler & Primary',
    rating: 5,
    quote: 'Our son went from restless tantrums to setting the dinner table with gentle, focused pride.',
    story: 'Before joining Montessori Pod, we were anxious about our son\'s boundless energy and short attention span. Within four months of entering the Primary Pod, the transformation was staggering. He prepares his own morning oat bowl, neatly folds his clothes, and spends forty minutes captivated by geometric bead work. The guides treat each child with profound, quiet dignity.',
    program: 'Primary Program'
  },
  {
    id: 't-2',
    parentName: 'Dr. Tariq Al-Mansoor',
    role: 'Parent of Layla (Age 3) & Zayd (Age 7)',
    childInfo: 'Two children enrolled across Toddler & Early Elementary',
    rating: 5,
    quote: 'An environment that awakens genuine intellectual curiosity rather than factory testing.',
    story: 'As a neuroscientist, I looked critically at the developmental philosophy of every school in the region. The Montessori Pod is the only sanctuary that genuinely respects neurobiology and sensitive periods. My 7-year-old son recently led a self-directed research project on fungal mycorrhizal networks, budgeting his own trip to the botanical conservatory. It is breathtaking.',
    program: 'Early Elementary'
  },
  {
    id: 't-3',
    parentName: 'Claire Chen & David Miller',
    role: 'Parents of Lucas (Age 22 months)',
    childInfo: 'Enrolled in Toddler Community',
    rating: 5,
    quote: 'The warmth, organic meals, and peaceful atmosphere feel like a loving extension of home.',
    story: 'Leaving our toddler for the first time felt overwhelming, but the warm cream classrooms and gentle morning greeting routines melted all anxiety away. Lucas now uses sign and spoken words with astonishing precision, washes his hands independently at his child-sized washstand, and hums peacefully while stacking blocks.',
    program: 'Toddler Community'
  },
  {
    id: 't-4',
    parentName: 'Soraya Hadid',
    role: 'Architect & Mother of Noah (Age 5)',
    childInfo: 'Enrolled in Primary Program',
    rating: 5,
    quote: 'The spatial design and natural light nurture an unshakeable sense of calm and aesthetic joy.',
    story: 'The physical space is an architectural triumph of warmth, solid cedar shelves, living botanical walls, and calm acoustic balance. Noah has mastered decimal operations using the Golden Beads and speaks with remarkable empathy. We could not imagine a more intentional community for his foundational years.',
    program: 'Primary Program'
  }
];

