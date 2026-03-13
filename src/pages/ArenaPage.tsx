import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Zap, ArrowRight, Shield, Swords, Info, RefreshCw as RefreshIcon, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { multiplayerService, Match, Player } from "@/lib/multiplayerService";
import { secureService } from "@/lib/secureService";

const CHALLENGE_ITEMS = [
  { id: '1', text: 'Health Insurance', category: 'Need' },
  { id: '2', text: 'Designer Handbag', category: 'Want' },
  { id: '3', text: 'Emergency Fund', category: 'Need' },
  { id: '4', text: 'Netflix Subscription', category: 'Want' },
  { id: '5', text: 'Electricity Bill', category: 'Need' },
  { id: '6', text: 'Dining Out', category: 'Want' },
  { id: '7', text: 'Mutual Fund SIP', category: 'Need' },
  { id: '8', text: 'Latest iPhone', category: 'Want' },
  { id: '9', text: 'House Rent', category: 'Need' },
  { id: '10', text: 'Video Games', category: 'Want' },
];

const ArenaPage = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Game State
  const [countdown, setCountdown] = useState(5);
  const [isGameActive, setIsGameActive] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [myProgress, setMyProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    // 1. Get user session or Guest info
    supabase.auth.getSession().then(({ data: { session } }) => {
      let player1: Player;
      
      if (session) {
        setCurrentUser(session.user);
        player1 = { id: session.user.id, username: session.user.email?.split('@')[0] || 'You', progress: 0 };
      } else {
        const params = new URLSearchParams(window.location.search);
        const guestId = params.get('id') || `guest_${Math.random().toString(36).substr(2, 9)}`;
        const guestName = params.get('name') || 'Guest';
        player1 = { id: guestId, username: guestName, progress: 0 };
        setCurrentUser({ id: guestId, isGuest: true });
      }
      
      setMatch({
          id: matchId || 'sim_match',
          player1,
          player2: { id: 'bot', username: 'ShadowPlayer_Bot', progress: 0 },
          status: 'counting_down',
          startTime: Date.now() + 5000
      });
    });

    // 2. Realtime listener for opponent progress
    const channel = supabase.channel(`match_${matchId}`);
    channel.on('broadcast', { event: 'progress' }, ({ payload }) => {
        if (payload.userId !== currentUser?.id) {
            setOpponentProgress(payload.progress);
        }
    }).subscribe();

    return () => { channel.unsubscribe(); };
  }, [matchId, navigate]);

  // Handle Countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isGameActive && !winner) {
      setIsGameActive(true);
      startOpponentSimulation();
    }
  }, [countdown, isGameActive, winner]);

  // Simulate Opponent Movement (Bot)
  const startOpponentSimulation = () => {
      let currentOpponentProgress = 0;
      const interval = setInterval(() => {
          if (winner || currentOpponentProgress >= 100) {
              clearInterval(interval);
              return;
          }
          currentOpponentProgress += Math.random() * 8;
          setOpponentProgress(Math.min(100, currentOpponentProgress));
          
          if (currentOpponentProgress >= 100 && !winner) {
              setWinner('opponent');
              setIsGameActive(false);
          }
      }, 1500);
  };

  const handleChoice = (category: string) => {
    const item = CHALLENGE_ITEMS[currentItemIndex];
    if (item.category === category) {
      toast.success("Correct!", { duration: 800 });
      const newIndex = currentItemIndex + 1;
      const newProgress = (newIndex / CHALLENGE_ITEMS.length) * 100;
      
      setMyProgress(newProgress);
      setCurrentItemIndex(newIndex);
      
      // Sync to backend/channel
      if (matchId) multiplayerService.updateProgress(matchId, currentUser.id, newProgress);

      if (newProgress >= 100 && !winner) {
          setWinner('me');
          setIsGameActive(false);
          awardXP();
      }
    } else {
      toast.error("Incorrect sorting!", { duration: 800 });
      // Minor penalty (shake or delay)
    }
  };

  const awardXP = async () => {
      if (!currentUser || currentUser.isGuest) {
          toast.info("Victory! Log in to save XP and climb the leaderboard.");
          return;
      }
      
      const result = await secureService.awardXP(150, 'MATCH_VICTORY', 'Won a 1v1 Arena match');
      if (result?.success) {
          toast.success("Victory! Awarded 150 XP");
      }
  };

  if (!match) return <AppLayout>Loading arena...</AppLayout>;

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
        {/* Match Header */}
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-6 shadow-sm">
             <div className="flex flex-1 flex-col items-center">
                 <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary border-2 border-primary">
                    {match.player1.username[0].toUpperCase()}
                 </div>
                 <div className="mt-2 font-display font-bold">{match.player1.username}</div>
                 <div className="mt-1 text-xs text-muted-foreground">Level 12 • Pro</div>
             </div>

             <div className="flex flex-col items-center px-8">
                 <div className="text-primary font-black italic text-4xl mb-2">VS</div>
                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <Swords size={20} />
                 </div>
             </div>

             <div className="flex flex-1 flex-col items-center">
                 <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center text-destructive border-2 border-destructive">
                    {match.player2.username[0].toUpperCase()}
                 </div>
                 <div className="mt-2 font-display font-bold">{match.player2.username}</div>
                 <div className="mt-1 text-xs text-muted-foreground">Bot • Challenge</div>
             </div>
        </div>

        {/* Progress Bars */}
        <div className="mt-8 space-y-6 px-4">
             <div>
                 <div className="flex justify-between text-xs mb-2">
                     <span className="font-bold flex items-center gap-1 uppercase tracking-wider"><CheckCircle2 size={12} className="text-primary" /> Your Progress</span>
                     <span className="font-mono">{Math.round(myProgress)}%</span>
                 </div>
                 <Progress value={myProgress} className="h-3" />
             </div>
             <div>
                 <div className="flex justify-between text-xs mb-2">
                     <span className="font-bold flex items-center gap-1 uppercase tracking-wider"><XCircle size={12} className="text-destructive" /> Opponent</span>
                     <span className="font-mono">{Math.round(opponentProgress)}%</span>
                 </div>
                 <Progress value={opponentProgress} className="h-3" />
             </div>
        </div>

        {/* Game Content */}
        <div className="mt-12 flex flex-col items-center justify-center min-h-[300px]">
            <AnimatePresence mode="wait">
                {countdown > 0 ? (
                    <motion.div
                        key="countdown"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{ scale: 2, opacity: 0 }}
                        className="text-6xl font-black text-primary font-display"
                    >
                        {countdown}
                    </motion.div>
                ) : winner ? (
                    <motion.div
                        key="winner"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center"
                    >
                        <div className={`text-4xl font-display font-bold mb-4 ${winner === 'me' ? 'text-success' : 'text-destructive'}`}>
                            {winner === 'me' ? 'WINNER!' : 'DEFEATED'}
                        </div>
                        <p className="text-muted-foreground mb-8">
                            {winner === 'me' ? 'You sorted the finances faster than your opponent!' : 'Better luck next time. Your opponent was quicker!'}
                        </p>
                        <Button size="lg" onClick={() => navigate('/compete')} className="gap-2">
                           <RefreshCw size={16} /> Back to Hub
                        </Button>
                    </motion.div>
                ) : isGameActive && currentItemIndex < CHALLENGE_ITEMS.length ? (
                    <motion.div
                        key={currentItemIndex}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        className="w-full max-w-md text-center"
                    >
                         <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Sort This Item</div>
                         <div className="text-3xl font-display font-black mb-8 p-8 rounded-2xl bg-secondary/30 border border-border">
                            {CHALLENGE_ITEMS[currentItemIndex].text}
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                             <Button 
                                variant="outline" 
                                size="lg" 
                                className="h-20 text-xl font-bold hover:bg-success/10 hover:text-success hover:border-success/50"
                                onClick={() => handleChoice('Need')}
                             >
                                Need
                             </Button>
                             <Button 
                                variant="outline" 
                                size="lg" 
                                className="h-20 text-xl font-bold hover:bg-warning/10 hover:text-warning hover:border-warning/50"
                                onClick={() => handleChoice('Want')}
                             >
                                Want
                             </Button>
                         </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
};

// Simple Refresh Icon if Lucide RefreshCw fails
const RefreshCw = ({ size, className }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);

export default ArenaPage;
