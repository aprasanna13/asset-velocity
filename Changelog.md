# Changelog

This document logs the major changes and features added to the **Field Operations** (formerly Velocity / Asset Velocity) application.

---

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
