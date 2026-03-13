import { useState, useEffect, useCallback } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { quizQuestions } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, CheckCircle, XCircle, Zap } from "lucide-react";
import { toast } from "sonner";

const TriviaGamePage = () => {
  const [gameState, setGameState] = useState<"start" | "playing" | "result">("start");
  const [questions, setQuestions] = useState(quizQuestions.slice(0, 10));
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timer, setTimer] = useState(30);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (gameState !== "playing" || showAnswer) return;
    if (timer <= 0) {
      handleAnswer(null);
      return;
    }
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, gameState, showAnswer]);

  const startGame = () => {
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setCurrentQ(0);
    setAnswers([]);
    setTimer(30);
    setShowAnswer(false);
    setSelected(null);
    setGameState("playing");
  };

  const handleAnswer = useCallback((idx: number | null) => {
    setSelected(idx);
    setShowAnswer(true);
    setAnswers((prev) => [...prev, idx]);
    setTimeout(() => {
      if (currentQ < 9) {
        setCurrentQ((c) => c + 1);
        setTimer(30);
        setShowAnswer(false);
        setSelected(null);
      } else {
        setGameState("result");
      }
    }, 1500);
  }, [currentQ]);

  const correctCount = answers.filter((a, i) => a === questions[i]?.correct).length;
  const xpEarned = correctCount * 10;

  if (gameState === "start") {
    return (
      <AppLayout>
        <div className="mx-auto flex max-w-lg flex-col items-center pt-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary text-3xl">❓</div>
          <h1 className="mt-6 font-display text-3xl">Financial Trivia</h1>
          <p className="mt-2 text-muted-foreground">10 questions • 30 seconds each • Earn up to 100 XP</p>
          <Button onClick={startGame} size="lg" className="mt-8">Start Game</Button>
        </div>
      </AppLayout>
    );
  }

  if (gameState === "result") {
    return (
      <AppLayout>
        <div className="mx-auto flex max-w-lg flex-col items-center pt-12 text-center">
          <h1 className="font-display text-3xl">Game Over!</h1>
          <div className="mt-6 grid grid-cols-3 gap-6">
            <div>
              <div className="font-mono text-3xl font-bold text-success">{correctCount}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div>
              <div className="font-mono text-3xl font-bold text-destructive">{10 - correctCount}</div>
              <div className="text-sm text-muted-foreground">Wrong</div>
            </div>
            <div>
              <div className="font-mono text-3xl font-bold text-primary">{xpEarned}</div>
              <div className="text-sm text-muted-foreground">XP Earned</div>
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <Button onClick={startGame}>Play Again</Button>
            <Button variant="outline" onClick={() => setGameState("start")}>Back</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const q = questions[currentQ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl pt-4">
        {/* Progress */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Question {currentQ + 1}/10</span>
          <span className={`flex items-center gap-1 font-mono ${timer <= 10 ? "text-destructive" : ""}`}>
            <Timer size={14} /> {timer}s
          </span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(currentQ + 1) * 10}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mt-8"
          >
            <span className="text-xs text-muted-foreground">{q.topic} • {q.difficulty}</span>
            <h2 className="mt-2 font-display text-2xl">{q.question}</h2>

            <div className="mt-6 space-y-3">
              {q.options.map((opt, i) => {
                let borderClass = "border-border hover:border-primary/40";
                if (showAnswer) {
                  if (i === q.correct) borderClass = "border-success bg-success/10";
                  else if (i === selected && i !== q.correct) borderClass = "border-destructive bg-destructive/10";
                } else if (selected === i) {
                  borderClass = "border-primary bg-primary/10";
                }

                return (
                  <button
                    key={i}
                    onClick={() => !showAnswer && handleAnswer(i)}
                    disabled={showAnswer}
                    className={`flex w-full items-center gap-3 rounded-xl border bg-card p-4 text-left transition-colors ${borderClass}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary font-mono text-sm">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm">{opt}</span>
                    {showAnswer && i === q.correct && <CheckCircle size={16} className="ml-auto text-success" />}
                    {showAnswer && i === selected && i !== q.correct && <XCircle size={16} className="ml-auto text-destructive" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default TriviaGamePage;
