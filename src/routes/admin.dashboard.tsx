import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminNav } from "@/lib/admin-nav";
import { Users, FileText, MessageCircle, ShieldAlert, Activity, FilePlus } from "lucide-react";
import { authors, blogs, timeAgo } from "@/lib/mock-data";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { categories } from "@/lib/categories";

export const Route = createFileRoute("/admin/dashboard")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("blogsphere.auth");
      if (!raw) throw redirect({ to: "/login" });
      const u = JSON.parse(raw);
      if (u.role !== "admin") throw redirect({ to: "/unauthorized" });
    }
  },
  head: () => ({ meta: [{ title: "Admin — BlogSphere AI" }] }),
  component: AdminDashboard,
});

const stats = [
  { label: "Total Users", value: "8,420", icon: Users, trend: "+124" },
  { label: "Blog Posters", value: "318", icon: FilePlus, trend: "+12" },
  { label: "Total Blogs", value: "1,204", icon: FileText, trend: "+38" },
  { label: "Comments", value: "12.4k", icon: MessageCircle, trend: "+412" },
  { label: "Flagged by SVM", value: "287", icon: ShieldAlert, trend: "+17" },
  { label: "Active Today", value: "1,830", icon: Activity, trend: "+8%" },
];

const blogsPerDay = [
  { d: "Mon", v: 12 }, { d: "Tue", v: 19 }, { d: "Wed", v: 14 },
  { d: "Thu", v: 22 }, { d: "Fri", v: 28 }, { d: "Sat", v: 17 }, { d: "Sun", v: 9 },
];

const catData = categories.filter((c) => c.name !== "All").map((c, i) => ({
  name: c.name, value: 30 + ((i * 17) % 80), color: c.color,
}));

const activity = [
  { icon: FilePlus, text: "New blog posted by Aisha Khan", time: new Date(Date.now() - 600_000).toISOString() },
  { icon: ShieldAlert, text: "Comment removed by AI moderation", time: new Date(Date.now() - 1_400_000).toISOString() },
  { icon: Users, text: "New user registered: hina@example.com", time: new Date(Date.now() - 3_600_000).toISOString() },
  { icon: ShieldAlert, text: "Blog poster blocked: spammer42", time: new Date(Date.now() - 7_200_000).toISOString() },
  { icon: FilePlus, text: "New blog posted by Daniyal Raza", time: new Date(Date.now() - 12_000_000).toISOString() },
];

function AdminDashboard() {
  return (
    <DashboardLayout navItems={adminNav} title="Overview" accent="Super Admin">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="grid place-items-center h-9 w-9 rounded-lg bg-primary/10 text-primary-glow"><s.icon className="h-4 w-4" /></div>
            <div className="mt-3 text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="text-xs text-success mt-1">{s.trend}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid lg:grid-cols-5 gap-6">
        <section className="lg:col-span-3 rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold">Recent Activity</h3>
          <ul className="mt-4 divide-y divide-border">
            {activity.map((a, i) => (
              <li key={i} className="py-3 flex items-center gap-3">
                <div className="grid place-items-center h-9 w-9 rounded-lg bg-card-elevated"><a.icon className="h-4 w-4 text-primary-glow" /></div>
                <div className="flex-1 text-sm">{a.text}</div>
                <span className="text-xs text-subtle">{timeAgo(a.time)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold">Top Posters</h3>
          <ul className="mt-4 space-y-3">
            {authors.map((a) => (
              <li key={a.id} className="flex items-center gap-3">
                <img src={a.avatar} alt={a.name} className="h-9 w-9 rounded-full" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.name}</div>
                  <div className="text-xs text-subtle">{a.postCount} posts</div>
                </div>
                <span className="text-xs text-primary-glow">{a.postCount! * 120} views</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid lg:grid-cols-5 gap-6">
        <section className="lg:col-span-3 rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Blogs per Day</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={blogsPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="d" stroke="oklch(0.7 0 0)" fontSize={12} />
                <YAxis stroke="oklch(0.7 0 0)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.225 0 0)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                <Bar dataKey="v" fill="oklch(0.55 0.235 295)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Category Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={catData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {catData.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h3 className="font-semibold mb-4">Recent Blogs</h3>
        <ul className="divide-y divide-border">
          {blogs.slice(0, 5).map((b) => (
            <li key={b.id} className="py-3 flex items-center gap-4">
              <img src={b.cover} alt="" className="h-12 w-16 object-cover rounded-md" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{b.title}</div>
                <div className="text-xs text-subtle">{b.author.name} · {timeAgo(b.publishedAt)}</div>
              </div>
              <span className="text-xs text-muted-foreground">{b.likes} likes</span>
            </li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
}
