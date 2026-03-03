# AppStore

## Current State
A no-code app builder platform called "AppForge" where users can:
- Create apps with name, description, icon, optional screenshots using an AI chat assistant
- Design multi-screen apps with drag-and-drop components (buttons, text, inputs, lists)
- Publish apps to a public App Store listing
- Play/interact with apps through a phone-frame UI
- Edit and delete apps after publishing

Backend: Motoko with blob-storage for icons/screenshots. No authentication.
Frontend: React + TanStack Router with pages: HomePage, BuilderPage, AppDetailPage, PlayPage.

## Requested Changes (Diff)

### Add
- **Authorization**: Full sign-in/sign-out using Internet Identity. ALL pages require login (no anonymous access to app builder, store, or play page).
- **Marvel Battle Game**: A dedicated `/marvel` route with a complete Marvel vs Green Goblin battle game:
  - Hero selection: Spider-Man, Iron Man, Captain America, Thor, Black Panther
  - Hero costume customization: choose color theme per hero (e.g. classic, gold, stealth, dark)
  - Special ability selection per hero (e.g. Web Shoot, Repulsor Blast, Shield Throw, Lightning Strike, Vibranium Slash)
  - Turn-based combat against Green Goblin with HP bars, attack animations, win/lose states
  - Accessible from the main navigation and from the App Store home page
- **Rename brand**: All "AppForge" references in UI renamed to "AppStore"
- **Navigation**: Add "Marvel Game" link in nav bar

### Modify
- **Layout/Nav**: Rename "AppForge" → "AppStore" throughout, add sign-in/out button and Marvel Game nav link
- **All pages**: Gate behind auth — show a login prompt/page if not authenticated
- **App ownership**: Apps created by a user are tied to their principal (owner field). Only the owner can edit/delete their app.

### Remove
- Nothing removed, all existing functionality preserved

## Implementation Plan
1. Add `authorization` component (Internet Identity sign-in)
2. Regenerate Motoko backend to add `owner` field to `App`, filter `listMyApps`, and add ownership checks on mutations
3. Update frontend Layout to show sign-in/out button and Marvel Game nav link, rename AppForge → AppStore everywhere
4. Add auth gate (redirect to login if not authenticated) wrapping all routes
5. Build `/marvel` page: hero picker, costume color chooser, ability picker, turn-based battle against Green Goblin with HP bars and animations
6. Wire authorization component into frontend
