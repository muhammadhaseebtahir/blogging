import {
  Cpu, HeartPulse, GraduationCap, Landmark, Trophy,
  Film, FlaskConical, Sparkles, LayoutGrid, type LucideIcon,
} from "lucide-react";

export type CategoryName =
  | "Technology" | "Health" | "Education" | "Politics"
  | "Sports" | "Entertainment" | "Science" | "Lifestyle";

export interface Category {
  name: CategoryName | "All";
  color: string;       // oklch
  icon: LucideIcon;
  keywords: string[];
}

export const categories: Category[] = [
  { name: "All", color: "oklch(0.55 0.235 295)", icon: LayoutGrid, keywords: [] },
  { name: "Technology", color: "oklch(0.65 0.18 240)", icon: Cpu, keywords: ["ai","code","software","tech","app","developer"] },
  { name: "Health", color: "oklch(0.7 0.17 145)", icon: HeartPulse, keywords: ["health","fitness","wellness","mental","body"] },
  { name: "Education", color: "oklch(0.78 0.15 80)", icon: GraduationCap, keywords: ["education","learn","study","school","teach"] },
  { name: "Politics", color: "oklch(0.6 0.2 25)", icon: Landmark, keywords: ["politic","government","election","policy"] },
  { name: "Sports", color: "oklch(0.7 0.18 50)", icon: Trophy, keywords: ["sport","game","team","football","cricket"] },
  { name: "Entertainment", color: "oklch(0.7 0.2 330)", icon: Film, keywords: ["movie","music","entertain","show","series"] },
  { name: "Science", color: "oklch(0.65 0.16 200)", icon: FlaskConical, keywords: ["science","research","space","biology","physics"] },
  { name: "Lifestyle", color: "oklch(0.72 0.16 350)", icon: Sparkles, keywords: ["life","travel","food","fashion","home"] },
];

export const detectCategory = (text: string): CategoryName => {
  const t = text.toLowerCase();
  let best: { name: CategoryName; score: number } = { name: "Lifestyle", score: 0 };
  for (const c of categories) {
    if (c.name === "All") continue;
    const score = c.keywords.reduce((s, k) => s + (t.includes(k) ? 1 : 0), 0);
    if (score > best.score) best = { name: c.name as CategoryName, score };
  }
  return best.name;
};

export const getCategory = (name: string) =>
  categories.find((c) => c.name === name) ?? categories[0];
