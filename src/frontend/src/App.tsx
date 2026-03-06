import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AppWindow, Loader2, LogIn } from "lucide-react";
import { motion } from "motion/react";
import { Layout } from "./components/Layout";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { AppDetailPage } from "./pages/AppDetailPage";
import { BuilderPage } from "./pages/BuilderPage";
import { HomePage } from "./pages/HomePage";
import { MarvelGamePage } from "./pages/MarvelGamePage";
import { PlayPage } from "./pages/PlayPage";

// ── Auth Gate ─────────────────────────────────────────────────────────────────

function AuthGate({ children }: { children: React.ReactNode }) {
  const { identity, login, isInitializing, isLoggingIn } =
    useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div
          className="flex flex-col items-center gap-4"
          data-ocid="auth.loading_state"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading AppStore…</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <LoginPage onLogin={login} isLoggingIn={isLoggingIn} />;
  }

  return <>{children}</>;
}

// ── Login / Welcome Page ──────────────────────────────────────────────────────

function LoginPage({
  onLogin,
  isLoggingIn,
}: { onLogin: () => void; isLoggingIn: boolean }) {
  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="auth.modal"
    >
      {/* Dark atmospheric backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 20%, oklch(0.62 0.22 265 / 0.18) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 80%, oklch(0.78 0.18 290 / 0.08) 0%, transparent 70%)",
          }}
        />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.97 0.005 250) 1px, transparent 1px), linear-gradient(90deg, oklch(0.97 0.005 250) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.55 0.24 285))",
                boxShadow:
                  "0 0 0 1px oklch(0.62 0.22 265 / 0.4), 0 8px 32px oklch(0.62 0.22 265 / 0.4)",
              }}
            >
              <AppWindow className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-display text-4xl font-bold text-foreground mb-3 tracking-tight"
          >
            AppStore
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-muted-foreground text-lg mb-2 leading-relaxed"
          >
            Build apps. Play games.
            <br />
            Share with the world.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-muted-foreground/50 text-sm mb-10"
          >
            Sign in to create apps, customize Marvel heroes, and publish to the
            store.
          </motion.p>

          {/* Glass card wrapper for the button */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-2xl p-5 bg-card/50 border border-border/50 backdrop-blur-md"
            style={{
              boxShadow:
                "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <Button
              size="lg"
              className="w-full rounded-xl text-base gap-2.5 font-semibold"
              style={{
                height: "52px",
                boxShadow: "0 4px 20px oklch(0.62 0.22 265 / 0.35)",
              }}
              onClick={onLogin}
              disabled={isLoggingIn}
              data-ocid="auth.primary_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In with Internet Identity
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground/40 mt-3 text-center">
              Free forever · No passwords · Powered by Internet Computer
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-border/30">
        <p className="text-xs text-muted-foreground/40">
          © {new Date().getFullYear()} AppStore · Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/60 hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

// ── Routes ────────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <AuthGate>
      <Layout>
        <Outlet />
      </Layout>
      <Toaster richColors position="top-right" />
    </AuthGate>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const builderNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/builder",
  component: BuilderPage,
});

const builderEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/builder/$appId",
  component: BuilderPage,
});

const appDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app/$appId",
  component: AppDetailPage,
});

const playRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/play/$appId",
  component: PlayPage,
});

const marvelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marvel",
  component: MarvelGamePage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  builderNewRoute,
  builderEditRoute,
  appDetailRoute,
  playRoute,
  marvelRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return <RouterProvider router={router} />;
}
