# Morkblade Keyboard Driver Internship Project

A web-based keyboard driver management panel built with Vue 3 + TypeScript.
This repository is an internship project built for Morkblade, and supports both real WebHID devices and a built-in preview mode.

> This public repository runs in **preview mode by default** (no private SDK required), so you can explore the full interface without physical hardware.

## Features

- **Preview-first experience**
  - Built-in mock service with device/performance/lighting data
  - Fully usable without device authorization
- **WebHID-ready architecture**
  - Real device flow via WebHID when SDK is enabled
  - Pluggable service abstraction (`MockService` vs real SDK)
- **Modular keyboard management pages**
  - `Key Performance`: travel, Rapid Trigger (RT), dead-zone tuning, live key test
  - `Key Assignment`: layered mapping UI (standard/Fn1/Fn2/Fn3)
  - `Advanced Keys`: SOCD, Mod Tap, DKS, toggle-style advanced behavior panels
  - `Lighting`: per-key RGB, dynamic modes, palette management
  - `Macros`: macro keyboard and setting panel (UI demo state)
  - `System`: polling rate / lock options (UI demo state)
  - `Firmware`: firmware info and upgrade UI (demo state)
- **Smooth interaction**
  - GSAP stagger animations
  - Separated keyboard/rendering panels for consistent transitions

## Tech Stack

- **Framework**: Vue 3 (Composition API) + TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **UI Library**: TDesign Vue Next
- **Animation**: GSAP + CSS transitions
- **Charts / Utilities**: ECharts, VueUse, Vue I18n

## Getting Started

### 1) Install dependencies

```bash
pnpm install
# or
npm install
```

### 2) Run development server

```bash
pnpm dev
```

Open `http://localhost:5173` and click **"Enter Preview"** on the welcome screen.

### 3) Build for production

```bash
pnpm build
```

### 4) Preview production build

```bash
pnpm preview
```

## Device Modes

### Default: Preview mode

- Automatically enabled when no real SDK is injected
- Uses `src/service/mockService.ts`
- Safe for UI development and interaction testing

### Optional: Real device mode

To connect actual hardware, provide your SDK and enable SDK mode:

1. Inject your SDK on `globalThis.__HSDK__` (project-specific integration)
2. Create `.env.local`:

```bash
VITE_SDK_ENABLED=true
```

3. Start the app and use the WebHID authorization flow

Current filter values in the service layer:

- `vendorId`: `0x34b7`
- `productId`: `0xffff`
- `usagePage`: `0xff00`
- `usage`: `0x01`

## Project Structure

```text
src/
├── assets/              # Static resources and keyboard layout JSON
├── components/          # Shared components (keyboard, alerts, etc.)
├── config/              # Key map and visual keyboard layout config
├── directives/          # Custom directives (stagger animation)
├── router/              # Route definitions
├── service/             # Service layer (mock + SDK client wrapper)
├── stores/              # Pinia stores (device/keyboard/performance/lighting)
├── styles/              # Global styles
├── types/               # TypeScript type declarations
└── views/               # Feature pages
    ├── KeyPerformance/
    ├── KeyAssignment/
    ├── AdvancedKeys/
    ├── Lighting/
    ├── Macro/
    ├── System/
    └── Firmware/
```

## Notes

- This repository intentionally excludes private third-party SDK source code.
- Several pages (such as Firmware/System/Macro) are currently focused on UI/interaction demonstration.

## License

MIT

Project context:
Built as an internship project for Morkblade, with UI patterns inspired by VIA.
