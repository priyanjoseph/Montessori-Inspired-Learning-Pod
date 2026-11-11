import crypto from 'node:crypto';
import {
  buildCookieHeader,
  generateOpaqueToken,
  isHttpsRequest,
  OAUTH_STATE_COOKIE_NAME,
  parseCookies,
  SESSION_COOKIE_NAME,
} from './security.mjs';

function getRequestOrigin(req) {
  const proto = isHttpsRequest(req) ? 'https' : 'http';
  const host = req.headers.host || 'localhost:5173';
  return `${proto}://${host}`;
}

export function getOAuthProvidersStatus() {
  const googleConfigured = Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim()
  );
  const facebookConfigured = Boolean(
    process.env.FACEBOOK_APP_ID?.trim() && process.env.FACEBOOK_APP_SECRET?.trim()
  );
  return {
    google: { configured: googleConfigured },
    facebook: { configured: facebookConfigured },
  };
}

function redirect(res, location, cookies = []) {
  const headers = { Location: location };
  if (cookies.length > 0) headers['Set-Cookie'] = cookies;
  res.writeHead(302, headers);
  res.end();
}

function createStarterChildForParent(db, { userId, parentName, childName, childAge, program }) {
  const childId = `child-${crypto.randomUUID().slice(0, 8)}`;
  const now = new Date().toISOString();
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const classroom =
    program && program.toLowerCase().includes('toddler')
      ? 'Nido & Toddler Sunroom'
      : program && program.toLowerCase().includes('elementary')
      ? 'Elementary Cosmic Studio'
      : 'Casa Studio II (East Garden Wing)';

  const assignedTeacher =
    program && program.toLowerCase().includes('toddler')
      ? 'Mateo Rossi, AMI'
      : program && program.toLowerCase().includes('elementary')
      ? 'Julian Montgomery, AMI'
      : 'Amina Al-Khatib, AMS';

  db.prepare(`
    INSERT INTO children (id, parent_id, name, age, birth_date, program, classroom, enrollment_date, assigned_teacher, photo, assigned_teachers_json, attendance_stats_json, learning_areas_json, created_at)
    VALUES (?, ?, ?, ?, '', ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    childId,
    userId,
    childName || `${parentName.split(' ')[0]}'s Child`,
    childAge || '3.5 Years',
    program || 'Primary Program (Casa dei Bambini)',
    classroom,
    formattedDate,
    assignedTeacher,
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
    JSON.stringify([
      {
        name: assignedTeacher.split(',')[0],
        role: 'Lead Montessori Guide',
        email: 'admissions@montessorilearningpod.edu',
      },
    ]),
    JSON.stringify({
      totalDays: 1,
      presentDays: 1,
      excusedAbsences: 0,
      unexcusedAbsences: 0,
      tardyCount: 0,
      attendancePercentage: 100,
      consecutivePresentStreak: 1,
    }),
    JSON.stringify([
      {
        area: 'Practical Life',
        category: 'Coordination & Independence',
        progressPercentage: 25,
        skillsMastered: 5,
        totalSkills: 20,
        description: 'Orientation to classroom trays, pouring, and purposeful care of environment.',
        color: 'bg-sage-500',
        recentMilestones: ['Classroom shelf orientation'],
      },
      {
        area: 'Sensorial Education',
        category: 'Perceptual Refinement',
        progressPercentage: 20,
        skillsMastered: 4,
        totalSkills: 20,
        description: 'Early exploration of dimension, texture, and chromatic pairs.',
        color: 'bg-terracotta',
        recentMilestones: ['Introductory Knobbed Cylinders'],
      },
    ]),
    now
  );

  db.prepare(`
    INSERT INTO tuition_accounts (child_id, total_tuition_fee, amount_paid, outstanding_balance, next_payment_due_date, payment_plan, tuition_cycle)
    VALUES (?, 14800, 0, 1480, 'December 1, 2026', '10-Month Academic Schedule', 'Academic Year 2026–2027')
  `).run(childId);

  db.prepare(`
    INSERT INTO notifications (id, user_id, target_role, title, message, type, date, timestamp, is_read, action_url)
    VALUES (?, ?, 'parent', ?, ?, 'announcement', 'Just now', ?, 0, '/dashboard')
  `).run(
    `notif-${crypto.randomUUID().slice(0, 8)}`,
    userId,
    'Welcome to the Montessori Learning Pod Portal',
    `Your parent account has been connected. Explore your child's overview, daily logs, and admissions schedule.`,
    now
  );
}

