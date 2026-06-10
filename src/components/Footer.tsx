import { Link } from "@tanstack/react-router";
import { Github, Twitter, Linkedin, Youtube, Mail, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const cols = [
  {
    title: "Discover",
    links: [
      { label: "Explore Blogs", to: "/blogs" },
      { label: "Trending", to: "/blogs" },
      { label: "Categories", to: "/blogs" },
      { label: "Featured Writers", to: "/blogs" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Become a Blogger", to: "/register" },
      { label: "Sign in", to: "/login" },
      { label: "Writer Guidelines", to: "/blogs" },
      { label: "Code of Conduct", to: "/blogs" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", to: "/blogs" },
      { label: "AI Categorization", to: "/blogs" },
      { label: "Moderation Policy", to: "/blogs" },
      { label: "API Status", to: "/blogs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/blogs" },
      { label: "Careers", to: "/blogs" },
      { label: "Press Kit", to: "/blogs" },
      { label: "Contact", to: "/blogs" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/blogs" },
      { label: "Terms of Service", to: "/blogs" },
      { label: "Cookie Policy", to: "/blogs" },
      { label: "DMCA", to: "/blogs" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-card mt-24 overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[800px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16">
        {/* Newsletter */}
        <div className="rounded-3xl border border-border bg-background/50 backdrop-blur-xl p-6 sm:p-10 grid lg:grid-cols-2 gap-6 items-center mb-14">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold">Stay in the loop</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Weekly handpicked reads, AI insights and writer spotlights — straight to your inbox.
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
              <Input type="email" placeholder="you@email.com" className="pl-9 bg-card border-border h-12" />
            </div>
            <Button variant="hero" size="lg">Subscribe <ArrowRight className="h-4 w-4" /></Button>
          </form>
        </div>

        {/* Link columns */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-semibold text-sm mb-4 tracking-wide uppercase text-foreground/90">{c.title}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="hover:text-primary-glow transition-smooth">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-subtle">© {new Date().getFullYear()} All rights reserved.</p>
          <div className="flex items-center gap-2">
            {[
              { I: Twitter, label: "Twitter" },
              { I: Github, label: "GitHub" },
              { I: Linkedin, label: "LinkedIn" },
              { I: Youtube, label: "YouTube" },
            ].map(({ I, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="grid place-items-center h-9 w-9 rounded-lg border border-border text-muted-foreground hover:text-primary-glow hover:border-primary transition-smooth"
              >
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
