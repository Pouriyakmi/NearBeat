export default function ProgressBar({ value = 0, subtle = false }) {
  return (
    <div className={`h-1.5 overflow-hidden rounded-full ${subtle ? 'bg-white/10' : 'bg-black/25'}`}>
      <div className="h-full rounded-full bg-emerald-400" style={{ width: `${value}%` }} />
    </div>
  );
}
