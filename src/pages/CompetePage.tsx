import AppLayout from "@/components/layout/AppLayout";
import { competitions } from "@/data/mockData";
import { motion } from "framer-motion";
import { Calendar, Users, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CompetePage = () => (
  <AppLayout>
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl">Competitions</h1>
      <p className="mt-1 text-muted-foreground">Join tournaments and compete for XP and rare badges</p>

      <h2 className="mt-8 font-display text-xl">Upcoming</h2>
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
              className="mt-4 w-full"
              onClick={() => toast.success(`Joined ${c.name}!`)}
            >
              Join Competition
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

export default CompetePage;
