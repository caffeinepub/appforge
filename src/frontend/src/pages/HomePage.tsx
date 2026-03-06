import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Layers,
  MessageSquare,
  Play,
  Plus,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react";
import { type Variants, motion } from "motion/react";
import { AppIcon } from "../components/AppIcon";
import { useListPublishedApps } from "../hooks/useQueries";

// ── Feature data ──────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Layers,
    title: "Visual Builder",
    desc: "Drag and drop buttons, forms, lists, and inputs onto multiple screens with a live phone preview.",
    gradient: "from-violet-500/20 to-blue-500/20",
    glow: "shadow-[0_0_30px_rgba(139,92,246,0.2)]",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    desc: "Describe your app idea in plain language. The AI builds your screens, fills in the details automatically.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    glow: "shadow-[0_0_30px_rgba(59,130,246,0.2)]",
  },
  {
    icon: Share2,
    title: "Instant Publishing",
    desc: "One click publishes your app to the public store. Anyone can browse, discover, and play your creation.",
    gradient: "from-emerald-500/20 to-teal-500/20",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.2)]",
  },
];

const HOW_IT_WORKS = [
  {
    num: "01",
    title: "Describe your app",
    desc: "Type your idea into the AI chat. It generates a name, description, and pre-built screens in seconds.",
    icon: MessageSquare,
  },
  {
    num: "02",
    title: "Design your screens",
    desc: "Use the drag-and-drop canvas to add buttons, forms, text, and lists. Arrange them however you like.",
    icon: Layers,
  },
  {
    num: "03",
    title: "Publish to the store",
    desc: "Hit publish and your app goes live instantly in the public App Store for the world to discover.",
    icon: Zap,
  },
];

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ── HomePage ──────────────────────────────────────────────────────────────────

