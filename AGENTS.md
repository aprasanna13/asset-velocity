# AGENTS.md: Field Operations

## 1. Project Overview
Field Operations is an industrial-grade workspace application built for natural gas pipeline monitoring, agentic triage, and automated maintenance orchestration. It processes high-frequency SCADA telemetry, computes automated mitigation strategies (load balancing, inventory checks), and enforces strict human-in-the-loop authorization guardrails (PIN challenges, explainability proofs) to ensure system safety.

## 2. Tech Stack
- **Languages**: TypeScript (Strict Mode), HTML5, CSS
- **Frontend Framework**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express, SQLite (`better-sqlite3`)
- **Key Paths**:
  - Entry & Routing: `src/App.tsx`
  - Global Types: `src/types.ts`
  - Mock/Synthetic Payloads: `src/mockData.ts`
  - Specifications: `prd.md`, `tdd.md`

## 3. Context Pointer
For human-centric context, read `README.md`.

## 4. Build & Test Commands
> [!NOTE]  
> This repository utilizes standard `npm` toolchains rather than Blaze/Bazel. No `BUILD` targets exist in this directory.

- **Run Development Server**: `npm run dev`
- **Execute Production Build**: `npm run build`
- **Run Static Analysis**: `npm run lint`
- **Start Production Server**: `npm start`

## 5. Conventions
- **Strict Typing**: Avoid the `any` type entirely. Use explicit interfaces defined in `src/types.ts`.
- **Module Exports**: Use named exports exclusively across all React components and utility files.
- **Safety Guardrails**: Never bypass or mock human-in-the-loop (HITL) PIN verification challenges when handling high-severity SCADA triage operations.
- **UI/Styling**: Adhere strictly to the industrial dark theme (`#0D0D0D`) using predefined Tailwind CSS utility classes.

## 6. Deployment (Google Cloud Run)
- **Container Registry**: Artifact Registry (`us-central1-docker.pkg.dev/pr-tftest/asset-vol-repo/assetvol:latest`)
- **Cloud Build Submission**: `gcloud builds submit --tag us-central1-docker.pkg.dev/pr-tftest/asset-vol-repo/assetvol:latest`
- **Cloud Run Deployment**: `gcloud run deploy assetvol --image us-central1-docker.pkg.dev/pr-tftest/asset-vol-repo/assetvol:latest --region us-central1 --platform managed --port 3001 --allow-unauthenticated`

## 7. Safety & Security
- **Human-in-the-Loop (HITL)**: Automated SCADA mitigations that exceed allowable operational thresholds must trigger multi-factor operator validation (PIN challenges and mandatory text justification).
- **Explainability**: AI triage decisions must present full mathematical proofs and variable matrices to the operator before execution.
- **Credential Management**: Third-party integrations (such as Google Maps API keys) must be injected via `.env` configuration and never hardcoded in source files.
