export default function SectionLabel({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.36em] text-pulse">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">{description}</p>
    </div>
  );
}
