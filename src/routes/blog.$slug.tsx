import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, MessageCircle, Share2, Clock } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { blogs, formatDate, mockComments, timeAgo } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const blog = blogs.find((b) => b.slug === params.slug);
    if (!blog) throw notFound();
    return { blog };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.blog.title} — BlogSphere AI` },
      { name: "description", content: loaderData.blog.excerpt },
      { property: "og:title", content: loaderData.blog.title },
      { property: "og:description", content: loaderData.blog.excerpt },
      { property: "og:image", content: loaderData.blog.cover },
      { name: "twitter:image", content: loaderData.blog.cover },
    ] : [],
  }),
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-md text-center py-32">
        <h1 className="text-3xl font-bold">Blog not found</h1>
        <Link to="/blogs" className="mt-6 inline-block text-primary-glow hover:underline">Browse all blogs →</Link>
      </div>
    </PageShell>
  ),
  errorComponent: ({ error }) => <div className="p-12 text-center">{error.message}</div>,
  component: BlogDetail,
});

function BlogDetail() {
  const { blog } = Route.useLoaderData();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(blog.likes);
  const [comments, setComments] = useState(mockComments.slice(0, 4));
  const [text, setText] = useState("");

  const requireAuth = () => {
    if (!user) { toast.error("Please log in to continue"); return false; }
    return true;
  };

  const onLike = () => {
    if (!requireAuth()) return;
    setLiked((v) => !v);
    setLikes((n: number) => (liked ? n - 1 : n + 1));
  };

  const submitComment = () => {
    if (!requireAuth() || !text.trim()) return;
    setComments((cs) => [{
      id: `n${Date.now()}`, blogId: blog.id, blogSlug: blog.slug, blogTitle: blog.title,
      author: { id: "me", name: user!.name, username: user!.email, avatar: user!.avatar },
      text, date: new Date().toISOString(),
    }, ...cs]);
    setText("");
    toast.success("Comment posted");
  };

  return (
    <PageShell>
      <article>
        {/* Header */}
        <header className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
          <img src={blog.cover} alt={blog.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
          <div className="relative mx-auto max-w-4xl h-full px-4 sm:px-6 flex flex-col justify-end pb-12">
            <CategoryBadge category={blog.category} size="md" />
            <h1 className="mt-4 text-4xl sm:text-6xl font-black leading-tight">{blog.title}</h1>
            <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
              <Avatar className="h-10 w-10">
                <AvatarImage src={blog.author.avatar} />
                <AvatarFallback>{blog.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-foreground font-medium">{blog.author.name}</div>
                <div className="flex items-center gap-2 text-xs">
                  {formatDate(blog.publishedAt)} · <Clock className="h-3 w-3" /> {blog.readTime} min read
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <div
            className="prose prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-foreground
              prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:text-lg
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-card prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-5 prose-blockquote:not-italic
              prose-pre:bg-card-elevated prose-pre:border prose-pre:border-border prose-pre:rounded-xl
              prose-code:text-primary-glow prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          <div className="mt-10 flex flex-wrap gap-2">
            {blog.tags.map((t: string) => (
              <span key={t} className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground">#{t}</span>
            ))}
          </div>

          {/* Comments */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
            {user ? (
              <div className="mt-5 rounded-2xl border border-border bg-card p-4">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share your thoughts…"
                  className="bg-transparent border-0 focus-visible:ring-0 min-h-[80px]"
                />
                <div className="flex justify-end mt-2">
                  <Button variant="hero" size="sm" onClick={submitComment}>Post comment</Button>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
                <Link to="/login" className="text-primary-glow hover:underline">Log in</Link> to post a comment.
              </div>
            )}

            <ul className="mt-6 space-y-5">
              {comments.map((c) => (
                <li key={c.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9"><AvatarImage src={c.author.avatar} /><AvatarFallback>{c.author.name[0]}</AvatarFallback></Avatar>
                    <div>
                      <div className="text-sm font-medium">{c.author.name}</div>
                      <div className="text-xs text-subtle">{timeAgo(c.date)}</div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-foreground/90">{c.text}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sticky engagement pill */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center gap-1 rounded-full border border-border bg-card/90 backdrop-blur-xl shadow-card px-2 py-2">
            <button onClick={onLike} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-smooth ${liked ? "text-primary-glow bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}>
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} /> {likes}
            </button>
            <a href="#" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground">
              <MessageCircle className="h-4 w-4" /> {comments.length}
            </a>
            <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </article>
    </PageShell>
  );
}