export function issueSessionForUser(db, req, userId, rememberMe = true) {
  const { raw, hash } = generateOpaqueToken();
  const ttlSeconds = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO sessions (id, token_hash, user_id, remember_me, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(`sess-${crypto.randomUUID().slice(0, 12)}`, hash, userId, rememberMe ? 1 : 0, expiresAt, now);

  return buildCookieHeader(SESSION_COOKIE_NAME, raw, {
    maxAge: ttlSeconds,
    httpOnly: true,
    sameSite: 'Lax',
    secure: isHttpsRequest(req),
  });
}

function linkOrCreateOAuthParent(db, { provider, providerId, email, name, avatar }) {
  const normalizedEmail = String(email).trim().toLowerCase();
  let user = db
    .prepare('SELECT * FROM users WHERE (provider = ? AND provider_id = ?) OR lower(email) = ?')
    .get(provider, providerId, normalizedEmail);

  const now = new Date().toISOString();

  if (user) {
    // Safely link provider details while preserving the existing role (parent or admin)
    db.prepare(`
      UPDATE users
      SET provider = CASE WHEN provider = 'local' THEN ? ELSE provider END,
          provider_id = CASE WHEN provider_id = '' THEN ? ELSE provider_id END,
          avatar = CASE WHEN avatar = '' THEN ? ELSE avatar END
      WHERE id = ?
    `).run(provider, providerId, avatar || '', user.id);
    return db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
  }

  // Newly registered social accounts ALWAYS receive the Parent/User role
  const newUserId = `user-${crypto.randomUUID().slice(0, 10)}`;
  db.prepare(`
    INSERT INTO users (id, name, email, phone, password_hash, role, avatar, provider, provider_id, emergency_contact, dietary_notes, notification_preferences, created_at)
    VALUES (?, ?, ?, '', NULL, 'parent', ?, ?, ?, '', '', ?, ?)
  `).run(
    newUserId,
    name || normalizedEmail.split('@')[0],
    normalizedEmail,
    avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    provider,
    providerId,
    JSON.stringify({ emailAlerts: true, dailyDigest: true, urgentSms: false, photoTagging: true }),
    now
  );

  createStarterChildForParent(db, {
    userId: newUserId,
    parentName: name || 'Montessori Parent',
    childName: `${(name || 'Family').split(' ')[0]}'s Child`,
    childAge: '3.5 Years',
    program: 'Primary Program (Casa dei Bambini)',
  });

  return db.prepare('SELECT * FROM users WHERE id = ?').get(newUserId);
}

export async function handleGoogleAuthStart(req, res) {
  const status = getOAuthProvidersStatus();
  if (!status.google.configured) {
    return redirect(res, '/login?oauth_error=google_not_configured');
  }

  const state = crypto.randomBytes(24).toString('hex');
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI?.trim() || `${getRequestOrigin(req)}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID.trim(),
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  });

  const stateCookie = buildCookieHeader(OAUTH_STATE_COOKIE_NAME, `google:${state}`, {
    maxAge: 600,
    httpOnly: true,
    sameSite: 'Lax',
    secure: isHttpsRequest(req),
  });

  return redirect(res, `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`, [
    stateCookie,
  ]);
}

export async function handleGoogleAuthCallback(req, res, db, url) {
  const error = url.searchParams.get('error');
  if (error) {
    return redirect(
      res,
      error === 'access_denied' ? '/login?oauth_error=google_cancelled' : '/login?oauth_error=google_failed'
    );
  }

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookies = parseCookies(req.headers.cookie);
  const expectedState = cookies[OAUTH_STATE_COOKIE_NAME];

  const clearStateCookie = buildCookieHeader(OAUTH_STATE_COOKIE_NAME, '', { maxAge: 0 });

  if (!code || !state || expectedState !== `google:${state}`) {
    return redirect(res, '/login?oauth_error=google_invalid_state', [clearStateCookie]);
  }

  if (!getOAuthProvidersStatus().google.configured) {
    return redirect(res, '/login?oauth_error=google_not_configured', [clearStateCookie]);
  }

  try {
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI?.trim() || `${getRequestOrigin(req)}/api/auth/google/callback`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID.trim(),
        client_secret: process.env.GOOGLE_CLIENT_SECRET.trim(),
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      return redirect(res, '/login?oauth_error=google_token_failed', [clearStateCookie]);
    }

    const tokenData = await tokenRes.json();
    const userInfoRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userInfoRes.ok) {
      return redirect(res, '/login?oauth_error=google_profile_failed', [clearStateCookie]);
    }

    const profile = await userInfoRes.json();
    if (!profile.email || !profile.email_verified) {
      return redirect(res, '/login?oauth_error=google_unverified_email', [clearStateCookie]);
    }

    const user = linkOrCreateOAuthParent(db, {
      provider: 'google',
      providerId: String(profile.sub),
      email: profile.email,
      name: profile.name || profile.email.split('@')[0],
      avatar: profile.picture || '',
    });

    const sessionCookie = issueSessionForUser(db, req, user.id, true);
    const destination = user.role === 'admin' ? '/admin' : '/dashboard';
    return redirect(res, destination, [clearStateCookie, sessionCookie]);
  } catch {
    return redirect(res, '/login?oauth_error=google_failed', [clearStateCookie]);
  }
}

export async function handleFacebookAuthStart(req, res) {
  const status = getOAuthProvidersStatus();
  if (!status.facebook.configured) {
    return redirect(res, '/login?oauth_error=facebook_not_configured');
  }

  const state = crypto.randomBytes(24).toString('hex');
  const redirectUri =
    process.env.FACEBOOK_REDIRECT_URI?.trim() || `${getRequestOrigin(req)}/api/auth/facebook/callback`;

  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID.trim(),
    redirect_uri: redirectUri,
    state,
    scope: 'email,public_profile',
    response_type: 'code',
  });

  const stateCookie = buildCookieHeader(OAUTH_STATE_COOKIE_NAME, `facebook:${state}`, {
    maxAge: 600,
    httpOnly: true,
    sameSite: 'Lax',
    secure: isHttpsRequest(req),
  });

  return redirect(res, `https://www.facebook.com/v20.0/dialog/oauth?${params.toString()}`, [
    stateCookie,
  ]);
}

