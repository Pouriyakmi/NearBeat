import { uploadFileToArvan } from './arvan-upload';

function validateClientFile(file, kind) {
  if (!file) throw new Error('No file selected.');
  if (kind === 'music' && !file.type.startsWith('audio/')) {
    throw new Error('Invalid file type. Please select an audio file.');
  }
  if (kind === 'covers' && !file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Please select an image file.');
  }
}

async function uploadDirect({ file, onProgress }) {
  onProgress?.(5, 'running');
  const uploaded = await uploadFileToArvan(file);
  onProgress?.(100, 'success');

  return {
    storagePath: uploaded.key,
    downloadURL: uploaded.url,
    publicUrl: uploaded.url,
  };
}

export function uploadTrackFile(uid, file, onProgress, metadata = {}) {
  void uid;
  void metadata;
  validateClientFile(file, 'music');
  return uploadDirect({ file, onProgress });
}

export function uploadProfilePhoto(uid, file, onProgress) {
  void uid;
  validateClientFile(file, 'covers');
  return uploadDirect({ file, onProgress });
}
