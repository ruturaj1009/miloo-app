---
name: dating-app-ui
description: Enforce modern dating app UI/UX design patterns, motion aesthetics, gesture handling, and responsive React Native component architectures.
---

# Dating App UI & UX Engineering Guidelines

Apply these conventions whenever architecting, styling, or refactoring screens and components for the React Native dating app.

---

## 1. Visual Aesthetics & Design System

### Tone & Visual Identity
- **Personality:** Modern, engaging, high-contrast, tactile, and emotionally warm.
- **Lighting & Contrast:** Default to dark mode or deep moody backgrounds (`#0F1115`, `#161922`) to make profile photos and media pop, using vibrant accent gradients.
- **Color Tokens:**
  - `brand-primary`: Vibrant Coral/Rose (`#FF4458` to `#FF5864`)
  - `brand-secondary`: Violet/Electric Indigo (`#7C3AED` to `#6366F1`)
  - `success-match`: Neon Emerald (`#10B981` or `#00E676`)
  - `super-like`: Vivid Cyan (`#00C9FF` to `#0072FF`)
  - `neutral-card`: Semi-transparent glass/surface (`rgba(255, 255, 255, 0.08)` on dark, `#FFFFFF` on light)
  - `text-primary`: `#FFFFFF` (dark surface), `#111827` (light surface)
  - `text-secondary`: `#9CA3AF` / `#6B7280`

### Surface & Depth
- **Border Radii:** Card-heavy interfaces require rounded ergonomics:
  - Swipe Cards: `border-radius: 24` to `28`
  - Action Chips & Floating Action Buttons: `border-radius: 9999` (full pill)
  - Modals & Sheets: Top corners `border-radius: 28`
- **Overlays:** Always use gradient overlays (`expo-linear-gradient`) on bottom 40% of media cards (`['transparent', 'rgba(0,0,0,0.85)']`) to maintain text legibility over user photos.

---

## 2. Core Screen Patterns & Layout Conventions

### The Card Deck (Discovery / Swipe Feed)
- **Geometry:** The active profile card must occupy ~75–82% of viewport height, keeping safe areas for top status/navigation and bottom action buttons.
- **Thumb Zones:** Primary floating actions (Rewind, Pass, Super Like, Like, Boost) must reside in the bottom 20% natural thumb reach area.
- **Photo Progression:** Tapping left/right edges of a card advances/reverses the image carousel; swipe gestures handle profile decisions. Always display top segmented progress bars (like Instagram stories) for multi-photo sets.

### Profile Detail View (Expanded Bottom Sheet)
- Seamless expansion from deck card into a scrollable sheet.
- Segmented tag pills for interest badges (`Hobbies`, `Zodiac`, `Music`, `Values`).
- Integrated prompt boxes (e.g., *"A non-negotiable for me is..."*) styled with subtle borders (`borderWidth: 1`, subtle card tint).

### Matches & Chat Feed
- **Top Row Horizontal Tray:** Unread "New Matches" and "Active Stories" as circular avatars with gradient borders (2px) and active online badges.
- **Conversation List:** Clear visual hierarchy between unread conversation states (bold typography, active indicator) and read conversations.

---

## 3. Gestures, Physics & Motion

- **Gesture Library:** Use `react-native-gesture-handler` (v2 `GestureDetector`) exclusively. Do not use legacy `PanResponder`.
- **Spring Physics:** Use `react-native-reanimated` (v3). Animate card swiping with dampening springs (`withSpring({ damping: 15, stiffness: 120 })`).
- **Card Rotation Formula:** Interpolate horizontal pan displacement ($X$) into slight rotation angle:
  - Translation: `[-width, 0, width]`
  - Rotation: `[-12deg, 0deg, 12deg]`
- **Feedback Stamps:** Overlay animated "LIKE" (green) and "NOPE" (red) badges directly on the card, scaling and fading in proportionally to gesture drag delta ($dx$).
- **Haptics:** Include `expo-haptics` triggers on threshold crossing (light impact during gesture threshold, medium impact on swipe confirmation).

---

## 4. Code & Architecture Rules

- **Platform Independence:** Support notch cutouts and gesture home indicators using `react-native-safe-area-context` (`SafeAreaView` or `useSafeAreaInsets`).
- **Image Performance:** Never render raw React Native `<Image>` for heavy profile stacks. Always use `expo-image` or `@shopify/react-native-fast-image` with explicit `priority`, `cachePolicy="memory-disk"`, and blur hash placeholders.
- **Styling Architecture:**
  - If using NativeWind/Tailwind: Enforce arbitrary values through tokens where possible.
  - If using `StyleSheet.create`: Keep layout styles memoized outside components to prevent re-creation during pan gestures.
- **Hit Slop:** Ensure all small icons and close/action buttons have `hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}` to avoid user frustration.

---

## 5. Accessibility & Ergonomics

- Ensure touch targets for primary actions are minimum 56x56 dp.
- Provide accessible alternatives to swipe gestures (explicit tap buttons for Pass, Like, and Super Like with appropriate `accessibilityLabel` and `accessibilityRole="button"`).
- Keep text contrast over images compliant with WCAG AA by enforcing dark gradient underlays behind names, ages, and bios.