import { useState, useEffect, useCallback } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gavel, TrendingUp, DollarSign, Trophy, Clock, Zap, AlertCircle, Star,
  Users, Globe, BarChart2, AlertTriangle, Lightbulb, Building2,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface Startup {
  id: number;
  name: string;
  tagline: string;
  sector: string;
  founded: number;
  stage: string;
  teamSize: number;
  hq: string;
  description: string;
  traction: string;
  marketSize: string;
  burnRate: string;
  revenue: string;
  keyRisk: string;
  analystNote: string;
  baseValue: number;
  potential: "🔥 Hot" | "📈 Growing" | "💎 Niche" | "⚡ Volatile";
  minBid: number;
  actualROI: number;
}

const STARTUPS: Startup[] = [
  {
    id: 1,
    name: "GreenLeaf AI",
    tagline: "Carbon credits, simplified.",
    sector: "CleanTech",
    founded: 2022,
    stage: "Series A",
    teamSize: 34,
    hq: "Bengaluru, India",
    description:
      "AI-powered carbon credit marketplace connecting businesses with verified green projects. Uses satellite imagery and ML to validate offsets in real-time, reducing fraud by 90% versus incumbents.",
    traction: "₹4.2Cr ARR • 180+ enterprise clients • 3 govt. partnerships",
    marketSize: "₹1.2L Cr global voluntary carbon market by 2030",
    burnRate: "₹28L/month",
    revenue: "₹4.2 Cr ARR (growing 18% MoM)",
    keyRisk: "Regulatory ambiguity around carbon credit standards in India",
    analystNote: "ESG mandates are accelerating enterprise adoption. Watch for Q3 policy signal.",
    baseValue: 80000,
    potential: "🔥 Hot",
    minBid: 10000,
    actualROI: 3.2,
  },
  {
    id: 2,
    name: "HealthBridge",
    tagline: "Healthcare for Bharat.",
    sector: "HealthTech",
    founded: 2021,
    stage: "Seed+",
    teamSize: 21,
    hq: "Pune, India",
    description:
      "Telemedicine platform serving tier-2 and tier-3 cities with vernacular language support in 12 languages. Built on a hybrid offline-first model ensuring usability in low-connectivity zones.",
    traction: "2.4L consultations • 800+ doctors • 14 states active",
    marketSize: "₹65,000 Cr Indian telehealth market by 2028",
    burnRate: "₹18L/month",
    revenue: "₹1.1 Cr ARR (B2B insurance partnerships)",
    keyRisk: "Doctor retention & trust in AI triage in rural areas",
    analystNote: "Ayushman Bharat integration could 10x their TAM overnight.",
    baseValue: 60000,
    potential: "📈 Growing",
    minBid: 8000,
    actualROI: 2.5,
  },
  {
    id: 3,
    name: "CryptoVault",
    tagline: "DeFi meets discipline.",
    sector: "FinTech / Web3",
    founded: 2023,
    stage: "Pre-Seed",
    teamSize: 9,
    hq: "Dubai, UAE (India ops)",
    description:
      "Decentralized asset management with AI-driven portfolio rebalancing across DeFi protocols. Claims 23% annualised yield. Targets HNIs and crypto-savvy millennials.",
    traction: "₹42Cr AUM • 3,200 active wallets • 0 security breaches",
    marketSize: "Global DeFi TVL projected at $500B+ by 2030",
    burnRate: "₹9L/month",
    revenue: "0.8% mgmt fee on AUM (~₹34L/yr)",
    keyRisk: "High regulatory risk — SEC, SEBI uncertainty on DeFi products",
    analystNote: "Impressive yield claims lack 3rd-party audit. Volatility risk is real.",
    baseValue: 90000,
    potential: "⚡ Volatile",
    minBid: 12000,
    actualROI: 0.6,
  },
  {
    id: 4,
    name: "AgriSense",
    tagline: "Smart farming, real returns.",
    sector: "AgriTech",
    founded: 2020,
    stage: "Series A",
    teamSize: 47,
    hq: "Nagpur, India",
    description:
      "IoT sensors + computer vision + ML to help farmers predict crop disease 14 days in advance and optimize yield by up to 32%. Operates on a SaaS + hardware subscription model.",
    traction: "12,000+ farmers • ₹6.8Cr ARR • 4 state FPO contracts",
    marketSize: "India's precision farming market: ₹18,000 Cr by 2027",
    burnRate: "₹22L/month",
    revenue: "₹6.8 Cr ARR (growing steadily at 11% MoM)",
    keyRisk: "Hardware logistics and last-mile installation at scale",
    analystNote: "Hidden gem. PM-KISAN integration discussions underway — potential breakout.",
    baseValue: 50000,
    potential: "💎 Niche",
    minBid: 6000,
    actualROI: 4.0,
  },
  {
    id: 5,
    name: "EduLoop",
    tagline: "Skills that pay the bills.",
    sector: "EdTech",
    founded: 2022,
    stage: "Seed",
    teamSize: 18,
    hq: "Hyderabad, India",
    description:
      "Adaptive learning platform with gamified skill tracks targeting blue-collar upskilling in manufacturing, retail, and logistics. Courses in 8 vernacular languages, with job placement tie-ups with 40+ employers.",
    traction: "85,000 learners • 60% course completion rate • NPS: 72",
    marketSize: "₹40,000 Cr Indian skilling market by 2026",
    burnRate: "₹14L/month",
    revenue: "₹90L ARR (B2B employer licensing + govt grants)",
    keyRisk: "EdTech sector fatigue post-COVID; reliance on govt scheme funding",
    analystNote: "High completion rate is rare. Employer demand for verified skills is surging.",
    baseValue: 70000,
    potential: "📈 Growing",
    minBid: 9000,
    actualROI: 2.8,
  },
  {
    id: 6,
    name: "DroneFleet",
    tagline: "The sky is the supply chain.",
    sector: "Logistics / DeepTech",
    founded: 2021,
    stage: "Series B",
    teamSize: 112,
    hq: "Delhi NCR, India",
    description:
      "Last-mile drone delivery network targeting rapid grocery, medicine, and document deliveries in urban and peri-urban zones. Holds 3 DGCA Type Certificates — only company with this many in India.",
    traction: "4.2L deliveries • 8 city licenses • Apollo Hospitals partnership",
    marketSize: "India drone economy: ₹90,000 Cr by 2030 (FICCI estimate)",
    burnRate: "₹1.8Cr/month",
    revenue: "₹9.6 Cr ARR (SLA delivery contracts)",
    keyRisk: "High capex; regulatory airspace approvals still evolving",
    analystNote: "Operationally complex but first-mover advantage is very real. Series C incoming.",
    baseValue: 110000,
    potential: "🔥 Hot",
    minBid: 15000,
    actualROI: 1.8,
  },
];

