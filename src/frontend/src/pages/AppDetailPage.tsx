import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Loader2,
  Monitor,
  Share2,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AppIcon } from "../components/AppIcon";
import { useGetApp, useUnpublishApp } from "../hooks/useQueries";
import { parseScreenContent } from "../types/builder";
import type { AppComponent } from "../types/builder";

// ── Phone Preview Component ────────────────────────────────────────────────────

function PhonePreview({
  components,
  title,
}: { components: AppComponent[]; title: string }) {
  return (
    <div
      className="phone-frame w-[260px] rounded-[3rem] p-3.5 mx-auto"
      style={{
        background: "linear-gradient(145deg, #f5f5f7, #e8e8ed)",
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.12), 0 8px 32px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.4)",
      }}
    >
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 mb-2">
        <span className="text-[10px] font-semibold text-foreground/60">
          9:41
        </span>
        <div className="bg-foreground/10 rounded-full h-6 w-24" />
        <div className="flex gap-1">
          <div className="w-3 h-2 bg-foreground/30 rounded-sm" />
          <div className="w-2 h-2 bg-foreground/30 rounded-full" />
        </div>
      </div>

      {/* Screen */}
      <div className="bg-white rounded-[2.2rem] min-h-[420px] overflow-hidden flex flex-col">
        {/* Navigation bar */}
        <div className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-100 px-5 py-3.5">
          <p className="text-sm font-semibold text-gray-800 text-center">
            {title}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {components.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Monitor className="w-8 h-8 text-gray-200 mb-2" />
              <p className="text-xs text-gray-300 font-medium">Empty screen</p>
            </div>
          ) : (
            components.map((comp) => (
              <RichPhoneComponent key={comp.id} component={comp} />
            ))
          )}
        </div>
      </div>

      {/* Home indicator */}
      <div className="mt-3 flex justify-center">
        <div className="bg-foreground/20 rounded-full h-1 w-24" />
      </div>
    </div>
  );
}

function RichPhoneComponent({ component }: { component: AppComponent }) {
  switch (component.type) {
    case "button":
      return (
        <button
          type="button"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-3 px-4 rounded-2xl text-sm font-semibold shadow-md shadow-blue-500/20 active:scale-95 transition-transform"
        >
          {component.label}
        </button>
      );
    case "text":
      return (
        <p className="text-sm text-gray-700 leading-relaxed">
          {component.label}
        </p>
      );
    case "input":
      return (
        <div className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-0.5">
            {component.label}
          </p>
          <p className="text-sm text-gray-400">
            {(component as { placeholder?: string }).placeholder ||
              "Enter text..."}
          </p>
        </div>
      );
    case "list": {
      const items = (component as { items?: string[] }).items ?? [];
      return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              {component.label}
            </p>
          </div>
          {items.map((item, idx) => (
            <div
              key={item}
              className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-blue-600">
                  {idx + 1}
                </span>
              </div>
              <span className="text-sm text-gray-700">{item}</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 ml-auto" />
            </div>
          ))}
        </div>
      );
    }
    default:
      return null;
  }
}

// ── Screenshots carousel ───────────────────────────────────────────────────────

