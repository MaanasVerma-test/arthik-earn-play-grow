import { useState, useMemo } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { simulatePortfolio, ratePortfolio, PortfolioAllocation, SimulationYear } from "@/lib/portfolioLogic";
import { toast } from "sonner";
import { TrendingUp, PieChart, ShieldCheck, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const INITIAL_INVESTMENT = 1000000; // ₹10,00,000

const PortfolioBuilderPage = () => {
  // Setup State
  const [allocation, setAllocation] = useState<PortfolioAllocation>({
    Equity: 50,
    Debt: 30,
    Gold: 10,
    RealEstate: 10
  });

  // Game State
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<{
    data: SimulationYear[];
    score: number;
    feedback: string[];
  } | null>(null);

  // Derived State
  const totalAllocated = useMemo(() => {
    return allocation.Equity + allocation.Debt + allocation.Gold + allocation.RealEstate;
  }, [allocation]);

  // Handlers
  const handleSliderChange = (asset: keyof PortfolioAllocation, value: number) => {
    setAllocation(prev => {
        const newAlloc = { ...prev, [asset]: value };
        const newTotal = Object.values(newAlloc).reduce((a, b) => a + b, 0);
        
        // Don't allow going over 100%
        if (newTotal > 100) {
            return prev;
        }
        return newAlloc;
    });
  };

  const runSimulation = () => {
    if (totalAllocated !== 100) {
      toast.error("Please allocate exactly 100% of your funds.");
      return;
    }

    setIsSimulating(true);
    setResults(null);

    // Fake delay for dramatic effect
    setTimeout(async () => {
      const simData = simulatePortfolio(INITIAL_INVESTMENT, allocation);
      const rating = ratePortfolio(allocation);
      
      setResults({
        data: simData,
        ...rating
      });
      setIsSimulating(false);
      
      // Award XP
      try {
          const { data: session } = await supabase.auth.getSession();
          if (session.session?.user && rating.score >= 5) {
              const { data: profile } = await supabase.from('profiles').select('xp').eq('id', session.session.user.id).single();
              await supabase.from('profiles').update({ xp: (profile?.xp || 0) + 100 }).eq('id', session.session.user.id);
              toast.success("Simulation Complete! +100 XP awarded.");
          }
      } catch (e) {
          console.error("XP not awarded", e);
      }
    }, 1500);
  };

  const finalValue = results ? results.data[results.data.length - 1].value : INITIAL_INVESTMENT;
  const totalReturnPercent = ((finalValue - INITIAL_INVESTMENT) / INITIAL_INVESTMENT) * 100;

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="font-display text-4xl mb-2">Portfolio Builder</h1>
          <p className="text-muted-foreground text-lg">
            Allocate ₹10,00,000 across 4 major asset classes. We'll simulate 10 years of market volatility and rate your strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Controls */}
            <div className="lg:col-span-5 space-y-6">
                <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-display text-xl">Allocation</h2>
                        <Badge variant={totalAllocated === 100 ? "default" : "destructive"}>
                            {totalAllocated}% Allocated
                        </Badge>
                    </div>

                    <div className="space-y-8">
                        {/* Equity Slider */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="font-bold flex items-center gap-2">
                                    <TrendingUp size={16} className="text-blue-500"/> Equity
                                </span>
                                <span className="font-mono bg-secondary px-2 py-0.5 rounded">{allocation.Equity}%</span>
                            </div>
                            <Slider 
                                value={[allocation.Equity]} 
                                max={100} 
                                step={5}
                                onValueChange={(val) => handleSliderChange('Equity', val[0])}
                                className="[&>[role=slider]]:border-blue-500 [&>[data-state=active]]:bg-blue-500"
                            />
                            <p className="text-xs text-muted-foreground mt-1 text-right">High Risk, High Return (12-15%)</p>
                        </div>

                        {/* Debt Slider */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="font-bold flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-green-500"/> Debt
                                </span>
                                <span className="font-mono bg-secondary px-2 py-0.5 rounded">{allocation.Debt}%</span>
                            </div>
                            <Slider 
                                value={[allocation.Debt]} 
                                max={100} 
                                step={5}
                                onValueChange={(val) => handleSliderChange('Debt', val[0])}
                                className="[&>[role=slider]]:border-green-500 [&>[data-state=active]]:bg-green-500"
                            />
                            <p className="text-xs text-muted-foreground mt-1 text-right">Low Risk, Stable Return (6-8%)</p>
                        </div>

                        {/* Gold Slider */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="font-bold flex items-center gap-2">
                                    <PieChart size={16} className="text-yellow-500"/> Gold
                                </span>
                                <span className="font-mono bg-secondary px-2 py-0.5 rounded">{allocation.Gold}%</span>
                            </div>
                            <Slider 
                                value={[allocation.Gold]} 
                                max={100} 
                                step={5}
                                onValueChange={(val) => handleSliderChange('Gold', val[0])}
                                className="[&>[role=slider]]:border-yellow-500 [&>[data-state=active]]:bg-yellow-500"
                            />
                            <p className="text-xs text-muted-foreground mt-1 text-right">Inflation Hedge (8-10%)</p>
                        </div>

                        {/* Real Estate Slider */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="font-bold flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> 
                                    Real Estate
                                </span>
                                <span className="font-mono bg-secondary px-2 py-0.5 rounded">{allocation.RealEstate}%</span>
                            </div>
                            <Slider 
                                value={[allocation.RealEstate]} 
                                max={100} 
                                step={5}
                                onValueChange={(val) => handleSliderChange('RealEstate', val[0])}
                                className="[&>[role=slider]]:border-purple-500 [&>[data-state=active]]:bg-purple-500"
                            />
                             <p className="text-xs text-muted-foreground mt-1 text-right">Illiquid, Moderate Risk (9-11%)</p>
                        </div>
                    </div>

                    <Button 
                        size="lg" 
                        className="w-full mt-8 h-12 text-lg font-bold transition-all hover:scale-[1.02]"
                        onClick={runSimulation}
                        disabled={isSimulating || totalAllocated !== 100}
                    >
                        {isSimulating ? "Fast-Forwarding 10 Years..." : "Simulate 10 Years"}
                    </Button>
                    
                    {totalAllocated !== 100 && (
                         <p className="text-xs text-destructive text-center mt-2 flex justify-center items-center gap-1">
                             <AlertTriangle size={12}/> You have {100 - totalAllocated}% remaining to allocate.
                         </p>
                    )}
                </div>
            </div>

            {/* Right Column: Visualization & Results */}
            <div className="lg:col-span-7 space-y-6">
                
                {/* Chart Area */}
                <div className="p-6 rounded-2xl border border-border bg-card shadow-sm h-[400px] flex flex-col">
                    <h2 className="font-display text-xl mb-4">10-Year Growth Trajectory</h2>
                    
                    {results ? (
                        <div className="flex-1 w-full h-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={results.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis 
                                        dataKey="year" 
                                        tickFormatter={(val) => `Yr ${val}`}
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis 
                                        tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dx={-10}
                                    />
                                    <Tooltip 
                                        formatter={(value: number) => [`₹${Intl.NumberFormat('en-IN').format(Math.round(value))}`, 'Total Value']}
                                        labelFormatter={(label) => `Year ${label}`}
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                            {isSimulating ? (
                                <div className="animate-pulse flex flex-col items-center">
                                    <TrendingUp size={48} className="mb-4 text-primary opacity-50" />
                                    <p className="font-display">Crunching Market Data...</p>
                                </div>
                            ) : (
                                <>
                                    <PieChart size={48} className="mb-4 opacity-20" />
                                    <p>Allocate funds and run simulation to see projection.</p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Score & Feedback */}
                {results && (
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl border border-border bg-card shadow-sm"
                     >
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* Score Box */}
                            <div className="flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-xl border border-border/50">
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Portfolio Rating</p>
                                <div className="text-6xl font-display font-black text-primary">
                                    {results.score}<span className="text-3xl text-muted-foreground">/10</span>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-xs text-muted-foreground">Absolute Return</p>
                                    <p className={`font-mono font-bold text-lg ${totalReturnPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                                        {totalReturnPercent >= 0 ? '+' : ''}{totalReturnPercent.toFixed(1)}%
                                    </p>
                                    <p className="font-mono text-sm">₹{Intl.NumberFormat('en-IN').format(Math.round(finalValue))}</p>
                                </div>
                            </div>

                            {/* Feedback List */}
                            <div className="md:col-span-2 flex flex-col justify-center">
                                <h3 className="font-display text-lg mb-4 flex items-center gap-2">
                                    <TrendingUp size={18} /> Financial Analysis
                                </h3>
                                <ul className="space-y-3">
                                    {results.feedback.map((msg, i) => (
                                        <li key={i} className="text-sm border-l-2 border-primary/50 pl-3 py-1 flex items-start gap-2">
                                            <span className="leading-relaxed">{msg}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                         </div>
                     </motion.div>
                )}
            </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default PortfolioBuilderPage;
