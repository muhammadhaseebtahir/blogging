import { getCategory } from "@/lib/categories";
import { cn } from "@/lib/utils";

interface Props {
  category: string;
  className?: string;
  size?: "sm" | "md";
}

export function CategoryBadge({ category, className, size = "sm" }: Props) {
  const c = getCategory(category);
  const Icon = c.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border backdrop-blur",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
        className,
      )}
      style={{
        color: c.color,
        backgroundColor: `color-mix(in oklab, ${c.color} 18%, transparent)`,
        borderColor: `color-mix(in oklab, ${c.color} 35%, transparent)`,
      }}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {c.name}
    </span>
  );
}
