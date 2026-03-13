import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [interest, setInterest] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role || !interest) {
      toast.error("Please select your role and interest.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: email.split('@')[0], // Default name
            role,
            interest,
            xp: 0,
            level: 1,
            streak_days: 0,
          }
        }
      });

      if (error) {
        toast.error(error.message);
      } else if (data.session) {
        toast.success("Welcome to Arthik!");
        navigate("/dashboard");
      } else if (data.user && !data.session) {
        // Confirmation email usually
        toast.success("Signup successful! Please check your email for confirmation.");
        navigate("/login");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred during signup.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background grid-texture px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mx-auto mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-display text-xl text-primary-foreground">अ</div>
          <span className="font-display text-2xl">Arthik</span>
        </Link>
        <div className="gold-border-top rounded-xl border border-border bg-card p-6">
          <h1 className="font-display text-2xl">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start your finance learning journey</p>
          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1 bg-secondary" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 bg-secondary" />
            </div>
            <div>
              <Label>I am a</Label>
              <div className="mt-1 flex gap-2">
                {["Student", "Working Professional"].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${role === r ? "border-primary bg-primary/10 text-foreground" : "border-border bg-secondary text-muted-foreground"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Primary Interest</Label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {["Investing", "Budgeting", "Markets", "All"].map((i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setInterest(i)}
                    className={`rounded-lg border px-3 py-2 text-sm transition-colors ${interest === i ? "border-primary bg-primary/10 text-foreground" : "border-border bg-secondary text-muted-foreground"}`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
