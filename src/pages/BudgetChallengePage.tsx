import { useState, useCallback, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Heart, Wallet, CalendarDays, RefreshCw, Trophy, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  BudgetEvent,
  Choice,
  INITIAL_SALARY,
  INITIAL_HAPPINESS,
  INITIAL_SAVINGS,
  WINNING_XP,
  fixedMonthlyEvent,
  getRandomEvent
} from "@/data/budgetEvents";
import { AnimatedAvatar } from "@/components/budget/AnimatedAvatar";

const TOTAL_MONTHS = 12;

type GameState = 'start' | 'playing' | 'won' | 'lost';
type Phase = 'monthly_income' | 'fixed_expenses' | 'random_event' | 'month_end';

const BudgetChallengePage = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [month, setMonth] = useState(1);
  const [savings, setSavings] = useState(INITIAL_SAVINGS);
  const [happiness, setHappiness] = useState(INITIAL_HAPPINESS);
  const [salary] = useState(INITIAL_SALARY);
  const [phase, setPhase] = useState<Phase>('monthly_income');
  
  // Event State
  const [currentEvent, setCurrentEvent] = useState<BudgetEvent | null>(null);
  const [seenEvents, setSeenEvents] = useState<string[]>([]);
  const [lastActionImpact, setLastActionImpact] = useState<'positive' | 'negative' | 'neutral' | null>(null);
  
  // Auth state for saving XP
  const [userId, setUserId] = useState<string | null>(null);
  const [isSavingXP, setIsSavingXP] = useState(false);

  useEffect(() => {
     // Fetch user session for XP rewards
     supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) setUserId(session.user.id);
     });
  }, []);

  const startGame = () => {
    setMonth(1);
    setSavings(INITIAL_SAVINGS);
    setHappiness(INITIAL_HAPPINESS);
    setGameState('playing');
    setPhase('monthly_income');
    setSeenEvents([]);
    handlePhaseChange('monthly_income', INITIAL_SAVINGS, INITIAL_HAPPINESS, 1);
  };

  const checkGameEnd = (currentSavings: number) => {
      if (currentSavings < 0) {
          setGameState('lost');
          toast.error("You ran out of money! Game Over.", { duration: 5000 });
          return true;
      }
      return false;
  };

  const updateStats = (costOffset: number, happinessOffset: number) => {
      const newSavings = savings - costOffset; // negative cost means income
      const newHappiness = Math.min(100, Math.max(0, happiness + happinessOffset));
      
      setSavings(newSavings);
      setHappiness(newHappiness);
      
      // Determine impact for avatar animation
      if (happinessOffset > 0 && costOffset <= 0) setLastActionImpact('positive');
      else if (costOffset > 0 || happinessOffset < 0) setLastActionImpact('negative');
      else setLastActionImpact('neutral');

      // Clear impact after animation
      setTimeout(() => setLastActionImpact(null), 1500);

      return { newSavings, newHappiness };
  };

  const handlePhaseChange = (targetPhase: Phase, currentSavings: number, currentHappiness: number, currentMonth: number) => {
     if (checkGameEnd(currentSavings)) return;

     setPhase(targetPhase);

     if (targetPhase === 'monthly_income') {
         // Automatically add salary
         setCurrentEvent({
             id: 'salary_deposit',
             title: `Month ${currentMonth} Salary`,
             description: 'Your monthly salary has been deposited into your account.',
             type: 'fixed',
             choices: [{
                 id: 'collect',
                 text: `Collect ₹${salary.toLocaleString()}`,
                 cost: -salary, // Negative cost increases savings
                 happinessImpact: 5,
                 description: 'A good day.'
             }]
         });
     } else if (targetPhase === 'fixed_expenses') {
         setCurrentEvent(fixedMonthlyEvent);
     } else if (targetPhase === 'random_event') {
         const newEvent = getRandomEvent(seenEvents);
         setCurrentEvent(newEvent);
         setSeenEvents(prev => [...prev, newEvent.id]);
     } else if (targetPhase === 'month_end') {
          if (currentMonth === TOTAL_MONTHS) {
              setGameState('won');
              awardXP(currentSavings);
          } else {
              setMonth(prev => prev + 1);
              handlePhaseChange('monthly_income', currentSavings, currentHappiness, currentMonth + 1);
          }
     }
  };

  const handleChoice = (choice: Choice) => {
      const { newSavings, newHappiness } = updateStats(choice.cost, choice.happinessImpact);
      
      toast(choice.text, {
          description: choice.description,
      });

      // Progress through phases
      if (phase === 'monthly_income') {
          setTimeout(() => handlePhaseChange('fixed_expenses', newSavings, newHappiness, month), 1500);
      } else if (phase === 'fixed_expenses') {
          setTimeout(() => handlePhaseChange('random_event', newSavings, newHappiness, month), 1500);
      } else if (phase === 'random_event') {
          handlePhaseChange('month_end', newSavings, newHappiness, month);
      }
  };

  const awardXP = async (finalSavings: number) => {
     if (!userId) return;
     setIsSavingXP(true);
     try {
        // Bonus XP for high savings
        const boundsXP = finalSavings > INITIAL_SAVINGS * 2 ? 50 : 0;
        const totalXP = WINNING_XP + boundsXP;

        // Fetch current profile
        const { data: profile } = await supabase.from('profiles').select('xp').eq('id', userId).single();
        const newXp = (profile?.xp ?? 0) + totalXP;

        // Update profile
        await supabase.from('profiles').update({ xp: newXp }).eq('id', userId);
        
        // Save history
        await supabase.from('game_history').insert({
             user_id: userId,
             game_id: 'budget_challenge',
             score: finalSavings,
             xp_earned: totalXP,
             details: { finalHappiness: happiness, finalSavings }
        });

        toast.success(`You survived the year! Awarded ${totalXP} XP.`);
     } catch (err) {
         console.error("Failed to save budget challenge XP", err);
     } finally {
         setIsSavingXP(false);
     }
  };


  if (gameState === 'start') {
      return (
          <AppLayout>
              <div className="mx-auto max-w-2xl px-4 py-12 text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Wallet size={48} />
                  </div>
                  <h1 className="font-display text-4xl font-bold">Budget Challenge</h1>
                  <p className="mt-4 text-xl text-muted-foreground">
                      Survive 12 months on a fixed salary while dealing with random life events. Balance your savings and your happiness.
                  </p>
                  
                  <div className="mt-8 grid grid-cols-2 gap-4 text-left">
                     <div className="rounded-xl border border-border bg-card p-4">
                         <div className="text-sm font-bold text-muted-foreground">Starting Salary</div>
                         <div className="text-xl font-mono mt-1">₹{INITIAL_SALARY.toLocaleString()} / mo</div>
                     </div>
                     <div className="rounded-xl border border-border bg-card p-4">
                         <div className="text-sm font-bold text-muted-foreground">Starting Savings</div>
                         <div className="text-xl font-mono mt-1">₹{INITIAL_SAVINGS.toLocaleString()}</div>
                     </div>
                  </div>

                  <Button onClick={startGame} className="mt-10 h-14 w-full max-w-sm text-lg font-bold shadow-xl transition-all hover:scale-105 active:scale-95">
                      Start Challenge
                  </Button>
              </div>
          </AppLayout>
      );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
         {/* Top HUD */}
         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
             <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2">
                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
                         <CalendarDays size={20} />
                     </div>
                     <div>
                         <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Month</div>
                         <div className="font-mono text-xl font-black">{month} <span className="text-sm text-muted-foreground font-normal">/ {TOTAL_MONTHS}</span></div>
                     </div>
                 </div>
                 
                 <div className="flex items-center gap-2 border-l border-border pl-6">
                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20 text-success">
                         <Wallet size={20} />
                     </div>
                     <div>
                         <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Savings</div>
                         <motion.div 
                              key={savings} 
                              initial={{ scale: 1.2, color: "var(--tw-colors-primary)" }} 
                              animate={{ scale: 1, color: "inherit" }} 
                              className="font-mono text-xl font-black"
                         >
                             ₹{savings.toLocaleString('en-IN')}
                         </motion.div>
                     </div>
                 </div>
             </div>

             <div className="sm:w-64">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5 uppercase tracking-wider text-muted-foreground">
                      <span className="flex items-center gap-1"><Heart size={14} className="text-destructive fill-destructive" /> Happiness</span>
                      <span>{happiness}%</span>
                  </div>
                  <Progress value={happiness} className="h-2.5" />
             </div>
         </div>

         {/* Main Game Area */}
         <div className="mt-8 grid gap-8 md:grid-cols-[1fr_300px]">
             {/* Events Panel */}
             <div className="order-2 md:order-1 flex flex-col justify-center">
                 <AnimatePresence mode="wait">
                     {gameState === 'playing' && currentEvent ? (
                         <motion.div
                             key={currentEvent.id + phase}
                             initial={{ opacity: 0, x: -20 }}
                             animate={{ opacity: 1, x: 0 }}
                             exit={{ opacity: 0, x: 20 }}
                             transition={{ duration: 0.4 }}
                             className="rounded-2xl border border-primary/20 bg-card p-6 shadow-xl relative overflow-hidden"
                         >
                             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] pointer-events-none" />
                             
                             <div className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                                 {phase === 'monthly_income' ? "Payday" : phase === 'fixed_expenses' ? "Bills Due" : "Life Event"}
                             </div>
                             <h2 className="font-display text-2xl mb-2">{currentEvent.title}</h2>
                             <p className="text-muted-foreground mb-8 text-lg">{currentEvent.description}</p>
                             
                             <div className="space-y-4">
                                 {currentEvent.choices.map((choice) => (
                                     <button
                                         key={choice.id}
                                         onClick={() => handleChoice(choice)}
                                         className="w-full relative flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-border bg-secondary/50 p-4 text-left transition-all hover:bg-secondary hover:border-primary/50 hover:-translate-y-0.5"
                                     >
                                         <div className="font-semibold text-lg">{choice.text}</div>
                                         <div className="flex items-center gap-3 shrink-0">
                                             <div className={`font-mono font-bold px-3 py-1 rounded-full text-xs ${choice.cost > 0 ? 'bg-destructive/10 text-destructive' : choice.cost < 0 ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                                                 {choice.cost > 0 ? '-' : choice.cost < 0 ? '+' : ''}₹{Math.abs(choice.cost).toLocaleString('en-IN')}
                                             </div>
                                             {choice.happinessImpact !== 0 && (
                                                 <div className={`flex items-center gap-1 font-bold text-xs ${choice.happinessImpact > 0 ? 'text-success' : 'text-destructive'}`}>
                                                     <Heart size={12} className={choice.happinessImpact > 0 ? 'fill-success' : 'fill-destructive'} /> 
                                                     {choice.happinessImpact > 0 ? '+' : ''}{choice.happinessImpact}
                                                 </div>
                                             )}
                                         </div>
                                     </button>
                                 ))}
                             </div>
                         </motion.div>
                     ) : (
                         <motion.div
                             key="game-over-panel"
                             initial={{ opacity: 0, scale: 0.9 }}
                             animate={{ opacity: 1, scale: 1 }}
                             className="rounded-2xl border border-border bg-card p-8 text-center shadow-xl"
                         >
                             {gameState === 'won' ? (
                                 <>
                                     <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/20 text-success">
                                         <Trophy size={40} />
                                     </div>
                                     <h2 className="font-display text-3xl font-bold mb-4">You Survived the Year!</h2>
                                     <div className="space-y-2 mb-8">
                                         <p className="text-muted-foreground">Final Savings: <span className="font-mono font-bold text-foreground">₹{savings.toLocaleString('en-IN')}</span></p>
                                         <p className="text-muted-foreground">Closing Happiness: <span className="font-bold text-foreground">{happiness}%</span></p>
                                         {userId && <p className="text-sm font-bold text-primary flex items-center justify-center gap-2 mt-4"><Zap size={16}/> XP Awarded Successfully</p>}
                                     </div>
                                 </>
                             ) : (
                                 <>
                                     <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/20 text-destructive">
                                         <Wallet size={40} />
                                     </div>
                                     <h2 className="font-display text-3xl font-bold mb-4">Bankrupt!</h2>
                                     <p className="text-muted-foreground mb-8">You ran out of savings. Budgeting is hard, but try again applying what you learned!</p>
                                 </>
                             )}
                             
                             <Button onClick={startGame} className="w-full h-12">
                                 <RefreshCw size={16} className="mr-2" /> Play Again
                             </Button>
                         </motion.div>
                     )}
                 </AnimatePresence>
             </div>

             {/* Avatar Panel */}
             <div className="order-1 md:order-2 flex items-center justify-center rounded-2xl border border-border bg-card p-6 shadow-sm">
                 <AnimatedAvatar happiness={happiness} savings={savings} lastActionImpact={lastActionImpact} />
             </div>
         </div>
      </div>
    </AppLayout>
  );
};

export default BudgetChallengePage;
