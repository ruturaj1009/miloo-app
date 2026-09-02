# Miloo - Next-Gen Cross-Platform Dating & Real-Time Interaction Mobile App

Cross-platform mobile application for **Miloo**, engineered using **React Native (Expo SDK 57)**, **TypeScript**, **React Native Reanimated 4**, **Zustand**, and **STOMP WebSockets**.

---

## 1. Features & Screens (Figma Blueprint)

* **SCR-01: Auth & Onboarding (`AuthScreen.tsx`)**:
  * Phone & email authentication with country code selector.
  * 6-digit auto-advancing OTP verification modal with resend throttle.
  * Persistent authentication tokens via `@react-native-async-storage/async-storage`.
* **SCR-02: Profile Builder (`ProfileBuilderScreen.tsx`)**:
  * 6-slot photo grid with drag-to-reorder and direct-to-R2 upload progress indicator.
  * Multi-step questionnaire: bio, gender, preferences, and interactive interest tag pills.
* **SCR-03: Card Discovery Deck (`DiscoveryDeckScreen.tsx`)**:
  * Fluid swipe physics powered by `react-native-reanimated` and `react-native-gesture-handler`.
  * Tap photo quadrants to cycle through user photos, pull down for expanded profile bio.
  * Bottom floating action dock (Pass, Superlike, Like).
* **SCR-04: Match Modal (`MatchCelebrationModal.tsx`)**:
  * Overlapping dual-avatar celebration animation upon reciprocal like.
  * Quick-send opening message input & "Keep Swiping" option.
* **SCR-05: Matches & Chat Tray (`MatchesTrayScreen.tsx`)**:
  * Horizontal scrolling carousel for new matches.
  * Vertical list of active conversations with unread badges, last message previews, and presence indicators.
* **SCR-06: 1-on-1 Chat Room (`ChatRoomScreen.tsx`)**:
  * Live messaging with optimistic UI rendering.
  * Real-time typing indicators and read receipt updates via STOMP WebSocket.
* **SCR-07: WebRTC Audio/Video Call (`WebRTCCallScreen.tsx`)**:
  * Full-screen remote video feed with draggable Picture-in-Picture (PiP) local camera preview.
  * Floating call controls (Mute Audio, Flip Camera, End Call) routed via backend signaling broker.
* **SCR-08: Settings & Discovery Preferences (`SettingsPrefsScreen.tsx`)**:
  * Distance radius slider (1–100 km), age range dual-slider, gender filters, account management, and haptics toggle.

---

## 2. Tech Stack

* **Framework:** React Native 0.86, Expo ~57.0.18 (New Architecture ready)
* **Language:** TypeScript 6.0
* **Navigation:** React Navigation v7 (Native Stack & Bottom Tabs)
* **Animation & Gestures:** React Native Reanimated 4.5 & React Native Gesture Handler 2.32
* **State Management:** Zustand 5.0
* **Networking & Real-Time:** Axios & native STOMP WebSocket client (`/ws/signaling`)
* **Design & Icons:** Lucide React Native, Expo Linear Gradient, Expo Blur

---

## 3. Getting Started

### Prerequisites
* **Node.js:** v18 or higher (`node -v`)
* **Package Manager:** npm or yarn
* **Expo Go App** (on iOS/Android physical device) or an emulator (Android Studio / Xcode).

### Installation
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### Running Locally
```bash
# Start Metro bundler
npm start

# Run on Android emulator / device
npm run android

# Run on iOS simulator
npm run ios

# Run in Web browser
npm run web
```

---

## 4. Backend Connectivity

The frontend connects to the **Miloo Spring Boot Modular Monolith Backend** (`http://localhost:8080/api/v1` and `ws://localhost:8080/ws/signaling`).

### Environment Configuration
The API client dynamically resolves the host:
* **Android Emulator:** Automatically routes to `http://10.0.2.2:8080/api/v1`.
* **iOS Simulator / Web:** Automatically routes to `http://localhost:8080/api/v1`.
* **Physical Device Testing:** Set your local machine's LAN IP:
  ```bash
  # .env or environment variable
  EXPO_PUBLIC_API_URL=http://<YOUR_LAN_IP>:8080/api/v1
  EXPO_PUBLIC_WS_URL=ws://<YOUR_LAN_IP>:8080/ws/signaling
  ```

### Mock Mode Toggle
In [`src/api/client.ts`](src/api/client.ts):
```ts
// Set to false to communicate with live Spring Boot backend
// Set to true to test offline with realistic mock data
export const USE_MOCK_API = false;
```
