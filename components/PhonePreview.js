import { motion } from 'framer-motion';

export default function PhonePreview() {
  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="glass-card relative mx-auto w-full max-w-md rounded-[2.5rem] p-6 shadow-pinkGlow">
      <p className="text-sm text-slate-300">NearBeat now runs on real Firebase data.</p>
    </motion.div>
  );
}
