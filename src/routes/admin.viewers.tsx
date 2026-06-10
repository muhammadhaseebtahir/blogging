import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminNav } from "@/lib/admin-nav";
import { viewers, type Viewer } from "@/lib/viewers";
import { formatDate, timeAgo } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, MessageSquare, Heart, MapPin, Calendar, Mail, Ban, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/viewers")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("blogsphere.auth");
      if (!raw) throw redirect({ to: "/login" });
      const u = JSON.parse(raw);
      if (u.role !== "admin") throw redirect({ to: "/unauthorized" });
    }
  },
  head: () => ({ meta: [{ title: "Viewers — BlogSphere AI" }] }),
  component: ViewersPage,
});

function ViewersPage() {
  const [q, setQ] = useState("");
  const [list, setList] = useState(viewers);
  const [selected, setSelected] = useState<Viewer | null>(null);

  const filtered = list.filter(
    (v) => v.name.toLowerCase().includes(q.toLowerCase()) || v.email.toLowerCase().includes(q.toLowerCase()),
  );

  const totals = {
    all: list.length,
    active: list.filter((v) => v.status === "active").length,
    banned: list.filter((v) => v.status === "banned").length,
    reads: list.reduce((a, v) => a + v.reads, 0),
  };

  const ban = (id: string) => {
    setList((l) => l.map((v) => v.id === id ? { ...v, status: v.status === "banned" ? "active" : "banned" } : v));
    toast.success("Viewer status updated");
  };
  const remove = (id: string) => {
    setList((l) => l.filter((v) => v.id !== id));
    setSelected(null);
    toast.success("Viewer removed");
  };

  return (
    <DashboardLayout navItems={adminNav} title="Viewers" accent="Super Admin">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          { label: "Total Viewers", value: totals.all, icon: Eye },
          { label: "Active", value: totals.active, icon: Heart },
          { label: "Banned", value: totals.banned, icon: Ban },
          { label: "Total Reads", value: totals.reads.toLocaleString(), icon: MessageSquare },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="grid place-items-center h-10 w-10 rounded-lg bg-primary/10 text-primary-glow"><s.icon className="h-5 w-5" /></div>
            <div className="mt-4 text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-6">
        <h2 className="text-xl font-bold">All Viewers</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email…" className="pl-9 bg-card border-border w-full sm:w-72" />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-subtle uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">Viewer</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Activity</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-b border-border last:border-0 hover:bg-card-elevated cursor-pointer" onClick={() => setSelected(v)}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={v.avatar} alt="" className="h-9 w-9 rounded-full" />
                      <div>
                        <div className="font-medium">{v.name}</div>
                        <div className="text-xs text-subtle flex items-center gap-1"><MapPin className="h-3 w-3" />{v.country}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{v.email}</td>
                  <td className="px-5 py-4 text-muted-foreground">{formatDate(v.joinedAt)}</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    <div className="flex gap-3 text-xs">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{v.reads}</span>
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{v.likes}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{v.comments}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      v.status === "active" ? "bg-success/15 text-success" :
                      v.status === "banned" ? "bg-destructive/15 text-destructive" :
                      "bg-warning/15 text-warning"
                    }`}>{v.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => ban(v.id)} className="p-2 rounded-md hover:bg-card text-muted-foreground hover:text-warning"><Ban className="h-4 w-4" /></button>
                      <button onClick={() => remove(v.id)} className="p-2 rounded-md hover:bg-card text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/70" onClick={() => setSelected(null)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-card border-l border-border overflow-y-auto animate-in slide-in-from-right">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Viewer Details</h3>
                <button onClick={() => setSelected(null)} className="p-2 rounded-md hover:bg-card-elevated"><X className="h-4 w-4" /></button>
              </div>
              <div className="text-center">
                <img src={selected.avatar} alt="" className="h-24 w-24 rounded-full mx-auto ring-4 ring-primary/30" />
                <h4 className="mt-3 text-xl font-bold">{selected.name}</h4>
                <p className="text-sm text-muted-foreground">@{selected.username}</p>
              </div>
              <dl className="mt-6 space-y-3 text-sm">
                <Row icon={Mail} label="Email" value={selected.email} />
                <Row icon={MapPin} label="Country" value={selected.country} />
                <Row icon={Calendar} label="Joined" value={formatDate(selected.joinedAt)} />
                <Row icon={Eye} label="Last active" value={timeAgo(selected.lastActive)} />
              </dl>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: "Reads", value: selected.reads, icon: Eye },
                  { label: "Likes", value: selected.likes, icon: Heart },
                  { label: "Comments", value: selected.comments, icon: MessageSquare },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border p-3 text-center">
                    <s.icon className="h-4 w-4 mx-auto text-primary-glow" />
                    <div className="mt-2 text-lg font-bold">{s.value}</div>
                    <div className="text-[10px] uppercase tracking-wider text-subtle">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-border p-4">
                <div className="text-xs text-subtle">Favorite category</div>
                <div className="text-sm font-medium mt-1">{selected.favoriteCategory}</div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => ban(selected.id)}>
                  <Ban className="h-4 w-4" />{selected.status === "banned" ? "Unban" : "Ban"}
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => remove(selected.id)}>
                  <Trash2 className="h-4 w-4" />Remove
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 mt-0.5 text-primary-glow shrink-0" />
      <div className="flex-1">
        <div className="text-xs text-subtle">{label}</div>
        <div>{value}</div>
      </div>
    </div>
  );
}