export function HomePage() {
  const navigate = useNavigate();
  const { data: apps, isLoading } = useListPublishedApps();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        {/* Radial glow backgrounds */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, oklch(0.62 0.22 265 / 0.18) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.62 0.22 265 / 0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[300px] h-[300px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.18 290 / 0.06) 0%, transparent 70%)",
          }}
        />

        {/* Grid lines overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.97 0.005 250) 1px, transparent 1px), linear-gradient(90deg, oklch(0.97 0.005 250) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Free. No code. No limits.
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.0] mb-6"
          >
            Build your app.
            <br />
            <span className="gradient-text">Ship it free.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Design multi-screen mobile apps with drag-and-drop simplicity.
            Describe your idea and AI builds it for you — then publish to the
            world in one click.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.34,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              size="lg"
              className="gap-2 text-base px-8 h-13 rounded-2xl shadow-lg shadow-primary/25 font-semibold"
              onClick={() => navigate({ to: "/builder" })}
              data-ocid="hero.primary_button"
            >
              <Plus className="w-4 h-4" />
              Start Building
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 text-base px-8 h-13 rounded-2xl border-border/80 bg-card/50 backdrop-blur-sm hover:bg-card/80 font-medium"
              onClick={() => {
                document
                  .getElementById("store")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              data-ocid="hero.secondary_button"
            >
              Browse Store
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Social proof line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.52 }}
            className="text-xs text-muted-foreground/50 mt-8 tracking-wide"
          >
            Powered by Internet Computer · No sign-up · Free forever
          </motion.p>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p
            variants={fadeUp}
            className="text-primary text-sm font-semibold uppercase tracking-widest mb-3"
          >
            Everything you need
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight"
          >
            Build faster, ship smarter
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              className="relative bg-card rounded-3xl p-7 app-card-shadow border border-border/60 overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mb-5 ${feature.glow} group-hover:bg-primary/25 transition-colors duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>

                <h3 className="font-display text-lg font-bold text-foreground mb-2.5 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        {/* Background accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, oklch(0.62 0.22 265 / 0.05) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 border-y border-border/40 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p
              variants={fadeUp}
              className="text-primary text-sm font-semibold uppercase tracking-widest mb-3"
            >
              Dead simple workflow
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight"
            >
              From idea to live in minutes
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative"
          >
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                className="relative text-center md:text-left"
              >
                <div className="flex flex-col md:items-start items-center gap-4">
                  {/* Step number + icon */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-card border border-border app-card-shadow flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                      {i + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <p className="text-primary/70 text-xs font-mono font-bold tracking-widest mb-1">
                      {step.num}
                    </p>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Marvel Game Featured Banner ───────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl cursor-pointer group"
          style={{
            background:
              "linear-gradient(135deg, #1a0a0a 0%, #2d0808 40%, #1a0a18 70%, #0d0d1a 100%)",
            boxShadow:
              "0 4px 32px rgba(185, 28, 28, 0.25), 0 0 0 1px rgba(185, 28, 28, 0.15)",
          }}
          onClick={() => navigate({ to: "/marvel" })}
          data-ocid="marvel.button"
        >
          {/* Atmospheric glow */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at 20% 50%, rgba(239, 68, 68, 0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(234, 179, 8, 0.3) 0%, transparent 60%)",
            }}
          />

          <div className="relative flex items-center gap-6 px-8 py-6">
            <div className="text-5xl sm:text-6xl flex-shrink-0 drop-shadow-lg">
              👺
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "#ef4444" }}
                >
                  Marvel Battle Game
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: "rgba(239,68,68,0.2)",
                    color: "#fca5a5",
                  }}
                >
                  New
                </span>
              </div>
              <h3
                className="font-display text-xl sm:text-2xl font-bold mb-1"
                style={{ color: "#fef2f2" }}
              >
                Defeat the Green Goblin
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(254,226,226,0.6)" }}
              >
                Choose your Marvel hero, customize their costume & powers, then
                battle in turn-based combat.
              </p>
            </div>
            <div className="flex-shrink-0 hidden sm:flex items-center gap-2">
              <div className="flex -space-x-1 text-2xl">
                <span>🕷️</span>
                <span>🦾</span>
                <span>🛡️</span>
                <span>⚡</span>
                <span>🐾</span>
              </div>
            </div>
            <Button
              size="sm"
              className="flex-shrink-0 rounded-2xl px-5 h-9 font-semibold gap-2 group-hover:scale-105 transition-transform"
              style={{
                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                color: "white",
                boxShadow: "0 2px 12px rgba(185,28,28,0.5)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate({ to: "/marvel" });
              }}
              data-ocid="marvel.primary_button"
            >
              <Play className="w-3.5 h-3.5" />
              Play Now
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ── App Store Grid ────────────────────────────────────────────────── */}
      <section id="store" className="max-w-5xl mx-auto px-6 py-12 pb-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={staggerContainer}
          className="flex items-end justify-between mb-10"
        >
          <motion.div variants={fadeUp}>
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">
              Community
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              App Store
            </h2>
            <p className="text-muted-foreground text-sm mt-1.5">
              Apps built and published by people like you
            </p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-primary hover:text-primary rounded-xl"
              onClick={() => navigate({ to: "/builder" })}
              data-ocid="store.primary_button"
            >
              <Plus className="w-4 h-4" />
              Add yours
            </Button>
          </motion.div>
        </motion.div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="store.loading_state"
          >
            {(["a", "b", "c", "d", "e", "f"] as const).map((k) => (
              <div
                key={k}
                className="bg-card rounded-2xl p-5 app-card-shadow border border-border/40"
              >
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
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {apps.map((app, i) => (
              <motion.div
                key={app.id}
                variants={fadeUp}
                className="bg-card rounded-2xl p-5 app-card-shadow border border-border/40 transition-all duration-200 cursor-pointer group"
                onClick={() =>
                  navigate({ to: "/app/$appId", params: { appId: app.id } })
                }
                data-ocid={`store.item.${i + 1}`}
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
                      <span className="text-xs text-muted-foreground bg-muted/60 border border-border/40 px-2 py-0.5 rounded-full">
                        {app.screens.length} screen
                        {app.screens.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 rounded-xl h-9 text-sm gap-1 group-hover:shadow-md transition-shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({
                        to: "/app/$appId",
                        params: { appId: app.id },
                      });
                    }}
                    data-ocid={`store.item.${i + 1}`}
                  >
                    View App
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl h-9 px-3 text-sm gap-1 text-primary border-primary/20 bg-primary/5 hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({
                        to: "/play/$appId",
                        params: { appId: app.id },
                      });
                    }}
                    data-ocid={`store.item.${i + 1}`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    Play
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-3xl p-16 text-center app-card-shadow border border-border/40"
            data-ocid="store.empty_state"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(98,72,230,0.2)]">
              <Layers className="w-9 h-9 text-primary/70" />
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
              data-ocid="store.primary_button"
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
