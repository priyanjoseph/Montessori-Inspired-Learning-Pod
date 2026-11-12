export interface TeacherGuide {
  id: string;
  name: string;
  role: string;
  credentials: string;
  experience: string;
  image: string;
  bio: string;
  specialty: string;
  quote: string;
}

export const teachersData: TeacherGuide[] = [
  {
    id: 'guide-1',
    name: 'Helena Bergström, M.Ed.',
    role: 'Head of School & Pedagogical Director',
    credentials: 'AMI Certified (0–3 & 3–6), M.Ed. Montessori Education (Loyola)',
    experience: '18 Years Experience',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&crop=faces,top&q=80&w=800&h=500',
    bio: 'Helena trained at the prestigious Association Montessori Internationale training center in Gothenburg and London. She established Montessori Pod with the vision of creating an unhurried, nature-infused learning haven where each child\'s unique spirit is revered.',
    specialty: 'Classroom Preparation & Early Cognitive Development',
    quote: 'Our task is not to shape the child, but to uncover the extraordinary wisdom already resting inside them.'
  },
  {
    id: 'guide-2',
    name: 'Julian Montgomery',
    role: 'Lead Guide – Early Elementary Pod',
    credentials: 'AMI Elementary Diploma (6–12), B.S. Environmental Science',
    experience: '11 Years Experience',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&crop=faces,center&q=80&w=800&h=500',
    bio: 'Julian blends a deep fascination with botany and geology into Dr. Montessori\'s Cosmic Education. Known for bringing history to life through interactive storytelling, Julian guides 6-to-9-year-olds through self-directed scientific research and community stewardship.',
    specialty: 'Cosmic Curriculum, Mathematical Foundations & Field Research',
    quote: 'When you ignite a child\'s cosmic imagination, their capacity for deep inquiry becomes boundless.'
  },
  {
    id: 'guide-3',
    name: 'Amina Al-Khatib',
    role: 'Lead Guide – Primary Community (Casa dei Bambini)',
    credentials: 'AMS Early Childhood Credential, B.A. Early Childhood Linguistics',
    experience: '9 Years Experience',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&crop=faces,top&q=80&w=800&h=500',
    bio: 'Amina is a master of phonemic literacy and peaceful classroom harmony. Her bilingual background enriches the classroom with multicultural songs, nuanced sandpaper letter work, and gentle restorative communication circles.',
    specialty: 'Phonetic Language Progression & Sensorial Refinement',
    quote: 'Watching a four-year-old spontaneously build their very first sentence with the Moveable Alphabet is pure magic.'
  },
  {
    id: 'guide-4',
    name: 'Mateo Rossi',
    role: 'Lead Guide – Toddler Community',
    credentials: 'AMI Assistants to Infancy (0–3), Certified RIE Educator',
    experience: '7 Years Experience',
    image: 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?auto=format&fit=crop&crop=faces,center&q=80&w=800&h=500',
    bio: 'Mateo specializes in the crucial window of toddler autonomy, bodily coordination, and spoken vocabulary. He creates a tranquil, predictable daily rhythm where toddlers master self-care and gentle peer collaboration.',
    specialty: 'Motor Independence, Practical Life & Grace & Courtesy',
    quote: 'True respect for a toddler begins by slowing down to their rhythm and believing in their capability.'
  },
  {
    id: 'guide-5',
    name: 'Sora Tanaka',
    role: 'Atelierista & Nature Studies Guide',
    credentials: 'B.F.A. Fine Arts, Forest School Leader Certification Level 3',
    experience: '8 Years Experience',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&crop=faces,top&q=80&w=800&h=500',
    bio: 'Sora bridges the indoor Montessori studio with our outdoor garden and forest trail. Guiding children in ceramic sculpting, botanical watercolor, permaculture composting, and seasonal weather observation, Sora nurtures aesthetic reverence.',
    specialty: 'Natural Pigments, Clay Sculpture & Permaculture Gardening',
    quote: 'Art and nature are languages through which the child makes visible their understanding of the universe.'
  },
  {
    id: 'guide-6',
    name: 'Nadia Morales',
    role: 'Peace Education & Music Guide',
    credentials: 'AMS Early Childhood Credential, Orff-Schulwerk Music Certification',
    experience: '10 Years Experience',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&crop=faces,top&q=80&w=800&h=500',
    bio: 'Nadia weaves Montessori Peace Education, acoustic bell work, and multilingual rhythm circles into daily pod life. She guides children in grace and courtesy modeling, mindful listening, and restorative conflict resolution.',
    specialty: 'Peace Education, Montessori Bells & Bilingual Rhythm',
    quote: 'When children practice empathy and respectful dialogue each day, peaceful community becomes second nature.'
  }
];

