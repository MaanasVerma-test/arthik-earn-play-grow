import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { currentUser as mockUser, getUserLevel, learningModules, leaderboardUsers } from "@/data/mockData";
import { Flame, Trophy, Award, TrendingUp, BookOpen, Gamepad2, History, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { secureService, ActivityLog } from "@/lib/secureService";

const DashboardPage = () => {
  const [user, setUser] = useState(mockUser);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        // Fetch Profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profile) {
          setUser({
            ...mockUser,
            name: profile.full_name || authUser.email?.split('@')[0] || "Trader",
            xp: profile.xp || 0,
            streak: profile.streak_days || 0,
          });
        }

        // Fetch Recent Activity
        const recentLogs = await secureService.getRecentActivity();
        setActivities(recentLogs);
      }
      setLoading(false);
    };

    fetchProfileData();
  }, []);

  const level = getUserLevel(user.xp);
  const xpProgress = ((user.xp - level.minXP) / (level.maxXP - level.minXP)) * 100;
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
              <h1 className="font-display text-2xl">Welcome back, {user.name.split(" ")[0]}</h1>
              <p className="mt-1 text-muted-foreground">Level {level.level} — {level.title}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame size={18} className="text-warning" />
              <span className="font-mono text-lg font-bold">{user.streak} day streak</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Level {level.level}</span>
              <span className="font-mono">{user.xp.toLocaleString()} / {level.maxXP.toLocaleString()} XP</span>
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

        {/* Quick stats grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total XP", value: user.xp.toLocaleString(), icon: TrendingUp },
            { label: "Badges", value: "3", icon: Award },
            { label: "Rank", value: `#${user.rank}`, icon: Trophy },
            { label: "Streak", value: `${user.streak} days`, icon: Flame },
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
           {/* Recent Activity */}
           <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <History size={16} />
                <span className="text-sm font-medium">Recent Activity</span>
              </div>
            </div>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity, i) => (
                  <div key={activity.id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Zap size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.details}</p>
                        <p className="text-xs text-muted-foreground">{new Date(activity.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-success">+{activity.xp_earned} XP</span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <p>No recent activity found.</p>
                  <p className="text-xs mt-1">Play games to earn XP and track history!</p>
                </div>
              )}
            </div>
          </motion.div>

          <div className="space-y-6">
            {/* Today's Challenge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="gold-border-top rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Gamepad2 size={16} />
                <span className="text-sm font-medium">Today's Challenge</span>
              </div>
              <h3 className="mt-3 font-display text-lg">Portfolio Builder</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Master the art of 10-year asset allocation and earn points.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-sm text-primary">+100 XP</span>
                <Button size="sm" asChild>
                  <Link to="/games/portfolio-builder">Play Now</Link>
                </Button>
              </div>
            </motion.div>

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
                  <span className="text-sm font-medium">Global Rankings</span>
                </div>
                <Link to="/leaderboard" className="text-xs text-primary hover:underline">View all</Link>
              </div>
              <div className="mt-4 space-y-2">
                {leaderboardUsers.slice(0, 3).map((u) => (
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
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
