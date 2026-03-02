# AppForge

## Current State
New project. No existing backend or frontend code.

## Requested Changes (Diff)

### Add
- A public no-code app builder where anyone (no login required) can create, design, edit, and delete mobile app projects
- App metadata: name, icon (uploaded image), description, screenshots (uploaded images)
- Multi-screen designer: users can add multiple screens to their app, each screen containing drag-and-drop UI components (button, text, form input, list)
- App store listing page: a public gallery of all published apps displayed in an Apple-style grid with app icon, name, and description
- App detail page: shows full app info (icon, name, description, screenshots, and a live preview of the designed screens)
- Edit mode: users can return to an app and modify its details, screens, and components
- Delete: users can remove their app from the listing
- Screen navigation preview: the app preview shows the screens with simulated navigation between them

### Modify
- None (new project)

### Remove
- None (new project)

## Implementation Plan

### Backend (Motoko)
1. Data types: App (id, name, description, iconUrl, screenshotUrls, screens, createdAt, updatedAt), Screen (id, name, components), Component (id, type [button|text|input|list], label, placeholder, items)
2. CRUD for apps: createApp, getApp, listApps, updateApp, deleteApp
3. Store apps in a stable HashMap keyed by UUID
4. Return app list sorted by newest first

### Frontend
1. Home / App Store page: grid of app cards (icon, name, short description), "Create App" button
2. App Builder page (create/edit):
   - Step 1: App Details form (name, description, icon upload, screenshot uploads)
   - Step 2: Screen Designer with left panel (screen list, add screen), center canvas (component list per screen), right panel (add component: button, text, input, list)
   - Drag-and-drop reordering of components within a screen
   - Save/Publish button
3. App Detail page: full listing view (icon, name, description, screenshots carousel, live screen preview with navigation)
4. Delete confirmation dialog
5. Clean, minimal Apple-style UI
