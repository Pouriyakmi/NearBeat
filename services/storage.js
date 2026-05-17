import { listMyUploadedTracks } from './firestore';

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
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
  const response = await fetch('/api/upload', {
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
  return {
    storagePath: result.storagePath,
    objectPath: result.storagePath,
    downloadURL: result.url,
    publicUrl: result.url,
  };
}

export async function uploadProfilePhoto(uid, file, onProgress) {
  const result = await uploadViaApi(file, 'covers', uid, onProgress);
  return {
    storagePath: result.storagePath,
    objectPath: result.storagePath,
    downloadURL: result.url,
    publicUrl: result.url,
  };
}

export function getTrackPublicUrl(storagePath = '') {
  return storagePath || '';
}

export async function listTrackFiles(uid) {
  const tracks = await listMyUploadedTracks(uid);
  return tracks.map((track) => ({
    id: track.id,
    name: track.fileName || track.title || track.id,
    path: track.storagePath || track.audioUrl || '',
    objectPath: track.storagePath || track.audioUrl || '',
    publicUrl: track.audioUrl || '',
  }));
}
