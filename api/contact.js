// Vercel serverless function (Node, no dependencies).
// POST /api/contact  ->  emails the Contact / Pitch forms via Resend.
//
// Env (set in Vercel, never in the repo):
//   RESEND_API_KEY       Resend API key
//   CONTACT_TO_EMAIL     inbox that receives submissions
//   CONTACT_FROM_EMAIL   verified sender, e.g. "Podcast Network <hello@brettkmoore.com>"

const MAX = { name: 120, email: 254, message: 5000, showName: 160, showUrl: 500 };
const EMAIL_RE = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/;

function str(v) {
  return typeof v === 'string' ? v.trim() : '';
}

function oneLine(v) {
  return v.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

function esc(v) {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function send(res, status, body) {
  res.status(status).setHeader('Cache-Control', 'no-store').json(body);
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 50000) throw new Error('too_large');
  }
  return raw ? JSON.parse(raw) : {};
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { ok: false, error: 'Method not allowed' });
  }

  let data;
  try {
    data = await readBody(req);
  } catch (e) {
    return send(res, 400, { ok: false, error: 'Invalid request' });
  }
  if (!data || typeof data !== 'object') return send(res, 400, { ok: false, error: 'Invalid request' });

  // Honeypot: bots fill the hidden "website" field. Pretend success, send nothing.
  if (str(data.website)) return send(res, 200, { ok: true });

  const form = str(data.form) === 'pitch' ? 'pitch' : str(data.form) === 'contact' ? 'contact' : '';
  const name = oneLine(str(data.name));
  const email = str(data.email);
  const message = str(data.message);
  const showName = oneLine(str(data.showName));
  const showUrl = oneLine(str(data.showUrl));

  if (!form) return send(res, 400, { ok: false, error: 'Unknown form' });
  if (!name) return send(res, 400, { ok: false, error: 'Please enter your name.' });
  if (!email || !EMAIL_RE.test(email)) return send(res, 400, { ok: false, error: 'Please enter a valid email address.' });
  if (!message) return send(res, 400, { ok: false, error: 'Please enter a message.' });
  if (form === 'pitch' && !showName) return send(res, 400, { ok: false, error: 'Please enter your show name.' });
  if (
    name.length > MAX.name ||
    email.length > MAX.email ||
    message.length > MAX.message ||
    showName.length > MAX.showName ||
    showUrl.length > MAX.showUrl
  ) {
    return send(res, 400, { ok: false, error: 'One of the fields is too long.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error('contact: missing RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL');
    return send(res, 503, { ok: false, error: 'Messaging is not available right now. Please try again later.' });
  }

  const subject =
    form === 'pitch'
      ? `Podcast Network pitch: ${showName}`
      : `Podcast Network contact: ${name}`;

  const lines = [
    `Form: ${form === 'pitch' ? 'Pitch your show' : 'Contact'}`,
    `Name: ${name}`,
    `Email: ${email}`,
  ];
  if (form === 'pitch') {
    lines.push(`Show: ${showName}`);
    if (showUrl) lines.push(`Show link: ${showUrl}`);
  }
  const text = `${lines.join('\n')}\n\nMessage:\n${message}\n`;
  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#111">` +
    lines.map((l) => `<div>${esc(l)}</div>`).join('') +
    `<p style="margin:16px 0 4px"><strong>Message</strong></p>` +
    `<div style="white-space:pre-wrap">${esc(message)}</div></div>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: subject.slice(0, 200),
        text,
        html,
      }),
    });
    if (!r.ok) {
      let detail = '';
      try {
        detail = (await r.text()).slice(0, 300);
      } catch (e) {}
      console.error('contact: resend error', r.status, detail);
      return send(res, 502, { ok: false, error: 'We could not send your message. Please try again later.' });
    }
    return send(res, 200, { ok: true });
  } catch (e) {
    console.error('contact: resend request failed', e && e.message);
    return send(res, 502, { ok: false, error: 'We could not send your message. Please try again later.' });
  }
};
