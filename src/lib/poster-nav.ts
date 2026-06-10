import { LayoutDashboard, FilePlus, FileText, Sparkles } from "lucide-react";
import type { NavItem } from "@/components/DashboardLayout";

export const posterNav: NavItem[] = [
  { to: "/poster/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/poster/blogs", label: "My Blogs", icon: FileText },
  { to: "/poster/create", label: "New Blog", icon: FilePlus },
  { to: "/profile", label: "My Profile", icon: Sparkles },
];
