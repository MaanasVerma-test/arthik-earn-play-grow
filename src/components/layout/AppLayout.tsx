import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, Gamepad2, Swords, Trophy, User, Flame, Menu, X, LineChart, Wallet } from "lucide-react";
import { currentUser, getUserLevel } from "@/data/mockData";
import { supabase } from "@/lib/supabase";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Learn", icon: BookOpen, href: "/learn" },
  { label: "Simulation", icon: LineChart, href: "/games/stock-simulator" },
  { label: "Budgeting", icon: Wallet, href: "/budgeting" },
  { label: "Games", icon: Gamepad2, href: "/games" },
  { label: "Compete", icon: Swords, href: "/compete" },
  { label: "Leaderboard", icon: Trophy, href: "/leaderboard" },
  { label: "Profile", icon: User, href: "/profile" },
];

const AppLayout = ({ children }: { children: ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(currentUser);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error("Auth error in AppLayout:", authError);
          return;
        }

        if (authUser) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (profile) {
            setUser({
              ...currentUser,
              name: profile.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || "Trader",
              xp: profile.xp || 0,
              streak: profile.streak_days || 0,
              avatar: authUser.user_metadata?.avatar || currentUser.avatar,
              balance: profile.balance || currentUser.balance,
              isPro: profile.is_pro || currentUser.isPro,
            });
          }
        }
      } catch (err) {
        console.error("Unexpected error in AppLayout fetchProfile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Header & Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={22} />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-display text-sm text-primary-foreground">अ</div>
              <span className="font-display text-lg hidden sm:inline-block">Arthik</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 ml-10">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${location.pathname === item.href ? "text-primary border-b-2 border-primary py-5" : "text-muted-foreground hover:text-foreground py-5"}`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 ml-auto">
             <div className="hidden sm:flex items-center gap-3 mr-2">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary rounded-full text-sm">
                  <span className="text-muted-foreground">Balance:</span>
                  <span className="font-mono font-medium text-foreground">₹{user.balance?.toLocaleString() || 0}</span>
                </div>
                {user.isPro && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-500 border border-yellow-500/30 rounded-full text-xs font-bold tracking-wider">
                    PRO
                  </div>
                )}
             </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Flame size={16} className="text-warning" />
              <span className="font-mono font-medium hidden sm:inline-block">{user.streak}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm">
              <span className="font-mono font-medium text-primary">{user.xp.toLocaleString()} <span className="hidden sm:inline-block">XP</span></span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground ml-1">
              {user.avatar}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card transition-transform md:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-display text-sm text-primary-foreground">अ</div>
            <span className="font-display text-lg">Arthik</span>
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-2 text-sm">
             <span className="text-muted-foreground">Balance:</span>
             <span className="font-mono font-medium text-foreground">₹{user.balance?.toLocaleString() || 0}</span>
          </div>
          {user.isPro && (
            <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-500 border border-yellow-500/30 rounded-full text-xs font-bold tracking-wider">
              PRO MEMBER
            </div>
          )}
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${location.pathname === item.href ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
