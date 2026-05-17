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

  onProgress?.(5, 'running');
  const response = await fetch('/api/storage/upload', { method: 'POST', body: form });
  onProgress?.(90, 'running');

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data?.error || 'Upload failed.');
    err.code = 'storage/upload-failed';
    throw err;
  }

  onProgress?.(100, 'success');
  const resolvedUrl = data.downloadURL || data.publicUrl || data.url || '';
  if (!resolvedUrl) {
    const err = new Error('Upload succeeded but no public file URL was returned by the server.');
    err.code = 'storage/missing-public-url';
    throw err;
  }

  return {
    storagePath: data.storagePath || data.key || '',
    downloadURL: resolvedUrl,
    publicUrl: data.publicUrl || resolvedUrl,
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
