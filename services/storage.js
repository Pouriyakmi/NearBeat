import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../lib/firebase';

function ensureStorage() {
  if (!storage) throw new Error('Firebase Storage is not configured.');
  return storage;
}

export function uploadTrackFile(uid, file, onProgress, metadata = {}) {
  return new Promise((resolve, reject) => {
    const fileRef = ref(ensureStorage(), `tracks/${uid}/${Date.now()}-${file.name}`);
    const task = uploadBytesResumable(fileRef, file, { contentType: file.type || 'audio/mpeg', customMetadata: Object.fromEntries(Object.entries(metadata).filter(([, v]) => v)) });

    task.on(
      'state_changed',
      (snapshot) => {
        if (!onProgress) return;
        const total = snapshot.totalBytes || file.size || 1;
        const progress = Math.min(100, Math.round((snapshot.bytesTransferred / total) * 100));
        onProgress(progress, snapshot.state);
      },
      reject,
      async () => {
        const downloadURL = await getDownloadURL(task.snapshot.ref);
        resolve({ storagePath: task.snapshot.ref.fullPath, downloadURL });
      }
    );
  });
}

export function uploadProfilePhoto(uid, file, onProgress) {
  return new Promise((resolve, reject) => {
    const fileRef = ref(ensureStorage(), `avatars/${uid}/${Date.now()}-${file.name}`);
    const task = uploadBytesResumable(fileRef, file, { contentType: file.type || 'image/jpeg' });

    task.on('state_changed', (snapshot) => {
      if (!onProgress) return;
      const total = snapshot.totalBytes || file.size || 1;
      const progress = Math.min(100, Math.round((snapshot.bytesTransferred / total) * 100));
      onProgress(progress, snapshot.state);
    }, reject, async () => {
      const downloadURL = await getDownloadURL(task.snapshot.ref);
      resolve({ storagePath: task.snapshot.ref.fullPath, downloadURL });
    });
  });
}
