import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../lib/firebase';

function ensureStorage() {
  if (!storage) throw new Error('Firebase Storage is not configured.');
  return storage;
}

export function uploadTrackFile(uid, file, onProgress) {
  return new Promise((resolve, reject) => {
    const fileRef = ref(ensureStorage(), `tracks/${uid}/${Date.now()}-${file.name}`);
    const task = uploadBytesResumable(fileRef, file, { contentType: file.type || 'audio/mpeg' });

    task.on(
      'state_changed',
      (snapshot) => {
        if (!onProgress) return;
        const progress = snapshot.totalBytes ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) : 0;
        onProgress(progress);
      },
      reject,
      async () => {
        const downloadURL = await getDownloadURL(task.snapshot.ref);
        resolve({ storagePath: task.snapshot.ref.fullPath, downloadURL });
      }
    );
  });
}
