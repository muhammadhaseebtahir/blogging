export interface Viewer {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  joinedAt: string;
  lastActive: string;
  reads: number;
  comments: number;
  likes: number;
  country: string;
  status: "active" | "inactive" | "banned";
  favoriteCategory: string;
}

const names = [
  ["Hassan Ali","hassan","Pakistan"],
  ["Ayesha Noor","ayesha","Pakistan"],
  ["Liam Carter","liam","UK"],
  ["Mia Rossi","mia","Italy"],
  ["Yusuf Demir","yusuf","Turkey"],
  ["Priya Sharma","priya","India"],
  ["Noah Becker","noah","Germany"],
  ["Zara Ahmed","zara","UAE"],
  ["Ethan Park","ethan","South Korea"],
  ["Olivia Brown","olivia","USA"],
  ["Bilal Iqbal","bilal","Pakistan"],
  ["Sofia Martins","sofia","Brazil"],
];

const cats = ["Technology","Health","Sports","Lifestyle","Science","Entertainment","Education","Politics"];

export const viewers: Viewer[] = names.map(([name, username, country], i) => ({
  id: `v${i + 1}`,
  name,
  username,
  email: `${username}@blogsphere.ai`,
  avatar: `https://i.pravatar.cc/150?img=${(i + 5) * 3}`,
  joinedAt: new Date(Date.now() - (i + 1) * 86400000 * 11).toISOString(),
  lastActive: new Date(Date.now() - i * 3600_000 * 7).toISOString(),
  reads: 12 + i * 9,
  comments: 2 + (i % 7),
  likes: 18 + i * 6,
  country,
  status: i === 4 ? "banned" : i % 5 === 0 ? "inactive" : "active",
  favoriteCategory: cats[i % cats.length],
}));
