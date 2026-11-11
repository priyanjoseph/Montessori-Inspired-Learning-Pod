import crypto from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(crypto.scrypt);
const SCRYPT_KEYLEN = 64;

/**
 * Hash a plaintext password using scrypt with a 16-byte random salt.
 */
export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, SCRYPT_KEYLEN);
  return `scrypt$${salt}$${Buffer.from(derivedKey).toString('hex')}`;
}

/**
 * Verify a plaintext password against a stored scrypt hash in constant time.
 */
export async function verifyPassword(password, storedHash) {
  if (!password || !storedHash || typeof storedHash !== 'string') return false;
  const parts = storedHash.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, salt, hexKey] = parts;
  const expected = Buffer.from(hexKey, 'hex');
  const derivedKey = Buffer.from(await scryptAsync(password, salt, expected.length));
  if (expected.length !== derivedKey.length) return false;
  return crypto.timingSafeEqual(expected, derivedKey);
}

/**
 * Enforce baseline password complexity for registration and password reset.
 */
export function validatePasswordStrength(password) {
  if (typeof password !== 'string' || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must contain at least one letter and one number.';
  }
  return null;
}

/**
 * Generate a cryptographically random opaque token and its SHA-256 digest.
 */
export function generateOpaqueToken() {
  const raw = crypto.randomBytes(32).toString('hex');
  return { raw, hash: hashToken(raw) };
}

export function hashToken(rawToken) {
  return crypto.createHash('sha256').update(String(rawToken)).digest('hex');
}

export const SESSION_COOKIE_NAME = 'mlp_session';
export const OAUTH_STATE_COOKIE_NAME = 'mlp_oauth_state';

export function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) cookies[key] = decodeURIComponent(val);
  }
  return cookies;
}

export function buildCookieHeader(name, value, options = {}) {
  const segments = [`${name}=${encodeURIComponent(value)}`, `Path=${options.path || '/'}`];
  if (options.httpOnly !== false) segments.push('HttpOnly');
  segments.push(`SameSite=${options.sameSite || 'Lax'}`);
  if (typeof options.maxAge === 'number') {
    segments.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  }
  if (options.secure) segments.push('Secure');
  return segments.join('; ');
}

export function isHttpsRequest(req) {
  const forwardedProto = req.headers['x-forwarded-proto'];
  if (typeof forwardedProto === 'string') {
    return forwardedProto.split(',')[0].trim() === 'https';
  }
  return Boolean(req.socket?.encrypted);
}

