export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">{eyebrow}</p> : null}
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl leading-7 text-slate-400">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
