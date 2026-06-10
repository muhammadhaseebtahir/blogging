import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles, Menu, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface NavItem { to: string; label: string; icon: LucideIcon }

export function DashboardLayout({
  navItems, title, children, accent = "Poster",
}: {
  navItems: NavItem[]; title: string; children: React.ReactNode; accent?: string;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = (
    <>
      <Link to="/" className="flex items-center gap-2 font-bold text-lg px-6 h-16 border-b border-border shrink-0">
        <span className="grid place-items-center h-8 w-8 rounded-lg bg-purple-gradient">
          <Sparkles className="h-4 w-4 text-white" />
        </span>
        BlogSphere
      </Link>

      <div className="px-4 py-6 flex-1 overflow-y-auto">
        <div className="text-xs uppercase tracking-wider text-subtle mb-3 px-3">{accent}</div>
        <nav className="space-y-1">
          {navItems.map((it) => {
            const active = path === it.to;
            return (
              <Link
                key={it.label}
                to={it.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-smooth ${
                  active ? "bg-primary/15 text-primary-glow" : "text-muted-foreground hover:bg-card-elevated hover:text-foreground"
                }`}
              >
                <it.icon className="h-4 w-4" />{it.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {user && (
        <div className="m-3 p-3 rounded-xl border border-border flex items-center gap-3">
          <Avatar className="h-9 w-9"><AvatarImage src={user.avatar} /><AvatarFallback>{user.name[0]}</AvatarFallback></Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user.name}</div>
            <button onClick={logout} className="text-xs text-subtle hover:text-foreground">Log out</button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-border bg-card lg:hidden animate-in slide-in-from-left">
            {SidebarContent}
          </aside>
        </>
      )}

      <div className="flex-1 min-w-0">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center gap-3 px-4 sm:px-6 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-2" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
