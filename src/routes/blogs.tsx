import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { BlogCard } from "@/components/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authors, blogs, popularTags } from "@/lib/mock-data";
import { categories } from "@/lib/categories";

interface BlogsSearch { category?: string; q?: string; page?: number }

export const Route = createFileRoute("/blogs")({
  validateSearch: (s: Record<string, unknown>): BlogsSearch => ({
    category: typeof s.category === "string" ? s.category : "All",
    q: typeof s.q === "string" ? s.q : "",
    page: typeof s.page === "number" ? s.page : 1,
  }),
  head: () => ({
    meta: [
      { title: "Explore Blogs — BlogSphere AI" },
      { name: "description", content: "Browse and search AI-categorized blogs across topics like Technology, Health, and more." },
    ],
  }),
  component: BlogsPage,
});

const PAGE_SIZE = 6;

function BlogsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(search.q ?? "");

  // debounce
  useEffect(() => {
    const t = setTimeout(() => {
      navigate({ search: (prev: BlogsSearch) => ({ ...prev, q, page: 1 }) });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const matchCat = !search.category || search.category === "All" || b.category === search.category;
      const matchQ = !search.q || b.title.toLowerCase().includes(search.q.toLowerCase());
      return matchCat && matchQ && b.status === "published";
    });
  }, [search.category, search.q]);

  const page = search.page ?? 1;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const setCategory = (c: string) => navigate({ search: (p: BlogsSearch) => ({ ...p, category: c, page: 1 }) });
  const setPage = (p: number) => navigate({ search: (prev: BlogsSearch) => ({ ...prev, page: p }) });

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-6">
        <h1 className="text-4xl font-bold">Explore <span className="text-gradient">Blogs</span></h1>
        <p className="mt-2 text-muted-foreground">Find stories tagged automatically by our AI.</p>
      </section>

      {/* Sticky filter */}
      <div className="sticky top-16 z-30 bg-background/85 backdrop-blur-xl border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative md:w-80 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search blogs…"
              className="pl-9 bg-card border-border"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 -mx-1 px-1">
            {categories.map((c) => {
              const active = (search.category ?? "All") === c.name;
              return (
                <button
                  key={c.name}
                  onClick={() => setCategory(c.name)}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs border transition-smooth ${
                    active
                      ? "bg-purple-gradient border-transparent text-white shadow-glow"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  }`}
                >
                  <c.icon className="h-3.5 w-3.5" />{c.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid lg:grid-cols-[1fr_320px] gap-10">
        <div>
          {paged.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">No blogs match your filters.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {paged.map((b) => <BlogCard key={b.id} blog={b} />)}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center items-center gap-1">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-md text-sm transition-smooth ${
                    p === page ? "bg-purple-gradient text-white" : "hover:bg-card"
                  }`}
                >{p}</button>
              ))}
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-semibold mb-3">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:text-primary-glow hover:border-primary/40 cursor-pointer transition-smooth">
                  #{t}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-semibold mb-3">Top Authors</h3>
            <ul className="space-y-3">
              {authors.map((a) => (
                <li key={a.id} className="flex items-center gap-3">
                  <img src={a.avatar} alt={a.name} className="h-9 w-9 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{a.name}</div>
                    <div className="text-xs text-subtle">{a.postCount} posts</div>
                  </div>
                  <Link to="/blogs" className="text-xs text-primary-glow hover:underline">Follow</Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
