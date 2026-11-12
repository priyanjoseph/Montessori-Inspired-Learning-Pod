export interface GalleryItem {
  id: string;
  title: string;
  category: 'all' | 'classroom' | 'nature' | 'practical' | 'arts';
  imageUrl: string;
  description: string;
  tag: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'The Prepared Casa dei Bambini',
    category: 'classroom',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&crop=entropy&q=80&w=960&h=800',
    description: 'Orderly, low solid birch shelves inviting independent choice and calm contemplation.',
    tag: 'Classroom Space'
  },
  {
    id: 'g-2',
    title: 'Hands-On Practical Life Kitchen',
    category: 'practical',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&crop=entropy&q=80&w=960&h=800',
    description: 'Child-sized baking counter where students knead wholesome bread and slice organic fruit.',
    tag: 'Practical Life'
  },
  {
    id: 'g-3',
    title: 'Natural Pigment & Clay Studio',
    category: 'arts',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&crop=entropy&q=80&w=960&h=800',
    description: 'Process-focused art exploration with non-toxic earth pigments and pottery wheels.',
    tag: 'Arts & Studio'
  },
  {
    id: 'g-4',
    title: 'Organic Garden & Raised Beds',
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&crop=entropy&q=80&w=960&h=800',
    description: 'Children cultivate heirloom peas, mint, and sunflower beds directly outside the pod.',
    tag: 'Nature Learning'
  },
  {
    id: 'g-5',
    title: 'Tactile Golden Bead Apparatus',
    category: 'classroom',
    imageUrl: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&crop=entropy&q=80&w=960&h=800',
    description: 'Mathematical insight made concrete through glass and brass decimal beads.',
    tag: 'Mathematics'
  },
  {
    id: 'g-6',
    title: 'Forest Sanctuary Trail & Botany',
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&crop=entropy&q=80&w=960&h=800',
    description: 'Daily outdoor expeditions through protected native woodlands for ecological observation.',
    tag: 'Forest School'
  },
  {
    id: 'g-7',
    title: 'Toddler Movement & Sensory Basin',
    category: 'practical',
    imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&crop=entropy&q=80&w=960&h=800',
    description: 'Water pouring, sea sponge squeezing, and sensory discovery tailored for little hands.',
    tag: 'Toddler Community'
  },
  {
    id: 'g-8',
    title: 'Cosmic Research & Timeline Studies',
    category: 'classroom',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&crop=entropy&q=80&w=960&h=800',
    description: 'Elementary students collaborate on cosmic timelines, mineralogy, and cartography.',
    tag: 'Cosmic Education'
  }
];

