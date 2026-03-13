import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, CheckCircle2, ChevronLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lesson, Subtopic } from "@/data/learningRoadmap";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface LessonViewProps {
  lesson: Lesson;
  onClose: () => void;
  onComplete: () => void;
}

const LessonView = ({ lesson, onClose, onComplete }: LessonViewProps) => {
  // Flatten all subtopics into a single array for pagination
  const allSubtopics = lesson.topics.flatMap(topic => 
    topic.subtopics.map(subtopic => ({ ...subtopic, parentTopicTitle: topic.title }))
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const currentSubtopic = allSubtopics[currentIndex];
  const isLast = currentIndex === allSubtopics.length - 1;

  const handleAnswer = (index: number) => {
    if (showExplanation) return;
    
    setSelectedAnswer(index);
    setShowExplanation(true);
    setIsQuizCompleted(true);
    
    const isCorrect = index === currentSubtopic.quiz?.correctAnswerIndex;
    if (isCorrect) {
      toast.success("Correct! Great job.");
    } else {
      toast.error("Not quite right. See the explanation.");
    }
  };

  const nextStep = () => {
    if (!isLast) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsQuizCompleted(false);
      window.scrollTo(0, 0);
    } else {
      // Complete the lesson
      triggerConfetti();
      toast.success(`Completed ${lesson.title}`);
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedAnswer(null); // Assuming going back resets the quiz view for simplicity, or we could save state
      setShowExplanation(false);
      setIsQuizCompleted(false);
      window.scrollTo(0, 0);
    }
  };

  const triggerConfetti = () => {
    const end = Date.now() + 2 * 1000;
    const colors = ['#22c55e', '#3b82f6', '#f59e0b'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex justify-center overflow-y-auto">
      <div className="w-full max-w-3xl min-h-screen bg-card shadow-2xl border-x border-border flex flex-col">
        
        {/* Top Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border bg-card/90 backdrop-blur">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X size={20} />
            </Button>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-primary">{lesson.title}</span>
              <span className="text-sm text-muted-foreground">{currentIndex + 1} of {allSubtopics.length}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-1/3 h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: `${((currentIndex) / allSubtopics.length) * 100}%` }}
              animate={{ width: `${((currentIndex + 1) / allSubtopics.length) * 100}%` }}
            />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-10 flex flex-col max-w-2xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {/* Context Label */}
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 self-start tracking-wider uppercase">
                {currentSubtopic.parentTopicTitle}
              </div>

              {/* Title & Concept */}
              <h1 className="font-display text-3xl md:text-4xl mb-6">{currentSubtopic.title}</h1>
              
              <div className="prose prose-invert max-w-none text-lg leading-relaxed text-muted-foreground mb-8">
                {currentSubtopic.content}
              </div>

              {/* Optional Visual / Chart Placeholder */}
              {currentSubtopic.chartUrl && (
                <div className="w-full aspect-video rounded-xl border border-border bg-secondary flex flex-col items-center justify-center mb-8 gap-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent"></div>
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                     <img src={`https://placehold.co/800x450/1e293b/a8a29e?text=${encodeURIComponent(currentSubtopic.chartUrl)}`} alt="Chart Example" className="w-full h-full object-cover rounded-lg shadow-lg border border-border" />
                  </motion.div>
                </div>
              )}

              {/* Quiz Section */}
              {currentSubtopic.quiz && (
                <div className="mt-auto border-t border-border pt-8 pb-4">
                  <h3 className="font-display text-xl mb-4">Knowledge Check</h3>
                  <p className="font-medium text-lg mb-6">{currentSubtopic.quiz.question}</p>
                  
                  <div className="space-y-3">
                    {currentSubtopic.quiz.options.map((option, i) => {
                      const isSelected = selectedAnswer === i;
                      const isCorrect = i === currentSubtopic.quiz?.correctAnswerIndex;
                      
                      let btnState = "border-border hover:border-primary/50 hover:bg-secondary/50";
                      
                      if (showExplanation) {
                        if (isCorrect) {
                          btnState = "border-green-500 bg-green-500/10 text-green-500";
                        } else if (isSelected) {
                          btnState = "border-red-500 bg-red-500/10 text-red-500";
                        } else {
                          btnState = "border-border opacity-50";
                        }
                      } else if (isSelected) {
                        btnState = "border-primary bg-primary/10 text-primary";
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => handleAnswer(i)}
                          disabled={showExplanation}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${btnState}`}
                        >
                          <span className="font-medium">{option}</span>
                          {showExplanation && isCorrect && <CheckCircle2 className="text-green-500" size={20} />}
                          {showExplanation && isSelected && !isCorrect && <X className="text-red-500" size={20} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <footer className="sticky bottom-0 border-t border-border bg-card/90 backdrop-blur p-4 md:p-6 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={prevStep}
            disabled={currentIndex === 0}
            className="gap-2"
          >
            <ChevronLeft size={16} /> Back
          </Button>

          <Button 
            onClick={nextStep}
            disabled={currentSubtopic.quiz && !showExplanation}
            className="gap-2 font-bold px-8 shadow-lg shadow-primary/20"
            size="lg"
          >
            {isLast ? "Complete Lesson" : "Continue"} 
            {isLast ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default LessonView;
