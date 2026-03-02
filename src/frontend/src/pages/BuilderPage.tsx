import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlignLeft,
  ArrowLeft,
  BookMarked,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  GripVertical,
  ImagePlus,
  List,
  Loader2,
  Monitor,
  Plus,
  Square,
  Trash2,
  Type,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { AppIcon } from "../components/AppIcon";
import {
  fileToExternalBlob,
  useAddScreen,
  useAddScreenshot,
  useCreateApp,
  useDeleteScreen,
  useEditScreen,
  useGetApp,
  usePublishApp,
  useUnpublishApp,
  useUploadIcon,
} from "../hooks/useQueries";
import type { AppComponent } from "../types/builder";
import { parseScreenContent, stringifyScreenContent } from "../types/builder";

// ── Step 1: App Details ────────────────────────────────────────────────────────

interface DetailsStepProps {
  appId: string | null;
  onNext: (id: string) => void;
}

function DetailsStep({ appId, onNext }: DetailsStepProps) {
  const navigate = useNavigate();
  const { data: existingApp, isLoading: appLoading } = useGetApp(
    appId ?? undefined,
  );
  const createApp = useCreateApp();
  const uploadIcon = useUploadIcon();
  const addScreenshot = useAddScreenshot();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconUploading, setIconUploading] = useState(false);
  const [screenshotUploading, setScreenshotUploading] = useState(false);

  const iconInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  // Populate form if editing
  useEffect(() => {
    if (existingApp) {
      setName(existingApp.name);
      setDescription(existingApp.description);
      if (existingApp.icon) {
        setIconPreview(existingApp.icon.getDirectURL());
      }
      if (existingApp.screenshots.length > 0) {
        setScreenshotPreviews(
          existingApp.screenshots.map((s) => s.getDirectURL()),
        );
      }
    }
  }, [existingApp]);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    const url = URL.createObjectURL(file);
    setIconPreview(url);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setScreenshotFiles((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setScreenshotPreviews((prev) => [...prev, ...previews]);
  };

  const removeScreenshot = (i: number) => {
    setScreenshotFiles((prev) => prev.filter((_, idx) => idx !== i));
    setScreenshotPreviews((prev) => {
      URL.revokeObjectURL(prev[i]);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter an app name");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    setIsSubmitting(true);
    try {
      let currentAppId = appId;

      // Create or reuse app
      if (!currentAppId) {
        const app = await createApp.mutateAsync({
          id: crypto.randomUUID(),
          name: name.trim(),
          description: description.trim(),
        });
        currentAppId = app.id;
      }

      // Upload icon if new file selected
      if (iconFile && currentAppId) {
        setIconUploading(true);
        try {
          const blob = await fileToExternalBlob(iconFile);
          await uploadIcon.mutateAsync({ appId: currentAppId, icon: blob });
        } finally {
          setIconUploading(false);
        }
      }

      // Upload new screenshots
      if (screenshotFiles.length > 0 && currentAppId) {
        setScreenshotUploading(true);
        try {
          await Promise.all(
            screenshotFiles.map(async (file) => {
              const blob = await fileToExternalBlob(file);
              await addScreenshot.mutateAsync({
                appId: currentAppId!,
                screenshot: blob,
              });
            }),
          );
        } finally {
          setScreenshotUploading(false);
        }
      }

      toast.success("App details saved!");
      onNext(currentAppId!);
    } catch (err) {
      toast.error("Failed to save. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (appId && appLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground mb-1">
          App Details
        </h2>
        <p className="text-muted-foreground text-sm">
          Tell us about your app — this will appear on your App Store listing.
        </p>
      </div>

      <div className="space-y-6">
        {/* Icon */}
        <div>
          <Label className="text-sm font-medium mb-3 block">App Icon</Label>
          <div className="flex items-center gap-5">
            {iconPreview ? (
              <img
                src={iconPreview}
                alt="App icon"
                className="w-20 h-20 rounded-2xl object-cover shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center">
                <ImagePlus className="w-7 h-7 text-muted-foreground/50" />
              </div>
            )}
            <div>
              <input
                ref={iconInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleIconChange}
              />
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg gap-2"
                onClick={() => iconInputRef.current?.click()}
              >
                <Upload className="w-3.5 h-3.5" />
                {iconPreview ? "Change Icon" : "Upload Icon"}
              </Button>
              <p className="text-xs text-muted-foreground mt-1.5">
                PNG, JPG up to 5MB. 1024×1024 recommended.
              </p>
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="app-name" className="text-sm font-medium mb-2 block">
            App Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="app-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. TaskFlow, MyNotes, WeatherPulse"
            className="h-11 rounded-xl"
            maxLength={50}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {name.length}/50 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <Label
            htmlFor="app-description"
            className="text-sm font-medium mb-2 block"
          >
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="app-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what your app does and who it's for..."
            className="rounded-xl min-h-[100px] resize-none"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {description.length}/500 characters
          </p>
        </div>

        {/* Screenshots */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Screenshots</Label>
          <div className="flex items-start gap-3 flex-wrap">
            {screenshotPreviews.map((preview, i) => (
              <div key={preview} className="relative group">
                <img
                  src={preview}
                  alt={`Screenshot ${i + 1}`}
                  className="w-24 h-40 rounded-xl object-cover shadow-sm"
                />
                {i >= (existingApp?.screenshots.length ?? 0) && (
                  <button
                    type="button"
                    onClick={() =>
                      removeScreenshot(
                        i - (existingApp?.screenshots.length ?? 0),
                      )
                    }
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => screenshotInputRef.current?.click()}
              className="w-24 h-40 rounded-xl border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              <input
                ref={screenshotInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleScreenshotChange}
              />
              <Plus className="w-5 h-5 text-muted-foreground/60" />
              <span className="text-xs text-muted-foreground/60">Add</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Add screenshots to showcase your app's screens.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="ghost"
            className="gap-2 rounded-xl"
            onClick={() => navigate({ to: "/" })}
          >
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            className="gap-2 rounded-xl flex-1"
            onClick={handleSubmit}
            disabled={isSubmitting || iconUploading || screenshotUploading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Next: Design Screens
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Component type definitions ────────────────────────────────────────────────

const COMPONENT_TYPES = [
  {
    type: "button" as const,
    label: "Button",
    icon: Square,
    desc: "Tap action",
    color: "text-blue-600 bg-blue-50",
  },
  {
    type: "text" as const,
    label: "Text Label",
    icon: Type,
    desc: "Display text",
    color: "text-purple-600 bg-purple-50",
  },
  {
    type: "input" as const,
    label: "Input Field",
    icon: AlignLeft,
    desc: "Text entry",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    type: "list" as const,
    label: "List",
    icon: List,
    desc: "Item list",
    color: "text-orange-600 bg-orange-50",
  },
];

// ── Mock Phone Preview Component ───────────────────────────────────────────────

function MockPhonePreview({ components }: { components: AppComponent[] }) {
  return (
    <div className="phone-frame w-[220px] rounded-[2.5rem] p-3 flex-shrink-0">
      {/* Notch */}
      <div className="bg-foreground/10 rounded-full h-6 w-24 mx-auto mb-3" />
      {/* Screen */}
      <div className="bg-white rounded-[1.8rem] min-h-[340px] overflow-y-auto p-4 space-y-3">
        {components.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Monitor className="w-8 h-8 text-gray-200 mb-2" />
            <p className="text-xs text-gray-300 font-medium">Empty screen</p>
          </div>
        ) : (
          components.map((comp) => (
            <PhoneComponent key={comp.id} component={comp} />
          ))
        )}
      </div>
      {/* Home indicator */}
      <div className="mt-3 flex justify-center">
        <div className="bg-foreground/20 rounded-full h-1 w-20" />
      </div>
    </div>
  );
}

function PhoneComponent({ component }: { component: AppComponent }) {
  switch (component.type) {
    case "button":
      return (
        <div className="w-full bg-blue-500 text-white text-center py-2 px-3 rounded-lg text-xs font-semibold shadow-sm">
          {component.label}
        </div>
      );
    case "text":
      return (
        <p className="text-xs text-gray-700 leading-relaxed">
          {component.label}
        </p>
      );
    case "input":
      return (
        <div className="border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
          <p className="text-xs text-gray-400">
            {(component as { placeholder?: string }).placeholder ||
              "Enter text..."}
          </p>
        </div>
      );
    case "list": {
      const items = (component as { items?: string[] }).items ?? [];
      return (
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-800 mb-1">
            {component.label}
          </p>
          {items.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-0"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
              <span className="text-xs text-gray-600">{item}</span>
            </div>
          ))}
        </div>
      );
    }
    default:
      return null;
  }
}

// ── Screen Designer Step ───────────────────────────────────────────────────────

interface DesignerStepProps {
  appId: string;
  onBack: () => void;
}

function DesignerStep({ appId, onBack }: DesignerStepProps) {
  const navigate = useNavigate();
  const { data: app, isLoading } = useGetApp(appId);
  const addScreen = useAddScreen();
  const editScreen = useEditScreen();
  const deleteScreen = useDeleteScreen();
  const publishApp = usePublishApp();
  const unpublishApp = useUnpublishApp();

  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Select first screen on load
  useEffect(() => {
    if (app && app.screens.length > 0 && !selectedScreenId) {
      setSelectedScreenId(app.screens[0].id);
    }
  }, [app, selectedScreenId]);

  const selectedScreen = app?.screens.find((s) => s.id === selectedScreenId);
  const selectedComponents = selectedScreen
    ? parseScreenContent(selectedScreen.content)
    : [];

  const handleAddScreen = async () => {
    const screenId = crypto.randomUUID();
    try {
      await addScreen.mutateAsync({
        appId,
        screenId,
        title: `Screen ${(app?.screens.length ?? 0) + 1}`,
        content: "[]",
      });
      setSelectedScreenId(screenId);
      toast.success("Screen added");
    } catch {
      toast.error("Failed to add screen");
    }
  };

  const handleDeleteScreen = async (screenId: string) => {
    if ((app?.screens.length ?? 0) <= 1) {
      toast.error("You need at least one screen");
      return;
    }
    try {
      const deletedApp = await deleteScreen.mutateAsync({ appId, screenId });
      if (selectedScreenId === screenId) {
        setSelectedScreenId(deletedApp.screens[0]?.id ?? null);
      }
      toast.success("Screen deleted");
    } catch {
      toast.error("Failed to delete screen");
    }
  };

  const handleAddComponent = async (type: AppComponent["type"]) => {
    if (!selectedScreen) return;

    const newComp: AppComponent = (() => {
      switch (type) {
        case "button":
          return { id: crypto.randomUUID(), type: "button", label: "Button" };
        case "text":
          return { id: crypto.randomUUID(), type: "text", label: "Text Label" };
        case "input":
          return {
            id: crypto.randomUUID(),
            type: "input",
            label: "Input Field",
            placeholder: "Enter text...",
          };
        case "list":
          return {
            id: crypto.randomUUID(),
            type: "list",
            label: "List",
            items: ["Item 1", "Item 2"],
          };
      }
    })();

    const updated = [...selectedComponents, newComp];
    try {
      await editScreen.mutateAsync({
        appId,
        screenId: selectedScreen.id,
        title: selectedScreen.title,
        content: stringifyScreenContent(updated),
      });
    } catch {
      toast.error("Failed to add component");
    }
  };

  const handleDeleteComponent = async (componentId: string) => {
    if (!selectedScreen) return;
    const updated = selectedComponents.filter((c) => c.id !== componentId);
    try {
      await editScreen.mutateAsync({
        appId,
        screenId: selectedScreen.id,
        title: selectedScreen.title,
        content: stringifyScreenContent(updated),
      });
    } catch {
      toast.error("Failed to remove component");
    }
  };

  const handleMoveComponent = async (from: number, to: number) => {
    if (!selectedScreen || to < 0 || to >= selectedComponents.length) return;
    const updated = [...selectedComponents];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    try {
      await editScreen.mutateAsync({
        appId,
        screenId: selectedScreen.id,
        title: selectedScreen.title,
        content: stringifyScreenContent(updated),
      });
    } catch {
      toast.error("Failed to reorder");
    }
  };

  // Drag events
  const handleDragStart = (index: number) => {
    setDragIndex(index);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent, overIndex: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== overIndex) {
      handleMoveComponent(dragIndex, overIndex);
      setDragIndex(overIndex);
    }
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setIsDragging(false);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await publishApp.mutateAsync(appId);
      toast.success("App published to the App Store!");
      navigate({ to: "/app/$appId", params: { appId } });
    } catch {
      toast.error("Failed to publish");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await unpublishApp.mutateAsync(appId);
      toast.success("Saved as draft");
      navigate({ to: "/" });
    } catch {
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-5 h-[600px]">
        <Skeleton className="w-52 rounded-2xl" />
        <Skeleton className="flex-1 rounded-2xl" />
        <Skeleton className="w-52 rounded-2xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {app && <AppIcon icon={app.icon} name={app.name} size="sm" />}
          <div>
            <h2 className="font-display text-xl font-bold text-foreground leading-none">
              {app?.name ?? "Screen Designer"}
            </h2>
            <p className="text-muted-foreground text-xs mt-0.5">
              {app?.screens.length ?? 0} screen
              {(app?.screens.length ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 rounded-lg"
            onClick={onBack}
          >
            <ChevronLeft className="w-4 h-4" />
            Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-lg"
            onClick={handleSaveDraft}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <BookMarked className="w-3.5 h-3.5" />
            )}
            Save Draft
          </Button>
          <Button
            size="sm"
            className="gap-1.5 rounded-lg"
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            Publish App
          </Button>
        </div>
      </div>

      <div className="flex gap-4 h-[580px]">
        {/* Left: Screen list */}
        <div className="w-48 flex-shrink-0 bg-card rounded-2xl app-card-shadow flex flex-col overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Screens
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {(app?.screens ?? []).map((screen, i) => (
              <button
                type="button"
                key={screen.id}
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl w-full text-left transition-all ${
                  selectedScreenId === screen.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-foreground"
                }`}
                onClick={() => setSelectedScreenId(screen.id)}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    selectedScreenId === screen.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted-foreground/15 text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="text-sm font-medium truncate flex-1">
                  {screen.title}
                </span>
                {(app?.screens.length ?? 0) > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteScreen(screen.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full gap-2 rounded-xl justify-center text-muted-foreground hover:text-primary hover:bg-primary/5"
              onClick={handleAddScreen}
              disabled={addScreen.isPending}
            >
              {addScreen.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              Add Screen
            </Button>
          </div>
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 bg-card rounded-2xl app-card-shadow flex flex-col overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-border flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">
              {selectedScreen?.title ?? "No screen selected"}
            </p>
            <Monitor className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex gap-6 items-start justify-center">
            {/* Component list */}
            <div className="flex-1 max-w-sm space-y-2">
              <AnimatePresence>
                {selectedComponents.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-48 text-center py-10"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
                      <Plus className="w-6 h-6 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      No components yet
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Add components from the right panel
                    </p>
                  </motion.div>
                ) : (
                  selectedComponents.map((comp, i) => (
                    <motion.div
                      key={comp.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      draggable
                      onDragStart={() => handleDragStart(i)}
                      onDragOver={(e) => handleDragOver(e, i)}
                      onDragEnd={handleDragEnd}
                      className={`component-chip flex items-center gap-3 px-4 py-3 bg-muted/60 hover:bg-muted rounded-xl border border-border group cursor-grab active:cursor-grabbing ${
                        isDragging && dragIndex === i ? "opacity-50" : ""
                      }`}
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                      <ComponentIcon type={comp.type} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {comp.label}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {comp.type}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleMoveComponent(i, i - 1)}
                          disabled={i === 0}
                          className="w-6 h-6 rounded-md hover:bg-border flex items-center justify-center disabled:opacity-30"
                        >
                          <ChevronLeft className="w-3.5 h-3.5 rotate-90" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveComponent(i, i + 1)}
                          disabled={i === selectedComponents.length - 1}
                          className="w-6 h-6 rounded-md hover:bg-border flex items-center justify-center disabled:opacity-30"
                        >
                          <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteComponent(comp.id)}
                          className="w-6 h-6 rounded-md hover:bg-destructive/10 hover:text-destructive flex items-center justify-center text-muted-foreground"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Phone preview */}
            <div className="flex-shrink-0 hidden lg:block">
              <MockPhonePreview components={selectedComponents} />
            </div>
          </div>
        </div>

        {/* Right: Component palette */}
        <div className="w-48 flex-shrink-0 bg-card rounded-2xl app-card-shadow flex flex-col overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Add Component
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {COMPONENT_TYPES.map((ct) => (
              <button
                type="button"
                key={ct.type}
                onClick={() => handleAddComponent(ct.type)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted transition-colors text-left group"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ct.color}`}
                >
                  <ct.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground leading-tight">
                    {ct.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{ct.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ComponentIcon({ type }: { type: AppComponent["type"] }) {
  const config = COMPONENT_TYPES.find((c) => c.type === type);
  if (!config) return null;
  const Icon = config.icon;
  return (
    <div
      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}
    >
      <Icon className="w-3.5 h-3.5" />
    </div>
  );
}

// ── Main Builder Page ──────────────────────────────────────────────────────────

export function BuilderPage() {
  const { appId } = useParams({ strict: false }) as { appId?: string };
  const [step, setStep] = useState<1 | 2>(appId ? 2 : 1);
  const [currentAppId, setCurrentAppId] = useState<string | null>(
    appId ?? null,
  );

  const handleDetailsNext = (id: string) => {
    setCurrentAppId(id);
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step >= 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > 1 ? <Check className="w-3.5 h-3.5" /> : "1"}
              </div>
              <span
                className={`text-sm font-medium ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}
              >
                App Details
              </span>
            </div>

            <div className="flex-1 h-px bg-border max-w-12" />

            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step >= 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <span
                className={`text-sm font-medium ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}
              >
                Design Screens
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <DetailsStep
              key="details"
              appId={currentAppId}
              onNext={handleDetailsNext}
            />
          ) : (
            <DesignerStep
              key="designer"
              appId={currentAppId!}
              onBack={() => setStep(1)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
