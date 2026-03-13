import { motion } from "framer-motion";
import { Lock, Play, RotateCcw, Check } from "lucide-react";
import { LessonState } from "@/data/learningRoadmap";

interface LessonNodeProps {
  title: string;
  icon: string;
  state: LessonState;
  index: number;
  onClick: () => void;
  isActivePath: boolean;
}

const LessonNode = ({ title, icon, state, index, onClick, isActivePath }: LessonNodeProps) => {
  const isLocked = state === "locked";
  const isCompleted = state === "completed";
  const isCurrent = state === "start" || state === "continue";

  return (
    <div className="relative flex flex-col items-center justify-center w-full z-10 group">
      {/* Connection Line (Top Half) */}
      {index > 0 && (
        <div 
          className={`absolute top-0 bottom-1/2 w-1.5 -translate-y-full -z-10 transition-colors duration-500
            ${isActivePath ? "bg-primary" : "bg-border"}
          `}
        />
      )}

      {/* Connection Line (Bottom Half) */}
      <div 
        className={`absolute top-1/2 bottom-0 w-1.5 translate-y-full -z-10 transition-colors duration-500
          ${isActivePath && state === "completed" ? "bg-primary" : "bg-border"}
        `}
      />

      {/* Glow effect for current lesson */}
      {isCurrent && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute w-24 h-24 bg-primary/20 rounded-full blur-xl pointer-events-none"
        />
      )}

      {/* Main Node Button */}
      <motion.button
        whileHover={!isLocked ? { scale: 1.05 } : {}}
        whileTap={!isLocked ? { scale: 0.95 } : {}}
        onClick={isLocked ? undefined : onClick}
        className={`
          relative z-10 flex items-center justify-center w-20 h-20 rounded-full border-4 shadow-lg transition-all duration-300
          ${isLocked 
            ? "bg-secondary border-border text-muted-foreground cursor-not-allowed opacity-60" 
            : isCompleted
            ? "bg-primary border-primary/30 text-primary-foreground shadow-primary/20"
            : "bg-background border-primary text-foreground shadow-primary/30 ring-4 ring-primary/20 hover:shadow-primary/50"
          }
        `}
      >
        <div className="text-3xl">
          {isLocked ? <Lock size={28} /> : isCompleted ? <Check size={32} /> : <span>{icon}</span>}
        </div>
      </motion.button>

      {/* Lesson Info Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          mt-4 p-3 rounded-xl border min-w-[180px] max-w-[220px] text-center shadow-md
          ${isLocked 
            ? "border-border/50 bg-secondary/30" 
            : isCurrent
            ? "border-primary/50 bg-card shadow-primary/10"
            : "border-border bg-card"
          }
        `}
      >
        <h3 className={`font-display font-medium text-sm md:text-base ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>
          {title}
        </h3>
        
        {/* Action Button Indicator */}
        <div className="mt-2 flex justify-center">
          <div className={`
            inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide
            ${isLocked ? "bg-secondary text-muted-foreground" : 
              state === "start" ? "bg-primary text-primary-foreground" :
              state === "continue" ? "bg-warning text-warning-foreground" :
              "bg-success/10 text-success"
            }
          `}>
            {state === "locked" && <>Locked</>}
            {state === "start" && <><Play size={12} fill="currentColor" /> Start</>}
            {state === "continue" && <><RotateCcw size={12} /> Continue</>}
            {state === "completed" && <>Completed</>}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LessonNode;
