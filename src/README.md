# Source (`src`) Directory

This directory contains the complete frontend React/TypeScript source code for the Field Operations application. It is organized into feature-based and shared directories to support modularity and maintainability.

## Root Files

- `App.tsx`: The main application layout and routing component. Handles global state management, authentication gateway routing, and top-level layout composition.
- `main.tsx`: The frontend entry point that mounts the React application onto the DOM.
- `index.css`: The global CSS stylesheet defining base typography and custom variables.
- `mockData.ts`: Synthetic datasets (pipeline topology, SCADA telemetry) used for offline verification and testing.
- `types.ts`: The global TypeScript type definitions and interfaces shared across the application.
- `vite-env.d.ts`: Vite environment type declarations for static assets and compiler configuration.
- `declarations.d.ts`: TypeScript declarations for static assets (e.g., allowing `.png` imports).

## Subdirectories

### `assets/`
Contains static media files used across the frontend.
- `Logo.png`: The application logo.

### `components/`
Contains reusable UI components shared across multiple features or layouts.
- `auth/`: Authentication portal (`Login.tsx`) and safety challenge verification screens (`ChallengeModal.tsx`).
- `ExecutionConsole/`: Log ingestion console and interactive execution streams.
- `explainability/`: Analytical explanations and mathematical proof modules.
- `Search/`: Global context-aware Fuse.js search componentry.
- `settings/`: Admin interface for managing pressure/temperature safety thresholds.
- `layout/`: Application shell structure and navigation items (`SidebarItem.tsx`).
- `shared/`: Generic reusable elements, including status badge displays (`StatusBadge.tsx`).

### `features/`
Contains specific functional view modules and domain logic for the application.
- `command-center/`: Real-time system triage alert panel and notification flyout.
- `handoff/`: Operational shift handoff briefing module, featuring influence explanation graphs (`InfluenceGraph.tsx`) and safety checklist validations.
- `maintenance/`: Work order tracking, technician repair checklists, and spare parts inventory dashboards (`InventoryView.tsx`).
- `scada-triage/`: SCADA pipeline telemetry monitoring charts and real-time anomaly detection dashboards.
- `topology/`: Dynamic network and pipeline visualizations, including SVG-based schematic topology layers and API-integrated Google Maps geographic coordinates overlays (`GeographicTopologyView.tsx`).

### `hooks/`
Contains custom React hooks for encapsulating business logic and side effects.
- `useHandoff.ts`: Handles automated shift transitions, validation checks, and offline local storage caching.
- `useInventory.ts`: A custom hook providing state and functions to fetch, manage, and reorder inventory parts via the backend API.
- `useSafetyGuardrails.ts`: Validates real-time pressure/temperature threshold and safety-limit boundaries.

### `services/`
Contains API clients and external service integrations.
- `api.ts`: The main HTTP client configuration and endpoints for communicating with the backend Node.js/SQLite service.

## Further Reading

For deep-dive engineering specifications, component APIs, and implementation designs, read the localized documentation files:
- [Reusable Component Directory README](file:///usr/local/google/home/prasannaankem/Code/Field Operations/src/components/README.md)
- [Authentication Module README](file:///usr/local/google/home/prasannaankem/Code/Field Operations/src/components/auth/README.md)
- [Explainability & AI Proofs README](file:///usr/local/google/home/prasannaankem/Code/Field Operations/src/components/explainability/README.md)
- [System Settings Panel README](file:///usr/local/google/home/prasannaankem/Code/Field Operations/src/components/settings/README.md)
