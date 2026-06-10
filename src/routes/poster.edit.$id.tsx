import { createFileRoute, redirect, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { posterNav } from "@/lib/poster-nav";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/CategoryBadge";
import { blogs } from "@/lib/mock-data";
import { Save, Send } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/poster/edit/$id")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("blogsphere.auth");
      if (!raw) throw redirect({ to: "/login" });
      const u = JSON.parse(raw);
      if (u.role !== "poster" && u.role !== "admin") throw redirect({ to: "/unauthorized" });
    }
  },
  loader: ({ params }) => {
    const blog = blogs.find((b) => b.id === params.id);
    if (!blog) throw notFound();
    return { blog };
  },
  notFoundComponent: () => <div className="p-12 text-center">Blog not found.</div>,
  errorComponent: ({ error }) => <div className="p-12 text-center">{error.message}</div>,
  component: EditBlog,
});

function EditBlog() {
  const { blog } = Route.useLoaderData();
  const navigate = useNavigate();
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.excerpt + "\n\n" + blog.content.replace(/<[^>]+>/g, ""));
  const [tags, setTags] = useState(blog.tags.join(", "));

  return (
    <DashboardLayout navItems={posterNav} title="Edit Blog" accent="Poster">
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-card border-border h-14 text-2xl font-bold" />
          <img src={blog.cover} alt="" className="rounded-2xl w-full aspect-[16/7] object-cover border border-border" />
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="bg-card border-border min-h-[400px] text-base leading-relaxed" />
          <div className="space-y-2">
            <Label>Tags</Label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} className="bg-card border-border" />
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 self-start">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs text-subtle mb-2">Detected category</div>
            <CategoryBadge category={blog.category} size="md" />
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <Button variant="hero" className="w-full" onClick={() => { toast.success("Changes saved"); navigate({ to: "/poster/dashboard" }); }}>
              <Send className="h-4 w-4" /> Update post
            </Button>
            <Button variant="outline" className="w-full" onClick={() => toast.success("Saved as draft")}>
              <Save className="h-4 w-4" /> Save as draft
            </Button>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
