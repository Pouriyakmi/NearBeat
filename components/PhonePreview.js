import { motion } from 'framer-motion';
import { nearbyListeners } from '../data/mockUsers';
import FeedCard from './FeedCard';

export default function PhonePreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, rotate: 2 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className="glass-card relative mx-auto w-full max-w-md rounded-[2.5rem] p-3 shadow-pinkGlow"
    >
      <div className="rounded-[2rem] border border-white/10 bg-black/30 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-pulse">near you</p>
            <h3 className="text-xl font-black">Live pulse</h3>
          </div>
          <div className="h-3 w-3 rounded-full bg-pulse shadow-glow" />
        </div>
        <div className="space-y-3">
          {nearbyListeners.slice(0, 2).map((listener, index) => (
            <FeedCard key={listener.id} listener={listener} index={index} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
