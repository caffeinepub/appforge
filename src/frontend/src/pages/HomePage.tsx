import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  Layers,
  Plus,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { AppIcon } from "../components/AppIcon";
import { useListPublishedApps } from "../hooks/useQueries";

// Sample published apps for initial load (shown as skeleton until data loads)
const FEATURE_BLURBS = [
  {
    icon: Layers,
    title: "Visual Screen Builder",
    desc: "Drag and drop components onto multiple screens with live preview.",
  },
  {
    icon: Zap,
    title: "Instant Publishing",
    desc: "Publish your app to the store in one click — no code required.",
  },
  {
    icon: Share2,
    title: "Public App Store",
    desc: "Share your creation with the world from your own app listing page.",
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const { data: apps, isLoading } = useListPublishedApps();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url(/assets/generated/hero-appforge.dim_1600x800.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Free. No code. No limits.
            </div>

            <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.05]">
              Build your app.
              <br />
              <span className="gradient-text">Publish it free.</span>
            </h1>

            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Design multi-screen mobile apps with drag-and-drop simplicity. Add
              forms, lists, and buttons — then share your creation with the
              world.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="gap-2 text-base px-8 h-12 rounded-xl shadow-lg shadow-primary/20"
                onClick={() => navigate({ to: "/builder" })}
              >
                <Plus className="w-4 h-4" />
                Create Your App
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 text-base px-8 h-12 rounded-xl"
                onClick={() => {
                  document
                    .getElementById("store")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Browse App Store
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature blurbs */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURE_BLURBS.map((blurb, i) => (
            <motion.div
              key={blurb.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1 + i * 0.08,
                ease: "easeOut",
              }}
              className="bg-card rounded-2xl p-6 app-card-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <blurb.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-base font-semibold text-foreground mb-1.5">
                {blurb.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {blurb.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* App Store Grid */}
      <section id="store" className="max-w-5xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">
              App Store
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Apps built and published by the community
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-primary hover:text-primary"
            onClick={() => navigate({ to: "/builder" })}
          >
            <Plus className="w-4 h-4" />
            Add yours
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(["a", "b", "c", "d", "e", "f"] as const).map((k) => (
              <div key={k} className="bg-card rounded-2xl p-5 app-card-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <Skeleton className="w-16 h-16 rounded-2xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : apps && apps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {apps.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
                className="bg-card rounded-2xl p-5 app-card-shadow transition-all duration-200 cursor-pointer group"
                onClick={() =>
                  navigate({ to: "/app/$appId", params: { appId: app.id } })
                }
              >
                <div className="flex items-start gap-4 mb-4">
                  <AppIcon icon={app.icon} name={app.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-foreground text-base truncate">
                      {app.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mt-0.5">
                      {app.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {app.screens.length} screen
                        {app.screens.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full rounded-xl h-9 text-sm gap-1 group-hover:shadow-md transition-shadow"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: "/app/$appId", params: { appId: app.id } });
                  }}
                >
                  View App
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-3xl p-16 text-center app-card-shadow"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6">
              <Layers className="w-9 h-9 text-primary/60" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No apps published yet
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
              Be the first to build and publish an app. It only takes a few
              minutes.
            </p>
            <Button
              className="gap-2 rounded-xl"
              onClick={() => navigate({ to: "/builder" })}
            >
              <Plus className="w-4 h-4" />
              Create the First App
            </Button>
          </motion.div>
        )}
      </section>
    </div>
  );
}