function ScreenshotCarousel({
  screenshots,
}: { screenshots: Array<{ getDirectURL: () => string }> }) {
  if (screenshots.length === 0) return null;

  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">
        Screenshots
      </h3>
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {screenshots.map((ss, i) => (
            <img
              key={ss.getDirectURL()}
              src={ss.getDirectURL()}
              alt={`Screenshot ${i + 1}`}
              className="w-48 h-80 object-cover rounded-2xl flex-shrink-0 snap-start shadow-sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main App Detail Page ───────────────────────────────────────────────────────

export function AppDetailPage() {
  const { appId } = useParams({ from: "/app/$appId" });
  const navigate = useNavigate();
  const { data: app, isLoading, isError } = useGetApp(appId);
  const unpublishApp = useUnpublishApp();

  const [selectedScreenIndex, setSelectedScreenIndex] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const selectedScreen = app?.screens[selectedScreenIndex];
  const selectedComponents = selectedScreen
    ? parseScreenContent(selectedScreen.content)
    : [];

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await unpublishApp.mutateAsync(appId);
      toast.success("App removed from the store");
      navigate({ to: "/" });
    } catch {
      toast.error("Failed to delete app");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
    toast.success("Link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="flex items-start gap-6">
          <Skeleton className="w-24 h-24 rounded-3xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !app) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <AlertTriangle className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          App Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          This app doesn't exist or has been removed from the store.
        </p>
        <Button
          onClick={() => navigate({ to: "/" })}
          className="gap-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to App Store
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 mb-8 -ml-2 rounded-xl text-muted-foreground hover:text-foreground"
          onClick={() => navigate({ to: "/" })}
        >
          <ArrowLeft className="w-4 h-4" />
          App Store
        </Button>

        {/* App header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-start gap-6 mb-10"
        >
          <AppIcon icon={app.icon} name={app.name} size="xl" />

          <div className="flex-1 min-w-0">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              {app.name}
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-4 max-w-xl">
              {app.description}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                className="gap-2 rounded-xl h-10 px-5"
                onClick={() =>
                  navigate({ to: "/builder/$appId", params: { appId: app.id } })
                }
              >
                <Edit3 className="w-4 h-4" />
                Edit App
              </Button>
              <Button
                variant="outline"
                className="gap-2 rounded-xl h-10 px-4"
                onClick={handleShare}
              >
                {showCopied ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                {showCopied ? "Copied!" : "Share"}
              </Button>
              <Button
                variant="outline"
                className="gap-2 rounded-xl h-10 px-4 text-destructive hover:bg-destructive/5 border-destructive/20"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-6 py-4 border-y border-border mb-10"
        >
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-foreground">
              {app.screens.length}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Screens</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-foreground">
              {app.screens.reduce(
                (sum, s) => sum + parseScreenContent(s.content).length,
                0,
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Components</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-foreground">
              {app.screenshots.length}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Screenshots</p>
          </div>
          <div className="ml-auto">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                app.isPublished
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${app.isPublished ? "bg-success" : "bg-muted-foreground/40"}`}
              />
              {app.isPublished ? "Published" : "Draft"}
            </span>
          </div>
        </motion.div>

        {/* Screenshots */}
        {app.screenshots.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-12"
          >
            <ScreenshotCarousel screenshots={app.screenshots} />
          </motion.div>
        )}

        {/* Live Screen Preview */}
        {app.screens.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-6">
              Screen Preview
            </h3>

            <div className="flex gap-8 items-start">
              {/* Screen tabs */}
              <div className="flex-shrink-0 w-44 space-y-1">
                {app.screens.map((screen, i) => (
                  <button
                    type="button"
                    key={screen.id}
                    onClick={() => setSelectedScreenIndex(i)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                      i === selectedScreenIndex
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        i === selectedScreenIndex
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium truncate">
                      {screen.title}
                    </span>
                  </button>
                ))}
              </div>

              {/* Phone preview */}
              <div className="flex-1 flex justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedScreenIndex}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PhonePreview
                      components={selectedComponents}
                      title={selectedScreen?.title ?? ""}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Prev/next arrows */}
            {app.screens.length > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-9 h-9 rounded-full"
                  disabled={selectedScreenIndex === 0}
                  onClick={() => setSelectedScreenIndex((i) => i - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {selectedScreenIndex + 1} / {app.screens.length}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-9 h-9 rounded-full"
                  disabled={selectedScreenIndex === app.screens.length - 1}
                  onClick={() => setSelectedScreenIndex((i) => i + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-2">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <DialogTitle className="font-display text-center">
              Delete "{app.name}"?
            </DialogTitle>
            <DialogDescription className="text-center">
              This will remove your app from the App Store. This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1 rounded-xl"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete App"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
