import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminNav } from "@/lib/admin-nav";
import { blogs as allBlogs, formatDate, mockComments } from "@/lib/mock-data";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/categories";
import { Trash2, Eye, Tag as TagIcon, ShieldAlert, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blogs")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("blogsphere.auth");
      if (!raw) throw redirect({ to: "/login" });
      const u = JSON.parse(raw);
      if (u.role !== "admin") throw redirect({ to: "/unauthorized" });
    }
  },
  head: () => ({ meta: [{ title: "Manage Blogs — BlogSphere AI" }] }),
  component: ManageBlogs,
});

function ManageBlogs() {
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");

  const filtered = allBlogs.filter((b) =>
    (cat === "all" || b.category === cat) &&
    (status === "all" || b.status === status) &&
    b.title.toLowerCase().includes(q.toLowerCase())
  );

  const flagged = mockComments.slice(0, 4);

  return (
    <DashboardLayout navItems={adminNav} title="Blogs & Moderation" accent="Super Admin">
      {/* Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title…" className="pl-9 bg-card border-border" />
        </div>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="w-44 bg-card border-border"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.filter((c) => c.name !== "All").map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-36 bg-card border-border"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-subtle uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">Blog</th>
                <th className="px-5 py-3 font-medium">Poster</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Stats</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-card-elevated transition-smooth">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 max-w-xs">
                      <img src={b.cover} alt="" className="h-10 w-14 object-cover rounded-md shrink-0" />
                      <div className="font-medium truncate">{b.title}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{b.author.name}</td>
                  <td className="px-5 py-4"><CategoryBadge category={b.category} /></td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${b.status === "published" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>{b.status}</span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground text-xs">{formatDate(b.publishedAt)}</td>
                  <td className="px-5 py-4 text-xs text-subtle">{b.likes}♥ · {b.commentsCount}💬</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <Link to="/blog/$slug" params={{ slug: b.slug }} className="p-2 rounded-md hover:bg-card text-muted-foreground hover:text-foreground"><Eye className="h-4 w-4" /></Link>
                      <button onClick={() => toast.info("Edit category modal (mock)")} className="p-2 rounded-md hover:bg-card text-muted-foreground hover:text-primary-glow"><TagIcon className="h-4 w-4" /></button>
                      <button onClick={() => toast.success("Blog deleted")} className="p-2 rounded-md hover:bg-card text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="h-5 w-5 text-destructive" />
          <h3 className="font-semibold">AI Moderation Log — Flagged Comments</h3>
        </div>
        <ul className="divide-y divide-border">
          {flagged.map((c) => (
            <li key={c.id} className="py-3 flex items-start gap-3">
              <div className="grid place-items-center h-9 w-9 rounded-lg bg-destructive/15 text-destructive shrink-0">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm">"{c.text}"</div>
                <div className="text-xs text-subtle mt-1">on <Link to="/blog/$slug" params={{ slug: c.blogSlug }} className="text-primary-glow hover:underline">{c.blogTitle}</Link> · removed by SVM</div>
              </div>
              <button onClick={() => toast.success("Restored")} className="text-xs text-muted-foreground hover:text-foreground">Restore</button>
            </li>
          ))}
        </ul>
      </section>
    </DashboardLayout>
  );
}
