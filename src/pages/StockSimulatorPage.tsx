import { useState, useCallback, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { mockStocks } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, TrendingUp, TrendingDown, Activity, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fetchLiveQuote, fetchHistoricalData, StockQuote, ChartDataPoint, TimeRange } from "@/lib/stockApi";

interface Holding {
  symbol: string;
  qty: number;
  avgPrice: number;
}

const TIME_RANGES: TimeRange[] = ['1D', '5D', '15D', '1M', '5M', '1Y'];

const StockSimulatorPage = () => {
  const [cash, setCash] = useState(100000);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [search, setSearch] = useState("");
  const [qty, setQty] = useState(1);
  
  // Real-time Data State
  const [selectedSymbol, setSelectedSymbol] = useState(mockStocks[0].symbol);
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const [livePrices, setLivePrices] = useState<Record<string, StockQuote>>({});
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Derive static info from mock list
  const filteredStockDefs = mockStocks.filter(
    (s) => s.symbol.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase())
  );
  
  const selectedDef = mockStocks.find(s => s.symbol === selectedSymbol) || mockStocks[0];
  const activeQuote = livePrices[selectedSymbol];

  const fetchCurrentQuote = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const q = await fetchLiveQuote(selectedSymbol);
      setLivePrices(prev => ({ ...prev, [q.symbol]: q }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedSymbol]);

  // Load Historical data when selected stock or time range changes
  useEffect(() => {
    let mounted = true;
    const loadChart = async () => {
      setIsChartLoading(true);
      const data = await fetchHistoricalData(selectedSymbol, timeRange);
      if (mounted) {
        setChartData(data);
        setIsChartLoading(false);
      }
    };
    loadChart();
    return () => { mounted = false; };
  }, [selectedSymbol, timeRange]);

  // Initial fetch for the active stock
  useEffect(() => {
    fetchCurrentQuote();
    // Intentionally removed the 15-second polling loop as Alpha Vantage free tier 
    // limits to 25 requests PER DAY. Active polling burns through the quota instantly.
  }, [fetchCurrentQuote]);


  const buy = useCallback(() => {
    if (!activeQuote) return;
    const cost = activeQuote.price * qty;
    if (cost > cash) { toast.error("Insufficient funds"); return; }
    
    setCash((c) => c - cost);
    setHoldings((prev) => {
      const existing = prev.find((h) => h.symbol === selectedSymbol);
      if (existing) {
        const newQty = existing.qty + qty;
        const newAvg = ((existing.avgPrice * existing.qty) + cost) / newQty;
        return prev.map((h) => h.symbol === selectedSymbol ? { ...h, qty: newQty, avgPrice: newAvg } : h);
      }
      return [...prev, { symbol: selectedSymbol, qty, avgPrice: activeQuote.price }];
    });
    toast.success(`Bought ${qty} ${selectedSymbol} at ₹${activeQuote.price.toFixed(2)}`);
  }, [selectedSymbol, activeQuote, qty, cash]);

  const sell = useCallback((symbol: string) => {
    const holding = holdings.find((h) => h.symbol === symbol);
    if (!holding) return;
    
    const currentPrice = livePrices[symbol]?.price || mockStocks.find(s=>s.symbol===symbol)?.price || holding.avgPrice;
    
    setCash((c) => c + currentPrice * holding.qty);
    setHoldings((prev) => prev.filter((h) => h.symbol !== symbol));
    toast.success(`Sold all ${symbol} at ₹${currentPrice.toFixed(2)}`);
  }, [holdings, livePrices]);

  // Dynamic Portfolio Calculations
  const portfolioValue = holdings.reduce((sum, h) => {
    const currentPrice = livePrices[h.symbol]?.price || mockStocks.find(s => s.symbol === h.symbol)?.price || h.avgPrice;
    return sum + currentPrice * h.qty;
  }, 0);

  const totalValue = cash + portfolioValue;
  const pnl = totalValue - 100000;
  const pnlPct = ((pnl / 100000) * 100).toFixed(2);

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="font-display text-3xl flex items-center gap-3">
                    Stock Market Simulator
                    {activeQuote?.isMock === false && (
                    <span className="flex items-center gap-1 rounded-full bg-success/20 px-2 py-0.5 text-xs font-semibold text-success border border-success/30">
                        <Activity size={12} className="animate-pulse" /> Live Market Data
                    </span>
                    )}
                    {activeQuote?.isMock && (
                    <span className="flex items-center gap-1 rounded-full bg-warning/20 px-2 py-0.5 text-xs font-semibold text-warning border border-warning/30">
                        <Activity size={12} /> Live API Limit Reached (Using Simulator)
                    </span>
                    )}
                </h1>
                <p className="mt-1 text-muted-foreground">Trade with virtual ₹1,00,000 using real-time quotes (Max 25 API hits/day)</p>
            </div>
            
            <Button variant="outline" size="sm" onClick={fetchCurrentQuote} disabled={isRefreshing} className="hidden sm:flex">
                <RefreshCw size={14} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh Quote
            </Button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <span className="text-xs text-muted-foreground">Cash</span>
            <div className="mt-1 font-mono text-xl font-bold">₹{cash.toLocaleString("en-IN", { minimumFractionDigits: 0 })}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden">
            <span className="text-xs text-muted-foreground">Portfolio</span>
            <div className="mt-1 font-mono text-xl font-bold">₹{portfolioValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            {portfolioValue > 0 && <div className="absolute right-0 top-0 h-full w-1 animate-pulse bg-primary/20" />}
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <span className="text-xs text-muted-foreground">Total Equity</span>
            <div className="mt-1 font-mono text-xl font-bold">₹{totalValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <span className="text-xs text-muted-foreground">Unrealized P&L</span>
            <div className={`mt-1 font-mono text-xl font-bold ${pnl >= 0 ? "text-success" : "text-destructive"}`}>
              {pnl >= 0 ? "+" : ""}₹{Math.abs(pnl).toLocaleString("en-IN", { minimumFractionDigits: 0 })} ({pnlPct}%)
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Stock list */}
          <div className="rounded-xl border border-border bg-card p-4 lg:col-span-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Indian stocks..."
                className="bg-secondary pl-9"
              />
            </div>
            <div className="mt-3 max-h-[500px] space-y-1 overflow-y-auto pr-1 custom-scrollbar">
              {filteredStockDefs.map((s) => {
                const quote = livePrices[s.symbol];
                const price = quote ? quote.price : s.price;
                const change = quote ? quote.changePercent : s.change;
                const isPositive = change >= 0;

                return (
                 <button
                   key={s.symbol}
                   onClick={() => setSelectedSymbol(s.symbol)}
                   className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition-all ${selectedSymbol === s.symbol ? "bg-primary/10 border border-primary/20" : "hover:bg-secondary border border-transparent"}`}
                 >
                   <div>
                     <div className="font-mono text-sm font-bold">{s.symbol}</div>
                     <div className="text-xs text-muted-foreground truncate w-32">{s.name}</div>
                   </div>
                   <div className="text-right">
                     <div className={`font-mono text-sm font-semibold ${quote && !quote.isMock ? "text-primary" : ""}`}>
                         ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                     </div>
                     <div className={`text-xs flex items-center justify-end gap-1 ${isPositive ? "text-success" : "text-destructive"}`}>
                       {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                       {isPositive ? "+" : ""}{change.toFixed(2)}%
                     </div>
                   </div>
                 </button>
                );
              })}
            </div>
          </div>

          {/* Chart + Buy */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-mono text-2xl font-bold flex items-center gap-2">
                      {selectedSymbol}
                  </h3>
                  <p className="text-sm text-muted-foreground">{selectedDef.name} &bull; {selectedDef.sector}</p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-3xl font-bold animate-in fade-in slide-in-from-bottom-2 flex justify-end gap-2 items-end">
                      ₹{activeQuote ? activeQuote.price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : "Loading..."}
                   </div>
                  {activeQuote && (
                    <div className={`flex items-center justify-end gap-1 text-sm font-medium mt-1 ${activeQuote.change >= 0 ? "text-success" : "text-destructive"}`}>
                        {activeQuote.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {activeQuote.change >= 0 ? "+" : ""}
                        ₹{Math.abs(activeQuote.change).toFixed(2)} ({activeQuote.changePercent.toFixed(2)}%)
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                  {TIME_RANGES.map((range) => (
                      <button
                          key={range}
                          onClick={() => setTimeRange(range)}
                          className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${timeRange === range ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}
                      >
                          {range}
                      </button>
                  ))}
              </div>

              <div className="mt-6 h-[250px] relative">
                {isChartLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm z-10 rounded-lg">
                        <RefreshCw size={24} className="animate-spin text-primary" />
                    </div>
                ) : null}
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(216 18% 62%)" }} stroke="hsl(216 18% 62%)" axisLine={false} tickLine={false} minTickGap={20} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(216 18% 62%)" }} stroke="hsl(216 18% 62%)" domain={['auto', 'auto']} axisLine={false} tickLine={false} width={40} />
                    <Tooltip
                      contentStyle={{ background: "hsl(220 40% 10%)", border: "1px solid hsl(218 20% 18%)", borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: "hsl(216 18% 62%)", marginBottom: 4 }}
                      itemStyle={{ color: "hsl(42 52% 54%)", fontWeight: "bold" }}
                      formatter={(val: number) => [`₹${val.toFixed(2)}`, "Close"]}
                    />
                    <Line type="monotone" dataKey="price" stroke="hsl(42 52% 54%)" strokeWidth={2.5} dot={false} activeDot={{ r: 6, fill: "hsl(42 52% 54%)", stroke: "hsl(220 40% 10%)", strokeWidth: 2 }} animationDuration={500} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Buy panel */}
                <div className="rounded-xl border border-border bg-card p-5">
                <h4 className="text-sm font-semibold flex items-center justify-between">
                    Market Order 
                    <span className="text-xs font-normal text-muted-foreground">Available: ₹{cash.toLocaleString("en-IN")}</span>
                </h4>
                <div className="mt-4 flex flex-col gap-4">
                    <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Quantity (Shares)</label>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1}>-</Button>
                        <Input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} className="bg-secondary text-center font-mono" />
                        <Button variant="outline" size="icon" onClick={() => setQty(qty + 1)}>+</Button>
                    </div>
                    </div>
                    <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Estimated Cost:</span>
                        <span className="font-mono font-bold">
                            ₹{activeQuote ? (activeQuote.price * qty).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "..."}
                        </span>
                    </div>
                    </div>
                </div>
                <Button onClick={buy} className="mt-4 w-full h-12 text-md font-bold" disabled={!activeQuote || (activeQuote.price * qty) > cash}>
                    Buy {selectedSymbol}
                </Button>
                </div>

                {/* Holdings */}
                <div className="rounded-xl border border-border bg-card p-5 flex flex-col">
                    <h4 className="text-sm font-semibold mb-4">Current Holdings</h4>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                    {holdings.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground flex-col gap-2 opacity-50">
                            <Activity size={32} />
                            No active positions. <br/> Buy stocks to build your portfolio.
                        </div>
                    ) : (
                        holdings.map((h) => {
                            const currentPrice = livePrices[h.symbol]?.price || mockStocks.find(s => s.symbol === h.symbol)?.price || h.avgPrice;
                            const value = currentPrice * h.qty;
                            const pl = value - (h.avgPrice * h.qty);
                            const plPct = (pl / (h.avgPrice * h.qty)) * 100;
                            const isPositive = pl >= 0;

                            return (
                                <div key={h.symbol} className="flex items-center justify-between rounded-lg bg-secondary/30 border border-border/50 px-3 py-2.5 hover:bg-secondary/60 transition-colors">
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-mono text-sm font-bold">{h.symbol}</span>
                                        <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 rounded">{h.qty}x</span>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground mt-0.5">Avg: ₹{h.avgPrice.toFixed(2)}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                    <div className="font-mono text-sm font-semibold">₹{value.toLocaleString("en-IN", {maximumFractionDigits: 0})}</div>
                                    <div className={`text-[10px] font-bold ${isPositive ? "text-success" : "text-destructive"}`}>
                                        {isPositive ? "+" : "!"}₹{Math.abs(pl).toFixed(0)} ({plPct.toFixed(1)}%)
                                    </div>
                                    </div>
                                    <Button size="icon" variant="destructive" className="h-7 w-7 opacity-80 hover:opacity-100" onClick={() => sell(h.symbol)} title="Sell Position">
                                        <span className="text-xs font-bold leading-none">S</span>
                                    </Button>
                                </div>
                                </div>
                            );
                        })
                    )}
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StockSimulatorPage;
