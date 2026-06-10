import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — BlogSphere AI" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const { login } = useAuth();
  const navigate = Route.useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [becomePoster, setBecomePoster] = useState(false);
  const [loading, setLoading] = useState(false);

  // Extra poster fields
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [expertise, setExpertise] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [experience, setExperience] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(becomePoster ? "poster" : "user", name);
      toast.success("Account created! Welcome to BlogSphere AI.");
      navigate({ to: becomePoster ? "/poster/dashboard" : "/profile" });
    }, 700);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="grid place-items-center p-6 sm:p-12 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="grid place-items-center h-8 w-8 rounded-lg bg-purple-gradient"><Sparkles className="h-4 w-4 text-white" /></span>
              BlogSphere AI
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Join thousands of readers and writers.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="bg-card" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@blogsphere.ai" className="bg-card" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className="bg-card" />
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 cursor-pointer hover:border-primary/50 transition-smooth">
              <input type="checkbox" checked={becomePoster} onChange={(e) => setBecomePoster(e.target.checked)} className="mt-1 accent-[oklch(0.55_0.235_295)]" />
              <div>
                <div className="text-sm font-medium">I want to publish blogs</div>
                <div className="text-xs text-muted-foreground">Get access to the Poster dashboard, drafts, and analytics.</div>
              </div>
            </label>

            {becomePoster && (
              <div className="space-y-4 rounded-xl border border-primary/30 bg-primary/5 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="text-xs font-semibold text-primary-glow uppercase tracking-wider">Poster details</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="@handle" className="bg-card" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+92 …" className="bg-card" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Pakistan" className="bg-card" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years writing</Label>
                    <Input id="experience" type="number" min={0} value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="2" className="bg-card" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expertise">Expertise / Topics</Label>
                  <Input id="expertise" value={expertise} onChange={(e) => setExpertise(e.target.value)} placeholder="AI, Tech, Productivity" className="bg-card" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Short bio</Label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="Tell readers a bit about you…"
                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://…" className="bg-card" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter / X</Label>
                    <Input id="twitter" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="@you" className="bg-card" />
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground text-center">
            Already have an account? <Link to="/login" className="text-primary-glow hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="relative hidden lg:block overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 bg-purple-gradient opacity-20" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute top-1/3 right-10 h-[500px] w-[500px] rounded-full bg-primary-glow/30 blur-3xl animate-pulse" />
        <div className="relative p-12 flex flex-col h-full justify-end">
          <h2 className="text-4xl font-black leading-tight">Your story, <span className="text-gradient">automatically</span> seen.</h2>
          <p className="mt-4 text-muted-foreground max-w-md">AI categorizes your posts, smart moderation keeps the community safe, and you focus on writing.</p>
        </div>
      </div>
    </div>
  );
}
