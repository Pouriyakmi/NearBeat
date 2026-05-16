import { Upload } from 'lucide-react';

export default function Uploader({ uploadState, progress, uploadMessage, onFileChange }) {
  const selecting = uploadState === 'selecting';
  const busy = uploadState === 'uploading' || uploadState === 'finalizing';

  return (
    <>
      <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-black text-slate-950">
        <Upload size={16} /> {busy ? `Uploading ${progress}%` : 'Upload track'}
        <input type="file" accept="audio/*" hidden onChange={onFileChange} disabled={busy} />
      </label>
      {busy && <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10"><div className="h-full bg-emerald-400 transition-all duration-200" style={{ width: `${progress}%` }} /></div>}
      {uploadMessage && <p className={`mt-3 text-sm ${uploadState === 'error' ? 'text-rose-400' : uploadState === 'success' ? 'text-emerald-300' : 'text-slate-300'}`}>{selecting ? 'Selecting file...' : uploadMessage}</p>}
    </>
  );
}
