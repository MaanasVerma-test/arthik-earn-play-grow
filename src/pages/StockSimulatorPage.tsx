import { useState, useCallback } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { mockStocks } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Holding {
  symbol: string;
  qty: number;
  avgPrice: number;
}

const StockSimulatorPage = () => {
  const [cash, setCash] = useState(100000);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [selectedStock, setSelectedStock] = useState(mockStocks[0]);
  const [qty, setQty] = useState(1);
  const [search, setSearch] = useState("");

  const filteredStocks = mockStocks.filter(
    (s) => s.symbol.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase())
  );

  const buy = useCallback(() => {
    const cost = selectedStock.price * qty;
    if (cost > cash) { toast.error("Insufficient funds"); return; }
    setCash((c) => c - cost);
    setHoldings((prev) => {
      const existing = prev.find((h) => h.symbol === selectedStock.symbol);
      if (existing) {
        const newQty = existing.qty + qty;
        const newAvg = ((existing.avgPrice * existing.qty) + cost) / newQty;
        return prev.map((h) => h.symbol === selectedStock.symbol ? { ...h, qty: newQty, avgPrice: newAvg } : h);
      }
      return [...prev, { symbol: selectedStock.symbol, qty, avgPrice: selectedStock.price }];
    });
    toast.success(`Bought ${qty} ${selectedStock.symbol}`);
  }, [selectedStock, qty, cash]);

  const sell = useCallback((symbol: string) => {
    const holding = holdings.find((h) => h.symbol === symbol);
    if (!holding) return;
    const stock = mockStocks.find((s) => s.symbol === symbol)!;
    setCash((c) => c + stock.price * holding.qty);
    setHoldings((prev) => prev.filter((h) => h.symbol !== symbol));
    toast.success(`Sold all ${symbol}`);
  }, [holdings]);

  const portfolioValue = holdings.reduce((sum, h) => {
    const stock = mockStocks.find((s) => s.symbol === h.symbol)!;
    return sum + stock.price * h.qty;
  }, 0);

  const totalValue = cash + portfolioValue;
  const pnl = totalValue - 100000;
  const pnlPct = ((pnl / 100000) * 100).toFixed(2);

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-3xl">Stock Market Simulator</h1>
        <p className="mt-1 text-muted-foreground">Trade with virtual ₹1,00,000 — maximize your portfolio</p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <span className="text-xs text-muted-foreground">Cash</span>
            <div className="mt-1 font-mono text-xl font-bold">₹{cash.toLocaleString("en-IN", { minimumFractionDigits: 0 })}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <span className="text-xs text-muted-foreground">Portfolio</span>
            <div className="mt-1 font-mono text-xl font-bold">₹{portfolioValue.toLocaleString("en-IN", { minimumFractionDigits: 0 })}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <span className="text-xs text-muted-foreground">Total</span>
            <div className="mt-1 font-mono text-xl font-bold">₹{totalValue.toLocaleString("en-IN", { minimumFractionDigits: 0 })}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <span className="text-xs text-muted-foreground">P&L</span>
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
                placeholder="Search stocks..."
                className="bg-secondary pl-9"
              />
            </div>
            <div className="mt-3 max-h-[400px] space-y-1 overflow-y-auto">
              {filteredStocks.map((s) => (
                <button
                  key={s.symbol}
                  onClick={() => setSelectedStock(s)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors ${selectedStock.symbol === s.symbol ? "bg-primary/10" : "hover:bg-secondary/50"}`}
                >
                  <div>
                    <div className="font-mono text-sm font-medium">{s.symbol}</div>
                    <div className="text-xs text-muted-foreground">{s.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">₹{s.price.toLocaleString()}</div>
                    <div className={`text-xs ${s.change >= 0 ? "text-success" : "text-destructive"}`}>
                      {s.change >= 0 ? "+" : ""}{s.change}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chart + Buy */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-mono text-lg font-bold">{selectedStock.symbol}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStock.name}</p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-2xl font-bold">₹{selectedStock.price.toLocaleString()}</div>
                  <div className={`flex items-center justify-end gap-1 text-sm ${selectedStock.change >= 0 ? "text-success" : "text-destructive"}`}>
                    {selectedStock.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {selectedStock.change >= 0 ? "+" : ""}{selectedStock.change}%
                  </div>
                </div>
              </div>
              <div className="mt-4 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedStock.priceHistory}>
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(216 18% 62%)" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(216 18% 62%)" domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{ background: "hsl(220 40% 10%)", border: "1px solid hsl(218 20% 18%)", borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: "hsl(216 18% 62%)" }}
                    />
                    <Line type="monotone" dataKey="price" stroke="hsl(42 52% 54%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Buy panel */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h4 className="text-sm font-medium">Buy {selectedStock.symbol}</h4>
              <div className="mt-3 flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground">Quantity</label>
                  <Input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="mt-1 bg-secondary" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground">Total Cost</label>
                  <div className="mt-1 flex h-10 items-center rounded-md border border-border bg-secondary px-3 font-mono text-sm">
                    ₹{(selectedStock.price * qty).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
              <Button onClick={buy} className="mt-3 w-full">Buy {selectedStock.symbol}</Button>
            </div>

            {/* Holdings */}
            {holdings.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h4 className="text-sm font-medium">Your Holdings</h4>
                <div className="mt-3 space-y-2">
                  {holdings.map((h) => {
                    const stock = mockStocks.find((s) => s.symbol === h.symbol)!;
                    const value = stock.price * h.qty;
                    const pl = value - h.avgPrice * h.qty;
                    return (
                      <div key={h.symbol} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
                        <div>
                          <span className="font-mono text-sm font-medium">{h.symbol}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{h.qty} shares</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-mono text-sm">₹{value.toLocaleString("en-IN")}</div>
                            <div className={`text-xs ${pl >= 0 ? "text-success" : "text-destructive"}`}>
                              {pl >= 0 ? "+" : ""}₹{Math.abs(pl).toFixed(0)}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => sell(h.symbol)}>Sell</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StockSimulatorPage;
