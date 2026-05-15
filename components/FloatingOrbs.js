export default function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-night bg-radial-grid">
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-pulse/20 blur-3xl" />
      <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-neonPink/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-neonBlue/10 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_72%)]" />
    </div>
  );
}
