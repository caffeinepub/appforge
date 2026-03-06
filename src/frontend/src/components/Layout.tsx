import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { AppWindow, LogIn, LogOut, Plus, Swords } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { identity, login, clear } = useInternetIdentity();
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  const principalStr = identity?.getPrincipal().toString();
  const shortPrincipal = principalStr
    ? `${principalStr.slice(0, 5)}...${principalStr.slice(-3)}`
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/70 backdrop-blur-xl border-b border-border/60 shadow-[0_1px_0_oklch(0.22_0.015_260)]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center gap-2.5 group flex-shrink-0"
            data-ocid="nav.link"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
              <AppWindow className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-white tracking-tight">
              AppStore
            </span>
          </Link>

          <nav className="flex items-center gap-1 flex-1 justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 rounded-xl h-8 text-sm px-3 text-muted-foreground hover:text-foreground hidden sm:flex"
              onClick={() => navigate({ to: "/marvel" })}
              data-ocid="nav.link"
            >
              <Swords className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Marvel Game</span>
              <span className="md:hidden">Game</span>
            </Button>

            <Button
              size="sm"
              className="gap-2 rounded-xl h-8 text-sm px-3 sm:px-4"
              onClick={() => navigate({ to: "/builder" })}
              data-ocid="nav.primary_button"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Create App</span>
            </Button>

            {identity ? (
              <div className="flex items-center gap-2 ml-1">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/60 border border-border hidden sm:flex">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                    {shortPrincipal?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {shortPrincipal}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-xl h-8 text-sm px-3"
                  onClick={clear}
                  data-ocid="nav.secondary_button"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 rounded-xl h-8 text-sm px-3 ml-1"
                onClick={login}
                data-ocid="nav.secondary_button"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <AppWindow className="w-3 h-3 text-primary/60" />
            </div>
            <span className="font-medium text-foreground/70">AppStore</span>
          </div>
          <p className="text-xs">
            © {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/80 hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
