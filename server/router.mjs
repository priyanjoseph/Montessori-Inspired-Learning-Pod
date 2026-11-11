import crypto from 'node:crypto';
import {
  buildCookieHeader,
  generateOpaqueToken,
  hashPassword,
  hashToken,
  isHttpsRequest,
  parseCookies,
  SESSION_COOKIE_NAME,
  validatePasswordStrength,
  verifyPassword,
} from './security.mjs';
import { isSmtpConfigured, sendPasswordResetEmail } from './mailer.mjs';
import {
  createStarterChildForParent,
  getOAuthProvidersStatus,
  handleFacebookAuthCallback,
  handleFacebookAuthStart,
  handleGoogleAuthCallback,
  handleGoogleAuthStart,
  issueSessionForUser,
} from './oauth.mjs';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeJsonParse(value, fallback) {
  if (!value || typeof value !== 'string') return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function sendJson(res, status, data, extraHeaders = {}) {
  const payload = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders,
  });
  res.end(payload);
}

async function readJsonBody(req) {
  const chunks = [];
  let totalBytes = 0;
  for await (const chunk of req) {
    totalBytes += chunk.length;
    if (totalBytes > 1024 * 1024) {
      throw Object.assign(new Error('Request body too large'), { statusCode: 413 });
    }
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw Object.assign(new Error('Invalid JSON request payload'), { statusCode: 400 });
  }
}

function sanitizeUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    role: row.role,
    avatar: row.avatar || '',
    provider: row.provider || 'local',
    hasPassword: Boolean(row.password_hash),
    emergencyContact: row.emergency_contact || '',
    dietaryNotes: row.dietary_notes || '',
    notificationPreferences: safeJsonParse(row.notification_preferences, {
      emailAlerts: true,
      dailyDigest: true,
      urgentSms: true,
      photoTagging: true,
    }),
    createdAt: row.created_at,
  };
}

function mapChildRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    parentId: row.parent_id,
    name: row.name,
    age: row.age,
    birthDate: row.birth_date || '',
    program: row.program,
    classroom: row.classroom,
    enrollmentDate: row.enrollment_date,
    assignedTeacher: row.assigned_teacher,
    photo: row.photo,
    assignedTeachers: safeJsonParse(row.assigned_teachers_json, []),
    attendanceStats: safeJsonParse(row.attendance_stats_json, {
      totalDays: 0,
      presentDays: 0,
      excusedAbsences: 0,
      unexcusedAbsences: 0,
      tardyCount: 0,
      attendancePercentage: 100,
      consecutivePresentStreak: 0,
    }),
    learningAreas: safeJsonParse(row.learning_areas_json, []),
  };
}

function mapLogRow(row) {
  return {
    id: row.id,
    childId: row.child_id,
    childName: row.child_name || undefined,
    date: row.date,
    time: row.time,
    title: row.title,
    category: row.category,
    description: row.description,
    teacherObservations: row.teacher_observations,
    photoUrl: row.photo_url,
    childParticipation: row.child_participation,
    skillsDeveloped: safeJsonParse(row.skills_developed_json, []),
    materialsUsed: row.materials_used,
    guideName: row.guide_name,
    guideAvatar: row.guide_avatar,
    comments: safeJsonParse(row.comments_json, []),
  };
}

function mapReportRow(row) {
  return {
    id: row.id,
    childId: row.child_id,
    childName: row.child_name || undefined,
    reportTitle: row.report_title,
    term: row.term,
    reportDate: row.report_date,
    teacherName: row.teacher_name,
    teacherRole: row.teacher_role,
    teacherCredentials: row.teacher_credentials,
    teacherAvatar: row.teacher_avatar,
    overallProgress: row.overall_progress,
    progressGrade: row.progress_grade,
    strengths: safeJsonParse(row.strengths_json, []),
    areasForImprovement: safeJsonParse(row.areas_for_improvement_json, []),
    socialObservations: row.social_observations,
    languageDevelopment: row.language_development,
    mathematicalDevelopment: row.mathematical_development,
    practicalLifeObservations: row.practical_life_observations,
    sensorialRefinement: row.sensorial_refinement,
    teacherComments: row.teacher_comments,
    recommendedHomeActivities: safeJsonParse(row.recommended_home_activities_json, []),
    chartMetrics: safeJsonParse(row.chart_metrics_json, []),
  };
}

function mapTuitionRow(row) {
  if (!row) {
    return {
      totalTuitionFee: 0,
      amountPaid: 0,
      outstandingBalance: 0,
      nextPaymentDueDate: 'N/A',
      paymentPlan: 'Standard Plan',
      tuitionCycle: 'Academic Year 2026–2027',
    };
  }
  return {
    childId: row.child_id,
    childName: row.child_name || undefined,
    totalTuitionFee: Number(row.total_tuition_fee),
    amountPaid: Number(row.amount_paid),
    outstandingBalance: Number(row.outstanding_balance),
    nextPaymentDueDate: row.next_payment_due_date,
    paymentPlan: row.payment_plan,
    tuitionCycle: row.tuition_cycle,
  };
}

function mapPaymentRow(row) {
  return {
    id: row.id,
    childId: row.child_id,
    parentId: row.parent_id,
    childName: row.child_name || undefined,
    parentName: row.parent_name || undefined,
    date: row.date,
    description: row.description,
    amount: Number(row.amount),
    status: row.status,
    paymentMethod: row.payment_method,
    receiptNumber: row.receipt_number,
  };
}

function mapNotificationRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    targetRole: row.target_role,
    title: row.title,
    message: row.message,
    type: row.type,
    date: row.date,
    timestamp: row.timestamp,
    isRead: Boolean(row.is_read),
    actionUrl: row.action_url || undefined,
  };
}

function getAuthenticatedUser(req, db) {
  const cookies = parseCookies(req.headers.cookie);
  const rawToken = cookies[SESSION_COOKIE_NAME];
  if (!rawToken) return null;

  const tokenHash = hashToken(rawToken);
  const nowIso = new Date().toISOString();
  const row = db
    .prepare(`
      SELECT u.*
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ? AND s.expires_at > ?
      LIMIT 1
    `)
    .get(tokenHash, nowIso);

  return row || null;
}

function requireRole(req, res, db, allowedRole) {
  const user = getAuthenticatedUser(req, db);
  if (!user) {
    sendJson(res, 401, { error: 'Authentication required. Please sign in.' });
    return null;
  }
  if (allowedRole && user.role !== allowedRole) {
    sendJson(res, 403, {
      error:
        allowedRole === 'admin'
          ? 'Forbidden: Administrator privileges required.'
          : 'Forbidden: Parent account required for this portal resource.',
    });
    return null;
  }
  return user;
}

function getParentOverviewPayload(db, userRow) {
  const childRows = db
    .prepare('SELECT * FROM children WHERE parent_id = ? ORDER BY created_at ASC')
    .all(userRow.id);
  const primaryChildRow = childRows[0] || null;
  const childId = primaryChildRow?.id || null;

  const logs = childId
    ? db
        .prepare('SELECT * FROM daily_logs WHERE child_id = ? ORDER BY created_at DESC, rowid DESC')
        .all(childId)
        .map(mapLogRow)
    : [];

  const reports = childId
    ? db
        .prepare('SELECT * FROM teacher_reports WHERE child_id = ? ORDER BY rowid DESC')
        .all(childId)
        .map(mapReportRow)
    : [];

  const tuitionRow = childId
    ? db.prepare('SELECT * FROM tuition_accounts WHERE child_id = ?').get(childId)
    : null;

  const paymentRows = childId
    ? db
        .prepare('SELECT * FROM payments WHERE child_id = ? AND parent_id = ? ORDER BY created_at DESC, rowid DESC')
        .all(childId, userRow.id)
        .map(mapPaymentRow)
    : [];

  const notifRows = db
    .prepare(`
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY timestamp DESC, rowid DESC
    `)
    .all(userRow.id)
    .map(mapNotificationRow);

  const upcomingEvents = db.prepare('SELECT * FROM events ORDER BY rowid ASC').all();

  return {
    user: sanitizeUser(userRow),
    childProfile: mapChildRow(primaryChildRow),
    children: childRows.map(mapChildRow),
    dailyLogs: logs,
    teacherReports: reports,
    tuitionSummary: mapTuitionRow(tuitionRow),
    paymentHistory: paymentRows,
    notifications: notifRows,
    events: upcomingEvents,
  };
}

