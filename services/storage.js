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
  const startedAt = Date.now();
  const debugInfo = {
    endpoint,
    folder,
    uid,
    fileName: file?.name,
    fileType: file?.type,
    fileSize: file?.size,
    startedAt: new Date(startedAt).toISOString(),
  };

  console.log('[upload-debug] step-1 prepare-request', debugInfo);

  onProgress?.(5, 'running');
  const response = await fetch(endpoint, { method: 'POST', body: form });
  onProgress?.(90, 'running');

  const elapsedMs = Date.now() - startedAt;
  const contentType = response.headers.get('content-type') || '';
  const responseMeta = {
    status: response.status,
    ok: response.ok,
    redirected: response.redirected,
    url: response.url,
    contentType,
    elapsedMs,
  };
  console.log('[upload-debug] step-2 receive-response', responseMeta);

  if (!contentType.includes('application/json')) {
    const err = new Error('Upload endpoint returned HTML instead of JSON. Configure NEXT_PUBLIC_UPLOAD_API_URL to a real backend endpoint (for example Cloud Run/Functions), because static Firebase Hosting cannot run /api routes.');
    err.code = 'storage/invalid-upload-endpoint';
    err.debug = { ...debugInfo, ...responseMeta };
    console.error('[upload-debug] step-3 invalid-content-type', err.debug);
    throw err;
  }

  const data = await response.json().catch(() => ({}));
  console.log('[upload-debug] step-3 parsed-json', {
    keys: Object.keys(data || {}),
    hasDownloadURL: Boolean(data?.downloadURL),
    hasPublicUrl: Boolean(data?.publicUrl),
    storagePath: data?.storagePath || null,
  });

  if (!response.ok) {
    const err = new Error(data?.error || 'Upload failed.');
    err.code = 'storage/upload-failed';
    err.debug = { ...debugInfo, ...responseMeta, responseBody: data };
    console.error('[upload-debug] step-4 non-2xx-response', err.debug);
    throw err;
  }

  onProgress?.(100, 'success');
  return {
    storagePath: data.storagePath,
    downloadURL: data.downloadURL,
    publicUrl: data.publicUrl,
    debug: { ...debugInfo, ...responseMeta, responseBody: data },
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
