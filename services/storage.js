import { TRACKS_BUCKET, supabase } from '../lib/supabase';

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function toReadableError(error, fallback) {
  const message = error?.message || fallback;
  const err = new Error(message);
  err.code = error?.statusCode || error?.code || 'storage/error';
  err.originalError = error;
  return err;
}

export async function uploadTrackFile(uid, file, onProgress, metadata = {}) {
  const timestamp = Date.now();
  const safeName = sanitizeFileName(file.name);
  const storagePath = `${uid}/${timestamp}-${safeName}`;

  onProgress?.(5, 'running');
  const { error } = await supabase.storage.from(TRACKS_BUCKET).upload(storagePath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || 'audio/mpeg',
    metadata: Object.fromEntries(Object.entries(metadata).filter(([, value]) => value)),
  });

  if (error) {
    throw toReadableError(error, 'Upload failed.');
  }

  onProgress?.(100, 'success');
  const { data } = supabase.storage.from(TRACKS_BUCKET).getPublicUrl(storagePath);

  return {
    storagePath: `tracks/${storagePath}`,
    objectPath: storagePath,
    downloadURL: data?.publicUrl || '',
    publicUrl: data?.publicUrl || '',
  };
}

export async function uploadProfilePhoto(uid, file, onProgress) {
  const timestamp = Date.now();
  const safeName = sanitizeFileName(file.name);
  const storagePath = `${uid}/${timestamp}-${safeName}`;

  onProgress?.(10, 'running');
  const { error } = await supabase.storage.from(TRACKS_BUCKET).upload(storagePath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || 'image/jpeg',
  });

  if (error) {
    throw toReadableError(error, 'Photo upload failed.');
  }

  onProgress?.(100, 'success');
  const { data } = supabase.storage.from(TRACKS_BUCKET).getPublicUrl(storagePath);

  return {
    storagePath: `tracks/${storagePath}`,
    objectPath: storagePath,
    downloadURL: data?.publicUrl || '',
    publicUrl: data?.publicUrl || '',
  };
}

export function getTrackPublicUrl(storagePath = '') {
  const normalizedPath = storagePath.startsWith('tracks/') ? storagePath.slice('tracks/'.length) : storagePath;
  const { data } = supabase.storage.from(TRACKS_BUCKET).getPublicUrl(normalizedPath);
  return data?.publicUrl || '';
}

export async function listTrackFiles(uid) {
  if (!uid) return [];
  const { data, error } = await supabase.storage.from(TRACKS_BUCKET).list(uid, {
    limit: 50,
    sortBy: { column: 'name', order: 'desc' },
  });
  if (error) throw toReadableError(error, 'Unable to load files.');

  return (data || []).map((item) => {
    const objectPath = `${uid}/${item.name}`;
    const { data: publicData } = supabase.storage.from(TRACKS_BUCKET).getPublicUrl(objectPath);
    return {
      ...item,
      path: `tracks/${objectPath}`,
      objectPath,
      publicUrl: publicData?.publicUrl || '',
    };
  });
}
