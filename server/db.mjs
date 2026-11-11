import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { hashPassword } from './security.mjs';

const DEFAULT_AVATARS = {
  parent: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
  parent2: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
  admin: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  child1: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
  child2: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&q=80&w=600',
};

let dbInstance = null;

function buildDefaultLearningAreas() {
  return [
    {
      area: 'Practical Life',
      category: 'Coordination & Independence',
      progressPercentage: 94,
      skillsMastered: 18,
      totalSkills: 20,
      description: 'Mastery of everyday physical tasks, bodily self-reliance, graceful movement, and classroom stewardship.',
      color: 'bg-sage-500',
      recentMilestones: ['Water transfer without spillage', 'Table setting with porcelain dishes', 'Sewing buttons on linen'],
    },
    {
      area: 'Sensorial Education',
      category: 'Perceptual Refinement',
      progressPercentage: 96,
      skillsMastered: 19,
      totalSkills: 20,
      description: 'Refining the five senses through materialized abstractions of dimension, weight, pitch, and chromatic color.',
      color: 'bg-terracotta',
      recentMilestones: ['Color Tablets Box III chromatic grading', 'Pink Tower & Broad Stair cross-construction', 'Bells diatonic matching'],
    },
    {
      area: 'Mathematics',
      category: 'Decimal Place Value & Arithmetic',
      progressPercentage: 90,
      skillsMastered: 16,
      totalSkills: 18,
      description: 'Concrete hands-on exploration of place value hierarchies, golden beads, and early dynamic operations.',
      color: 'bg-forest-600',
      recentMilestones: ['Golden Bead bank game exchanges', 'Stamp Game 4-digit dynamic addition', 'Teen board bead counting'],
    },
    {
      area: 'Language Development',
      category: 'Phonetics, Writing & Literacy',
      progressPercentage: 88,
      skillsMastered: 15,
      totalSkills: 18,
      description: 'Moving from phonemic sound segmentation to cursive sandpaper letters, Moveable Alphabet composing, and early reading.',
      color: 'bg-forest-800',
      recentMilestones: ['Moveable alphabet word building', 'Tracing 26 cursive sandpaper letters', 'Phonetic object baskets'],
    },
    {
      area: 'Creativity & Arts',
      category: 'Fine Art, Music & Clay',
      progressPercentage: 86,
      skillsMastered: 13,
      totalSkills: 16,
      description: 'Expressive fine art using natural earth pigments, clay sculpting, table loom weaving, and musical rhythm.',
      color: 'bg-softbrown-400',
      recentMilestones: ['Natural mineral tempera painting', 'Coil pot clay sculpting', 'Pentatonic metallophone rhythm'],
    },
    {
      area: 'Social Development',
      category: 'Grace, Courtesy & Empathy',
      progressPercentage: 95,
      skillsMastered: 17,
      totalSkills: 18,
      description: 'Cultivating peaceful conflict resolution, welcoming community guests, and nurturing multi-age friendships.',
      color: 'bg-sage-600',
      recentMilestones: ['Peace Rose dispute resolution', 'Mentoring 3-year-old peers in work cycle', 'Snack host responsibilities'],
    },
  ];
}

