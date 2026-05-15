import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../lib/firebase';

function ensureStorage() {
  if (!storage) throw new Error('Firebase Storage is not configured.');
  return storage;
}

export async function uploadTrackFile(uid, file) {
  const fileRef = ref(ensureStorage(), `tracks/${uid}/${Date.now()}-${file.name}`);
  const result = await uploadBytes(fileRef, file, { contentType: file.type || 'audio/mpeg' });
  const downloadURL = await getDownloadURL(result.ref);
  return { storagePath: result.ref.fullPath, downloadURL };
}
