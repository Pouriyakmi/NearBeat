import fs from 'fs';
import path from 'path';

const ALLOWED_FOLDERS = new Set(['music', 'covers']);

function parseAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS || process.env.NEXT_PUBLIC_ALLOWED_ORIGINS || '';
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function setCors(req, res) {
  const origins = parseAllowedOrigins();
  const requestOrigin = req.headers.origin;

  if (!origins.length) return;

  const allowAll = origins.includes('*');
  const isAllowed = allowAll || (requestOrigin && origins.includes(requestOrigin));

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', allowAll ? '*' : requestOrigin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
  }
}

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const parts = req.query.path || [];
  const [folder, ...nameParts] = parts;
  const fileName = nameParts.join('/');

  if (!ALLOWED_FOLDERS.has(folder) || !fileName) {
    return res.status(404).json({ error: 'Not found' });
  }

  const baseDir = path.join(process.cwd(), 'uploads', folder);
  const target = path.join(baseDir, fileName);
  const resolved = path.resolve(target);
  if (!resolved.startsWith(path.resolve(baseDir))) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  if (!fs.existsSync(resolved)) return res.status(404).json({ error: 'Not found' });

  const ext = path.extname(fileName).toLowerCase();
  const mime = ext === '.mp3' ? 'audio/mpeg' : ext === '.wav' ? 'audio/wav' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.png' ? 'image/png' : 'application/octet-stream';
  res.setHeader('Content-Type', mime);
  res.setHeader('Accept-Ranges', 'bytes');
  fs.createReadStream(resolved).pipe(res);
}
