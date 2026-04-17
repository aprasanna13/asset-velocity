# Source (`src`) Directory

This directory contains the complete frontend React/TypeScript source code for the Field Operations application. It is organized into feature-based and shared directories to support modularity and maintainability.

## Root Files

- `App.tsx`: The main application layout and routing component. Handles global state management, authentication gateways, and top-level layout composition.
- `main.tsx`: The frontend entry point that mounts the React application onto the DOM.
- `index.css`: The global CSS stylesheet defining base typography and custom variables.
- `types.ts`: The global TypeScript type definitions and interfaces shared across the application.
- `declarations.d.ts`: TypeScript declarations for static assets (e.g., allowing `.png` imports).

## Subdirectories

### `assets/`
Contains static media files used across the frontend.
- `Logo.png`: The official application brand logo.

### `components/`
Contains reusable UI components shared across multiple features or layouts.
- `auth/Login.tsx`: The secure authentication gateway and login screen.
- `ExecutionConsole/`: Components for the high-performance, interactive execution console and log viewer.
- `layout/SidebarItem.tsx`: A reusable navigation link item for the primary application sidebar.
- `shared/StatusBadge.tsx`: A visual badge component for rendering the operational or health status of a system component.

### `features/`
Contains specific functional zones and domain logic for the application views.
- `command-center/`: Components and logic for the notification flyout and real-time system triage alerts.
- `handoff/`: Components for automated operational briefing and shift handover safety checks.
- `maintenance/`: Components for the maintenance workflow, tracking repairs, and technician instructions.
- `scada-triage/`: Interactive monitoring interfaces and SCADA anomaly detection views.
- `topology/`: SVG-based dynamic network and pipeline topology visualizations.

### `hooks/`
Contains custom React hooks for encapsulating specific business logic and side effects.
- `useInventory.ts`: A custom hook providing state and functions to fetch, manage, and reorder inventory parts via the backend API.

### `services/`
Contains API clients and external service integrations.
- `api.ts`: The main HTTP client configuration and endpoints for communicating with the backend Node.js/SQLite service.
