import { S3Client, HeadBucketCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import formidable from 'formidable';
import fs from 'node:fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_FILE_SIZE = 30 * 1024 * 1024;
const ALLOWED_TYPES = {
  music: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/aac', 'audio/ogg', 'audio/flac', 'audio/mp4', 'audio/x-m4a'],
  covers: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
};

let cachedClient = null;

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function getStorageConfig() {
  return {
    bucket: getRequiredEnv('ARVAN_STORAGE_BUCKET'),
    endpoint: getRequiredEnv('ARVAN_STORAGE_ENDPOINT'),
    publicBaseUrl: getRequiredEnv('ARVAN_STORAGE_PUBLIC_BASE_URL'),
    accessKeyId: getRequiredEnv('ARVAN_STORAGE_ACCESS_KEY'),
    secretAccessKey: getRequiredEnv('ARVAN_STORAGE_SECRET_KEY'),
  };
}

function getS3Client() {
  if (cachedClient) return cachedClient;
  const { endpoint, accessKeyId, secretAccessKey } = getStorageConfig();
  cachedClient = new S3Client({
    endpoint,
    region: 'us-east-1',
    forcePathStyle: false,
    credentials: { accessKeyId, secretAccessKey },
  });
  return cachedClient;
}

function parseRequest(req) {
  const form = formidable({ multiples: false, maxFileSize: MAX_FILE_SIZE, allowEmptyFiles: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

function sanitizeFilename(name = 'file') {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-').toLowerCase();
}

function createStorageKey(folder, uid, originalFilename) {
  const safeUid = sanitizeFilename(uid || 'anonymous');
  const safeName = sanitizeFilename(originalFilename || 'file');
  return `${folder}/${safeUid}/${Date.now()}-${safeName}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fields, files } = await parseRequest(req);
    const uploadFile = Array.isArray(files.file) ? files.file[0] : files.file;
    const folder = Array.isArray(fields.folder) ? fields.folder[0] : fields.folder;
    const uid = Array.isArray(fields.uid) ? fields.uid[0] : fields.uid;

    if (!uploadFile) return res.status(400).json({ error: 'No file provided.' });
    if (!folder || !ALLOWED_TYPES[folder]) return res.status(400).json({ error: 'Invalid folder. Use "music" or "covers".' });
    if (!uid || typeof uid !== 'string') return res.status(400).json({ error: 'Missing uid.' });

    const fileType = uploadFile.mimetype || 'application/octet-stream';
    if (!ALLOWED_TYPES[folder].includes(fileType)) {
      return res.status(400).json({ error: `Invalid file type for ${folder}.` });
    }

    const { bucket, publicBaseUrl } = getStorageConfig();
    const s3 = getS3Client();

    await s3.send(new HeadBucketCommand({ Bucket: bucket }));

    const storagePath = createStorageKey(folder, uid, uploadFile.originalFilename);
    const fileStream = fs.createReadStream(uploadFile.filepath);

    const uploader = new Upload({
      client: s3,
      params: {
        Bucket: bucket,
        Key: storagePath,
        Body: fileStream,
        ContentType: fileType,
        ACL: 'public-read',
        CacheControl: folder === 'music' ? 'public, max-age=31536000, immutable' : 'public, max-age=86400',
      },
    });

    await uploader.done();
    const publicUrl = `${publicBaseUrl.replace(/\/$/, '')}/${storagePath}`;

    return res.status(200).json({ storagePath, downloadURL: publicUrl, publicUrl });
  } catch (error) {
    console.error('[arvan-upload] failed', error);
    const statusCode = error?.message?.startsWith('Missing required environment variable') ? 500 : 400;
    return res.status(statusCode).json({ error: error?.message || 'Upload failed' });
  }
}
