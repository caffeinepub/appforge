# AppForge

## Current State

- Full-stack app builder with Motoko backend and React frontend
- Two-step builder flow: (1) App Details (name, description, icon, screenshots), (2) Screen Designer
- App Details step requires users to manually upload screenshots
- Screen Designer lets users add/arrange UI components (button, text, input, list) across multiple screens
- Published apps appear in an App Store gallery (HomePage)
- Apps can be previewed and played (PlayPage, AppDetailPage)
- Backend stores apps with `id, name, description, screens, icon, screenshots, isPublished`

## Requested Changes (Diff)

### Add
- **AI Chat Assistant** panel on the App Details step (Step 1): a floating chat box where users can describe their app in natural language
- **AI-generated app details**: when user sends a message, the AI (simulated client-side) parses it and auto-fills name, description, and generates placeholder screens for the designer step
- **AI-generated screens**: when the AI processes the description, it creates initial screens with appropriate components (buttons, lists, inputs, text) based on keywords in the description
- Optional screenshots: screenshots section stays but is no longer required -- remove the screenshot requirement from the validation logic

### Modify
- **DetailsStep validation**: screenshots are now optional (remove any "must have screenshot" requirement -- currently there is none but make it clear in UI that they're optional)
- **DetailsStep UI**: add an "Ask AI" chat panel alongside the form. When the user types a description and sends it, the AI fills in the name, description fields and optionally suggests screens. The chat should feel conversational with a simple message history.
- **DetailsStep screenshot label**: change "Screenshots" label to "Screenshots (optional)" to make it clear they're not required
- **Builder flow**: after AI fills details, the user can proceed to the Screen Designer where AI-generated screens are already populated

### Remove
- Nothing removed -- manual entry and screenshot upload remain available alongside AI

## Implementation Plan

1. **Add AI chat component to DetailsStep** (`BuilderPage.tsx`)
   - Add a collapsible "Ask AI" section/panel below or alongside the form
   - Chat input + message history (user messages + AI responses)
   - AI response is generated client-side using keyword parsing (no external API -- simulate AI by parsing description keywords)
   - When AI responds, it calls setter functions to auto-fill `name`, `description` fields
   - AI also returns suggested screens (array of `{title, components[]}`)
   - Store AI-suggested screens in component state to be passed to DesignerStep

2. **Pass AI-generated screens to DesignerStep**
   - Add `initialScreens?: Array<{title: string, components: AppComponent[]}>` prop to DesignerStep
   - On mount, if `initialScreens` is provided and app has no screens yet, create them via `addScreen` mutations

3. **Make screenshots clearly optional**
   - Update label to "Screenshots (optional)"
   - No validation change needed (already optional), just clarify in UI

4. **AI parsing logic** (client-side, no external API)
   - Parse user input for keywords to suggest app name, description, and screen structure
   - Example: "todo app" -> name: "TaskMaster", description: "...", screens: [Home with list+button, Add Task with input+button]
   - Keep it simple and fast -- pure JS string parsing with template-based responses
