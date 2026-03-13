import { useState } from "react";
import LessonNode from "./LessonNode";
import LessonView from "./LessonView";
import { initialRoadmap, Lesson, LessonState } from "@/data/learningRoadmap";

const LearningPathMap = () => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  
  // In a real app, this state would come from a backend or local storage
  // We'll mock it: Lesson 1 is "start", Lesson 2 is "locked" initially.
  const [lessonStates, setLessonStates] = useState<Record<string, LessonState>>({
    "lesson-1": "start",
    "lesson-2": "start",
    "lesson-3": "start",
    "lesson-4": "start",
    "lesson-5": "start",
    "lesson-6": "start",
    "lesson-7": "start",
    "lesson-8": "start",
  });

  const handleLessonComplete = () => {
    if (!activeLesson) return;
    
    setLessonStates(prev => {
      const newState = { ...prev, [activeLesson.id]: "completed" as LessonState };
      
      // Find current lesson index to unlock next one
      const currentIndex = initialRoadmap.findIndex(l => l.id === activeLesson.id);
      if (currentIndex < initialRoadmap.length - 1) {
        const nextLessonId = initialRoadmap[currentIndex + 1].id;
        if (prev[nextLessonId] === "locked" || !prev[nextLessonId]) {
          newState[nextLessonId] = "start";
        }
      }
      return newState;
    });
    
    setActiveLesson(null);
  };

  return (
    <div className="relative max-w-lg mx-auto py-12 px-4 flex flex-col gap-32 items-center w-full min-h-screen">
      {/* Introduction */}
      <div className="text-center mb-10">
        <h2 className="font-display text-4xl mb-4">Your Learning Path</h2>
        <p className="text-muted-foreground text-lg">Follow the roadmap to master financial concepts.</p>
      </div>

      <div className="relative w-full flex flex-col items-center gap-32 pb-32">
        {initialRoadmap.map((lesson, index) => {
          const state = lessonStates[lesson.id] || "locked";
          const isActivePath = state === "completed" || state === "start" || state === "continue";

          // To create a meandering path, we alternate translation
          const xOffset = index % 2 === 0 ? -60 : 60;

          return (
            <div 
              key={lesson.id} 
              className="w-full flex justify-center relative translate-x-[var(--x)] transition-transform duration-500 hover:scale-[1.02]"
              style={{ '--x': `${xOffset}px` } as React.CSSProperties}
            >
              <LessonNode
                title={lesson.title}
                icon={lesson.icon}
                state={state}
                index={index}
                isActivePath={isActivePath}
                onClick={() => setActiveLesson(lesson)}
              />
            </div>
          );
        })}
      </div>

      {activeLesson && (
        <LessonView
          lesson={activeLesson}
          onClose={() => setActiveLesson(null)}
          onComplete={handleLessonComplete}
        />
      )}
    </div>
  );
};

export default LearningPathMap;
