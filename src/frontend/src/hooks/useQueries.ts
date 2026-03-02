import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalBlob } from "../backend";
import type {
  AddScreenInput,
  AddScreenshotInput,
  App,
  CreateAppInput,
  EditScreenInput,
  UploadIconInput,
} from "../backend.d";
import { useActor } from "./useActor";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyExternalBlob = any;

// Query keys
export const queryKeys = {
  apps: ["apps"] as const,
  publishedApps: ["apps", "published"] as const,
  app: (id: string) => ["apps", id] as const,
};

// ── Queries ──────────────────────────────────────────────────────────────────

export function useListPublishedApps() {
  const { actor, isFetching } = useActor();
  return useQuery<App[]>({
    queryKey: queryKeys.publishedApps,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPublishedApps();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListAllApps() {
  const { actor, isFetching } = useActor();
  return useQuery<App[]>({
    queryKey: queryKeys.apps,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllApps();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetApp(appId: string | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<App>({
    queryKey: queryKeys.app(appId!),
    queryFn: async () => {
      if (!actor || !appId) throw new Error("No actor or appId");
      return actor.getApp(appId);
    },
    enabled: !!actor && !isFetching && !!appId,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateApp() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<App, Error, CreateAppInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("No actor");
      return actor.createApp(input);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.app(data.id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.apps });
    },
  });
}

export function useAddScreen() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<App, Error, AddScreenInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("No actor");
      return actor.addScreen(input);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.app(data.id), data);
    },
  });
}

export function useEditScreen() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<App, Error, EditScreenInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("No actor");
      return actor.editScreen(input);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.app(data.id), data);
    },
  });
}

export function useDeleteScreen() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<App, Error, { appId: string; screenId: string }>({
    mutationFn: async ({ appId, screenId }) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteScreen(appId, screenId);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.app(data.id), data);
    },
  });
}

export function useUploadIcon() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<App, Error, { appId: string; icon: AnyExternalBlob }>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("No actor");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).uploadIcon(input);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.app(data.id), data);
    },
  });
}

export function useAddScreenshot() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<
    App,
    Error,
    { appId: string; screenshot: AnyExternalBlob }
  >({
    mutationFn: async (input) => {
      if (!actor) throw new Error("No actor");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).addScreenshot(input);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.app(data.id), data);
    },
  });
}

export function usePublishApp() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<App, Error, string>({
    mutationFn: async (appId) => {
      if (!actor) throw new Error("No actor");
      return actor.publishApp(appId);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.app(data.id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.apps });
    },
  });
}

export function useUnpublishApp() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<App, Error, string>({
    mutationFn: async (appId) => {
      if (!actor) throw new Error("No actor");
      return actor.unpublishApp(appId);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.app(data.id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.apps });
    },
  });
}

// ── Image helpers ─────────────────────────────────────────────────────────────

export async function fileToExternalBlob(file: File): Promise<AnyExternalBlob> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  return ExternalBlob.fromBytes(uint8Array);
}
