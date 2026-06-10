import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoryBadge } from "@/components/CategoryBadge";
import { useAuth } from "@/lib/auth";
import { blogs, mockComments, timeAgo, formatDate } from "@/lib/mock-data";
import { categories } from "@/lib/categories";
import {
  Bookmark, Heart, MessageSquare, Settings, Share2, MapPin, Calendar,
  Sparkles, Pencil, Mail, Globe, Trophy,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — BlogSphere AI" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("blogsphere.auth");
        if (!raw) throw redirect({ to: "/login" });
      } catch {}
    }
  },
  component: ProfilePage,
});

const TABS = [
  { id: "saved", label: "Saved", icon: Bookmark },
  { id: "liked", label: "Liked", icon: Heart },
  { id: "comments", label: "Comments", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

function ProfilePage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<typeof TABS[number]["id"]>("saved");
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [bio, setBio] = useState("Curious reader. Sometimes writer. Always learning.");

  if (!user) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md text-center py-32">
          <p>Please <Link to="/login" className="text-primary-glow hover:underline">log in</Link>.</p>
        </div>
      </PageShell>
    );
  }

  const saved = blogs.slice(0, 4);
  const liked = blogs.slice(2, 6);
  const myComments = mockComments.slice(0, 5);
  const interests = categories.filter((c) => c.name !== "All").slice(0, 5);

  return (
    <PageShell>
      {/* Cover with bold gradient + grid */}
      <div className="relative h-72 overflow-hidden">
        <div className="absolute inset-0 bg-purple-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.6_0.25_295/0.5),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0/0.08) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0/0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-primary-glow/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 -mt-24 pb-20">
        {/* Identity card */}
        <div className="rounded-3xl border border-border bg-card/90 backdrop-blur-xl p-6 sm:p-8 shadow-card">
          <div className="flex flex-col md:flex-row gap-6 md:items-end">
            <div className="relative shrink-0">
              <Avatar className="h-32 w-32 ring-4 ring-background shadow-glow">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-3xl">{user.name[0]}</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-success ring-4 ring-card" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-black">{user.name}</h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs text-primary-glow capitalize">
                  <Sparkles className="h-3 w-3" />{user.role}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">@{user.email.split("@")[0]}</p>
              <p className="mt-3 text-sm max-w-xl">{bio}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{user.email}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />Karachi, PK</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Joined Mar 2025</span>
                <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" />blogsphere.ai/{user.email.split("@")[0]}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setTab("settings")}><Pencil className="h-4 w-4" />Edit</Button>
              <Button variant="hero" size="sm" onClick={() => toast.success("Profile link copied")}><Share2 className="h-4 w-4" />Share</Button>
            </div>
          </div>

          {/* Inline stats */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Saved", value: saved.length, icon: Bookmark, color: "from-purple-500/20 to-purple-500/5" },
              { label: "Liked", value: liked.length, icon: Heart, color: "from-pink-500/20 to-pink-500/5" },
              { label: "Comments", value: myComments.length, icon: MessageSquare, color: "from-blue-500/20 to-blue-500/5" },
              { label: "Reads", value: 142, icon: Trophy, color: "from-amber-500/20 to-amber-500/5" },
            ].map((s) => (
              <div key={s.label} className={`rounded-2xl border border-border p-4 bg-gradient-to-br ${s.color}`}>
                <s.icon className="h-4 w-4 text-primary-glow" />
                <div className="mt-2 text-2xl font-black">{s.value}</div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Two-column body */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[18rem_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary-glow" />Interests</h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((c) => (
                  <span
                    key={c.name}
                    className="text-xs px-2.5 py-1 rounded-full border"
                    style={{
                      borderColor: `color-mix(in oklab, ${c.color} 35%, transparent)`,
                      backgroundColor: `color-mix(in oklab, ${c.color} 12%, transparent)`,
                      color: c.color,
                    }}
                  >{c.name}</span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Trophy className="h-4 w-4 text-warning" />Achievements</h3>
              <ul className="space-y-3">
                {[
                  { title: "First Save", desc: "Bookmarked your first blog" },
                  { title: "Curator", desc: "Saved 10+ blogs" },
                  { title: "Voice", desc: "Posted 5 comments" },
                ].map((a) => (
                  <li key={a.title} className="flex items-start gap-3">
                    <div className="grid place-items-center h-9 w-9 rounded-lg bg-purple-gradient shrink-0 shadow-glow">
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{a.title}</div>
                      <div className="text-xs text-muted-foreground">{a.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <nav className="rounded-2xl border border-border bg-card p-2">
              {TABS.map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-smooth ${
                      active ? "bg-primary/15 text-primary-glow" : "text-muted-foreground hover:bg-card-elevated hover:text-foreground"
                    }`}
                  >
                    <t.icon className="h-4 w-4" />{t.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main panel */}
          <main>
            {tab === "saved" && (
              <Section title="Saved articles" count={saved.length}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {saved.map((b) => (
                    <Link key={b.id} to="/blog/$slug" params={{ slug: b.slug }} className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-smooth">
                      <div className="relative h-32 overflow-hidden">
                        <img src={b.cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
                        <div className="absolute top-2 left-2"><CategoryBadge category={b.category} /></div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-sm line-clamp-2">{b.title}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">{formatDate(b.publishedAt)} · {b.readTime} min read</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Section>
            )}

            {tab === "liked" && (
              <Section title="Liked articles" count={liked.length}>
                <ul className="space-y-3">
                  {liked.map((b) => (
                    <li key={b.id} className="rounded-2xl border border-border bg-card p-4 flex gap-4 items-center hover:border-primary/40 transition-smooth">
                      <img src={b.cover} alt="" className="h-16 w-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <Link to="/blog/$slug" params={{ slug: b.slug }} className="font-medium text-sm hover:text-primary-glow line-clamp-1">{b.title}</Link>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <CategoryBadge category={b.category} /><span>{formatDate(b.publishedAt)}</span>
                        </div>
                      </div>
                      <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {tab === "comments" && (
              <Section title="Your comments" count={myComments.length}>
                <ul className="space-y-3">
                  {myComments.map((c) => (
                    <li key={c.id} className="rounded-2xl border border-border bg-card p-5">
                      <div className="text-xs text-subtle mb-2">on <Link to="/blog/$slug" params={{ slug: c.blogSlug }} className="text-primary-glow hover:underline">{c.blogTitle}</Link> · {timeAgo(c.date)}</div>
                      <p className="text-sm">{c.text}</p>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {tab === "settings" && (
              <Section title="Account settings">
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4 max-w-xl">
                  <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="bg-background" /></div>
                  <div className="space-y-2"><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background" /></div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <Button variant="hero" onClick={() => toast.success("Profile updated")}>Save changes</Button>
                </div>
              </Section>
            )}
          </main>
        </div>
      </div>
    </PageShell>
  );
}

function Section({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {count !== undefined && <span className="text-xs text-muted-foreground">{count} items</span>}
      </div>
      {children}
    </div>
  );
}
