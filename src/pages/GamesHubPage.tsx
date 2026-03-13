import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TrendingUp, Wallet, HelpCircle, PieChart, Users, Clock, Zap } from "lucide-react";

const games = [
  { icon: TrendingUp, title: "Stock Market Simulator", desc: "Trade with virtual ₹1,00,000 using real historical data. Build your portfolio and maximize returns.", difficulty: "Medium", xp: "100-200", time: "15-20 min", players: 1245, link: "/games/stock-simulator" },
  { icon: Wallet, title: "Budget Challenge", desc: "Given a monthly salary and random life events — make smart decisions to survive and grow savings.", difficulty: "Easy", xp: "80-150", time: "10-15 min", players: 892, link: "/games" },
  { icon: HelpCircle, title: "Financial Trivia", desc: "Test your finance knowledge with timed Q&A. Play solo or challenge friends.", difficulty: "Easy", xp: "50-100", time: "5-8 min", players: 2341, link: "/games/trivia" },
  { icon: PieChart, title: "Portfolio Builder", desc: "Allocate across equity, debt, gold, and real estate. Simulate 10-year returns.", difficulty: "Hard", xp: "150-250", time: "20-25 min", players: 567, link: "/games" },
];

const diffColor: Record<string, string> = { Easy: "text-common", Medium: "text-warning", Hard: "text-destructive" };

const GamesHubPage = () => (
  <AppLayout>
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl">Games</h1>
      <p className="mt-1 text-muted-foreground">Learn by doing — pick a game and earn XP</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {games.map((g, i) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={g.link}
              className="gold-border-top block rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <g.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl">{g.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{g.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className={diffColor[g.difficulty]}>{g.difficulty}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {g.time}</span>
                    <span className="flex items-center gap-1"><Zap size={12} className="text-primary" /> {g.xp} XP</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {g.players.toLocaleString()} today</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </AppLayout>
);

export default GamesHubPage;
