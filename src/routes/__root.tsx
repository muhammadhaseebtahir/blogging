import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter,
  HeadContent, Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="min-h-screen grid place-items-center px-4 bg-background">
      <div className="text-center max-w-md">
        <div className="text-[8rem] leading-none font-black text-gradient">404</div>
        <h2 className="text-2xl font-semibold mt-2">This page wandered off</h2>
        <p className="text-muted-foreground mt-3">
          The page you’re looking for doesn’t exist or has been moved. Let’s get you back on track.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link to="/" className="inline-flex h-10 items-center rounded-md bg-purple-gradient px-5 text-sm font-medium text-white shadow-glow">Go home</Link>
          <Link to="/blogs" className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm">Browse blogs</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex gap-2 justify-center">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm text-primary-foreground"
          >Try again</button>
          <a href="/" className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BlogSphere AI — Smart Blogging, Auto Categorized" },
      { name: "description", content: "AI-powered blogging platform with automated categorization and smart moderation." },
      { property: "og:title", content: "BlogSphere AI — Smart Blogging, Auto Categorized" },
      { property: "og:description", content: "AI-powered blogging platform with automated categorization and smart moderation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "BlogSphere AI — Smart Blogging, Auto Categorized" },
      { name: "twitter:description", content: "AI-powered blogging platform with automated categorization and smart moderation." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3d44d8eb-2c10-4433-a587-bd03ea0389bd/id-preview-5cec2989--d825a730-93be-42b5-a664-9b4592ccd94a.lovable.app-1778267140972.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3d44d8eb-2c10-4433-a587-bd03ea0389bd/id-preview-5cec2989--d825a730-93be-42b5-a664-9b4592ccd94a.lovable.app-1778267140972.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
