import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth, type Role } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — BlogSphere AI" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = Route.useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Exclude<Role, "guest">>("user");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(role);
      toast.success(`Welcome back!`);
      navigate({ to: role === "admin" ? "/admin/dashboard" : role === "poster" ? "/poster/dashboard" : "/profile" });
    }, 600);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:block overflow-hidden">
        <div className="absolute inset-0 bg-purple-gradient opacity-20" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute -top-40 left-20 h-[500px] w-[500px] rounded-full bg-primary/40 blur-3xl animate-pulse" />
        <div className="relative p-12 flex flex-col h-full">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="grid place-items-center h-9 w-9 rounded-xl bg-purple-gradient shadow-glow">
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            BlogSphere AI
          </Link>
          <div className="mt-auto">
            <h2 className="text-4xl font-black leading-tight">Where stories find their <span className="text-gradient">readers.</span></h2>
            <p className="mt-4 text-muted-foreground max-w-md">Sign in to continue reading, writing, and engaging with a smart, AI-moderated community.</p>
          </div>
        </div>
      </div>

      <div className="grid place-items-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="grid place-items-center h-8 w-8 rounded-lg bg-purple-gradient"><Sparkles className="h-4 w-4 text-white" /></span>
              BlogSphere AI
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Log in to your account to continue.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@blogsphere.ai" className="bg-card" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-card" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-subtle">Login as (demo)</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["user","poster","admin"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`text-xs py-2 rounded-lg border capitalize transition-smooth ${
                      role === r ? "bg-purple-gradient border-transparent text-white" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >{r}</button>
                ))}
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground text-center">
            New here? <Link to="/register" className="text-primary-glow hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
