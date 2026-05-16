import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../lib/firebase';

const UPLOAD_STALL_TIMEOUT_MS = 30000;

function normalizeBucketName(bucket = '') {
  return String(bucket).replace(/^gs:\/\//, '').trim();
}

function isLikelyValidBucket(bucket = '') {
  const normalized = normalizeBucketName(bucket);
  if (!normalized) return false;
  return normalized.endsWith('.appspot.com') || normalized.endsWith('.firebasestorage.app');
}

function ensureStorage() {
  if (!storage) throw new Error('Firebase Storage is not configured.');
  const bucket = storage?.app?.options?.storageBucket || '';
  if (!isLikelyValidBucket(bucket)) {
    throw new Error('Firebase Storage bucket is missing or invalid. Check NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET (examples: your-project.appspot.com or your-project.firebasestorage.app).');
  }
  return storage;
}

function normalizeStorageError(error) {
  const code = error?.code || 'storage/unknown';
  const messages = {
    'storage/unauthorized': 'Upload denied. Sign in and make sure Storage rules allow authenticated users to write.',
    'storage/canceled': 'Upload was canceled before completion.',
    'storage/retry-limit-exceeded': 'Upload failed after multiple retries. Please try again.',
    'storage/quota-exceeded': 'Storage quota exceeded for this Firebase project.',
    'storage/invalid-checksum': 'Upload integrity check failed (invalid checksum).',
    'storage/invalid-format': 'File format is invalid for this upload.',
    'storage/invalid-argument': 'Upload request is invalid. Please check file metadata.',
    'storage/object-not-found': 'Uploaded file could not be found in Storage.',
    'storage/unknown': error?.message || 'Unexpected Firebase Storage error.',
  };
  const readableMessage = messages[code] || error?.message || 'Unexpected Firebase Storage error.';
  const enrichedError = new Error(readableMessage);
  enrichedError.code = code;
  enrichedError.originalMessage = error?.message || '';
  enrichedError.originalError = error;
  return enrichedError;
}

function observeUpload(task, file, onProgress, resolve, reject) {
  const fallbackTotal = file?.size || 1;
  let lastBytesTransferred = 0;
  let stalledTimeout = null;

  const clearStallTimeout = () => {
    if (stalledTimeout) {
      clearTimeout(stalledTimeout);
      stalledTimeout = null;
    }
  };

  const scheduleStallRecovery = () => {
    clearStallTimeout();
    stalledTimeout = setTimeout(() => {
      if (task.snapshot?.state === 'running' && lastBytesTransferred < fallbackTotal) {
        console.warn('[storage] upload appears stalled, forcing retry via pause/resume');
        task.pause();
        task.resume();
      }
    }, UPLOAD_STALL_TIMEOUT_MS);
  };

  task.on(
    'state_changed',
    (snapshot) => {
      const bytesTransferred = Number.isFinite(snapshot?.bytesTransferred) ? snapshot.bytesTransferred : lastBytesTransferred;
      const rawTotal = Number.isFinite(snapshot?.totalBytes) ? snapshot.totalBytes : 0;
      const computedTotal = rawTotal > 0 ? rawTotal : fallbackTotal;
      const progress = Math.min(100, Math.round((bytesTransferred / Math.max(1, computedTotal)) * 100));
      lastBytesTransferred = Math.max(lastBytesTransferred, bytesTransferred);
      if (snapshot?.state === 'running' && bytesTransferred < computedTotal) scheduleStallRecovery();
      else clearStallTimeout();

      console.info('[storage] state_changed', {
        state: snapshot?.state,
        bytesTransferred,
        totalBytes: rawTotal,
        computedTotal,
        progress,
      });

      onProgress?.(progress, snapshot?.state || 'running');
    },
    (error) => {
      clearStallTimeout();
      reject(normalizeStorageError(error));
    },
    async () => {
      clearStallTimeout();
      try {
        const downloadURL = await getDownloadURL(task.snapshot.ref);
        resolve({ storagePath: task.snapshot.ref.fullPath, downloadURL });
      } catch (error) {
        reject(normalizeStorageError(error));
      }
    }
  );
}

export function uploadTrackFile(uid, file, onProgress, metadata = {}) {
  return new Promise((resolve, reject) => {
    const fileRef = ref(ensureStorage(), `tracks/${uid}/${Date.now()}-${file.name}`);
    const task = uploadBytesResumable(fileRef, file, { contentType: file.type || 'audio/mpeg', customMetadata: Object.fromEntries(Object.entries(metadata).filter(([, v]) => v)) });
    observeUpload(task, file, onProgress, resolve, reject);
  });
}

export function uploadProfilePhoto(uid, file, onProgress) {
  return new Promise((resolve, reject) => {
    const fileRef = ref(ensureStorage(), `avatars/${uid}/${Date.now()}-${file.name}`);
    const task = uploadBytesResumable(fileRef, file, { contentType: file.type || 'image/jpeg' });
    observeUpload(task, file, onProgress, resolve, reject);
  });
}