const TOTAL_BUDGET = 200000;
const ROUND_TIMER = 40;

type Phase = "start" | "bidding" | "result";

interface AcquiredAsset {
  startup: Startup;
  bidAmount: number;
}

const potentialColor: Record<string, string> = {
  "🔥 Hot": "text-orange-400",
  "📈 Growing": "text-emerald-400",
  "💎 Niche": "text-purple-400",
  "⚡ Volatile": "text-yellow-400",
};

const stageBg: Record<string, string> = {
  "Pre-Seed": "bg-zinc-700/50 text-zinc-300",
  "Seed": "bg-emerald-900/40 text-emerald-300",
  "Seed+": "bg-emerald-900/40 text-emerald-300",
  "Series A": "bg-blue-900/40 text-blue-300",
  "Series B": "bg-purple-900/40 text-purple-300",
};

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

const BidBonanzaPage = () => {
  const [phase, setPhase] = useState<Phase>("start");
  const [round, setRound] = useState(0);
  const [budget, setBudget] = useState(TOTAL_BUDGET);
  const [bidInput, setBidInput] = useState<string>("");
  const [timer, setTimer] = useState(ROUND_TIMER);
  const [portfolio, setPortfolio] = useState<AcquiredAsset[]>([]);
  const [passed, setPassed] = useState<number[]>([]);
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [lastAction, setLastAction] = useState<"won" | "passed" | "outbid" | null>(null);
  const [shuffledStartups, setShuffledStartups] = useState<Startup[]>([]);

  const currentStartup = shuffledStartups[round];

  useEffect(() => {
    if (phase !== "bidding" || showRoundResult) return;
    if (timer <= 0) { handlePass(true); return; }
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, phase, showRoundResult]);

  const startGame = () => {
    const shuffled = [...STARTUPS].sort(() => Math.random() - 0.5);
    setShuffledStartups(shuffled);
    setBudget(TOTAL_BUDGET);
    setPortfolio([]);
    setPassed([]);
    setRound(0);
    setTimer(ROUND_TIMER);
    setBidInput("");
    setShowRoundResult(false);
    setLastAction(null);
    setPhase("bidding");
  };

  const advanceRound = useCallback(() => {
    const nextRound = round + 1;
    if (nextRound >= STARTUPS.length) {
      setPhase("result");
    } else {
      setRound(nextRound);
      setTimer(ROUND_TIMER);
      setBidInput("");
      setShowRoundResult(false);
      setLastAction(null);
    }
  }, [round]);

  const handleBid = () => {
    const amount = parseInt(bidInput.replace(/,/g, ""), 10);
    if (!amount || isNaN(amount)) { toast.error("Enter a valid bid amount."); return; }
    if (amount < currentStartup.minBid) { toast.error(`Minimum bid is ${fmt(currentStartup.minBid)}`); return; }
    if (amount > budget) { toast.error("Insufficient budget!"); return; }
    const competitorBid = Math.round(currentStartup.minBid * (1.1 + Math.random() * 1.3));
    if (amount <= competitorBid && Math.random() < 0.4) {
      setLastAction("outbid");
      toast.warning(`You were outbid on ${currentStartup.name}! Competitor bid ${fmt(competitorBid)}.`);
    } else {
      setBudget((b) => b - amount);
      setPortfolio((p) => [...p, { startup: currentStartup, bidAmount: amount }]);
      setLastAction("won");
      toast.success(`🎉 You acquired ${currentStartup.name} for ${fmt(amount)}!`);
    }
    setShowRoundResult(true);
    setTimeout(() => advanceRound(), 2000);
  };

  const handlePass = (auto = false) => {
    setPassed((p) => [...p, currentStartup.id]);
    setLastAction("passed");
    if (!auto) toast.info(`Passed on ${currentStartup.name}.`);
    else toast.warning(`⏱ Time's up! Passed on ${currentStartup.name}.`);
    setShowRoundResult(true);
    setTimeout(() => advanceRound(), 1800);
  };

  const totalInvested = portfolio.reduce((s, a) => s + a.bidAmount, 0);
  const portfolioValue = portfolio.reduce((s, a) => s + a.bidAmount * a.startup.actualROI, 0);
  const xpEarned = Math.max(0, Math.round((portfolioValue / TOTAL_BUDGET) * 150));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveResults = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { error: gameError } = await supabase.from('game_results').insert({
        user_id: user.id,
        game_name: 'Bid Bonanza',
        invested_amount: totalInvested,
        final_value: Math.round(portfolioValue),
        xp_earned: xpEarned
      });
      if (gameError) throw gameError;

      const { data: profile } = await supabase.from('profiles').select('xp').eq('id', user.id).single();
      const currentXP = profile?.xp || 0;
      
      const { error: updateError } = await supabase.from('profiles').upsert({ 
        id: user.id,
        xp: currentXP + xpEarned, 
        updated_at: new Date().toISOString() 
      });
      
      if (updateError) throw updateError;
      
      // Also update auth metadata for near-instant sync in some components
      await supabase.auth.updateUser({
        data: { xp: currentXP + xpEarned }
      });
      
      console.log("Successfully saved results and updated XP.");
    } catch (err: any) {
      console.error("Error saving results:", err);
      toast.error("Failed to save game results. XP may not be updated.");
    } finally {
      setIsSubmitting(false);
    }
  }, [totalInvested, portfolioValue, xpEarned]);

  useEffect(() => {
    if (phase === "result") {
      saveResults();
    }
  }, [phase, saveResults]);

  // ─── Render Logic ─────────────────────────────────────────────────────────

  if (phase === "start") {
    return (
      <AppLayout>
        <div className="mx-auto flex max-w-2xl flex-col items-center pt-10 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-5xl">🔨</div>
          <h1 className="mt-6 font-display text-4xl">Bid Bonanza</h1>
          <p className="mt-3 text-muted-foreground max-w-lg">
            You have <span className="text-primary font-semibold">{fmt(TOTAL_BUDGET)}</span> to invest.
            Analyze {STARTUPS.length} startup opportunities and build the highest-value portfolio by bidding smart under time pressure.
          </p>
          <div className="mt-8 grid w-full gap-4 sm:grid-cols-3 text-sm">
            {[
              { icon: Clock, label: "40s per round", sub: "Read details, bid fast" },
              { icon: DollarSign, label: fmt(TOTAL_BUDGET) + " budget", sub: "Manage your capital" },
              { icon: Trophy, label: "Max XP: 300", sub: "Best portfolio wins" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
                <Icon size={20} className="mx-auto mb-2 text-primary" />
                <div className="font-semibold">{label}</div>
                <div className="text-xs text-muted-foreground">{sub}</div>
              </div>
            ))}
          </div>
          <Button size="lg" className="mt-8 px-10 text-base" onClick={startGame}>Start Bidding</Button>
        </div>
      </AppLayout>
    );
  }

  if (phase === "result") {
    return (
      <AppLayout>
        <div className="mx-auto max-w-2xl pt-8 pb-12">
          <div className="text-center">
            <div className="text-5xl">{portfolio.length >= 3 ? "🏆" : portfolio.length >= 1 ? "📊" : "💸"}</div>
            <h1 className="mt-4 font-display text-3xl">Bid Bonanza Complete!</h1>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Acquired", value: portfolio.length, color: "text-primary" },
              { label: "Invested", value: fmt(totalInvested), color: "text-warning" },
              { label: "Portfolio Value", value: fmt(Math.round(portfolioValue)), color: "text-success" },
              { label: "XP Earned", value: xpEarned, color: "text-primary" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
                <div className={`font-mono text-2xl font-bold ${color}`}>{value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
          {portfolio.length > 0 && (
            <div className="mt-6">
              <h2 className="font-display text-lg mb-3">Your Portfolio</h2>
              <div className="space-y-3">
                {portfolio.map(({ startup, bidAmount }) => {
                  const finalValue = Math.round(bidAmount * startup.actualROI);
                  const gain = finalValue - bidAmount;
                  return (
                    <div key={startup.id} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{startup.name}</div>
                          <div className="text-xs text-muted-foreground">{startup.sector} · {startup.stage}</div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="text-muted-foreground">{fmt(bidAmount)} → <span className="font-semibold text-foreground">{fmt(finalValue)}</span></div>
                          <div className={gain >= 0 ? "text-success text-xs" : "text-destructive text-xs"}>
                            {gain >= 0 ? "+" : ""}{fmt(gain)} ({startup.actualROI}x ROI)
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground italic border-t border-border pt-2">
                        💡 {startup.analystNote}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="mt-8 flex gap-3 justify-center">
            <Button onClick={startGame}>Play Again</Button>
            <Button variant="outline" onClick={() => setPhase("start")}>Back</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Fallback: Bidding Screen
  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl pt-4 pb-12">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>Round {round + 1} / {STARTUPS.length}</span>
          <span className="flex items-center gap-1 text-primary font-semibold">
            <DollarSign size={14} /> {fmt(budget)} remaining
          </span>
          <span className={`flex items-center gap-1 font-mono font-bold ${timer <= 10 ? "text-destructive animate-pulse" : ""}`}>
            <Clock size={14} /> {timer}s
          </span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((round + 1) / STARTUPS.length) * 100}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={round}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 space-y-4"
          >
            {/* ── Main card ── */}
            <div className="rounded-2xl border border-border bg-card p-6">
              {/* Title row */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{currentStartup?.sector}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${stageBg[currentStartup?.stage] ?? "bg-zinc-700/50 text-zinc-300"}`}>
                      {currentStartup?.stage}
                    </span>
                  </div>
                  <h2 className="mt-1 font-display text-2xl">{currentStartup?.name}</h2>
                  <p className="text-xs text-muted-foreground italic">{currentStartup?.tagline}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-sm font-semibold ${potentialColor[currentStartup?.potential]}`}>{currentStartup?.potential}</span>
                  <div className="mt-1 text-xs text-muted-foreground">Market Signal</div>
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{currentStartup?.description}</p>

              {/* Meta row */}
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground border-t border-border pt-4">
                <span className="flex items-center gap-1"><Building2 size={11} /> Founded {currentStartup?.founded}</span>
                <span className="flex items-center gap-1"><Users size={11} /> {currentStartup?.teamSize} people</span>
                <span className="flex items-center gap-1"><Globe size={11} /> {currentStartup?.hq}</span>
              </div>

              {/* Metrics grid */}
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  { label: "Est. Valuation", value: fmt(currentStartup?.baseValue), icon: TrendingUp, color: "text-primary" },
                  { label: "Revenue / ARR", value: currentStartup?.revenue?.split(" ")[0], icon: BarChart2, color: "text-success" },
                  { label: "Burn Rate", value: currentStartup?.burnRate, icon: Zap, color: "text-warning" },
                  { label: "Market Size", value: currentStartup?.marketSize?.split(" ").slice(0, 3).join(" ") + "…", icon: Globe, color: "text-blue-400" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="rounded-xl border border-border bg-secondary/30 p-3">
                    <div className={`flex items-center gap-1 text-xs mb-1 ${color}`}><Icon size={11} />{label}</div>
                    <div className="text-sm font-semibold text-foreground">{value}</div>
                  </div>
                ))}
              </div>

              {/* Traction */}
              <div className="mt-4 rounded-xl bg-primary/5 border border-primary/10 p-3">
                <div className="text-xs font-semibold text-primary mb-1 flex items-center gap-1"><Star size={11} /> Traction</div>
                <div className="text-xs text-muted-foreground">{currentStartup?.traction}</div>
              </div>

              {/* Risk + Analyst Note */}
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-destructive/5 border border-destructive/10 p-3">
                  <div className="text-xs font-semibold text-destructive mb-1 flex items-center gap-1"><AlertTriangle size={11} /> Key Risk</div>
                  <div className="text-xs text-muted-foreground">{currentStartup?.keyRisk}</div>
                </div>
                <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/10 p-3">
                  <div className="text-xs font-semibold text-yellow-400 mb-1 flex items-center gap-1"><Lightbulb size={11} /> Analyst Note</div>
                  <div className="text-xs text-muted-foreground">{currentStartup?.analystNote}</div>
                </div>
              </div>

              {/* Financials detail */}
              <div className="mt-3 text-xs text-muted-foreground border-t border-border pt-3">
                <span className="font-medium text-foreground">Revenue detail:</span> {currentStartup?.revenue} &nbsp;|&nbsp;
                <span className="font-medium text-foreground">TAM:</span> {currentStartup?.marketSize}
              </div>
            </div>

            {/* ── Bid input ── */}
            {!showRoundResult ? (
              <div>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                    <input
                      type="number"
                      placeholder={`Min ${fmt(currentStartup?.minBid)}`}
                      value={bidInput}
                      onChange={(e) => setBidInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleBid()}
                      className="w-full rounded-xl border border-border bg-card py-3 pl-8 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-0"
                    />
                  </div>
                  <Button onClick={handleBid} size="lg" className="shrink-0 gap-2" disabled={showRoundResult}>
                    <Gavel size={16} /> Bid
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => handlePass()} className="shrink-0" disabled={showRoundResult}>Pass</Button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[0.25, 0.5, 0.75, 1].map((frac) => {
                    const amt = Math.round(currentStartup?.minBid * (1 + frac));
                    return (
                      <button
                        key={frac}
                        onClick={() => setBidInput(String(amt))}
                        className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs hover:border-primary/40 transition-colors"
                      >
                        {fmt(amt)}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <AlertCircle size={12} />
                  Tip: Bid higher than competitors to secure the deal. Potential is a hint — not a guarantee!
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-border bg-card p-5 text-center"
              >
                {lastAction === "won" && (
                  <><div className="text-3xl">🎉</div><div className="mt-2 font-display text-lg text-success">Deal Acquired!</div><div className="text-sm text-muted-foreground mt-1">Added to your portfolio</div></>
                )}
                {lastAction === "outbid" && (
                  <><div className="text-3xl">😤</div><div className="mt-2 font-display text-lg text-destructive">Outbid!</div><div className="text-sm text-muted-foreground mt-1">A competitor took this deal</div></>
                )}
                {lastAction === "passed" && (
                  <><div className="text-3xl">⏭️</div><div className="mt-2 font-display text-lg text-muted-foreground">Passed</div><div className="text-sm text-muted-foreground mt-1">Moving to next opportunity…</div></>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Mini portfolio strip */}
        {portfolio.length > 0 && (
          <div className="mt-5 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground mb-2">
              <Star size={12} className="text-primary" /> Portfolio ({portfolio.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {portfolio.map(({ startup, bidAmount }) => (
                <span key={startup.id} className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs text-primary font-medium">
                  {startup.name} · {fmt(bidAmount)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default BidBonanzaPage;
