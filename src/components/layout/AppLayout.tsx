import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, BookOpen, Gamepad2, Swords, Trophy, User, Flame, Menu, X } from "lucide-react";
import { currentUser, getUserLevel } from "@/data/mockData";
import { supabase } from "@/lib/supabase";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Learn", icon: BookOpen, href: "/learn" },
  { label: "Games", icon: Gamepad2, href: "/games" },
  { label: "Compete", icon: Swords, href: "/compete" },
  { label: "Leaderboard", icon: Trophy, href: "/leaderboard" },
  { label: "Profile", icon: User, href: "/profile" },
];

const AppLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
          console.log("AppLayout: Found auth user", authUser.id);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (profileError) {
            console.warn("AppLayout: Profile fetch error (may not exist yet):", profileError);
          }

          if (profile) {
            console.log("AppLayout: Profile found, updating XP:", profile.xp);
            setUser({
              ...currentUser,
              name: profile.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || "Trader",
              xp: profile.xp || 0,
              streak: profile.streak_days || 0,
              avatar: authUser.user_metadata?.avatar || currentUser.avatar,
            });
          } else {
            console.log("AppLayout: No profile row, using metadata fallback");
            setUser({
              ...currentUser,
              name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || "Trader",
              xp: authUser.user_metadata?.xp || 0,
              streak: authUser.user_metadata?.streak_days || 0,
            });
          }
        } else {
          console.log("AppLayout: No logged in user");
        }
      } catch (err) {
        console.error("Unexpected error in AppLayout fetchProfile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [location.pathname]);

  const level = getUserLevel(user.xp);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-display text-sm text-primary-foreground">अ</div>
            <span className="font-display text-lg">Arthik</span>
          </Link>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${location.pathname === item.href ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-background/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-xl lg:px-6">
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm">
              <Flame size={16} className="text-warning" />
              <span className="font-mono font-medium">{user.streak}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm">
              <span className="font-mono font-medium text-primary">{user.xp.toLocaleString()} XP</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {user.avatar}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
