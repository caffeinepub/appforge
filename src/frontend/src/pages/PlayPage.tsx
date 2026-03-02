import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AppIcon } from "../components/AppIcon";
import { useGetApp } from "../hooks/useQueries";
import type { AppComponent } from "../types/builder";
import { parseScreenContent } from "../types/builder";

// ── Interactive phone component ────────────────────────────────────────────────

interface InteractiveComponentProps {
  component: AppComponent;
  inputValues: Record<string, string>;
  selectedListItems: Record<string, number | null>;
  onInput: (id: string, value: string) => void;
  onListSelect: (id: string, index: number) => void;
  onButtonClick: () => void;
}

function InteractiveComponent({
  component,
  inputValues,
  selectedListItems,
  onInput,
  onListSelect,
  onButtonClick,
}: InteractiveComponentProps) {
  switch (component.type) {
    case "button":
      return (
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          onClick={onButtonClick}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-3.5 px-4 rounded-2xl text-sm font-semibold shadow-md shadow-blue-500/25 cursor-pointer select-none"
        >
          {component.label}
        </motion.button>
      );

    case "text":
      return (
        <p className="text-sm text-gray-700 leading-relaxed">
          {component.label}
        </p>
      );

    case "input": {
      const inputId = `input-${component.id}`;
      return (
        <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <label
            htmlFor={inputId}
            className="block px-4 pt-3 text-xs font-medium text-gray-500"
          >
            {component.label}
          </label>
          <input
            id={inputId}
            type="text"
            className="w-full px-4 pb-3 pt-1 text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
            placeholder={
              (component as { placeholder?: string }).placeholder ||
              "Enter text..."
            }
            value={inputValues[component.id] ?? ""}
            onChange={(e) => onInput(component.id, e.target.value)}
          />
        </div>
      );
    }

    case "list": {
      const items = (component as { items?: string[] }).items ?? [];
      const selected = selectedListItems[component.id] ?? null;
      return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {component.label}
            </p>
          </div>
          {items.map((item, idx) => (
            <motion.button
              key={item}
              type="button"
              whileTap={{ backgroundColor: "rgba(59, 130, 246, 0.08)" }}
              onClick={() => onListSelect(component.id, idx)}
              className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 text-left transition-colors ${
                selected === idx ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  selected === idx ? "bg-blue-500" : "bg-gray-100"
                }`}
              >
                <span
                  className={`text-xs font-bold ${selected === idx ? "text-white" : "text-gray-500"}`}
                >
                  {idx + 1}
                </span>
              </div>
              <span
                className={`text-sm ${selected === idx ? "font-semibold text-blue-700" : "text-gray-700"}`}
              >
                {item}
              </span>
              <ChevronRight
                className={`w-3.5 h-3.5 ml-auto transition-colors ${selected === idx ? "text-blue-400" : "text-gray-300"}`}
              />
            </motion.button>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}

// ── Play Page ──────────────────────────────────────────────────────────────────

export function PlayPage() {
  const { appId } = useParams({ from: "/play/$appId" });
  const navigate = useNavigate();
  const { data: app, isLoading, isError } = useGetApp(appId);

  const [screenIndex, setScreenIndex] = useState(0);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [selectedListItems, setSelectedListItems] = useState<
    Record<string, number | null>
  >({});
  const [showEnd, setShowEnd] = useState(false);

  // Reset per-screen state when screen changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally depends on screenIndex to reset state
  useEffect(() => {
    setInputValues({});
    setSelectedListItems({});
    setShowEnd(false);
  }, [screenIndex]);

  const screens = app?.screens ?? [];
  const currentScreen = screens[screenIndex];
  const components = currentScreen
    ? parseScreenContent(currentScreen.content)
    : [];
  const totalScreens = screens.length;

  const handleButtonClick = useCallback(() => {
    if (screenIndex < totalScreens - 1) {
      setScreenIndex((i) => i + 1);
    } else {
      setShowEnd(true);
      toast.success("🎉 The End!", {
        description: "You've completed all screens of this app.",
        duration: 3000,
      });
    }
  }, [screenIndex, totalScreens]);

  const handleInput = useCallback((id: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleListSelect = useCallback((id: string, index: number) => {
    setSelectedListItems((prev) => ({ ...prev, [id]: index }));
  }, []);

  const goToPrev = () => {
    setScreenIndex((i) => Math.max(0, i - 1));
    setShowEnd(false);
  };

  const goToNext = () => {
    if (screenIndex < totalScreens - 1) {
      setScreenIndex((i) => i + 1);
      setShowEnd(false);
    }
  };

  const restart = () => {
    setScreenIndex(0);
    setShowEnd(false);
    setInputValues({});
    setSelectedListItems({});
  };

  // ── Loading state ────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Skeleton className="h-8 w-28 mb-10" />
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="w-20 h-20 rounded-3xl" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="mt-10 flex justify-center">
            <Skeleton className="w-[300px] h-[580px] rounded-[3rem]" />
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────────

  if (isError || !app) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <AlertTriangle className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          App Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          This app doesn't exist or has been removed.
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

  // ── No screens state ─────────────────────────────────────────────────────────

  if (screens.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <Gamepad2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          No screens to play
        </h2>
        <p className="text-muted-foreground mb-6">
          This app has no screens yet. Add some in the builder!
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() =>
              navigate({ to: "/app/$appId", params: { appId: app.id } })
            }
            className="gap-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  // ── Main play view ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-sm mx-auto px-5 py-8 flex flex-col items-center">
        {/* Back button */}
        <div className="w-full mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 -ml-2 rounded-xl text-muted-foreground hover:text-foreground"
            onClick={() =>
              navigate({ to: "/app/$appId", params: { appId: app.id } })
            }
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* App identity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-3 mb-8"
        >
          <AppIcon icon={app.icon} name={app.name} size="lg" />
          <div className="text-center">
            <h1 className="font-display text-xl font-bold text-foreground">
              {app.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5 justify-center">
              <Gamepad2 className="w-3.5 h-3.5" />
              Interactive Preview
            </p>
          </div>
        </motion.div>

        {/* Phone frame */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full"
        >
          <div
            className="phone-frame w-full max-w-[300px] rounded-[3rem] p-3.5 mx-auto"
            style={{
              background: "linear-gradient(145deg, #f5f5f7, #e8e8ed)",
              boxShadow:
                "0 0 0 1px rgba(0,0,0,0.12), 0 12px 48px rgba(0,0,0,0.20), inset 0 0 0 1px rgba(255,255,255,0.45)",
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
            <div
              className="bg-white rounded-[2.2rem] overflow-hidden flex flex-col"
              style={{ minHeight: 460 }}
            >
              {/* Nav bar */}
              <div className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-100 px-5 py-3.5 flex-shrink-0">
                <p className="text-sm font-semibold text-gray-800 text-center truncate">
                  {currentScreen?.title ?? ""}
                </p>
              </div>

              {/* Content area */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 overscroll-contain">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={screenIndex}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="space-y-3"
                  >
                    {showEnd ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-16 text-center px-4"
                      >
                        <div className="text-4xl mb-4">🎉</div>
                        <h2 className="font-display text-lg font-bold text-gray-800 mb-1">
                          The End!
                        </h2>
                        <p className="text-sm text-gray-500 mb-5">
                          You've reached the end of this app.
                        </p>
                        <button
                          type="button"
                          onClick={restart}
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-transform"
                        >
                          Play Again
                        </button>
                      </motion.div>
                    ) : components.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                          <Gamepad2 className="w-5 h-5 text-gray-300" />
                        </div>
                        <p className="text-xs text-gray-400 font-medium">
                          Empty screen
                        </p>
                      </div>
                    ) : (
                      components.map((comp) => (
                        <InteractiveComponent
                          key={comp.id}
                          component={comp}
                          inputValues={inputValues}
                          selectedListItems={selectedListItems}
                          onInput={handleInput}
                          onListSelect={handleListSelect}
                          onButtonClick={handleButtonClick}
                        />
                      ))
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Home indicator */}
            <div className="mt-3 flex justify-center">
              <div className="bg-foreground/20 rounded-full h-1 w-24" />
            </div>
          </div>
        </motion.div>

        {/* Navigation controls */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-4 mt-7"
        >
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-full"
            disabled={screenIndex === 0}
            onClick={goToPrev}
            aria-label="Previous screen"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex flex-col items-center gap-1 min-w-[80px]">
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {screenIndex + 1} / {totalScreens}
            </span>
            <p className="text-xs text-muted-foreground truncate max-w-[130px] text-center">
              {currentScreen?.title}
            </p>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-full"
            disabled={screenIndex === totalScreens - 1}
            onClick={goToNext}
            aria-label="Next screen"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Screen dot indicators */}
        {totalScreens > 1 && (
          <div className="flex items-center gap-1.5 mt-4">
            {screens.map((_, i) => (
              <button
                key={screens[i].id}
                type="button"
                aria-label={`Go to screen ${i + 1}`}
                onClick={() => {
                  setScreenIndex(i);
                  setShowEnd(false);
                }}
                className={`rounded-full transition-all duration-200 ${
                  i === screenIndex
                    ? "w-5 h-2 bg-primary"
                    : "w-2 h-2 bg-muted-foreground/25 hover:bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