export async function handleFacebookAuthCallback(req, res, db, url) {
  const error = url.searchParams.get('error');
  if (error) {
    return redirect(
      res,
      error === 'access_denied'
        ? '/login?oauth_error=facebook_cancelled'
        : '/login?oauth_error=facebook_failed'
    );
  }

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookies = parseCookies(req.headers.cookie);
  const expectedState = cookies[OAUTH_STATE_COOKIE_NAME];
  const clearStateCookie = buildCookieHeader(OAUTH_STATE_COOKIE_NAME, '', { maxAge: 0 });

  if (!code || !state || expectedState !== `facebook:${state}`) {
    return redirect(res, '/login?oauth_error=facebook_invalid_state', [clearStateCookie]);
  }

  if (!getOAuthProvidersStatus().facebook.configured) {
    return redirect(res, '/login?oauth_error=facebook_not_configured', [clearStateCookie]);
  }

  try {
    const redirectUri =
      process.env.FACEBOOK_REDIRECT_URI?.trim() || `${getRequestOrigin(req)}/api/auth/facebook/callback`;

    const tokenUrl = new URL('https://graph.facebook.com/v20.0/oauth/access_token');
    tokenUrl.searchParams.set('client_id', process.env.FACEBOOK_APP_ID.trim());
    tokenUrl.searchParams.set('client_secret', process.env.FACEBOOK_APP_SECRET.trim());
    tokenUrl.searchParams.set('redirect_uri', redirectUri);
    tokenUrl.searchParams.set('code', code);

    const tokenRes = await fetch(tokenUrl);
    if (!tokenRes.ok) {
      return redirect(res, '/login?oauth_error=facebook_token_failed', [clearStateCookie]);
    }
    const tokenData = await tokenRes.json();

    const profileUrl = new URL('https://graph.facebook.com/me');
    profileUrl.searchParams.set('fields', 'id,name,email,picture.type(large)');
    profileUrl.searchParams.set('access_token', tokenData.access_token);

    const profileRes = await fetch(profileUrl);
    if (!profileRes.ok) {
      return redirect(res, '/login?oauth_error=facebook_profile_failed', [clearStateCookie]);
    }

    const profile = await profileRes.json();
    if (!profile.email) {
      return redirect(res, '/login?oauth_error=facebook_no_email', [clearStateCookie]);
    }

    const user = linkOrCreateOAuthParent(db, {
      provider: 'facebook',
      providerId: String(profile.id),
      email: profile.email,
      name: profile.name || profile.email.split('@')[0],
      avatar: profile.picture?.data?.url || '',
    });

    const sessionCookie = issueSessionForUser(db, req, user.id, true);
    const destination = user.role === 'admin' ? '/admin' : '/dashboard';
    return redirect(res, destination, [clearStateCookie, sessionCookie]);
  } catch {
    return redirect(res, '/login?oauth_error=facebook_failed', [clearStateCookie]);
  }
}

export { createStarterChildForParent };

