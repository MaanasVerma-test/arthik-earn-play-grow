import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Frown, Meh, DollarSign, Zap } from 'lucide-react';

interface AnimatedAvatarProps {
  happiness: number; // 0 to 100
  savings: number;
  lastActionImpact: 'positive' | 'negative' | 'neutral' | null;
}

export const AnimatedAvatar = ({ happiness, savings, lastActionImpact }: AnimatedAvatarProps) => {
  // Determine expression based on happiness
  let ExpressionComponent = Meh;
  let colorClass = 'text-warning';

  if (happiness >= 70) {
    ExpressionComponent = Smile;
    colorClass = 'text-success';
  } else if (happiness <= 30) {
    ExpressionComponent = Frown;
    colorClass = 'text-destructive';
  }

  // Determine background intensity based on savings
  let bgClass = 'bg-secondary';
  if (savings > 60000) {
    bgClass = 'bg-success/20 border-success/50';
  } else if (savings < 5000) {
    bgClass = 'bg-destructive/20 border-destructive/50';
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-6">
      {/* Action Impact Particles */}
      <AnimatePresence>
        {lastActionImpact && (
          <motion.div
            key={Date.now()} // Force remount on new action
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -40, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`absolute top-0 flex items-center gap-1 font-bold ${
              lastActionImpact === 'positive' ? 'text-success' : lastActionImpact === 'negative' ? 'text-destructive' : 'text-muted-foreground'
            }`}
          >
            {lastActionImpact === 'positive' ? <Zap size={16} /> : lastActionImpact === 'negative' ? <DollarSign size={16} className="opacity-50" /> : null}
            {lastActionImpact === 'positive' ? '+Joy' : lastActionImpact === 'negative' ? '-Cash' : 'Hmm'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Avatar Character */}
      <motion.div
        animate={{ 
            y: [0, -5, 0], // Subtle breathing animation
            scale: lastActionImpact ? [1, 1.1, 1] : 1 // Bump on action
        }}
        transition={{ 
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 0.3 }
        }}
        className={`relative flex h-32 w-32 items-center justify-center rounded-full border-4 shadow-xl ${bgClass} transition-colors duration-500`}
      >
        <motion.div
            key={happiness} // Animate expression change
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={colorClass}
        >
             <ExpressionComponent size={64} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
      
      {/* Shadow */}
      <motion.div 
        animate={{ scale: [1, 0.9, 1], opacity: [0.3, 0.1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mt-4 h-2 w-20 rounded-full bg-black/20 dark:bg-white/10 blur-sm" 
      />
    </div>
  );
};
