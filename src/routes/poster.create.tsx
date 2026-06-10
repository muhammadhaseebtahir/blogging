import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { posterNav } from "@/lib/poster-nav";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/CategoryBadge";
import { detectCategory, type CategoryName } from "@/lib/categories";
import { Image as ImageIcon, Sparkles, Send, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/poster/create")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("blogsphere.auth");
      if (!raw) throw redirect({ to: "/login" });
      const u = JSON.parse(raw);
      if (u.role !== "poster" && u.role !== "admin") throw redirect({ to: "/unauthorized" });
    }
  },
  head: () => ({ meta: [{ title: "Create Blog — BlogSphere AI" }] }),
  component: CreateBlog,
});

function CreateBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [cover, setCover] = useState<string | null>(null);
  const [detected, setDetected] = useState<CategoryName | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const analyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setDetected(detectCategory(`${title} ${content} ${tags}`));
      setAnalyzing(false);
    }, 900);
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setCover(URL.createObjectURL(f));
  };

  const submit = (status: "draft" | "published") => {
    if (!title.trim() || !content.trim()) { toast.error("Title and content are required"); return; }
    toast.success(status === "draft" ? "Draft saved" : "Blog published!");
    navigate({ to: "/poster/dashboard" });
  };

  return (
    <DashboardLayout navItems={posterNav} title="Create Blog" accent="Poster">
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={analyze}
            placeholder="Untitled story…"
            className="bg-card border-border h-14 text-2xl font-bold"
          />

          <label className="block rounded-2xl border-2 border-dashed border-border bg-card aspect-[16/7] overflow-hidden cursor-pointer hover:border-primary/50 transition-smooth relative">
            {cover ? (
              <img src={cover} className="absolute inset-0 h-full w-full object-cover" alt="cover" />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-sm">Upload cover image</div>
                </div>
              </div>
            )}
            <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
          </label>

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={analyze}
            placeholder="Write your story here. Markdown is welcome…"
            className="bg-card border-border min-h-[400px] text-base leading-relaxed"
          />

          <div className="space-y-2">
            <Label>Tags (comma separated)</Label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ai, design, future" className="bg-card border-border" />
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 self-start">
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary-glow" /> AI Category Detection
            </div>
            <p className="mt-2 text-xs text-muted-foreground">We'll suggest a category based on your content.</p>
            <div className="mt-4">
              {analyzing ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary-glow animate-pulse" /> Analyzing…
                </div>
              ) : detected ? (
                <div className="space-y-2">
                  <div className="text-xs text-subtle">Detected:</div>
                  <CategoryBadge category={detected} size="md" />
                </div>
              ) : (
                <Button variant="glow" size="sm" onClick={analyze} disabled={!title && !content}>
                  Analyze content
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="text-sm font-semibold">Publish</div>
            <Button variant="hero" className="w-full" onClick={() => submit("published")}>
              <Send className="h-4 w-4" /> Publish now
            </Button>
            <Button variant="outline" className="w-full" onClick={() => submit("draft")}>
              <Save className="h-4 w-4" /> Save draft
            </Button>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
