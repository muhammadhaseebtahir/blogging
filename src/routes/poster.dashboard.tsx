import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { posterNav } from "@/lib/poster-nav";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/CategoryBadge";
import { blogs, formatDate } from "@/lib/mock-data";
import { Eye, Heart, MessageCircle, FilePlus, Sparkles, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/poster/dashboard")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("blogsphere.auth");
      if (!raw) throw redirect({ to: "/login" });
      const u = JSON.parse(raw);
      if (u.role !== "poster" && u.role !== "admin") throw redirect({ to: "/unauthorized" });
    }
  },
  head: () => ({ meta: [{ title: "Poster Dashboard — BlogSphere AI" }] }),
  component: PosterDashboard,
});

function PosterDashboard() {
  const myBlogs = blogs.slice(0, 6);
  const stats = [
    { label: "Total Blogs", value: myBlogs.length, icon: FilePlus, trend: "+2 this week" },
    { label: "Total Views", value: "12.4k", icon: Eye, trend: "+18%" },
    { label: "Total Likes", value: "1,209", icon: Heart, trend: "+12%" },
    { label: "Comments", value: "342", icon: MessageCircle, trend: "+5%" },
  ];

  return (
    <DashboardLayout navItems={posterNav} title="Dashboard" accent="Poster">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Welcome back ✨</h2>
          <p className="text-sm text-muted-foreground">Here's what's happening with your blogs.</p>
        </div>
        <Button asChild variant="hero"><Link to="/poster/create"><FilePlus className="h-4 w-4" />New Blog</Link></Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="grid place-items-center h-10 w-10 rounded-lg bg-primary/10 text-primary-glow"><s.icon className="h-5 w-5" /></div>
              <span className="text-xs text-success">{s.trend}</span>
            </div>
            <div className="mt-4 text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5 flex items-start gap-4">
        <div className="grid place-items-center h-10 w-10 rounded-lg bg-purple-gradient shadow-glow shrink-0"><Sparkles className="h-5 w-5 text-white" /></div>
        <div>
          <div className="font-semibold">AI Tip</div>
          <p className="text-sm text-muted-foreground">Posts in <span className="text-primary-glow">Technology</span> get 32% more engagement when published Tuesday mornings. Try scheduling your next one!</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold">My Blogs</h3>
          <span className="text-xs text-muted-foreground">{myBlogs.length} posts</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-subtle uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myBlogs.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-card-elevated transition-smooth">
                  <td className="px-5 py-4 max-w-xs"><div className="font-medium truncate">{b.title}</div></td>
                  <td className="px-5 py-4"><CategoryBadge category={b.category} /></td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${b.status === "published" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{formatDate(b.publishedAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link to="/poster/edit/$id" params={{ id: b.id }} className="p-2 rounded-md hover:bg-card text-muted-foreground hover:text-primary-glow"><Pencil className="h-4 w-4" /></Link>
                      <button className="p-2 rounded-md hover:bg-card text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
