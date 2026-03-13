import AppLayout from "@/components/layout/AppLayout";
import { currentUser, getUserLevel, leaderboardUsers, learningModules } from "@/data/mockData";
import { Flame, Trophy, Award, TrendingUp, BookOpen, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  const level = getUserLevel(currentUser.xp);
  const xpProgress = ((currentUser.xp - level.minXP) / (level.maxXP - level.minXP)) * 100;
  const lastModule = learningModules[0];

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="gold-border-top rounded-xl border border-border bg-card p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl">Welcome back, {currentUser.name.split(" ")[0]}</h1>
              <p className="mt-1 text-muted-foreground">Level {level.level} — {level.title}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame size={18} className="text-warning" />
              <span className="font-mono text-lg font-bold">{currentUser.streak} day streak</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Level {level.level}</span>
              <span className="font-mono">{currentUser.xp.toLocaleString()} / {level.maxXP.toLocaleString()} XP</span>
            </div>
            <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-primary"
              />
            </div>
          </div>
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total XP", value: currentUser.xp.toLocaleString(), icon: TrendingUp },
            { label: "Badges", value: "3", icon: Award },
            { label: "Rank", value: `#${currentUser.rank}`, icon: Trophy },
            { label: "Streak", value: `${currentUser.streak} days`, icon: Flame },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <s.icon size={16} className="text-muted-foreground" />
              <div className="mt-2 font-mono text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Continue Learning */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen size={16} />
              <span className="text-sm font-medium">Continue Learning</span>
            </div>
            <h3 className="mt-3 font-display text-lg">{lastModule.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{lastModule.description}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-1/4 rounded-full bg-primary" />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">25% complete</span>
              <Button size="sm" variant="outline" asChild>
                <Link to="/learn">Resume</Link>
              </Button>
            </div>
          </motion.div>

          {/* Today's Challenge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="gold-border-top rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Gamepad2 size={16} />
              <span className="text-sm font-medium">Today's Challenge</span>
            </div>
            <h3 className="mt-3 font-display text-lg">Financial Trivia</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Answer 10 questions about investing basics and earn up to 100 XP.
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-sm text-primary">+100 XP</span>
              <Button size="sm" asChild>
                <Link to="/games/trivia">Play Now</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Mini Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Trophy size={16} />
              <span className="text-sm font-medium">Leaderboard</span>
            </div>
            <Link to="/leaderboard" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="mt-4 space-y-2">
            {leaderboardUsers.slice(0, 5).map((u) => (
              <div key={u.rank} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-secondary/50">
                <div className="flex items-center gap-3">
                  <span className="w-6 font-mono text-sm text-muted-foreground">{u.rank}</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs">{u.avatar}</div>
                  <span className="text-sm">{u.name}</span>
                </div>
                <span className="font-mono text-sm text-muted-foreground">{u.xp.toLocaleString()} XP</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
