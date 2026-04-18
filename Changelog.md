# Changelog

This document logs the major changes and features added to the **Field Operations** (formerly Velocity / Asset Velocity) application.

---

## [2026-04-17] - Implementation
- **Feature**: Implemented Context-Aware Categorized Global Search with Fuse.js.
- **Feature**: Created `SearchContext`, `useSearch` hook, and `SearchBar` component.
- **Feature**: Implemented adapters for Inventory, Logs, and Nodes.
- **Integration**: Integrated `SearchBar` into `App.tsx` header.
- **Documentation**: Updated `src/components/README.md` with search documentation.
- **Bug Fix**: Fixed issue where clicking search results did not navigate to the corresponding screen.

## [2026-04-17]
- **Documentation**: Updated `cr_search.md` with agreed implementation details for the Global Search feature.
- **Documentation**: Further refined `cr_search.md` with specifics on Fuse.js, Context location, and action handling.

## [2026-04-16]
- **Documentation**: Updated `src/README.md` and `src/components/README.md` to include the `ExecutionConsole` and `handoff` features.

## [2026-04-15]
- **Configuration**: Added `gchat` and `g3doc_documentation` skills to the user's personal `skills.json` configuration in CitC workspaces.
- **Refactor**: Applied `ts_readability` fixes to `src/App.tsx` (removed `any` type, converted to named export).
- **Chore**: Configured local ESLint (`.eslintrc.cjs`) for validation sweeps.

## [2026-04-13]
- **Feature**: Implemented a high-performance, interactive Execution Console with unconditional auto-scrolling and a 50-item ring-buffer limit to replace static logs.
- **Feature**: Implemented the Automated Operational Briefing (Handoff) feature with shift handover safety checks, contextual recovery intercepts, and offline caching capabilities.
- **Documentation**: Standardized internal architecture documentation by creating READMEs across all nested component modules (`auth`, `explainability`, `layout`, `settings`, `shared`) and aggregated them into `src/components/README.md`.
- **Documentation**: Finalized `Operator_Handoff.md` and `cr_logviewer.md` technical design specifications.

## [2026-04-11]
- **UI/UX**: Redesigned the Workflow Timeline to a dense, horizontally optimized grid matching Stitch specifications to eliminate vertical scrolling.
- **Layout**: Restructured the workspace layout to distinctly separate the 7-step workflow tracking from the full-width diagnostic execution console.

## [2026-04-09]
- **Feature**: Implemented the Agentic triage and automation engine featuring interactive safety challenges (PIN validation) and transparent anomaly explanations.
- **Documentation**: Merged historical changelogs into `prd.md` and updated `tdd.md` to provide a complete blueprint for safety guardrails.

## [2026-04-07]
- **Documentation**: Created `prd_settings.md` detailing the specifications for the Settings Configuration Panel.
- **Documentation**: Added comprehensive README files to `backend`, `dist`, and `src` directories, synthesizing them into the root `README.md`.

## [2026-04-02]
- **Refactor**: Renamed the application from "Velocity" to "Field Operations" across the UI, configuration files, and documentation.
- **Feature**: Implemented the Command Center (Notification Flyout) for interactive system triage and monitoring.

## [2026-03-02]
- **Feature**: Implemented a custom Secure Access Portal (Login Screen).
- **Refactor**: Integrated the React frontend and Node.js backend into a single-port deployment (Port 3001) to eliminate CORS and Identity Proxy redirection issues.
- **Deployment**: Deployed the integrated application to Google Cloud Run.

## [2026-02-27]
- **UI/UX**: Executed a comprehensive redesign implementing an industrial dark theme (`#0D0D0D`).
- **Feature**: Optimized the Agentic Engine maintenance workflow into 7 distinct lifecycle steps with contextual action buttons.
- **Backend**: Added persistent SAP inventory tracking with a Node.js and SQLite backend.

## [2026-02-20]
- **Chore**: Resolved initial deployment compilation and TypeScript errors.
- **Chore**: Migrated container registry from GCR to Artifact Registry and configured proper IAM permissions.

## [2026-04-17] - Canvas Topology View
- **Refactor**: Refactored `TopologyView.tsx` to use HTML5 Canvas for rendering the network graph.
- **Feature**: Implemented smooth flow animations using canvas line dash offset.

## [2026-04-17] - Layout Fix
- **Fix**: Added localized scrolling (`overflow-y-auto`) to the data column in `TopologyView.tsx` to prevent clipping on short viewports.

## [2026-04-17] - Design
- **Documentation**: Created `cr_googlemaps.md` design document for Google Maps integration (Section 0).

## [2026-04-17] - Design Update
- **Documentation**: Added Section 1 to `cr_googlemaps.md` describing the high-level plan.

## [2026-04-17] - Design Finalized
- **Documentation**: Added Section 2 to `cr_googlemaps.md` with a detailed file-by-file implementation plan.

## [2026-04-17] - Security Update
- **Documentation**: Updated `cr_googlemaps.md` to specify API key storage using environment variables and `.env.example`.

## [2026-04-18] - Design Update
- **Documentation**: Updated `cr_googlemaps.md` with specific details: component props, library choice for line simplification, mock data for Texas network, custom dark theme map styles, and acceptance criteria.

## [2026-04-18] - Implementation
- **Feature**: Implemented Geographic Map View with Google Maps and HTML5 Canvas overlay.
- **Feature**: Added view switcher in `App.tsx` to toggle between Schematic and Geographic views.
- **Chore**: Installed `@googlemaps/react-wrapper` and `simplify-js`.
- **Configuration**: Created `.env` and `.env.example` for API key management.

## [2026-04-18] - Fix
- **Fix**: Added visible fallback polylines and click interaction (InfoWindow) to markers in `GeographicTopologyView`.
- **Fix**: Moved canvas overlay to `floatPane` to ensure it renders above the map.

## [2026-04-18] - Fix
- **Fix**: Moved canvas overlay back to `overlayLayer` with high z-index and added finite checks to prevent artifact rendering.

## [2026-04-18] - Fix
- **Fix**: Added off-screen and extreme coordinate checks in canvas drawing to prevent random line artifacts.