function getAdminOverviewPayload(db) {
  const students = db
    .prepare(`
      SELECT c.*, u.name AS parent_name, u.email AS parent_email, u.phone AS parent_phone
      FROM children c
      JOIN users u ON u.id = c.parent_id
      ORDER BY c.created_at DESC
    `)
    .all()
    .map((row) => ({
      ...mapChildRow(row),
      parentName: row.parent_name,
      parentEmail: row.parent_email,
      parentPhone: row.parent_phone,
    }));

  const parents = db
    .prepare(`
      SELECT u.*, COUNT(c.id) AS children_count
      FROM users u
      LEFT JOIN children c ON c.parent_id = u.id
      WHERE u.role = 'parent'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `)
    .all()
    .map((row) => ({
      ...sanitizeUser(row),
      childrenCount: Number(row.children_count),
    }));

  const staff = db.prepare('SELECT * FROM staff ORDER BY rowid ASC').all();
  const programs = db
    .prepare('SELECT * FROM programs_catalog ORDER BY rowid ASC')
    .all()
    .map((p) => ({
      id: p.id,
      title: p.title,
      ageGroup: p.age_group,
      ratio: p.ratio,
      hours: p.hours,
      tuition: p.tuition,
      enrolledCount: Number(p.enrolled_count),
      capacity: Number(p.capacity),
      status: p.status,
    }));

  const attendance = db
    .prepare(`
      SELECT a.*, c.name AS child_name, c.classroom
      FROM attendance_records a
      JOIN children c ON c.id = a.child_id
      ORDER BY a.date DESC, a.rowid DESC
    `)
    .all()
    .map((a) => ({
      id: a.id,
      childId: a.child_id,
      childName: a.child_name,
      classroom: a.classroom,
      date: a.date,
      status: a.status,
      notes: a.notes || '',
    }));

  const logs = db
    .prepare(`
      SELECT l.*, c.name AS child_name
      FROM daily_logs l
      JOIN children c ON c.id = l.child_id
      ORDER BY l.created_at DESC, l.rowid DESC
    `)
    .all()
    .map(mapLogRow);

  const reports = db
    .prepare(`
      SELECT r.*, c.name AS child_name
      FROM teacher_reports r
      JOIN children c ON c.id = r.child_id
      ORDER BY r.rowid DESC
    `)
    .all()
    .map(mapReportRow);

  const events = db.prepare('SELECT * FROM events ORDER BY rowid ASC').all();

  const tuitionAccounts = db
    .prepare(`
      SELECT t.*, c.name AS child_name
      FROM tuition_accounts t
      JOIN children c ON c.id = t.child_id
      ORDER BY c.name ASC
    `)
    .all()
    .map(mapTuitionRow);

  const payments = db
    .prepare(`
      SELECT p.*, c.name AS child_name, u.name AS parent_name
      FROM payments p
      JOIN children c ON c.id = p.child_id
      JOIN users u ON u.id = p.parent_id
      ORDER BY p.created_at DESC, p.rowid DESC
    `)
    .all()
    .map(mapPaymentRow);

  const notifications = db
    .prepare(`
      SELECT n.*, u.name AS recipient_name
      FROM notifications n
      LEFT JOIN users u ON u.id = n.user_id
      ORDER BY n.timestamp DESC, n.rowid DESC
      LIMIT 60
    `)
    .all()
    .map((row) => ({
      ...mapNotificationRow(row),
      recipientName: row.recipient_name || 'All Parents',
    }));

  const cmsContent = db.prepare('SELECT * FROM cms_content ORDER BY rowid ASC').all().map((c) => ({
    key: c.key,
    section: c.section,
    title: c.title,
    subtitle: c.subtitle,
    body: c.body,
    updatedAt: c.updated_at,
  }));

  const settingsRows = db.prepare('SELECT * FROM system_settings ORDER BY key ASC').all();
  const systemSettings = {};
  for (const row of settingsRows) {
    systemSettings[row.key] = row.value;
  }

  const totalCollected = tuitionAccounts.reduce((sum, item) => sum + item.amountPaid, 0);
  const totalOutstanding = tuitionAccounts.reduce((sum, item) => sum + item.outstandingBalance, 0);
  const presentRecords = attendance.filter((a) => a.status === 'Present').length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentRecords / attendance.length) * 100) : 95;

  return {
    metrics: {
      totalStudents: students.length,
      totalParents: parents.length,
      totalStaff: staff.length,
      activePrograms: programs.filter((p) => p.status === 'Active').length,
      attendanceRate,
      totalCollected,
      totalOutstanding,
      recentLogsCount: logs.length,
    },
    students,
    parents,
    staff,
    programs,
    attendance,
    logs,
    reports,
    events,
    tuitionAccounts,
    payments,
    notifications,
    cmsContent,
    systemSettings,
  };
}

function getRequestOrigin(req) {
  const proto = isHttpsRequest(req) ? 'https' : 'http';
  const host = req.headers.host || 'localhost:5173';
  return `${proto}://${host}`;
}

