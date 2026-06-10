import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Sparkles, ShieldCheck, Tag, Users } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { blogs } from "@/lib/mock-data";
import { categories } from "@/lib/categories";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BlogSphere AI — Smart Blogging, Auto Categorized" },
      { name: "description", content: "Discover trending stories, explore by topic, and join an AI-moderated blogging community." },
    ],
  }),
  component: HomePage,
});

const features = [
  { icon: Tag, title: "AI Categorization", desc: "Every post auto-tagged into the right topic — no manual labeling." },
  { icon: ShieldCheck, title: "Smart Moderation", desc: "An SVM model quietly filters toxic comments before anyone sees them." },
  { icon: Users, title: "Role-Based Access", desc: "Readers, posters, and admins each get a tailored, secure experience." },
];

function HomePage() {
  const [visible, setVisible] = useState(6);
  const trending = blogs.slice(0, 3);
  const latest = blogs.slice(3, 3 + visible);

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/30 blur-3xl pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary-glow">
            <Sparkles className="h-3 w-3" /> AI-powered · Auto-categorized · Moderated
          </span>
          <h1 className="mt-6 text-5xl sm:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-[1.05]">
            Stories that find their <span className="text-gradient">readers.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            BlogSphere AI is a smart blogging platform where machine learning quietly handles the
            chores — categorization, moderation, discovery — so writers can focus on writing.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 justify-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/blogs">Start Reading <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/register">Become a Blogger</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-bold">Trending Now <span aria-hidden>🔥</span></h2>
          <Link to="/blogs" className="text-sm text-primary-glow hover:underline">See all trending →</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {trending.map((b) => <BlogCard key={b.id} blog={b} variant="featured" />)}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <h2 className="text-3xl font-bold mb-6">Explore by Topic</h2>
        <div className="flex flex-wrap gap-3">
          {categories.filter((c) => c.name !== "All").map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.name}
                to="/blogs"
                search={{ category: c.name } as never}
                className="group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-smooth hover:scale-105"
                style={{
                  borderColor: `color-mix(in oklab, ${c.color} 35%, transparent)`,
                  backgroundColor: `color-mix(in oklab, ${c.color} 12%, transparent)`,
                  color: c.color,
                }}
              >
                <Icon className="h-4 w-4" />{c.name}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Latest */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {latest.map((b) => <BlogCard key={b.id} blog={b} />)}
        </div>
        {visible < blogs.length - 3 && (
          <div className="mt-10 text-center">
            <Button variant="glow" onClick={() => setVisible((v) => v + 4)}>Load more</Button>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="rounded-3xl border border-border bg-card p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-glow opacity-50 pointer-events-none" />
          <div className="relative grid gap-8 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title}>
                <div className="grid place-items-center h-12 w-12 rounded-xl bg-purple-gradient shadow-glow">
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community reviews */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary-glow">
            <Sparkles className="h-3 w-3" /> Loved by readers & writers
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black">What the community is saying</h2>
          <p className="mt-3 text-muted-foreground">Honest words from people who read, write and grow on BlogSphere AI.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: "Aisha Khan", role: "Tech Writer", img: "https://i.pravatar.cc/150?img=47", quote: "AI categorization saves me hours every week. My posts find their audience without me lifting a finger." , rating: 5 },
            { name: "Daniyal Raza", role: "Reader", img: "https://i.pravatar.cc/150?img=12", quote: "The feed actually feels personal. Comments stay civil too — moderation here is on another level.", rating: 5 },
            { name: "Sara Malik", role: "Lifestyle Blogger", img: "https://i.pravatar.cc/150?img=32", quote: "Beautiful UI, clean editor, and tags I never have to think about. This is the future of blogging.", rating: 5 },
            { name: "Omar Siddiqui", role: "Educator", img: "https://i.pravatar.cc/150?img=15", quote: "I use BlogSphere with my class — auto-moderation makes student blogging a safe experience.", rating: 4 },
            { name: "Hina Tariq", role: "Journalist", img: "https://i.pravatar.cc/150?img=44", quote: "Discovery here is uncanny. I keep finding writers I genuinely want to follow.", rating: 5 },
            { name: "Bilal Iqbal", role: "Reader", img: "https://i.pravatar.cc/150?img=33", quote: "Finally a blogging platform that doesn't drown me in noise. Just good writing, well sorted.", rating: 5 },
          ].map((r) => (
            <figure key={r.name} className="rounded-3xl border border-border bg-card p-6 hover:border-primary/40 transition-smooth flex flex-col">
              <div className="flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < r.rating ? "" : "opacity-20"}>★</span>
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-foreground/90 flex-1">"{r.quote}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 pt-4 border-t border-border">
                <img src={r.img} alt="" className="h-10 w-10 rounded-full" />
                <div>
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-20 text-center">
        <h2 className="text-4xl sm:text-5xl font-black">Ready to Share Your Story?</h2>
        <p className="mt-4 text-muted-foreground">Join a community where great writing finds its audience automatically.</p>
        <div className="mt-8">
          <Button asChild variant="hero" size="lg"><Link to="/register">Join BlogSphere AI</Link></Button>
        </div>
      </section>
    </PageShell>
  );
}
