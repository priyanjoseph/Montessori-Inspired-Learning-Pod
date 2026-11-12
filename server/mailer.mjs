import net from 'node:net';
import tls from 'node:tls';

export function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT || '587');
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.SMTP_FROM?.trim() || user;
  return { host, port, secure, user, pass, from };
}

export function isSmtpConfigured() {
  const cfg = getSmtpConfig();
  return Boolean(cfg.host && cfg.user && cfg.pass && cfg.from);
}

/**
 * Minimal SMTP AUTH LOGIN sender using built-in Node sockets (zero dependencies).
 */
async function sendSmtpRaw(cfg, { to, subject, text, html }) {
  const connect = () =>
    new Promise((resolve, reject) => {
      const socket = cfg.secure
        ? tls.connect({ host: cfg.host, port: cfg.port }, () => resolve(socket))
        : net.createConnection({ host: cfg.host, port: cfg.port }, () => resolve(socket));
      socket.once('error', reject);
      socket.setTimeout(10000, () => reject(new Error('SMTP connection timed out')));
    });

  const readReply = (socket) =>
    new Promise((resolve, reject) => {
      let buffer = '';
      const onData = (chunk) => {
        buffer += chunk.toString('utf8');
        const lines = buffer.split(/\r?\n/).filter(Boolean);
        const last = lines[lines.length - 1];
        if (last && /^\d{3} /.test(last)) {
          cleanup();
          const code = Number(last.slice(0, 3));
          if (code >= 400) reject(new Error(`SMTP ${code}: ${last}`));
          else resolve(buffer);
        }
      };
      const onErr = (err) => {
        cleanup();
        reject(err);
      };
      const cleanup = () => {
        socket.off('data', onData);
        socket.off('error', onErr);
      };
      socket.on('data', onData);
      socket.on('error', onErr);
    });

  const command = async (socket, line) => {
    socket.write(`${line}\r\n`);
    return readReply(socket);
  };

  let socket = await connect();
  try {
    await readReply(socket);
    const ehlo = await command(socket, 'EHLO montessorilearningpod.local');

    if (!cfg.secure && /STARTTLS/i.test(ehlo)) {
      await command(socket, 'STARTTLS');
      socket = await new Promise((resolve, reject) => {
        const tlsSock = tls.connect({ socket, host: cfg.host }, () => resolve(tlsSock));
        tlsSock.once('error', reject);
      });
      await command(socket, 'EHLO montessorilearningpod.local');
    }

    await command(socket, 'AUTH LOGIN');
    await command(socket, Buffer.from(cfg.user, 'utf8').toString('base64'));
    await command(socket, Buffer.from(cfg.pass, 'utf8').toString('base64'));
    await command(socket, `MAIL FROM:<${cfg.from}>`);
    await command(socket, `RCPT TO:<${to}>`);
    await command(socket, 'DATA');

    const boundary = `mlp_${Date.now().toString(36)}`;
    const payload = [
      `From: Montessori Pod <${cfg.from}>`,
      `To: <${to}>`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset="utf-8"',
      '',
      text,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset="utf-8"',
      '',
      html,
      '',
      `--${boundary}--`,
      '.',
    ].join('\r\n');

    await command(socket, payload);
    await command(socket, 'QUIT');
  } finally {
    socket.end();
  }
}

export async function sendPasswordResetEmail({ toEmail, toName, resetUrl }) {
  if (!isSmtpConfigured()) {
    return {
      sent: false,
      reason: 'smtp_not_configured',
    };
  }

  const cfg = getSmtpConfig();
  const safeName = toName || 'Parent';
  await sendSmtpRaw(cfg, {
    to: toEmail,
    subject: 'Reset Your Montessori Pod Password',
    text: `Hello ${safeName},\n\nWe received a request to reset your Montessori Pod password.\nOpen this link within 30 minutes to set a new password:\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email.`,
    html: `<div style="font-family:sans-serif;color:#1D2A1F;line-height:1.6;"><h2>Montessori Pod</h2><p>Hello ${safeName},</p><p>Click the button below within 30 minutes to reset your password:</p><p><a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#435B45;color:#FAF7F0;border-radius:999px;text-decoration:none;font-weight:600;">Reset Password</a></p><p style="font-size:12px;color:#554232;">If you did not request a password reset, no changes have been made to your account.</p></div>`,
  });

  return { sent: true };
}