export async function handleApiRequest(req, res, db) {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = (req.method || 'GET').toUpperCase();

  try {
    // =========================================================
    // 1. HEALTH & PUBLIC CONFIG
    // =========================================================
    if (pathname === '/api/health' && method === 'GET') {
      return sendJson(res, 200, { ok: true, timestamp: new Date().toISOString() });
    }

    if (pathname === '/api/auth/providers' && method === 'GET') {
      return sendJson(res, 200, {
        ...getOAuthProvidersStatus(),
        smtpConfigured: isSmtpConfigured(),
      });
    }

    if (pathname === '/api/public/content' && method === 'GET') {
      const cms = db.prepare('SELECT key, section, title, subtitle, body FROM cms_content').all();
      const events = db.prepare('SELECT id, title, date, time, location, category, audience, description FROM events').all();
      return sendJson(res, 200, { cms, events });
    }

    // =========================================================
    // 2. AUTHENTICATION & PASSWORD RECOVERY ROUTES
    // =========================================================
    if (pathname === '/api/auth/me' && method === 'GET') {
      const user = getAuthenticatedUser(req, db);
      return sendJson(res, 200, {
        authenticated: Boolean(user),
        user: sanitizeUser(user),
      });
    }

    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await readJsonBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const rememberMe = Boolean(body.rememberMe);

      if (!EMAIL_REGEX.test(email) || !password) {
        return sendJson(res, 400, { error: 'Please enter a valid email address and password.' });
      }

      const user = db.prepare('SELECT * FROM users WHERE lower(email) = ?').get(email);
      if (!user) {
        return sendJson(res, 401, { error: 'Invalid email or password.' });
      }

      if (!user.password_hash) {
        return sendJson(res, 401, {
          error: 'This account uses social sign-in. Continue with Google/Facebook or reset your password.',
        });
      }

      const valid = await verifyPassword(password, user.password_hash);
      if (!valid) {
        return sendJson(res, 401, { error: 'Invalid email or password.' });
      }

      const cookie = issueSessionForUser(db, req, user.id, rememberMe);
      return sendJson(res, 200, { user: sanitizeUser(user) }, { 'Set-Cookie': cookie });
    }

    if (pathname === '/api/auth/register' && method === 'POST') {
      const settingRow = db
        .prepare("SELECT value FROM system_settings WHERE key = 'allow_parent_registration'")
        .get();
      if (settingRow && settingRow.value === 'false') {
        return sendJson(res, 403, { error: 'New parent registrations are currently paused by admissions.' });
      }

      const body = await readJsonBody(req);
      const name = String(body.name || '').trim();
      const email = String(body.email || '').trim().toLowerCase();
      const phone = String(body.phone || '').trim();
      const password = String(body.password || '');
      const confirmPassword = body.confirmPassword !== undefined ? String(body.confirmPassword) : password;
      const childName = String(body.childName || '').trim();
      const childAge = String(body.childAge || '').trim();
      const preferredProgram = String(body.preferredProgram || '').trim();
      const agreeToTerms = body.agreeToTerms !== undefined ? Boolean(body.agreeToTerms) : true;

      if (name.length < 2) {
        return sendJson(res, 400, { error: 'Please provide your full name (at least 2 characters).' });
      }
      if (!EMAIL_REGEX.test(email)) {
        return sendJson(res, 400, { error: 'Please provide a valid email address.' });
      }
      if (phone && phone.replace(/\D/g, '').length < 7) {
        return sendJson(res, 400, { error: 'Please provide a valid phone number.' });
      }

      const passwordError = validatePasswordStrength(password);
      if (passwordError) {
        return sendJson(res, 400, { error: passwordError });
      }
      if (password !== confirmPassword) {
        return sendJson(res, 400, { error: 'Passwords do not match.' });
      }
      if (!childName || childName.length < 2) {
        return sendJson(res, 400, { error: "Please enter your child's full name." });
      }
      if (!childAge) {
        return sendJson(res, 400, { error: "Please specify your child's age." });
      }
      if (!preferredProgram) {
        return sendJson(res, 400, { error: 'Please select a preferred Montessori program.' });
      }
      if (!agreeToTerms) {
        return sendJson(res, 400, { error: 'Please accept the Terms of Service & Family Privacy Policy.' });
      }

      const existing = db.prepare('SELECT id FROM users WHERE lower(email) = ?').get(email);
      if (existing) {
        return sendJson(res, 409, { error: 'An account with this email address is already registered.' });
      }

      const userId = `user-${crypto.randomUUID().slice(0, 10)}`;
      const passwordHash = await hashPassword(password);
      const now = new Date().toISOString();

      // SECURITY: Always enforce 'parent' role on self-registration regardless of client payload
      db.exec('BEGIN');
      try {
        db.prepare(`
          INSERT INTO users (id, name, email, phone, password_hash, role, avatar, provider, provider_id, emergency_contact, dietary_notes, notification_preferences, created_at)
          VALUES (?, ?, ?, ?, ?, 'parent', '', 'local', '', '', '', ?, ?)
        `).run(
          userId,
          name,
          email,
          phone,
          passwordHash,
          JSON.stringify({ emailAlerts: true, dailyDigest: true, urgentSms: true, photoTagging: true }),
          now
        );

        createStarterChildForParent(db, {
          userId,
          parentName: name,
          childName,
          childAge,
          program: preferredProgram,
        });
        db.exec('COMMIT');
      } catch (err) {
        db.exec('ROLLBACK');
        throw err;
      }

      const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
      const cookie = issueSessionForUser(db, req, newUser.id, true);
      return sendJson(res, 201, { user: sanitizeUser(newUser) }, { 'Set-Cookie': cookie });
    }

    if (pathname === '/api/auth/logout' && method === 'POST') {
      const cookies = parseCookies(req.headers.cookie);
      const rawToken = cookies[SESSION_COOKIE_NAME];
      if (rawToken) {
        db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(rawToken));
      }
      const clearCookie = buildCookieHeader(SESSION_COOKIE_NAME, '', {
        maxAge: 0,
        httpOnly: true,
        sameSite: 'Lax',
        secure: isHttpsRequest(req),
      });
      return sendJson(res, 200, { ok: true }, { 'Set-Cookie': clearCookie });
    }

    if (pathname === '/api/auth/forgot-password' && method === 'POST') {
      const body = await readJsonBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      if (!EMAIL_REGEX.test(email)) {
        return sendJson(res, 400, { error: 'Please enter a valid email address.' });
      }

      if (!isSmtpConfigured()) {
        return sendJson(res, 200, {
          ok: true,
          emailSent: false,
          smtpConfigured: false,
          message:
            'SMTP email delivery is not configured in this environment. Set SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM to deliver live password reset emails.',
        });
      }

      const user = db.prepare('SELECT id, name, email FROM users WHERE lower(email) = ?').get(email);
      if (user) {
        const { raw, hash } = generateOpaqueToken();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 30 * 60 * 1000).toISOString();

        db.prepare('DELETE FROM password_resets WHERE user_id = ? AND used_at IS NULL').run(user.id);
        db.prepare(`
          INSERT INTO password_resets (id, user_id, token_hash, expires_at, used_at, created_at)
          VALUES (?, ?, ?, ?, NULL, ?)
        `).run(`rst-${crypto.randomUUID().slice(0, 10)}`, user.id, hash, expiresAt, now.toISOString());

        const resetUrl = `${getRequestOrigin(req)}/reset-password?token=${encodeURIComponent(raw)}`;
        try {
          await sendPasswordResetEmail({
            toEmail: user.email,
            toName: user.name,
            resetUrl,
          });
        } catch (err) {
          return sendJson(res, 502, {
            error: `SMTP server failed to send password reset email: ${err.message}`,
          });
        }
      }

      return sendJson(res, 200, {
        ok: true,
        emailSent: true,
        smtpConfigured: true,
        message: 'If an account matches that email address, a password reset link has been sent (valid for 30 minutes).',
      });
    }

    if (pathname === '/api/auth/reset-password/validate' && method === 'GET') {
      const rawToken = String(url.searchParams.get('token') || '').trim();
      if (!rawToken) {
        return sendJson(res, 200, { valid: false, reason: 'missing_token' });
      }
      const record = db
        .prepare('SELECT id, expires_at, used_at FROM password_resets WHERE token_hash = ?')
        .get(hashToken(rawToken));
      if (!record) return sendJson(res, 200, { valid: false, reason: 'invalid_token' });
      if (record.used_at) return sendJson(res, 200, { valid: false, reason: 'token_used' });
      if (record.expires_at <= new Date().toISOString()) {
        return sendJson(res, 200, { valid: false, reason: 'token_expired' });
      }
      return sendJson(res, 200, { valid: true });
    }

    if (pathname === '/api/auth/reset-password' && method === 'POST') {
      const body = await readJsonBody(req);
      const rawToken = String(body.token || '').trim();
      const password = String(body.password || '');
      const confirmPassword = body.confirmPassword !== undefined ? String(body.confirmPassword) : password;

      if (!rawToken) {
        return sendJson(res, 400, { error: 'Missing password reset token.' });
      }
      const passwordError = validatePasswordStrength(password);
      if (passwordError) {
        return sendJson(res, 400, { error: passwordError });
      }
      if (password !== confirmPassword) {
        return sendJson(res, 400, { error: 'Passwords do not match.' });
      }

      const tokenHash = hashToken(rawToken);
      const record = db
        .prepare('SELECT * FROM password_resets WHERE token_hash = ?')
        .get(tokenHash);

      if (!record) {
        return sendJson(res, 400, { error: 'Invalid or unknown password reset token.' });
      }
      if (record.used_at) {
        return sendJson(res, 400, { error: 'This password reset link has already been used.' });
      }
      if (record.expires_at <= new Date().toISOString()) {
        return sendJson(res, 400, { error: 'This password reset link has expired. Please request a new one.' });
      }

      const newHash = await hashPassword(password);
      const now = new Date().toISOString();
      db.exec('BEGIN');
      try {
        db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, record.user_id);
        db.prepare('UPDATE password_resets SET used_at = ? WHERE id = ?').run(now, record.id);
        db.prepare('DELETE FROM sessions WHERE user_id = ?').run(record.user_id);
        db.exec('COMMIT');
      } catch (err) {
        db.exec('ROLLBACK');
        throw err;
      }

      return sendJson(res, 200, {
        ok: true,
        message: 'Your password has been updated. Please sign in with your new credentials.',
      });
    }

    if (pathname === '/api/auth/google' && method === 'GET') {
      return handleGoogleAuthStart(req, res);
    }
    if (pathname === '/api/auth/google/callback' && method === 'GET') {
      return await handleGoogleAuthCallback(req, res, db, url);
    }
    if (pathname === '/api/auth/facebook' && method === 'GET') {
      return handleFacebookAuthStart(req, res);
    }
    if (pathname === '/api/auth/facebook/callback' && method === 'GET') {
      return await handleFacebookAuthCallback(req, res, db, url);
    }

    // =========================================================
    // 3. PARENT DASHBOARD ROUTES (STRICT 'parent' ROLE + OWNERSHIP)
    // =========================================================
    if (pathname === '/api/parent/overview' && method === 'GET') {
      const user = requireRole(req, res, db, 'parent');
      if (!user) return;
      return sendJson(res, 200, getParentOverviewPayload(db, user));
    }

    if (pathname === '/api/parent/profile' && method === 'PATCH') {
      const user = requireRole(req, res, db, 'parent');
      if (!user) return;
      const body = await readJsonBody(req);

      const nextName = body.name !== undefined ? String(body.name).trim() : user.name;
      if (nextName.length < 2) {
        return sendJson(res, 400, { error: 'Name must be at least 2 characters.' });
      }
      const nextPhone = body.phone !== undefined ? String(body.phone).trim() : user.phone;
      const nextEmergency =
        body.emergencyContact !== undefined ? String(body.emergencyContact).trim() : user.emergency_contact;
      const nextDietary =
        body.dietaryNotes !== undefined ? String(body.dietaryNotes).trim() : user.dietary_notes;
      const currentPrefs = safeJsonParse(user.notification_preferences, {
        emailAlerts: true,
        dailyDigest: true,
        urgentSms: true,
        photoTagging: true,
      });
      const nextPrefs = body.notificationPreferences
        ? { ...currentPrefs, ...body.notificationPreferences }
        : currentPrefs;

      db.prepare(`
        UPDATE users
        SET name = ?, phone = ?, emergency_contact = ?, dietary_notes = ?, notification_preferences = ?
        WHERE id = ?
      `).run(nextName, nextPhone, nextEmergency, nextDietary, JSON.stringify(nextPrefs), user.id);

      if (body.childProfile && typeof body.childProfile === 'object') {
        const child = db
          .prepare('SELECT * FROM children WHERE parent_id = ? ORDER BY created_at ASC LIMIT 1')
          .get(user.id);
        if (child) {
          const cp = body.childProfile;
          db.prepare(`
            UPDATE children
            SET name = ?, age = ?, birth_date = ?, program = ?, classroom = ?
            WHERE id = ? AND parent_id = ?
          `).run(
            cp.name !== undefined ? String(cp.name).trim() || child.name : child.name,
            cp.age !== undefined ? String(cp.age).trim() || child.age : child.age,
            cp.birthDate !== undefined ? String(cp.birthDate).trim() : child.birth_date,
            cp.program !== undefined ? String(cp.program).trim() || child.program : child.program,
            cp.classroom !== undefined ? String(cp.classroom).trim() || child.classroom : child.classroom,
            child.id,
            user.id
          );
        }
      }

      const refreshedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
      return sendJson(res, 200, getParentOverviewPayload(db, refreshedUser));
    }

    if (pathname === '/api/parent/change-password' && method === 'POST') {
      const user = requireRole(req, res, db, 'parent');
      if (!user) return;
      const body = await readJsonBody(req);
      const currentPassword = String(body.currentPassword || '');
      const newPassword = String(body.newPassword || '');

      if (user.password_hash) {
        const valid = await verifyPassword(currentPassword, user.password_hash);
        if (!valid) {
          return sendJson(res, 400, { error: 'Current password is incorrect.' });
        }
      }

      const strengthError = validatePasswordStrength(newPassword);
      if (strengthError) {
        return sendJson(res, 400, { error: strengthError });
      }

      const nextHash = await hashPassword(newPassword);
      db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(nextHash, user.id);
      return sendJson(res, 200, { ok: true, message: 'Password updated successfully.' });
    }

    const logCommentMatch = pathname.match(/^\/api\/parent\/logs\/([^/]+)\/comments$/);
    if (logCommentMatch && method === 'POST') {
      const user = requireRole(req, res, db, 'parent');
      if (!user) return;
      const logId = decodeURIComponent(logCommentMatch[1]);
      const body = await readJsonBody(req);
      const text = String(body.text || '').trim();
      if (!text) {
        return sendJson(res, 400, { error: 'Comment text cannot be empty.' });
      }

      const logRow = db
        .prepare(`
          SELECT l.*, c.parent_id
          FROM daily_logs l
          JOIN children c ON c.id = l.child_id
          WHERE l.id = ?
        `)
        .get(logId);

      if (!logRow) {
        return sendJson(res, 404, { error: 'Learning log entry not found.' });
      }
      if (logRow.parent_id !== user.id) {
        return sendJson(res, 403, { error: 'Forbidden: You may only comment on your own child’s learning logs.' });
      }

      const comments = safeJsonParse(logRow.comments_json, []);
      const newComment = {
        id: `cmt-${crypto.randomUUID().slice(0, 8)}`,
        authorName: user.name,
        authorRole: 'Parent',
        text,
        createdAt: new Date().toISOString(),
      };
      comments.push(newComment);
      db.prepare('UPDATE daily_logs SET comments_json = ? WHERE id = ?').run(JSON.stringify(comments), logId);
      return sendJson(res, 201, { comment: newComment, comments });
    }

    if (pathname === '/api/parent/payments' && method === 'POST') {
      const user = requireRole(req, res, db, 'parent');
      if (!user) return;
      const body = await readJsonBody(req);
      const amount = Number(body.amount);
      const paymentMethod = String(body.method || 'Online ACH Transfer').trim();
      const customDescription = body.description ? String(body.description).trim() : '';
      const pendingPaymentId = body.paymentId ? String(body.paymentId) : null;

      if (!Number.isFinite(amount) || amount <= 0) {
        return sendJson(res, 400, { error: 'Please enter a valid positive payment amount.' });
      }

      const child = db
        .prepare('SELECT * FROM children WHERE parent_id = ? ORDER BY created_at ASC LIMIT 1')
        .get(user.id);
      if (!child) {
        return sendJson(res, 404, { error: 'No enrolled child found for this parent account.' });
      }

      const tuition = db.prepare('SELECT * FROM tuition_accounts WHERE child_id = ?').get(child.id);
      if (!tuition) {
        return sendJson(res, 404, { error: 'Tuition account not found.' });
      }

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const receipt = `RCP-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const paymentId = `PAY-${now.getFullYear()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

      db.exec('BEGIN');
      try {
        const nextPaid = Number(tuition.amount_paid) + amount;
        const nextOutstanding = Math.max(0, Number(tuition.outstanding_balance) - amount);
        db.prepare(`
          UPDATE tuition_accounts
          SET amount_paid = ?, outstanding_balance = ?
          WHERE child_id = ?
        `).run(nextPaid, nextOutstanding, child.id);

        if (pendingPaymentId) {
          const existingInv = db
            .prepare('SELECT * FROM payments WHERE id = ?')
            .get(pendingPaymentId);
          if (!existingInv || existingInv.parent_id !== user.id) {
            throw Object.assign(new Error('Forbidden invoice reference.'), { statusCode: 403 });
          }
          db.prepare(`
            UPDATE payments
            SET status = 'Paid', date = ?, payment_method = ?, receipt_number = ?
            WHERE id = ? AND parent_id = ?
          `).run(dateStr, paymentMethod, receipt, pendingPaymentId, user.id);
        } else {
          db.prepare(`
            INSERT INTO payments (id, child_id, parent_id, date, description, amount, status, payment_method, receipt_number, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'Paid', ?, ?, ?)
          `).run(
            paymentId,
            child.id,
            user.id,
            dateStr,
            customDescription || `${child.program} Tuition Payment`,
            amount,
            paymentMethod,
            receipt,
            now.toISOString()
          );
        }

        db.prepare(`
          INSERT INTO notifications (id, user_id, target_role, title, message, type, date, timestamp, is_read, action_url)
          VALUES (?, ?, 'parent', ?, ?, 'tuition', 'Just now', ?, 0, '/dashboard/tuition')
        `).run(
          `notif-${crypto.randomUUID().slice(0, 8)}`,
          user.id,
          'Payment Confirmation & Digital Receipt',
          `Thank you! A tuition payment of $${amount.toLocaleString()} (${receipt}) has been recorded for ${child.name}.`,
          now.toISOString()
        );

        db.exec('COMMIT');
      } catch (err) {
        db.exec('ROLLBACK');
        throw err;
      }

      return sendJson(res, 200, {
        ...getParentOverviewPayload(db, user),
        receiptNumber: receipt,
        success: true,
      });
    }

    const notifReadMatch = pathname.match(/^\/api\/parent\/notifications\/([^/]+)\/read$/);
    if (notifReadMatch && method === 'PATCH') {
      const user = requireRole(req, res, db, 'parent');
      if (!user) return;
      const notifId = decodeURIComponent(notifReadMatch[1]);
      const row = db.prepare('SELECT user_id FROM notifications WHERE id = ?').get(notifId);
      if (!row) return sendJson(res, 404, { error: 'Notification not found.' });
      if (row.user_id !== user.id) return sendJson(res, 403, { error: 'Forbidden.' });
      db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(notifId, user.id);
      return sendJson(res, 200, { ok: true });
    }

    if (pathname === '/api/parent/notifications/read-all' && method === 'POST') {
      const user = requireRole(req, res, db, 'parent');
      if (!user) return;
      db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(user.id);
      return sendJson(res, 200, { ok: true });
    }

    const notifDeleteMatch = pathname.match(/^\/api\/parent\/notifications\/([^/]+)$/);
    if (notifDeleteMatch && method === 'DELETE') {
      const user = requireRole(req, res, db, 'parent');
      if (!user) return;
      const notifId = decodeURIComponent(notifDeleteMatch[1]);
      const row = db.prepare('SELECT user_id FROM notifications WHERE id = ?').get(notifId);
      if (!row) return sendJson(res, 404, { error: 'Notification not found.' });
      if (row.user_id !== user.id) return sendJson(res, 403, { error: 'Forbidden.' });
      db.prepare('DELETE FROM notifications WHERE id = ? AND user_id = ?').run(notifId, user.id);
      return sendJson(res, 200, { ok: true });
    }

    if (pathname === '/api/parent/notifications' && method === 'DELETE') {
      const user = requireRole(req, res, db, 'parent');
      if (!user) return;
      db.prepare('DELETE FROM notifications WHERE user_id = ?').run(user.id);
      return sendJson(res, 200, { ok: true });
    }

    // =========================================================
    // 4. ADMIN DASHBOARD ROUTES (STRICT 'admin' ROLE ONLY)
    // =========================================================
    if (pathname.startsWith('/api/admin/')) {
      const admin = requireRole(req, res, db, 'admin');
      if (!admin) return;

      if (pathname === '/api/admin/overview' && method === 'GET') {
        return sendJson(res, 200, getAdminOverviewPayload(db));
      }

      // Students CRUD
      if (pathname === '/api/admin/students' && method === 'GET') {
        return sendJson(res, 200, { students: getAdminOverviewPayload(db).students });
      }
      if (pathname === '/api/admin/students' && method === 'POST') {
        const body = await readJsonBody(req);
        const name = String(body.name || '').trim();
        const age = String(body.age || '').trim();
        const program = String(body.program || '').trim();
        const classroom = String(body.classroom || '').trim() || 'Casa Studio II';
        const assignedTeacher = String(body.assignedTeacher || 'Amina Al-Khatib, AMS').trim();
        const parentId = String(body.parentId || '').trim();

        if (!name || !age || !program || !parentId) {
          return sendJson(res, 400, { error: 'Student name, age, program, and parent account are required.' });
        }
        const parent = db.prepare("SELECT id FROM users WHERE id = ? AND role = 'parent'").get(parentId);
        if (!parent) {
          return sendJson(res, 404, { error: 'Selected parent account does not exist.' });
        }

        const childId = `child-${crypto.randomUUID().slice(0, 8)}`;
        const now = new Date().toISOString();
        const enrollDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        db.exec('BEGIN');
        try {
          db.prepare(`
            INSERT INTO children (id, parent_id, name, age, birth_date, program, classroom, enrollment_date, assigned_teacher, photo, assigned_teachers_json, attendance_stats_json, learning_areas_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            childId,
            parentId,
            name,
            age,
            String(body.birthDate || ''),
            program,
            classroom,
            enrollDate,
            assignedTeacher,
            String(body.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600'),
            JSON.stringify([{ name: assignedTeacher.split(',')[0], role: 'Lead Guide', email: 'guides@montessorilearningpod.edu' }]),
            JSON.stringify({ totalDays: 1, presentDays: 1, excusedAbsences: 0, unexcusedAbsences: 0, tardyCount: 0, attendancePercentage: 100, consecutivePresentStreak: 1 }),
            JSON.stringify([]),
            now
          );
          db.prepare(`
            INSERT INTO tuition_accounts (child_id, total_tuition_fee, amount_paid, outstanding_balance, next_payment_due_date, payment_plan, tuition_cycle)
            VALUES (?, 14800, 0, 1480, 'December 1, 2026', '10-Month Academic Schedule', 'Academic Year 2026–2027')
          `).run(childId);
          db.exec('COMMIT');
        } catch (err) {
          db.exec('ROLLBACK');
          throw err;
        }
        return sendJson(res, 201, getAdminOverviewPayload(db));
      }

      const studentMatch = pathname.match(/^\/api\/admin\/students\/([^/]+)$/);
      if (studentMatch && method === 'PATCH') {
        const studentId = decodeURIComponent(studentMatch[1]);
        const existing = db.prepare('SELECT * FROM children WHERE id = ?').get(studentId);
        if (!existing) return sendJson(res, 404, { error: 'Student not found.' });
        const body = await readJsonBody(req);
        db.prepare(`
          UPDATE children
          SET name = ?, age = ?, program = ?, classroom = ?, assigned_teacher = ?
          WHERE id = ?
        `).run(
          body.name !== undefined ? String(body.name).trim() || existing.name : existing.name,
          body.age !== undefined ? String(body.age).trim() || existing.age : existing.age,
          body.program !== undefined ? String(body.program).trim() || existing.program : existing.program,
          body.classroom !== undefined ? String(body.classroom).trim() || existing.classroom : existing.classroom,
          body.assignedTeacher !== undefined ? String(body.assignedTeacher).trim() || existing.assigned_teacher : existing.assigned_teacher,
          studentId
        );
        return sendJson(res, 200, getAdminOverviewPayload(db));
      }
      if (studentMatch && method === 'DELETE') {
        const studentId = decodeURIComponent(studentMatch[1]);
        db.prepare('DELETE FROM children WHERE id = ?').run(studentId);
        return sendJson(res, 200, getAdminOverviewPayload(db));
      }

      // Parents CRUD
      if (pathname === '/api/admin/parents' && method === 'GET') {
        return sendJson(res, 200, { parents: getAdminOverviewPayload(db).parents });
      }
      if (pathname === '/api/admin/parents' && method === 'POST') {
        const body = await readJsonBody(req);
        const name = String(body.name || '').trim();
        const email = String(body.email || '').trim().toLowerCase();
        const phone = String(body.phone || '').trim();
        const password = String(body.password || 'WelcomeParent123!');
        if (!name || !EMAIL_REGEX.test(email)) {
          return sendJson(res, 400, { error: 'Valid parent name and email are required.' });
        }
        const exists = db.prepare('SELECT id FROM users WHERE lower(email) = ?').get(email);
        if (exists) {
          return sendJson(res, 409, { error: 'An account with this email already exists.' });
        }
        const pwHash = await hashPassword(password);
        const userId = `user-${crypto.randomUUID().slice(0, 10)}`;
        db.prepare(`
          INSERT INTO users (id, name, email, phone, password_hash, role, avatar, provider, provider_id, emergency_contact, dietary_notes, notification_preferences, created_at)
          VALUES (?, ?, ?, ?, ?, 'parent', '', 'local', '', ?, ?, ?, ?)
        `).run(
          userId,
          name,
          email,
          phone,
          pwHash,
          String(body.emergencyContact || ''),
          String(body.dietaryNotes || ''),
          JSON.stringify({ emailAlerts: true, dailyDigest: true, urgentSms: true, photoTagging: true }),
          new Date().toISOString()
        );
        return sendJson(res, 201, getAdminOverviewPayload(db));
      }
      const parentMatch = pathname.match(/^\/api\/admin\/parents\/([^/]+)$/);
      if (parentMatch && method === 'PATCH') {
        const parentId = decodeURIComponent(parentMatch[1]);
        const existing = db.prepare("SELECT * FROM users WHERE id = ? AND role = 'parent'").get(parentId);
        if (!existing) return sendJson(res, 404, { error: 'Parent not found.' });
        const body = await readJsonBody(req);
        db.prepare(`
          UPDATE users SET name = ?, phone = ?, emergency_contact = ?, dietary_notes = ?
          WHERE id = ? AND role = 'parent'
        `).run(
          body.name !== undefined ? String(body.name).trim() || existing.name : existing.name,
          body.phone !== undefined ? String(body.phone).trim() : existing.phone,
          body.emergencyContact !== undefined ? String(body.emergencyContact).trim() : existing.emergency_contact,
          body.dietaryNotes !== undefined ? String(body.dietaryNotes).trim() : existing.dietary_notes,
          parentId
        );
        return sendJson(res, 200, getAdminOverviewPayload(db));
      }
      if (parentMatch && method === 'DELETE') {
        const parentId = decodeURIComponent(parentMatch[1]);
        db.prepare("DELETE FROM users WHERE id = ? AND role = 'parent'").run(parentId);
        return sendJson(res, 200, getAdminOverviewPayload(db));
      }

      // Teacher & Staff CRUD
      if (pathname === '/api/admin/staff' && method === 'POST') {
        const body = await readJsonBody(req);
        const name = String(body.name || '').trim();
        const roleTitle = String(body.role || '').trim();
        const email = String(body.email || '').trim();
        if (!name || !roleTitle) {
          return sendJson(res, 400, { error: 'Guide name and role are required.' });
        }
        db.prepare(`
          INSERT INTO staff (id, name, role, credentials, experience, email, classroom, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          `guide-${crypto.randomUUID().slice(0, 6)}`,
          name,
          roleTitle,
          String(body.credentials || 'AMS/AMI Montessori Certified'),
          String(body.experience || '5 Years'),
          email || 'guides@montessorilearningpod.edu',
          String(body.classroom || 'Primary Community'),
          String(body.status || 'Active')
        );
        return sendJson(res, 201, getAdminOverviewPayload(db));
      }
      const staffMatch = pathname.match(/^\/api\/admin\/staff\/([^/]+)$/);
      if (staffMatch && method === 'PATCH') {
        const id = decodeURIComponent(staffMatch[1]);
        const existing = db.prepare('SELECT * FROM staff WHERE id = ?').get(id);
        if (!existing) return sendJson(res, 404, { error: 'Staff record not found.' });
        const body = await readJsonBody(req);
        db.prepare(`
          UPDATE staff SET name = ?, role = ?, classroom = ?, status = ? WHERE id = ?
        `).run(
          body.name !== undefined ? String(body.name).trim() || existing.name : existing.name,
          body.role !== undefined ? String(body.role).trim() || existing.role : existing.role,
          body.classroom !== undefined ? String(body.classroom).trim() || existing.classroom : existing.classroom,
          body.status !== undefined ? String(body.status).trim() || existing.status : existing.status,
          id
        );
        return sendJson(res, 200, getAdminOverviewPayload(db));
      }
      if (staffMatch && method === 'DELETE') {
        db.prepare('DELETE FROM staff WHERE id = ?').run(decodeURIComponent(staffMatch[1]));
        return sendJson(res, 200, getAdminOverviewPayload(db));
      }

      // Programs & Curriculum Management
      if (pathname === '/api/admin/programs' && method === 'POST') {
        const body = await readJsonBody(req);
        const title = String(body.title || '').trim();
        if (!title) return sendJson(res, 400, { error: 'Program title is required.' });
        db.prepare(`
          INSERT INTO programs_catalog (id, title, age_group, ratio, hours, tuition, enrolled_count, capacity, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          `prog-${crypto.randomUUID().slice(0, 6)}`,
          title,
          String(body.ageGroup || '3 – 6 Years'),
          String(body.ratio || '1 Guide : 8 Children'),
          String(body.hours || '8:30 AM – 3:00 PM'),
          String(body.tuition || '$1,450 / month'),
          Number(body.enrolledCount || 0),
          Number(body.capacity || 15),
          String(body.status || 'Active')
        );
        return sendJson(res, 201, getAdminOverviewPayload(db));
      }
      const progMatch = pathname.match(/^\/api\/admin\/programs\/([^/]+)$/);
      if (progMatch && method === 'PATCH') {
        const id = decodeURIComponent(progMatch[1]);
        const existing = db.prepare('SELECT * FROM programs_catalog WHERE id = ?').get(id);
        if (!existing) return sendJson(res, 404, { error: 'Program not found.' });
        const body = await readJsonBody(req);
        db.prepare(`
          UPDATE programs_catalog
          SET title = ?, age_group = ?, ratio = ?, hours = ?, tuition = ?, capacity = ?, status = ?
          WHERE id = ?
        `).run(
          body.title !== undefined ? String(body.title).trim() || existing.title : existing.title,
          body.ageGroup !== undefined ? String(body.ageGroup).trim() : existing.age_group,
          body.ratio !== undefined ? String(body.ratio).trim() : existing.ratio,
          body.hours !== undefined ? String(body.hours).trim() : existing.hours,
          body.tuition !== undefined ? String(body.tuition).trim() : existing.tuition,
          body.capacity !== undefined ? Number(body.capacity) : existing.capacity,
          body.status !== undefined ? String(body.status).trim() : existing.status,
          id
        );
        return sendJson(res, 200, getAdminOverviewPayload(db));
      }

      // Attendance Management
      if (pathname === '/api/admin/attendance' && method === 'POST') {
        const body = await readJsonBody(req);
        const childId = String(body.childId || '').trim();
        const date = String(body.date || new Date().toISOString().slice(0, 10)).trim();
        const status = String(body.status || 'Present').trim();
        const notes = String(body.notes || '').trim();
        if (!childId || !['Present', 'Excused', 'Absent', 'Tardy'].includes(status)) {
          return sendJson(res, 400, { error: 'Valid student and attendance status are required.' });
        }
        const child = db.prepare('SELECT id FROM children WHERE id = ?').get(childId);
        if (!child) return sendJson(res, 404, { error: 'Student not found.' });

        db.prepare(`
          INSERT INTO attendance_records (id, child_id, date, status, notes)
          VALUES (?, ?, ?, ?, ?)
        `).run(`att-${crypto.randomUUID().slice(0, 8)}`, childId, date, status, notes);
        return sendJson(res, 201, getAdminOverviewPayload(db));
      }

      // Daily Learning Logs Management
      if (pathname === '/api/admin/logs' && method === 'POST') {
        const body = await readJsonBody(req);
        const childId = String(body.childId || '').trim();
        const title = String(body.title || '').trim();
        const category = String(body.category || 'Practical Life').trim();
        const description = String(body.description || '').trim();
        const teacherObservations = String(body.teacherObservations || '').trim();
        if (!childId || !title || !description) {
          return sendJson(res, 400, { error: 'Student, title, and activity description are required.' });
        }
        const child = db.prepare('SELECT id, parent_id, name FROM children WHERE id = ?').get(childId);
        if (!child) return sendJson(res, 404, { error: 'Student not found.' });

        const now = new Date();
        const dateLabel = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeLabel = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        const skills = Array.isArray(body.skillsDeveloped)
          ? body.skillsDeveloped
          : String(body.skillsDeveloped || 'Focused Concentration, Independence')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);

        db.exec('BEGIN');
        try {
          db.prepare(`
            INSERT INTO daily_logs (id, child_id, date, time, title, category, description, teacher_observations, photo_url, child_participation, skills_developed_json, materials_used, guide_name, guide_avatar, comments_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', ?)
          `).run(
            `log-${crypto.randomUUID().slice(0, 8)}`,
            childId,
            dateLabel,
            timeLabel,
            title,
            category,
            description,
            teacherObservations || 'Guided classroom observation recorded.',
            String(body.photoUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800'),
            String(body.childParticipation || 'Independent Focus'),
            JSON.stringify(skills),
            String(body.materialsUsed || 'Montessori Classroom Materials'),
            String(body.guideName || admin.name),
            'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
            now.toISOString()
          );

          db.prepare(`
            INSERT INTO notifications (id, user_id, target_role, title, message, type, date, timestamp, is_read, action_url)
            VALUES (?, ?, 'parent', ?, ?, 'log', 'Just now', ?, 0, '/dashboard/logs')
          `).run(
            `notif-${crypto.randomUUID().slice(0, 8)}`,
            child.parent_id,
            `New Daily Log for ${child.name}`,
            `${String(body.guideName || admin.name)} posted "${title}".`,
            now.toISOString()
          );
          db.exec('COMMIT');
        } catch (err) {
          db.exec('ROLLBACK');
          throw err;
        }
        return sendJson(res, 201, getAdminOverviewPayload(db));
      }
      const adminLogMatch = pathname.match(/^\/api\/admin\/logs\/([^/]+)$/);
      if (adminLogMatch && method === 'DELETE') {
        db.prepare('DELETE FROM daily_logs WHERE id = ?').run(decodeURIComponent(adminLogMatch[1]));
        return sendJson(res, 200, getAdminOverviewPayload(db));
      }

      // Teacher Reports Management
      if (pathname === '/api/admin/reports' && method === 'POST') {
        const body = await readJsonBody(req);
        const childId = String(body.childId || '').trim();
        const reportTitle = String(body.reportTitle || '').trim();
        const term = String(body.term || 'Winter Term 2026').trim();
        const overallProgress = String(body.overallProgress || '').trim();
        if (!childId || !reportTitle || !overallProgress) {
          return sendJson(res, 400, { error: 'Student, report title, and progress summary are required.' });
        }
        const child = db.prepare('SELECT id, parent_id, name FROM children WHERE id = ?').get(childId);
        if (!child) return sendJson(res, 404, { error: 'Student not found.' });

        const now = new Date();
        const reportDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const strengths = Array.isArray(body.strengths)
          ? body.strengths
          : String(body.strengths || 'Deep focus during morning work cycle')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);
        const improvements = Array.isArray(body.areasForImprovement)
          ? body.areasForImprovement
          : String(body.areasForImprovement || 'Continue multi-step peer collaboration')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);

        db.exec('BEGIN');
        try {
          db.prepare(`
            INSERT INTO teacher_reports (
              id, child_id, report_title, term, report_date, teacher_name, teacher_role, teacher_credentials, teacher_avatar,
              overall_progress, progress_grade, strengths_json, areas_for_improvement_json, social_observations,
              language_development, mathematical_development, practical_life_observations, sensorial_refinement,
              teacher_comments, recommended_home_activities_json, chart_metrics_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            `rep-${crypto.randomUUID().slice(0, 8)}`,
            childId,
            reportTitle,
            term,
            reportDate,
            String(body.teacherName || admin.name),
            'Lead Montessori Guide',
            'AMS / AMI Certified Educator',
            'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
            overallProgress,
            String(body.progressGrade || 'Strong Consistent Growth'),
            JSON.stringify(strengths),
            JSON.stringify(improvements),
            String(body.socialObservations || 'Respectful peer relationships and grace during community work.'),
            String(body.languageDevelopment || 'Growing phonetic awareness and expressive vocabulary.'),
            String(body.mathematicalDevelopment || 'Confident tactile exploration of decimal quantities.'),
            String(body.practicalLifeObservations || 'Independent care of materials and orderly tray restoration.'),
            String(body.sensorialRefinement || 'Accurate discrimination of dimension, texture, and color.'),
            String(body.teacherComments || overallProgress),
            JSON.stringify(['Involve your child in kitchen measuring and sorting.', 'Read nature stories together daily.']),
            JSON.stringify([
              { area: 'Practical Life', score: 92, target: 85 },
              { area: 'Sensorial Education', score: 90, target: 85 },
              { area: 'Mathematics', score: 88, target: 80 },
              { area: 'Language & Literacy', score: 89, target: 80 },
            ])
          );

          db.prepare(`
            INSERT INTO notifications (id, user_id, target_role, title, message, type, date, timestamp, is_read, action_url)
            VALUES (?, ?, 'parent', ?, ?, 'report', 'Just now', ?, 0, '/dashboard/reports')
          `).run(
            `notif-${crypto.randomUUID().slice(0, 8)}`,
            child.parent_id,
            `New Pedagogical Report: ${reportTitle}`,
            `An updated Montessori term evaluation is ready to view for ${child.name}.`,
            now.toISOString()
          );
          db.exec('COMMIT');
        } catch (err) {
          db.exec('ROLLBACK');
          throw err;
        }
        return sendJson(res, 201, getAdminOverviewPayload(db));
      }
      const adminReportMatch = pathname.match(/^\/api\/admin\/reports\/([^/]+)$/);
      if (adminReportMatch && method === 'DELETE') {
        db.prepare('DELETE FROM teacher_reports WHERE id = ?').run(decodeURIComponent(adminReportMatch[1]));
        return sendJson(res, 200, getAdminOverviewPayload(db));
      }

      // Events Management
      if (pathname === '/api/admin/events' && method === 'POST') {
        const body = await readJsonBody(req);
        const title = String(body.title || '').trim();
        const date = String(body.date || '').trim();
        if (!title || !date) return sendJson(res, 400, { error: 'Event title and date are required.' });
        db.prepare(`
          INSERT INTO events (id, title, date, time, location, category, audience, description)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          `evt-${crypto.randomUUID().slice(0, 6)}`,
          title,
          date,
          String(body.time || '10:00 AM – 12:00 PM'),
          String(body.location || 'Main Pod Courtyard'),
          String(body.category || 'Community Event'),
          String(body.audience || 'All Families'),
          String(body.description || 'Community gathering and Montessori observation.')
        );
        return sendJson(res, 201, getAdminOverviewPayload(db));
      }
      const eventMatch = pathname.match(/^\/api\/admin\/events\/([^/]+)$/);
      if (eventMatch && method === 'DELETE') {
        db.prepare('DELETE FROM events WHERE id = ?').run(decodeURIComponent(eventMatch[1]));
        return sendJson(res, 200, getAdminOverviewPayload(db));
      }

      // Tuition & Payments Management
      if (pathname === '/api/admin/tuition/charges' && method === 'POST') {
        const body = await readJsonBody(req);
        const childId = String(body.childId || '').trim();
        const description = String(body.description || '').trim();
        const amount = Number(body.amount);
        if (!childId || !description || !Number.isFinite(amount) || amount <= 0) {
          return sendJson(res, 400, { error: 'Valid student, charge description, and positive amount are required.' });
        }
        const child = db.prepare('SELECT id, parent_id, name FROM children WHERE id = ?').get(childId);
        if (!child) return sendJson(res, 404, { error: 'Student not found.' });

        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const invNumber = `INV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        db.exec('BEGIN');
        try {
          db.prepare(`
            UPDATE tuition_accounts
            SET outstanding_balance = outstanding_balance + ?, total_tuition_fee = total_tuition_fee + ?
            WHERE child_id = ?
          `).run(amount, amount, childId);

          db.prepare(`
            INSERT INTO payments (id, child_id, parent_id, date, description, amount, status, payment_method, receipt_number, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'Pending', 'Parent Portal Invoice', ?, ?)
          `).run(
            `PAY-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
            childId,
            child.parent_id,
            dateStr,
            description,
            amount,
            invNumber,
            now.toISOString()
          );

          db.prepare(`
            INSERT INTO notifications (id, user_id, target_role, title, message, type, date, timestamp, is_read, action_url)
            VALUES (?, ?, 'parent', ?, ?, 'tuition', 'Just now', ?, 0, '/dashboard/tuition')
          `).run(
            `notif-${crypto.randomUUID().slice(0, 8)}`,
            child.parent_id,
            `New Tuition Invoice (${invNumber})`,
            `A balance of $${amount.toLocaleString()} for "${description}" has been added for ${child.name}.`,
            now.toISOString()
          );
          db.exec('COMMIT');
        } catch (err) {
          db.exec('ROLLBACK');
          throw err;
        }
        return sendJson(res, 201, getAdminOverviewPayload(db));
      }

      const adminPaymentMatch = pathname.match(/^\/api\/admin\/payments\/([^/]+)$/);
      if (adminPaymentMatch && method === 'PATCH') {
        const paymentId = decodeURIComponent(adminPaymentMatch[1]);
        const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(paymentId);
        if (!payment) return sendJson(res, 404, { error: 'Payment record not found.' });
        const body = await readJsonBody(req);
        const nextStatus = String(body.status || 'Paid');
        if (!['Paid', 'Pending', 'Overdue'].includes(nextStatus)) {
          return sendJson(res, 400, { error: 'Invalid payment status.' });
        }
        db.exec('BEGIN');
        try {
          if (payment.status !== 'Paid' && nextStatus === 'Paid') {
            db.prepare(`
              UPDATE tuition_accounts
              SET amount_paid = amount_paid + ?, outstanding_balance = MAX(0, outstanding_balance - ?)
              WHERE child_id = ?
            `).run(payment.amount, payment.amount, payment.child_id);
          }
          db.prepare('UPDATE payments SET status = ? WHERE id = ?').run(nextStatus, paymentId);
          db.exec('COMMIT');
        } catch (err) {
          db.exec('ROLLBACK');
          throw err;
        }
        return sendJson(res, 200, getAdminOverviewPayload(db));
      }

      // Notifications Management
      if (pathname === '/api/admin/notifications' && method === 'POST') {
        const body = await readJsonBody(req);
        const title = String(body.title || '').trim();
        const message = String(body.message || '').trim();
        const type = ['log', 'report', 'tuition', 'event', 'announcement'].includes(body.type)
          ? body.type
          : 'announcement';
        const targetUserId = body.userId ? String(body.userId).trim() : null;
        if (!title || !message) {
          return sendJson(res, 400, { error: 'Notification title and message are required.' });
        }

        const now = new Date().toISOString();
        const insertNotif = db.prepare(`
          INSERT INTO notifications (id, user_id, target_role, title, message, type, date, timestamp, is_read, action_url)
          VALUES (?, ?, 'parent', ?, ?, ?, 'Just now', ?, 0, '/dashboard/notifications')
        `);

        if (targetUserId) {
          const parent = db.prepare("SELECT id FROM users WHERE id = ? AND role = 'parent'").get(targetUserId);
          if (!parent) return sendJson(res, 404, { error: 'Target parent not found.' });
          insertNotif.run(`notif-${crypto.randomUUID().slice(0, 8)}`, targetUserId, title, message, type, now);
        } else {
          const parents = db.prepare("SELECT id FROM users WHERE role = 'parent'").all();
          for (const p of parents) {
            insertNotif.run(`notif-${crypto.randomUUID().slice(0, 8)}`, p.id, title, message, type, now);
          }
        }
        return sendJson(res, 201, getAdminOverviewPayload(db));
      }

      // Website Content Management
      const cmsMatch = pathname.match(/^\/api\/admin\/cms\/([^/]+)$/);
      if (cmsMatch && method === 'PATCH') {
        const key = decodeURIComponent(cmsMatch[1]);
        const existing = db.prepare('SELECT * FROM cms_content WHERE key = ?').get(key);
        if (!existing) return sendJson(res, 404, { error: 'CMS block not found.' });
        const body = await readJsonBody(req);
        db.prepare(`
          UPDATE cms_content
          SET title = ?, subtitle = ?, body = ?, updated_at = ?
          WHERE key = ?
        `).run(
          body.title !== undefined ? String(body.title).trim() : existing.title,
          body.subtitle !== undefined ? String(body.subtitle).trim() : existing.subtitle,
          body.body !== undefined ? String(body.body).trim() : existing.body,
          new Date().toISOString(),
          key
        );
        return sendJson(res, 200, getAdminOverviewPayload(db));
      }

      // Administrative Analytics
      if (pathname === '/api/admin/analytics' && method === 'GET') {
        const overview = getAdminOverviewPayload(db);
        const byProgram = {};
        for (const student of overview.students) {
          byProgram[student.program] = (byProgram[student.program] || 0) + 1;
        }
        return sendJson(res, 200, {
          metrics: overview.metrics,
          enrollmentByProgram: Object.entries(byProgram).map(([program, count]) => ({ program, count })),
          attendanceSummary: overview.attendance,
        });
      }

      // System Settings
      if (pathname === '/api/admin/settings' && method === 'PATCH') {
        const body = await readJsonBody(req);
        const now = new Date().toISOString();
        const upsert = db.prepare(`
          INSERT INTO system_settings (key, value, updated_at)
          VALUES (?, ?, ?)
          ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
        `);
        const allowedKeys = [
          'school_name',
          'academic_year',
          'observation_hours',
          'allow_parent_registration',
          'session_timeout_hours',
        ];
        for (const k of allowedKeys) {
          if (body[k] !== undefined) {
            upsert.run(k, String(body[k]), now);
          }
        }
        return sendJson(res, 200, getAdminOverviewPayload(db));
      }

      return sendJson(res, 404, { error: `Unknown admin endpoint: ${pathname}` });
    }

    return sendJson(res, 404, { error: `Unknown API endpoint: ${pathname}` });
  } catch (err) {
    const status = err.statusCode || 500;
    return sendJson(res, status, {
      error: status >= 500 ? 'Internal server error.' : err.message,
    });
  }
}
