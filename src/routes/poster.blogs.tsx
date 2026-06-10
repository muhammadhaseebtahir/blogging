import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { posterNav } from "@/lib/poster-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryBadge } from "@/components/CategoryBadge";
import { blogs, formatDate } from "@/lib/mock-data";
import { Search, FilePlus, Pencil, Trash2, Eye, Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/poster/blogs")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("blogsphere.auth");
      if (!raw) throw redirect({ to: "/login" });
      const u = JSON.parse(raw);
      if (u.role !== "poster" && u.role !== "admin") throw redirect({ to: "/unauthorized" });
    }
  },
  head: () => ({ meta: [{ title: "My Blogs — BlogSphere AI" }] }),
  component: MyBlogsPage,
});

function MyBlogsPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [list, setList] = useState(blogs.slice(0, 8));

  const filtered = list
    .filter((b) => filter === "all" || b.status === filter)
    .filter((b) => b.title.toLowerCase().includes(q.toLowerCase()));

  const remove = (id: string) => {
    setList((l) => l.filter((b) => b.id !== id));
    toast.success("Blog deleted");
  };

  return (
    <DashboardLayout navItems={posterNav} title="My Blogs" accent="Poster">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold">All your blogs</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} of {list.length} posts</p>
        </div>
        <Button asChild variant="hero"><Link to="/poster/create"><FilePlus className="h-4 w-4" />New Blog</Link></Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your blogs…" className="pl-9 bg-card border-border" />
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
          {(["all","published","draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs capitalize transition-smooth ${
                filter === f ? "bg-primary/20 text-primary-glow" : "text-muted-foreground hover:text-foreground"
              }`}
            >{f}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((b) => (
          <div key={b.id} className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col sm:flex-row hover:border-primary/40 transition-smooth">
            <img src={b.cover} alt="" className="h-40 sm:h-auto sm:w-48 object-cover" />
            <div className="flex-1 p-5 flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <CategoryBadge category={b.category} />
                <span className={`text-xs px-2 py-0.5 rounded-full ${b.status === "published" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>{b.status}</span>
                <span className="text-xs text-subtle">{formatDate(b.publishedAt)}</span>
              </div>
              <h3 className="mt-2 font-semibold text-lg line-clamp-1">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{b.excerpt}</p>
              <div className="mt-auto pt-3 flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{b.views}</span>
                  <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{b.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{b.commentsCount}</span>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm"><Link to="/blog/$slug" params={{ slug: b.slug }}><Eye className="h-3 w-3" />View</Link></Button>
                  <Button asChild variant="outline" size="sm"><Link to="/poster/edit/$id" params={{ id: b.id }}><Pencil className="h-3 w-3" />Edit</Link></Button>
                  <Button variant="outline" size="sm" onClick={() => remove(b.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">No blogs match your filters.</div>
        )}
      </div>
    </DashboardLayout>
  );
}
