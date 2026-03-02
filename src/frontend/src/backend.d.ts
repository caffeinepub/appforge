import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface App {
    id: string;
    isPublished: boolean;
    screens: Array<AppScreen>;
    icon?: ExternalBlob;
    name: string;
    description: string;
    screenshots: Array<ExternalBlob>;
}
export interface AppScreen {
    id: string;
    title: string;
    content: string;
}
export interface AddScreenInput {
    title: string;
    content: string;
    appId: string;
    screenId: string;
}
export interface UploadIconInput {
    appId: string;
    icon: ExternalBlob;
}
export interface AddScreenshotInput {
    appId: string;
    screenshot: ExternalBlob;
}
export interface EditScreenInput {
    title: string;
    content: string;
    appId: string;
    screenId: string;
}
export interface CreateAppInput {
    id: string;
    name: string;
    description: string;
}
export interface backendInterface {
    addScreen(input: AddScreenInput): Promise<App>;
    addScreenshot(input: AddScreenshotInput): Promise<App>;
    createApp(input: CreateAppInput): Promise<App>;
    deleteScreen(appId: string, screenId: string): Promise<App>;
    editScreen(input: EditScreenInput): Promise<App>;
    getApp(appId: string): Promise<App>;
    listAllApps(): Promise<Array<App>>;
    listPublishedApps(): Promise<Array<App>>;
    publishApp(appId: string): Promise<App>;
    unpublishApp(appId: string): Promise<App>;
    uploadIcon(input: UploadIconInput): Promise<App>;
}
