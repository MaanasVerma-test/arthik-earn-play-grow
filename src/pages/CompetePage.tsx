import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { competitions } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, Trophy, Zap, Swords, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { multiplayerService } from "@/lib/multiplayerService";
import { supabase } from "@/lib/supabase";

const CompetePage = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("Player");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        setUsername(session.user.email?.split('@')[0] || "Player");
      }
    });
  }, []);

  const handleFindMatch = async () => {
    let currentId = userId;
    let currentName = username;

    if (!currentId) {
      currentId = `guest_${Math.random().toString(36).substr(2, 9)}`;
      currentName = `Guest_${Math.random().toString(36).substr(2, 4)}`;
    }

    setIsSearching(true);
    
    await multiplayerService.findMatch(currentId, currentName, (match) => {
        setIsSearching(false);
        toast.success("Match Found! Entering Arena...");
        setTimeout(() => {
            navigate(`/compete/arena/${match.id}?guest=true&name=${currentName}&id=${currentId}`);
        }, 1500);
    });
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="font-display text-3xl">Competitions</h1>
                <p className="mt-1 text-muted-foreground">Join tournaments and compete for XP and rare badges</p>
            </div>
            
            <Button 
                size="lg" 
                onClick={handleFindMatch}
                disabled={isSearching}
                className="gap-2 h-14 px-8 text-lg font-bold shadow-xl transition-all hover:scale-105"
            >
                {isSearching ? <Loader2 className="animate-spin" /> : <Swords size={20} />}
                {isSearching ? "Searching..." : "Find Live Match"}
            </Button>
        </div>

        <AnimatePresence>
            {isSearching && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center"
                >
                    <div className="relative">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <Swords className="absolute inset-0 m-auto h-5 w-5 text-primary opacity-50" />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-bold">Scanning for Opponents...</h3>
                    <p className="text-sm text-muted-foreground">Looking for a challenger in your skill bracket</p>
                    <div className="mt-4 flex gap-1">
                        {[1, 2, 3].map((i) => (
                            <motion.div 
                                key={i}
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                className="h-2 w-2 rounded-full bg-primary"
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <h2 className="mt-10 font-display text-xl">Ongoing Tournaments</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {competitions.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="gold-border-top rounded-xl border border-border bg-card p-5"
            >
              <h3 className="font-display text-lg">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.gameType}</p>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(c.startDate).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
                  {" at "}
                  {new Date(c.startDate).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </div>
                <div className="flex items-center gap-2">
                  <Trophy size={14} className="text-primary" />
                  {c.prize}
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} />
                  {c.entryCount} participants
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => toast.info(`Tournament registration starts soon!`)}
              >
                Register
              </Button>
            </motion.div>
          ))}
        </div>

        <h2 className="mt-10 font-display text-xl">Past Competitions</h2>
        <div className="mt-4 rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
          No past competitions yet. Stay tuned!
        </div>
      </div>
    </AppLayout>
  );
};

export default CompetePage;

