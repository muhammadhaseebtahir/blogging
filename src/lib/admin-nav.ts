import { LayoutDashboard, Users, FileText, Eye, Sparkles } from "lucide-react";
import type { NavItem } from "@/components/DashboardLayout";

export const adminNav: NavItem[] = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/posters", label: "Blog Posters", icon: Users },
  { to: "/admin/viewers", label: "Viewers", icon: Eye },
  { to: "/admin/blogs", label: "Blogs & Moderation", icon: FileText },
  { to: "/", label: "Back to Site", icon: Sparkles },
];
