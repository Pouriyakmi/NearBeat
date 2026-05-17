import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

export const config = { api: { bodyParser: false } };
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
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
}

function ensureUploadDir(folder) {
  const targetDir = path.join(process.cwd(), 'uploads', folder);
  fs.mkdirSync(targetDir, { recursive: true });
  return targetDir;
}

function parseForm(req) {
  const form = formidable({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
  });
}

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { fields, files } = await parseForm(req);
    const folder = Array.isArray(fields.folder) ? fields.folder[0] : fields.folder;
    const uid = (Array.isArray(fields.uid) ? fields.uid[0] : fields.uid) || 'anonymous';
    if (!ALLOWED_FOLDERS.has(folder)) return res.status(400).json({ error: 'Invalid folder' });

    const inputFile = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!inputFile?.filepath) return res.status(400).json({ error: 'File is required' });

    const uploadDir = ensureUploadDir(folder);
    const safeName = (inputFile.originalFilename || 'file.bin').replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${uid}-${Date.now()}-${safeName}`;
    await fs.promises.copyFile(inputFile.filepath, path.join(uploadDir, filename));

    const publicPath = `/api/files/${folder}/${filename}`;
    return res.status(200).json({ ok: true, folder, fileName: filename, storagePath: publicPath, url: publicPath });
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Upload failed', code: 'upload/error' });
  }
}
