import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/unauthorized")({
  head: () => ({ meta: [{ title: "Access denied — BlogSphere AI" }] }),
  component: () => (
    <PageShell>
      <div className="mx-auto max-w-md text-center py-32 px-4">
        <div className="inline-grid place-items-center h-20 w-20 rounded-2xl bg-destructive/10 text-destructive mb-6">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold">Access denied</h1>
        <p className="mt-3 text-muted-foreground">You don’t have permission to view this page. If you think this is a mistake, contact an administrator.</p>
        <div className="mt-8 flex gap-3 justify-center">
          <Button asChild variant="hero"><Link to="/">Go home</Link></Button>
          <Button asChild variant="outline"><Link to="/login">Switch account</Link></Button>
        </div>
      </div>
    </PageShell>
  ),
});
