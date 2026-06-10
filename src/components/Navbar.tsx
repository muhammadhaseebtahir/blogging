import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/blogs", label: "Explore" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashHref =
    user?.role === "admin" ? "/admin/dashboard" :
    user?.role === "poster" ? "/poster/dashboard" :
    user?.role === "user" ? "/profile" : "/login";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-smooth ${
        scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-purple-gradient shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <span>BlogSphere<span className="text-primary-glow"> AI</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm transition-smooth ${
                path === l.to ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="h-9 w-9 ring-2 ring-primary/40 ring-offset-2 ring-offset-background">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
                {user.role !== "user" && (
                  <DropdownMenuItem asChild><Link to={dashHref}>Dashboard</Link></DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/login">Log in</Link></Button>
              <Button asChild variant="hero" size="sm"><Link to="/register">Get started</Link></Button>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background shadow-card">
          <div className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-lg text-sm text-foreground hover:bg-card transition-smooth"
              >
                {l.label}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            {user ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-sm hover:bg-card">Profile</Link>
                {user.role !== "user" && (
                  <Link to={dashHref} onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-sm hover:bg-card">Dashboard</Link>
                )}
                <Button variant="outline" size="sm" onClick={() => { logout(); setOpen(false); }}>Log out</Button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Button asChild variant="outline" size="sm" className="flex-1" onClick={() => setOpen(false)}><Link to="/login">Log in</Link></Button>
                <Button asChild variant="hero" size="sm" className="flex-1" onClick={() => setOpen(false)}><Link to="/register">Sign up</Link></Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
