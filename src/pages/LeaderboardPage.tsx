import AppLayout from "@/components/layout/AppLayout";
import { leaderboardUsers, currentUser } from "@/data/mockData";
import { useState } from "react";
import { Crown, Medal } from "lucide-react";
import { motion } from "framer-motion";

const tabs = ["Weekly", "Monthly", "All-time"];

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState("Weekly");

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-3xl">Leaderboard</h1>

        <div className="mt-6 flex gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${activeTab === t ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Top 3 */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[1, 0, 2].map((idx) => {
            const u = leaderboardUsers[idx];
            const isFirst = u.rank === 1;
            return (
              <motion.div
                key={u.rank}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex flex-col items-center rounded-xl border bg-card p-5 text-center ${isFirst ? "gold-border-top border-primary/30 gold-glow" : "border-border"} ${isFirst ? "order-first sm:order-none" : ""}`}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold ${isFirst ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                  {u.avatar}
                </div>
                <div className="mt-3 font-display text-lg">{u.name}</div>
                <div className="text-xs text-muted-foreground">{u.city}</div>
                <div className="mt-2 font-mono text-xl font-bold text-primary">{u.xp.toLocaleString()} XP</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {u.rank === 1 ? "🥇" : u.rank === 2 ? "🥈" : "🥉"} Rank #{u.rank}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Full table */}
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
          <div className="grid grid-cols-[3rem_1fr_5rem_5rem_5rem] gap-2 border-b border-border px-4 py-3 text-xs text-muted-foreground">
            <span>#</span>
            <span>Player</span>
            <span className="text-right">XP</span>
            <span className="text-right">Badges</span>
            <span className="text-right">Games</span>
          </div>
          {leaderboardUsers.map((u) => (
            <div key={u.rank} className="grid grid-cols-[3rem_1fr_5rem_5rem_5rem] items-center gap-2 border-b border-border px-4 py-3 last:border-0">
              <span className="font-mono text-sm text-muted-foreground">{u.rank}</span>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs">{u.avatar}</div>
                <div>
                  <span className="text-sm font-medium">{u.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{u.city}</span>
                </div>
              </div>
              <span className="text-right font-mono text-sm">{u.xp.toLocaleString()}</span>
              <span className="text-right font-mono text-sm">{u.badges}</span>
              <span className="text-right font-mono text-sm">{u.gamesPlayed}</span>
            </div>
          ))}
          {/* Current user */}
          <div className="grid grid-cols-[3rem_1fr_5rem_5rem_5rem] items-center gap-2 border-t-2 border-primary/30 bg-primary/5 px-4 py-3">
            <span className="font-mono text-sm">{currentUser.rank}</span>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{currentUser.avatar}</div>
              <span className="text-sm font-medium text-primary">You</span>
            </div>
            <span className="text-right font-mono text-sm">{currentUser.xp.toLocaleString()}</span>
            <span className="text-right font-mono text-sm">3</span>
            <span className="text-right font-mono text-sm">{currentUser.gamesPlayed}</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LeaderboardPage;
