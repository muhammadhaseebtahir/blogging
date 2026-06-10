import type { CategoryName } from "./categories";

export interface Author {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  postCount?: number;
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  category: CategoryName;
  author: Author;
  publishedAt: string;
  readTime: number;
  likes: number;
  commentsCount: number;
  tags: string[];
  status: "published" | "draft";
  views?: number;
}

export interface Comment {
  id: string;
  blogId: string;
  blogTitle: string;
  blogSlug: string;
  author: Author;
  text: string;
  date: string;
  flagged?: boolean;
}

const cover = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1200&q=70`;

export const authors: Author[] = [
  { id: "a1", name: "Aisha Khan", username: "aisha", avatar: "https://i.pravatar.cc/150?img=47", bio: "Tech writer & ML engineer.", postCount: 24 },
  { id: "a2", name: "Daniyal Raza", username: "daniyal", avatar: "https://i.pravatar.cc/150?img=12", bio: "Sports analyst.", postCount: 18 },
  { id: "a3", name: "Sara Malik", username: "sara", avatar: "https://i.pravatar.cc/150?img=32", bio: "Health & lifestyle.", postCount: 15 },
  { id: "a4", name: "Omar Siddiqui", username: "omar", avatar: "https://i.pravatar.cc/150?img=15", bio: "Educator.", postCount: 12 },
  { id: "a5", name: "Hina Tariq", username: "hina", avatar: "https://i.pravatar.cc/150?img=44", bio: "Entertainment journalist.", postCount: 9 },
];

const seeds = [
  "photo-1518770660439-4636190af475",
  "photo-1517423440428-a5a00ad493e8",
  "photo-1526374965328-7f61d4dc18c5",
  "photo-1551434678-e076c223a692",
  "photo-1587620962725-abab7fe55159",
  "photo-1581090464777-f3220bbe1b8b",
  "photo-1488590528505-98d2b5aba04b",
  "photo-1461749280684-dccba630e2f6",
  "photo-1486312338219-ce68d2c6f44d",
  "photo-1460925895917-afdab827c52f",
];

const titles = [
  "How AI Is Quietly Rewriting the Internet",
  "The Future of Personalized Medicine",
  "Rethinking Education for a Hybrid World",
  "What the Latest Election Means Globally",
  "Cricket's New Generation: Stars to Watch",
  "Why Indie Films Are Having a Moment",
  "Inside the Mind of a Quantum Researcher",
  "Slow Living: A Manifesto for Modern Life",
  "Edge Computing Demystified for Builders",
  "The Habits of People Who Sleep Well",
  "Open Source AI: Promise and Perils",
  "Designing Calm Workspaces at Home",
];

const cats: CategoryName[] = [
  "Technology","Health","Education","Politics","Sports","Entertainment",
  "Science","Lifestyle","Technology","Health","Technology","Lifestyle",
];

const longContent = `
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. The conversation around modern blogging has shifted dramatically in the last few years, with creators leaning into both authenticity and automation.</p>
<h2>The new shape of content</h2>
<p>From auto-categorization to community moderation, platforms are quietly weaving intelligence into every step of the writing journey. The goal isn't to replace voice — it's to amplify it.</p>
<blockquote>Good tools disappear. Great tools make you sound more like yourself.</blockquote>
<h2>What this means for you</h2>
<p>If you're a reader, expect feeds that finally feel personal without feeling creepy. If you're a writer, expect fewer chores and more space to think.</p>
<pre><code>const future = await blog.publish({ assistedBy: "AI" });</code></pre>
<p>The next chapter of the web is being written, paragraph by paragraph, by people like you.</p>
`;

export const blogs: Blog[] = titles.map((title, i) => {
  const author = authors[i % authors.length];
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return {
    id: `b${i + 1}`,
    slug,
    title,
    excerpt: "A quick look at how creators, communities, and clever software are reshaping the way we read and write online.",
    content: longContent,
    cover: cover(seeds[i % seeds.length]),
    category: cats[i],
    author,
    publishedAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
    readTime: 4 + (i % 6),
    likes: 30 + i * 17,
    commentsCount: 3 + (i % 7),
    tags: ["ai", "writing", "design", "future", "web"].slice(0, 3 + (i % 3)),
    status: i === 11 ? "draft" : "published",
    views: 500 + i * 230,
  };
});

export const popularTags = [
  "ai","writing","web","design","future","health","ml","startup",
  "sports","film","education","science","lifestyle","politics",
];

export const mockComments: Comment[] = blogs.slice(0, 6).map((b, i) => ({
  id: `c${i + 1}`,
  blogId: b.id,
  blogTitle: b.title,
  blogSlug: b.slug,
  author: authors[(i + 1) % authors.length],
  text: [
    "This was such a great read — thank you for sharing!",
    "Really insightful. The part about moderation hit home.",
    "Disagree with point 2, but loved everything else.",
    "Saving this for later. Bookmarked!",
    "Can you write more on this topic?",
    "Beautifully written, as always.",
  ][i],
  date: new Date(Date.now() - i * 3600_000 * 5).toISOString(),
}));

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const timeAgo = (iso: string) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};
