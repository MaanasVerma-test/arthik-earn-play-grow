import AppLayout from "@/components/layout/AppLayout";
import { learningModules, topicCategories } from "@/data/mockData";
import { motion } from "framer-motion";
import { Clock, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const diffColor: Record<string, string> = {
  Beginner: "text-common",
  Intermediate: "text-warning",
  Advanced: "text-destructive",
};

const LearnPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const filtered = selectedCategory
    ? learningModules.filter((m) => m.category === selectedCategory)
    : learningModules;

  const openModule = learningModules.find((m) => m.id === activeModule);

  if (openModule && openModule.content) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => setActiveModule(null)}
            className="mb-4 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to modules
          </button>
          <div className="gold-border-top rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className={diffColor[openModule.difficulty]}>{openModule.difficulty}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {openModule.duration}</span>
              <span className="flex items-center gap-1"><Zap size={14} className="text-primary" /> {openModule.xp} XP</span>
            </div>
            <h1 className="mt-3 font-display text-3xl">{openModule.title}</h1>
            <div className="prose prose-invert mt-6 max-w-none">
              {openModule.content.split("\n\n").map((block, i) => {
                if (block.startsWith("## ")) return <h2 key={i} className="font-display text-xl text-foreground mt-6 mb-2">{block.replace("## ", "")}</h2>;
                if (block.startsWith("- ")) return <ul key={i} className="space-y-1 text-muted-foreground">{block.split("\n").map((li, j) => <li key={j} className="text-sm">{li.replace("- ", "• ")}</li>)}</ul>;
                if (block.match(/^\d\./)) return <ol key={i} className="space-y-1 text-muted-foreground">{block.split("\n").map((li, j) => <li key={j} className="text-sm">{li}</li>)}</ol>;
                return <p key={i} className="text-muted-foreground text-sm leading-relaxed">{block}</p>;
              })}
            </div>
            <div className="mt-8 border-t border-border pt-6">
              <Button onClick={() => { toast.success(`+${openModule.xp} XP earned!`); setActiveModule(null); }}>
                Complete Module (+{openModule.xp} XP)
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-3xl">Learn</h1>
        <p className="mt-1 text-muted-foreground">Master finance one topic at a time</p>

        {/* Categories */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${!selectedCategory ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            All Topics
          </button>
          {topicCategories.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCategory(c.name)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${selectedCategory === c.name ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        {/* Modules */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {filtered.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="cursor-pointer rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              onClick={() => m.content ? setActiveModule(m.id) : toast.info("Module coming soon!")}
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={diffColor[m.difficulty]}>{m.difficulty}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {m.duration}</span>
              </div>
              <h3 className="mt-2 font-display text-lg">{m.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-primary">
                <Zap size={12} /> {m.xp} XP
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default LearnPage;
