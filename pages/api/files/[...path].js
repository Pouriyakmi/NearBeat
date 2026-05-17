import fs from 'fs';
import path from 'path';

const ALLOWED_FOLDERS = new Set(['music', 'covers']);

export default async function handler(req, res) {
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
  fs.createReadStream(resolved).pipe(res);
}
