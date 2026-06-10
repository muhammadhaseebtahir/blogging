import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { CategoryBadge } from "./CategoryBadge";
import { formatDate, type Blog } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  blog: Blog;
  variant?: "default" | "featured" | "compact";
}

export function BlogCard({ blog, variant = "default" }: Props) {
  const featured = variant === "featured";
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: blog.slug }}
      className="group block overflow-hidden rounded-2xl bg-card border border-border transition-smooth hover:border-primary/50 hover:shadow-glow"
    >
      <div className="relative overflow-hidden aspect-[16/9] bg-muted">
        <img
          src={blog.cover}
          alt={blog.title}
          loading="lazy"
          className="h-full w-full object-cover transition-smooth group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <CategoryBadge category={blog.category} />
        </div>
      </div>
      <div className="p-5">
        <h3 className={`font-bold text-foreground group-hover:text-primary-glow transition-smooth line-clamp-2 ${featured ? "text-xl" : "text-lg"}`}>
          {blog.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{blog.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-subtle">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={blog.author.avatar} />
              <AvatarFallback>{blog.author.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground">{blog.author.name}</span>
            <span>·</span>
            <span>{formatDate(blog.publishedAt)}</span>
          </div>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{blog.readTime}m</span>
        </div>
      </div>
    </Link>
  );
}
