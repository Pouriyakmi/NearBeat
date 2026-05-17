import { listMyUploadedTracks } from './firestore';

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || '').trim().replace(/\/$/, '');
}

function withApiBase(path) {
  const base = getApiBaseUrl();
  return base ? `${base}${path}` : path;
}

async function uploadViaApi(file, folder, uid, onProgress, metadata = {}) {
  const timestamp = Date.now();
  const safeName = sanitizeFileName(file.name);
  const formData = new FormData();
  formData.append('file', file, `${timestamp}-${safeName}`);
  formData.append('folder', folder);
  formData.append('uid', uid || 'anonymous');
  formData.append('metadata', JSON.stringify(metadata));

  onProgress?.(15, 'running');
  const response = await fetch(withApiBase('/api/upload'), {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const err = new Error(payload?.error || 'Upload failed.');
    err.code = payload?.code || 'storage/error';
    throw err;
  }

  onProgress?.(100, 'success');
  return response.json();
}

export async function uploadTrackFile(uid, file, onProgress, metadata = {}) {
  const result = await uploadViaApi(file, 'music', uid, onProgress, metadata);
  const publicUrl = withApiBase(result.url);
  return {
    storagePath: result.storagePath,
    objectPath: result.storagePath,
    downloadURL: publicUrl,
    publicUrl,
  };
}

export async function uploadProfilePhoto(uid, file, onProgress) {
  const result = await uploadViaApi(file, 'covers', uid, onProgress);
  const publicUrl = withApiBase(result.url);
  return {
    storagePath: result.storagePath,
    objectPath: result.storagePath,
    downloadURL: publicUrl,
    publicUrl,
  };
}

export function getTrackPublicUrl(storagePath = '') {
  return storagePath ? withApiBase(storagePath) : '';
}

export async function listTrackFiles(uid) {
  const tracks = await listMyUploadedTracks(uid);
  return tracks.map((track) => ({
    id: track.id,
    name: track.fileName || track.title || track.id,
    path: track.storagePath || track.audioUrl || '',
    objectPath: track.storagePath || track.audioUrl || '',
    publicUrl: getTrackPublicUrl(track.audioUrl || track.storagePath || ''),
  }));
}
