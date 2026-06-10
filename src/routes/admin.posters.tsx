import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminNav } from "@/lib/admin-nav";
import { authors } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Ban, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/posters")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("blogsphere.auth");
      if (!raw) throw redirect({ to: "/login" });
      const u = JSON.parse(raw);
      if (u.role !== "admin") throw redirect({ to: "/unauthorized" });
    }
  },
  head: () => ({ meta: [{ title: "Manage Posters — BlogSphere AI" }] }),
  component: ManagePosters,
});

function ManagePosters() {
  const [q, setQ] = useState("");
  const [list, setList] = useState(authors.map((a) => ({ ...a, blocked: false })));
  const filtered = list.filter((a) => a.name.toLowerCase().includes(q.toLowerCase()));

  const toggleBlock = (id: string) => {
    setList((l) => l.map((a) => a.id === id ? { ...a, blocked: !a.blocked } : a));
    toast.success("Status updated");
  };
  const remove = (id: string) => {
    setList((l) => l.filter((a) => a.id !== id));
    toast.success("Poster removed");
  };

  return (
    <DashboardLayout navItems={adminNav} title="Manage Blog Posters" accent="Super Admin">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-6">
        <h2 className="text-xl font-bold">All Blog Posters</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search posters…" className="pl-9 bg-card border-border w-64" />
          </div>
          <Button variant="hero" onClick={() => toast.info("Open invite modal (mock)")}><Plus className="h-4 w-4" />Add Poster</Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-subtle uppercase tracking-wider">
            <tr className="border-b border-border">
              <th className="px-5 py-3 font-medium">Poster</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Posts</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0 hover:bg-card-elevated transition-smooth">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img src={a.avatar} alt="" className="h-9 w-9 rounded-full" />
                    <div>
                      <div className="font-medium">{a.name}</div>
                      <div className="text-xs text-subtle">@{a.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{a.username}@blogsphere.ai</td>
                <td className="px-5 py-4">{a.postCount}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${a.blocked ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"}`}>
                    {a.blocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => toggleBlock(a.id)} className="p-2 rounded-md hover:bg-card text-muted-foreground hover:text-warning"><Ban className="h-4 w-4" /></button>
                    <button onClick={() => remove(a.id)} className="p-2 rounded-md hover:bg-card text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
