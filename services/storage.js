const ALLOWED_UPLOAD_FOLDERS = new Set(['music', 'covers']);

function validateClientFile(file, kind) {
  if (!file) throw new Error('No file selected.');
  if (kind === 'music' && !file.type.startsWith('audio/')) {
    throw new Error('Invalid file type. Please select an audio file.');
  }
  if (kind === 'covers' && !file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Please select an image file.');
  }
}

async function uploadViaApi({ uid, file, folder, onProgress }) {
  if (!ALLOWED_UPLOAD_FOLDERS.has(folder)) throw new Error('Invalid upload folder.');
  if (!uid) throw new Error('Missing user id for upload.');

  const form = new FormData();
  form.append('file', file);
  form.append('uid', uid);
  form.append('folder', folder);

  const configuredEndpoint = process.env.NEXT_PUBLIC_UPLOAD_API_URL?.trim();
  const endpoint = configuredEndpoint || '/api/storage/upload';

  onProgress?.(5, 'running');
  const response = await fetch(endpoint, { method: 'POST', body: form });
  onProgress?.(90, 'running');

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const err = new Error('Upload endpoint returned HTML instead of JSON. Configure NEXT_PUBLIC_UPLOAD_API_URL to a real backend endpoint (for example Cloud Run/Functions), because static Firebase Hosting cannot run /api routes.');
    err.code = 'storage/invalid-upload-endpoint';
    throw err;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data?.error || 'Upload failed.');
    err.code = 'storage/upload-failed';
    throw err;
  }

  onProgress?.(100, 'success');
  return {
    storagePath: data.storagePath,
    downloadURL: data.downloadURL,
    publicUrl: data.publicUrl,
  };
}

export function uploadTrackFile(uid, file, onProgress, metadata = {}) {
  void metadata;
  validateClientFile(file, 'music');
  return uploadViaApi({ uid, file, folder: 'music', onProgress });
}

export function uploadProfilePhoto(uid, file, onProgress) {
  validateClientFile(file, 'covers');
  return uploadViaApi({ uid, file, folder: 'covers', onProgress });
}
