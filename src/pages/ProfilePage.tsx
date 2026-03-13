import AppLayout from "@/components/layout/AppLayout";
import { currentUser, getUserLevel, badges } from "@/data/mockData";
import { motion } from "framer-motion";
import { Calendar, Gamepad2, BookOpen, Trophy, Flame } from "lucide-react";

const rarityColor: Record<string, string> = {
  Common: "border-common/40 text-common",
  Rare: "border-rare/40 text-rare",
  Epic: "border-epic/40 text-epic",
  Legendary: "border-legendary/40 text-legendary",
};
const rarityBg: Record<string, string> = {
  Common: "bg-common/10",
  Rare: "bg-rare/10",
  Epic: "bg-epic/10",
  Legendary: "bg-legendary/10",
};

const ProfilePage = () => {
  const level = getUserLevel(currentUser.xp);
  const xpProgress = ((currentUser.xp - level.minXP) / (level.maxXP - level.minXP)) * 100;

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="gold-border-top rounded-xl border border-border bg-card p-6"
        >
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {currentUser.avatar}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="font-display text-2xl">{currentUser.name}</h1>
              <p className="text-muted-foreground">{currentUser.role} • {currentUser.city}</p>
              <div className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-foreground sm:justify-start">
                <Calendar size={14} /> Joined {new Date(currentUser.joinDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
              </div>
            </div>
            <div className="sm:ml-auto text-center">
              <div className="font-mono text-3xl font-bold text-primary">{currentUser.xp.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Level {level.level} — {level.title}</div>
              <div className="mt-2 h-2 w-40 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary" style={{ width: `${xpProgress}%` }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Modules Completed", value: currentUser.modulesCompleted, icon: BookOpen },
            { label: "Games Played", value: currentUser.gamesPlayed, icon: Gamepad2 },
            { label: "Tournaments Won", value: currentUser.tournamentsWon, icon: Trophy },
            { label: "Longest Streak", value: `${currentUser.streak} days`, icon: Flame },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4">
              <s.icon size={16} className="text-muted-foreground" />
              <div className="mt-2 font-mono text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <h2 className="mt-8 font-display text-2xl">Badges</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {badges.map((b) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex flex-col items-center rounded-xl border bg-card p-4 text-center ${b.earned ? rarityColor[b.rarity] : "border-border opacity-40 grayscale"}`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full text-xl ${b.earned ? rarityBg[b.rarity] : "bg-secondary"}`}>
                {b.icon}
              </div>
              <h4 className="mt-2 text-sm font-medium text-foreground">{b.name}</h4>
              <span className="text-xs text-muted-foreground">{b.description}</span>
              <span className={`mt-1 text-xs ${b.earned ? rarityColor[b.rarity] : "text-muted-foreground"}`}>
                {b.rarity} {!b.earned && "• Locked"}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