export async function getDb() {
  if (dbInstance) return dbInstance;

  const dbPath =
    process.env.MONTESSORI_DB_PATH ||
    path.join(process.cwd(), 'server', 'data', 'montessori.sqlite');

  if (dbPath !== ':memory:') {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }

  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA foreign_keys = ON;');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      phone TEXT DEFAULT '',
      password_hash TEXT,
      role TEXT NOT NULL DEFAULT 'parent' CHECK (role IN ('parent', 'admin')),
      avatar TEXT DEFAULT '',
      provider TEXT NOT NULL DEFAULT 'local',
      provider_id TEXT DEFAULT '',
      emergency_contact TEXT DEFAULT '',
      dietary_notes TEXT DEFAULT '',
      notification_preferences TEXT NOT NULL DEFAULT '{"emailAlerts":true,"dailyDigest":true,"urgentSms":true,"photoTagging":true}',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS children (
      id TEXT PRIMARY KEY,
      parent_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      age TEXT NOT NULL,
      birth_date TEXT DEFAULT '',
      program TEXT NOT NULL,
      classroom TEXT NOT NULL,
      enrollment_date TEXT NOT NULL,
      assigned_teacher TEXT NOT NULL,
      photo TEXT NOT NULL,
      assigned_teachers_json TEXT NOT NULL,
      attendance_stats_json TEXT NOT NULL,
      learning_areas_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      token_hash TEXT NOT NULL UNIQUE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      remember_me INTEGER NOT NULL DEFAULT 0,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      used_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS daily_logs (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      teacher_observations TEXT NOT NULL,
      photo_url TEXT NOT NULL,
      child_participation TEXT NOT NULL,
      skills_developed_json TEXT NOT NULL,
      materials_used TEXT NOT NULL,
      guide_name TEXT NOT NULL,
      guide_avatar TEXT NOT NULL,
      comments_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS teacher_reports (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
      report_title TEXT NOT NULL,
      term TEXT NOT NULL,
      report_date TEXT NOT NULL,
      teacher_name TEXT NOT NULL,
      teacher_role TEXT NOT NULL,
      teacher_credentials TEXT NOT NULL,
      teacher_avatar TEXT NOT NULL,
      overall_progress TEXT NOT NULL,
      progress_grade TEXT NOT NULL,
      strengths_json TEXT NOT NULL,
      areas_for_improvement_json TEXT NOT NULL,
      social_observations TEXT NOT NULL,
      language_development TEXT NOT NULL,
      mathematical_development TEXT NOT NULL,
      practical_life_observations TEXT NOT NULL,
      sensorial_refinement TEXT NOT NULL,
      teacher_comments TEXT NOT NULL,
      recommended_home_activities_json TEXT NOT NULL,
      chart_metrics_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tuition_accounts (
      child_id TEXT PRIMARY KEY REFERENCES children(id) ON DELETE CASCADE,
      total_tuition_fee REAL NOT NULL,
      amount_paid REAL NOT NULL,
      outstanding_balance REAL NOT NULL,
      next_payment_due_date TEXT NOT NULL,
      payment_plan TEXT NOT NULL,
      tuition_cycle TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
      parent_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      receipt_number TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      target_role TEXT NOT NULL DEFAULT 'parent',
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      action_url TEXT
    );

    CREATE TABLE IF NOT EXISTS staff (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      credentials TEXT NOT NULL,
      experience TEXT NOT NULL,
      email TEXT NOT NULL,
      classroom TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Active'
    );

    CREATE TABLE IF NOT EXISTS programs_catalog (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      age_group TEXT NOT NULL,
      ratio TEXT NOT NULL,
      hours TEXT NOT NULL,
      tuition TEXT NOT NULL,
      enrolled_count INTEGER NOT NULL DEFAULT 0,
      capacity INTEGER NOT NULL DEFAULT 16,
      status TEXT NOT NULL DEFAULT 'Active'
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      category TEXT NOT NULL,
      audience TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attendance_records (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('Present', 'Excused', 'Absent', 'Tardy')),
      notes TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS cms_content (
      key TEXT PRIMARY KEY,
      section TEXT NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      body TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  const countRow = db.prepare('SELECT COUNT(*) AS count FROM users').get();
  if (countRow.count === 0) {
    await seedInitialData(db);
  }

  dbInstance = db;
  return db;
}

async function seedInitialData(db) {
  const now = new Date().toISOString();
  const parentHash = await hashPassword('parent123');
  const adminHash = await hashPassword('admin123');

  // 1. Users: Sarah Jenkins (Demo Parent), Elena Morales (Second Parent for isolation testing), Helena Bergstrom (Demo Admin)
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, phone, password_hash, role, avatar, provider, provider_id, emergency_contact, dietary_notes, notification_preferences, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'local', '', ?, ?, ?, ?)
  `);

  insertUser.run(
    'user-parent-1',
    'Sarah Jenkins',
    'parent@example.com',
    '+1 (555) 724-8190',
    parentHash,
    'parent',
    DEFAULT_AVATARS.parent,
    'Marcus Jenkins (Father) - +1 (555) 392-1049',
    'Organic vegetarian preference; No peanut allergies.',
    JSON.stringify({ emailAlerts: true, dailyDigest: true, urgentSms: true, photoTagging: true }),
    now
  );

  insertUser.run(
    'user-parent-2',
    'Claire Chen',
    'claire@example.com',
    '+1 (555) 891-4022',
    parentHash,
    'parent',
    DEFAULT_AVATARS.parent2,
    'David Miller (Father) - +1 (555) 412-9012',
    'No allergies; dairy-free snack preference.',
    JSON.stringify({ emailAlerts: true, dailyDigest: true, urgentSms: false, photoTagging: true }),
    now
  );

  insertUser.run(
    'user-admin-1',
    'Helena Bergström, M.Ed.',
    'admin@montessorilearningpod.edu',
    '+1 (555) 382-7190',
    adminHash,
    'admin',
    DEFAULT_AVATARS.admin,
    'Campus Security & Office Desk - +1 (555) 382-7199',
    'Administrative account',
    JSON.stringify({ emailAlerts: true, dailyDigest: true, urgentSms: true, photoTagging: false }),
    now
  );

  // 2. Children (Oliver belongs strictly to Sarah; Lucas belongs strictly to Claire)
  const insertChild = db.prepare(`
    INSERT INTO children (id, parent_id, name, age, birth_date, program, classroom, enrollment_date, assigned_teacher, photo, assigned_teachers_json, attendance_stats_json, learning_areas_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const oliverTeachers = [
    { name: 'Amina Al-Khatib', role: 'Lead Guide (AMS Early Childhood)', email: 'amina@montessorilearningpod.edu' },
    { name: 'Mateo Rossi', role: 'Co-Guide (AMI Certified 0–3 & 3–6)', email: 'mateo@montessorilearningpod.edu' },
  ];

  const oliverAttendance = {
    totalDays: 45,
    presentDays: 43,
    excusedAbsences: 2,
    unexcusedAbsences: 0,
    tardyCount: 1,
    attendancePercentage: 95.6,
    consecutivePresentStreak: 16,
  };

  insertChild.run(
    'child-oliver',
    'user-parent-1',
    'Oliver Jenkins',
    '4 Years, 6 Months',
    'May 12, 2022',
    'Primary Program (Casa dei Bambini)',
    'Casa Studio II (East Garden Wing)',
    'September 1, 2025',
    'Amina Al-Khatib, AMS',
    DEFAULT_AVATARS.child1,
    JSON.stringify(oliverTeachers),
    JSON.stringify(oliverAttendance),
    JSON.stringify(buildDefaultLearningAreas()),
    now
  );

  const lucasTeachers = [
    { name: 'Mateo Rossi', role: 'Lead Guide – Toddler Community', email: 'mateo@montessorilearningpod.edu' },
  ];

  const lucasAttendance = {
    totalDays: 45,
    presentDays: 42,
    excusedAbsences: 3,
    unexcusedAbsences: 0,
    tardyCount: 0,
    attendancePercentage: 93.3,
    consecutivePresentStreak: 11,
  };

  insertChild.run(
    'child-lucas',
    'user-parent-2',
    'Lucas Miller',
    '22 Months',
    'January 14, 2025',
    'Toddler Community (18m – 3 yrs)',
    'Nido & Toddler Sunroom',
    'September 1, 2026',
    'Mateo Rossi, AMI',
    DEFAULT_AVATARS.child2,
    JSON.stringify(lucasTeachers),
    JSON.stringify(lucasAttendance),
    JSON.stringify(buildDefaultLearningAreas()),
    now
  );

  // 3. Daily Learning Logs
  const insertLog = db.prepare(`
    INSERT INTO daily_logs (id, child_id, date, time, title, category, description, teacher_observations, photo_url, child_participation, skills_developed_json, materials_used, guide_name, guide_avatar, comments_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', ?)
  `);

  const oliverLogs = [
    ['log-1', 'child-oliver', 'Today, Nov 5, 2026', '10:15 AM', 'Counting Wooden Golden Beads & Decimal Hierarchies', 'Mathematics', 'Oliver worked with the Golden Bead apparatus, systematically exchanging ten unit beads for a ten-bar, and ten ten-bars for a hundred-square.', 'Oliver displayed uninterrupted concentration for 44 continuous minutes. When calculating 2,430 + 1,245, he independently verified his decimal exchanges without asking for adult verification.', 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&q=80&w=800', 'Independent Focus', ['Decimal Place Value (1–9,999)', 'Concrete Arithmetic', 'Bilateral Hand Coordination', 'Self-Verification'], 'Montessori Golden Bead Material, Decimal Number Cards, Green Felt Mat', 'Amina Al-Khatib', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256'],
    ['log-2', 'child-oliver', 'Yesterday, Nov 4, 2026', '1:30 PM', 'Sorting Color Tablets (Box III: Chromatic Shades)', 'Sensorial', 'Grading 63 color tablets across seven distinct hues, systematically ordering shades from palest pastel tint to deepest saturated hue.', 'Oliver selected the blue and terracotta tablets today. He held each tablet at arms length under natural window light to discern subtle chromatic gradations.', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800', 'Independent Focus', ['Visual Discrimination of Hue & Value', 'Orderly Sequencing', 'Aesthetic Sensitivity', 'Pincer Grasp Control'], 'Montessori Color Box III (Lacquered Birch & Silk Threads)', 'Mateo Rossi', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256'],
    ['log-3', 'child-oliver', 'Nov 3, 2026', '11:00 AM', 'Planting Heirloom Sweet Pea Seeds & Garden Composting', 'Nature & Ecology', 'Measuring organic potting soil into biodegradable peat pots, carefully planting sweet pea seeds, and recording moisture levels in the garden log.', 'In the greenhouse courtyard, Oliver showed great care handling the delicate seedlings and invited younger peers to smell the damp soil.', 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800', 'Collaborative Mentorship', ['Ecological Stewardship', 'Measurement & Volume', 'Botanical Life Cycles', 'Empathetic Peer Tutoring'], 'Organic Soil, Peat Pots, Miniature Trowels, Rainwater Pitcher', 'Sora Tanaka', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'],
    ['log-4', 'child-oliver', 'Nov 2, 2026', '9:30 AM', 'Letter Recognition & Cursive Sandpaper Tracing', 'Language', 'Tactile tracing of phonograms "sh", "ch", and "th" on emery sandpaper cards while vocalizing phonetic sounds.', 'Oliver moved from tracing to the Large Moveable Alphabet and composed "ship", "chin", and "moth" independently.', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800', 'Creative Mastery', ['Phonemic Awareness', 'Muscle Memory for Cursive Script', 'Word Synthesis', 'Auditory-Visual Integration'], 'Cursive Sandpaper Letters, Moveable Alphabet Wooden Box', 'Amina Al-Khatib', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256'],
    ['log-5', 'child-oliver', 'Oct 31, 2026', '2:00 PM', 'Practical Life: Handwashing & Citrus Slicing for Snack', 'Practical Life', 'Setting up the porcelain washstand, washing hands methodically, peeling and slicing organic clementines for morning communal snack.', 'Oliver carried the ceramic basin calmly and offered snack to each classmate before sitting down.', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800', 'Independent Focus', ['Grace & Courtesy', 'Fine Motor Dexterity', 'Sequential Order (4-Step Restorations)', 'Community Care'], 'Hand-thrown Porcelain Basin, Organic Citrus, Wavy Slicer, Bamboo Tray', 'Mateo Rossi', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256'],
    ['log-6', 'child-oliver', 'Oct 29, 2026', '10:00 AM', 'Continent Wooden Puzzle Map: Africa & Biome Wildlife', 'Social Grace', 'Dismantling and assembling the continent puzzle map of Africa, matching animal miniature replicas to regional biomes.', 'Oliver recognized the Nile River and Madagascar immediately and collaborated peacefully with Leo for 35 minutes.', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800', 'Collaborative Mentorship', ['Global Geography', 'Spatial Reasoning', 'Fine Motor Knob Grip', 'Collaborative Problem-Solving'], 'Wooden Africa Continent Map, Wildlife Replicas, Felt Biome Mat', 'Julian Montgomery', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'],
    ['log-lucas-1', 'child-lucas', 'Today, Nov 5, 2026', '9:45 AM', 'Water Pouring & Sponge Transfer Work', 'Practical Life', 'Lucas practiced pouring water between two glass pitchers and wiping small droplets with a linen cloth.', 'Steady two-handed coordination and proud self-restoration of the tray.', 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&q=80&w=800', 'Guided Exploration', ['Pincer Coordination', 'Focus', 'Practical Care'], 'Glass Pitchers, Linen Cloth, Wooden Tray', 'Mateo Rossi', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256'],
  ];

  for (const row of oliverLogs) {
    insertLog.run(
      row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9],
      JSON.stringify(row[10]), row[11], row[12], row[13], now
    );
  }

  // 4. Teacher Reports
  const insertReport = db.prepare(`
    INSERT INTO teacher_reports (
      id, child_id, report_title, term, report_date, teacher_name, teacher_role, teacher_credentials, teacher_avatar,
      overall_progress, progress_grade, strengths_json, areas_for_improvement_json, social_observations,
      language_development, mathematical_development, practical_life_observations, sensorial_refinement,
      teacher_comments, recommended_home_activities_json, chart_metrics_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertReport.run(
    'rep-fall-2026', 'child-oliver', 'Fall Term Comprehensive Developmental Progress Report', 'Fall Term (Sep – Nov 2026)', 'October 30, 2026',
    'Amina Al-Khatib', 'Lead Guide – Primary Community (Casa dei Bambini II)', 'AMS Early Childhood Credential, M.Ed. Montessori Education',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
    'Oliver has demonstrated remarkable cognitive stamina, authentic independence, and compassionate social poise throughout the Fall Term. His concentration periods now regularly exceed 45 minutes.',
    'Exceeding Expectations',
    JSON.stringify([
      'Profound concentration during multi-step mathematical operations using the Golden Beads and Stamp Game.',
      'Exceptional phonetic awareness and spontaneous creative writing with the Moveable Alphabet.',
      'Gentle community mentorship: frequently helps younger 3-year-olds carry trays and choose floor rugs.',
      'Impeccable care for the prepared environment, consistently restoring materials to their exact shelf location.',
    ]),
    JSON.stringify([
      'Encourage patience when transitioning from high-focus indoor work cycles to group outdoor cleanup.',
      'Expand confidence with cursive pencil grip when transferring thoughts from the Moveable Alphabet to paper.',
    ]),
    'Oliver is a calming, anchor presence in Casa II. He gravitates toward cooperative partnerships and uses the Peace Rose spontaneously to resolve minor differences with peers.',
    'Oliver has mastered all single-letter cursive sandpaper phonograms and is currently synthesizing 4-letter blends.',
    'Solid conceptual understanding of decimal place values up to 9,999. He has mastered static addition and is exploring dynamic addition.',
    'High dexterity in fine motor activities including sewing buttons, citrus squeezing, and folding linen napkins.',
    'Grading Color Tablets Box III with 100% visual accuracy and identifying geometric plane figures.',
    'It is an absolute joy to guide Oliver. His natural curiosity is boundless, and his respect for materials reflects deep inner peace.',
    JSON.stringify([
      'Invite Oliver to measure ingredients during family baking.',
      'Provide unlined sketchbooks and quality colored pencils for spontaneous storytelling.',
      'Engage in family outdoor nature walks classifying seasonal botanical specimens.',
    ]),
    JSON.stringify([
      { area: 'Practical Life', score: 94, target: 85 },
      { area: 'Sensorial Education', score: 96, target: 85 },
      { area: 'Mathematics', score: 92, target: 80 },
      { area: 'Language & Literacy', score: 88, target: 80 },
      { area: 'Nature & Cultural', score: 90, target: 80 },
      { area: 'Social Grace', score: 95, target: 85 },
    ])
  );

  insertReport.run(
    'rep-spring-2026', 'child-oliver', 'Mid-Year Sensitive Periods & Social Horizon Assessment', 'Spring Term 2026', 'May 15, 2026',
    'Mateo Rossi', 'Co-Lead Guide & Toddler-to-Primary Transition Specialist', 'AMI Certified (0–3 & 3–6), RIE Certified Educator',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    'Oliver completed a seamless transition from the Toddler Community into the full 3–6 Casa environment, displaying eagerness to explore concrete mathematical apparatus.',
    'Strong Consistent Growth',
    JSON.stringify([
      'Rapid mastery of physical classroom boundaries and grace & courtesy rituals.',
      'Deep enthusiasm for sensorial dimension materials (Pink Tower, Broad Stair, Knobbed Cylinders).',
      'Warm and polite communication with guides and peers.',
    ]),
    JSON.stringify([
      'Developing sustained focus on longer spoken-language group discussions.',
      'Gentle reinforcement of putting work rugs away neatly rolled rather than folded.',
    ]),
    'Adapted effortlessly to older peers in the multi-age setting.',
    'Rich spoken vocabulary and excellent phonetic sound isolation for starting consonants.',
    'Mastered counting 1–10 with Number Rods and Spindle Boxes with zero error.',
    'Enjoys wet pouring, mirror polishing, and dressing frames with large wooden buttons.',
    'Exceptional tactile perception with rough/smooth boards and thermic bottles.',
    'Oliver has established strong roots in our pod. His gentle disposition makes him a beloved friend in the classroom.',
    JSON.stringify(['Encourage dressing independence.', 'Sing rhythmic poetry and rhyming games together.']),
    JSON.stringify([
      { area: 'Practical Life', score: 88, target: 80 },
      { area: 'Sensorial Education', score: 90, target: 80 },
      { area: 'Mathematics', score: 84, target: 75 },
      { area: 'Language & Literacy', score: 82, target: 75 },
      { area: 'Nature & Cultural', score: 85, target: 75 },
      { area: 'Social Grace', score: 89, target: 80 },
    ])
  );

  insertReport.run(
    'rep-lucas-fall-2026', 'child-lucas', 'Toddler Community Autumn Adaptation Evaluation', 'Fall Term 2026', 'November 1, 2026',
    'Mateo Rossi', 'Lead Guide – Toddler Community', 'AMI Assistants to Infancy (0–3)',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    'Lucas has settled warmly into the Toddler Community, showing steady motor coordination and expressive spoken language growth.',
    'Strong Consistent Growth',
    JSON.stringify(['Independent handwashing', 'Peaceful turn-taking during circle time']),
    JSON.stringify(['Expanding 3-word spoken requests']),
    'Warmly greets classmates each morning.',
    'Uses 40+ new vocabulary cards.',
    'Matches one-to-one ceramic cups during snack.',
    'Confidently pours water and wipes spills.',
    'Explores textured touch boards carefully.',
    'Lucas brings bright curiosity to our sunroom each day.',
    JSON.stringify(['Provide low shoe rack for independent dressing']),
    JSON.stringify([
      { area: 'Practical Life', score: 86, target: 75 },
      { area: 'Language', score: 84, target: 75 },
      { area: 'Social Grace', score: 88, target: 75 },
    ])
  );

  // 5. Tuition & Payments
  const insertTuition = db.prepare(`
    INSERT INTO tuition_accounts (child_id, total_tuition_fee, amount_paid, outstanding_balance, next_payment_due_date, payment_plan, tuition_cycle)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertTuition.run('child-oliver', 14800, 11840, 1480, 'December 1, 2026', '10-Month Academic Schedule ($1,480 / month)', 'Academic Year 2026–2027 (Primary Pod Casa II)');
  insertTuition.run('child-lucas', 12500, 10000, 1250, 'December 1, 2026', '10-Month Academic Schedule ($1,250 / month)', 'Academic Year 2026–2027 (Toddler Community)');

  const insertPayment = db.prepare(`
    INSERT INTO payments (id, child_id, parent_id, date, description, amount, status, payment_method, receipt_number, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const seedPayments = [
    ['PAY-2026-1101', 'child-oliver', 'user-parent-1', 'Nov 1, 2026', 'November 2026 Primary Program Tuition', 1480, 'Paid', 'Bank ACH (•••• 4921)', 'RCP-2026-8491'],
    ['PAY-2026-1001', 'child-oliver', 'user-parent-1', 'Oct 1, 2026', 'October 2026 Primary Program Tuition', 1480, 'Paid', 'Visa Debit (•••• 8192)', 'RCP-2026-7312'],
    ['PAY-2026-0915', 'child-oliver', 'user-parent-1', 'Sep 15, 2026', 'Annual Forest School & Organic Snack Material Fee', 450, 'Paid', 'Bank ACH (•••• 4921)', 'RCP-2026-6804'],
    ['PAY-2026-0901', 'child-oliver', 'user-parent-1', 'Sep 1, 2026', 'September 2026 Primary Program Tuition & Deposit', 2480, 'Paid', 'Bank ACH (•••• 4921)', 'RCP-2026-6201'],
    ['PAY-2026-1201', 'child-oliver', 'user-parent-1', 'Dec 1, 2026', 'December 2026 Primary Program Tuition', 1480, 'Pending', 'Scheduled Auto-Debit (Dec 1)', 'INV-2026-9042'],
    ['PAY-2026-LUCAS-11', 'child-lucas', 'user-parent-2', 'Nov 1, 2026', 'November 2026 Toddler Tuition', 1250, 'Paid', 'Visa (•••• 2219)', 'RCP-2026-8510'],
  ];
  for (const p of seedPayments) {
    insertPayment.run(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], now);
  }

  // 6. Notifications
  const insertNotif = db.prepare(`
    INSERT INTO notifications (id, user_id, target_role, title, message, type, date, timestamp, is_read, action_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const seedNotifs = [
    ['notif-1', 'user-parent-1', 'parent', 'New Daily Learning Log Published', 'Guide Amina posted an observation log: "Counting Wooden Golden Beads & Decimal Hierarchies".', 'log', 'Today, 10:30 AM', '2026-11-05T10:30:00Z', 0, '/dashboard/logs'],
    ['notif-2', 'user-parent-1', 'parent', 'Fall Term Pedagogical Report Available', 'Oliver’s comprehensive Fall Term developmental progress evaluation has been published by Lead Guide Amina.', 'report', 'Yesterday, 3:45 PM', '2026-11-04T15:45:00Z', 0, '/dashboard/reports'],
    ['notif-3', 'user-parent-1', 'parent', 'Tuition Statement Reminder', 'Your December 2026 tuition statement ($1,480.00) is generated. Due date: December 1, 2026.', 'tuition', 'Nov 2, 2026', '2026-11-02T09:00:00Z', 1, '/dashboard/tuition'],
    ['notif-4', 'user-parent-1', 'parent', 'Autumn Harvest Soup & Bread Feast', 'Reminder: Family Community gathering this Friday, Nov 8 at 9:00 AM in the Pod Kitchen & Courtyard.', 'event', 'Oct 31, 2026', '2026-10-31T14:15:00Z', 1, '/dashboard'],
    ['notif-5', 'user-parent-1', 'parent', 'Seasonal Outdoor Clothing Guidelines', 'As chilly mornings arrive, please pack extra wool socks, waterproof mud boots, and layered outdoor gear.', 'announcement', 'Oct 28, 2026', '2026-10-28T11:00:00Z', 1, '/dashboard'],
    ['notif-lucas-1', 'user-parent-2', 'parent', 'Toddler Water Transfer Log Posted', 'Guide Mateo shared a new practical life observation for Lucas.', 'log', 'Today, 10:00 AM', '2026-11-05T10:00:00Z', 0, '/dashboard/logs'],
  ];
  for (const n of seedNotifs) {
    insertNotif.run(n[0], n[1], n[2], n[3], n[4], n[5], n[6], n[7], n[8], n[9]);
  }

  // 7. Staff (for Admin Teacher & Staff Management)
  const insertStaff = db.prepare(`
    INSERT INTO staff (id, name, role, credentials, experience, email, classroom, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const seedStaff = [
    ['guide-1', 'Helena Bergström, M.Ed.', 'Head of School & Pedagogical Director', 'AMI Certified (0–3 & 3–6), M.Ed. Montessori Education', '18 Years', 'helena@montessorilearningpod.edu', 'All Campus Communities', 'Active'],
    ['guide-2', 'Julian Montgomery', 'Lead Guide – Early Elementary Pod', 'AMI Elementary Diploma (6–12), B.S. Environmental Science', '11 Years', 'julian@montessorilearningpod.edu', 'Elementary Cosmic Studio', 'Active'],
    ['guide-3', 'Amina Al-Khatib', 'Lead Guide – Primary Community (Casa dei Bambini)', 'AMS Early Childhood Credential, B.A. Linguistics', '9 Years', 'amina@montessorilearningpod.edu', 'Casa Studio II (East Garden Wing)', 'Active'],
    ['guide-4', 'Mateo Rossi', 'Lead Guide – Toddler Community', 'AMI Assistants to Infancy (0–3), Certified RIE Educator', '7 Years', 'mateo@montessorilearningpod.edu', 'Nido & Toddler Sunroom', 'Active'],
    ['guide-5', 'Sora Tanaka', 'Atelierista & Nature Studies Guide', 'B.F.A. Fine Arts, Forest School Leader Level 3', '8 Years', 'sora@montessorilearningpod.edu', 'Art Studio & Forest Trail', 'Active'],
    ['guide-6', 'Nadia Morales', 'Peace Education & Music Guide', 'AMS Early Childhood Credential, Orff-Schulwerk Level II', '10 Years', 'nadia@montessorilearningpod.edu', 'Music & Peace Pavilion', 'Active'],
  ];
  for (const s of seedStaff) insertStaff.run(...s);

  // 8. Programs Catalog (Admin Programs & Curriculum Management)
  const insertProg = db.prepare(`
    INSERT INTO programs_catalog (id, title, age_group, ratio, hours, tuition, enrolled_count, capacity, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertProg.run('toddler-program', 'Toddler Community', '18 Months – 3 Years', '1 Guide : 4 Toddlers', '8:30 AM – 12:30 PM / 3:00 PM', '$1,250 / month', 11, 12, 'Active');
  insertProg.run('primary-program', 'Primary Program (Children’s House)', '3 – 6 Years', '1 Guide : 10 Children', '8:15 AM – 3:15 PM', '$1,480 / month', 18, 20, 'Active');
  insertProg.run('early-elementary', 'Early Elementary Pod', '6 – 9 Years', '1 Guide : 12 Students', '8:15 AM – 3:30 PM', '$1,620 / month', 10, 12, 'Active');

  // 9. Events (Admin Events Management + Parent Overview upcoming events)
  const insertEvent = db.prepare(`
    INSERT INTO events (id, title, date, time, location, category, audience, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertEvent.run('evt-1', 'Autumn Harvest Soup & Bread Feast', 'Nov 8, 2026', '9:00 AM – 11:30 AM', 'Pod Kitchen & Courtyard', 'Community Feast', 'All Families', 'Children prepare stone-ground bread and organic seasonal harvest soup to share with families.');
  insertEvent.run('evt-2', 'Parent Observation & Material Workshop', 'Nov 19, 2026', '4:00 PM – 5:30 PM', 'Casa Studio II', 'Workshop', 'Primary Parents', 'Hands-on evening exploring Golden Bead mathematics and Cursive Sandpaper Letters.');
  insertEvent.run('evt-3', 'Winter Solstice Lantern Walk', 'Dec 18, 2026', '5:00 PM – 6:30 PM', 'Forest Sanctuary Trail', 'Seasonal Ritual', 'All Families', 'Quiet twilight lantern walk celebrating light, community gratitude, and seasonal rhythms.');

  // 10. Attendance Records
  const insertAttendance = db.prepare(`
    INSERT INTO attendance_records (id, child_id, date, status, notes)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertAttendance.run('att-1', 'child-oliver', '2026-11-05', 'Present', 'Arrived 8:15 AM, engaged in Golden Bead work.');
  insertAttendance.run('att-2', 'child-lucas', '2026-11-05', 'Present', 'Arrived 8:30 AM, joyful morning transition.');

  // 11. CMS Content (Admin Website Content Management)
  const insertCms = db.prepare(`
    INSERT INTO cms_content (key, section, title, subtitle, body, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertCms.run('hero-home-1', 'Homepage Hero 1', 'Growing Curious Minds. Embracing Independent Learning.', 'Authentic Montessori Pod • Ages 18m – 9y', 'Discover a nurturing Montessori-inspired learning environment where children explore, create, develop independence, and learn at their own pace.', now);
  insertCms.run('admissions-notice', 'Admissions Banner', '2026–2027 Enrollment Cycle Open', 'Limited Cohort Spaces Available', 'Morning observation tours are offered Tuesday through Friday from 9:15 AM to 10:30 AM.', now);
  insertCms.run('campus-address', 'Contact & Campus', '742 Evergreen Botanical Way, Boulder, CO 80302', 'Boulder Foothills Campus', 'Free parent visitor parking available at North Cedar Gateway.', now);

  // 12. System Settings (Admin System Settings)
  const insertSetting = db.prepare(`
    INSERT INTO system_settings (key, value, updated_at)
    VALUES (?, ?, ?)
  `);
  insertSetting.run('school_name', 'Montessori Learning Pod', now);
  insertSetting.run('academic_year', '2026–2027', now);
  insertSetting.run('observation_hours', 'Mon–Fri, 9:00 AM – 11:00 AM', now);
  insertSetting.run('allow_parent_registration', 'true', now);
  insertSetting.run('session_timeout_hours', '24', now);
}

