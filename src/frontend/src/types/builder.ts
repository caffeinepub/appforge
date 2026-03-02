export type ComponentType = "button" | "text" | "input" | "list";

export interface ButtonComponent {
  id: string;
  type: "button";
  label: string;
}

export interface TextComponent {
  id: string;
  type: "text";
  label: string;
}

export interface InputComponent {
  id: string;
  type: "input";
  label: string;
  placeholder: string;
}

export interface ListComponent {
  id: string;
  type: "list";
  label: string;
  items: string[];
}

export type AppComponent =
  | ButtonComponent
  | TextComponent
  | InputComponent
  | ListComponent;

export function parseScreenContent(content: string): AppComponent[] {
  if (!content || content.trim() === "") return [];
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function stringifyScreenContent(components: AppComponent[]): string {
  return JSON.stringify(components);
}
