# Changelog

This document logs the changes made to the Asset Velocity application.

---

### My Thinking Process

My goal was to deploy the application to Google Cloud Run and then apply subsequent updates as requested. The process involved several steps, starting with understanding the project, identifying and fixing issues that arose during deployment, and finally, implementing new features.

Here's a breakdown of my thought process for each major change:

1.  **Initial Deployment & Troubleshooting:**
    *   My first step was to try and deploy the application as-is to understand its structure and dependencies. This immediately revealed issues with the build process, including TypeScript errors and problems with the container registry.
    *   I tackled each of these issues systematically. The TypeScript errors required me to add explicit types to the React components and state, which I did by creating interfaces and updating the code accordingly. The container registry issue led me to switch from the deprecated Google Container Registry to the recommended Artifact Registry, which involved creating a new repository and updating the deployment scripts.

2.  **Permissions and Configuration:**
    *   Even after switching to Artifact Registry, I encountered a permission error. I deduced that the Cloud Build service account, which was running the build, did not have the necessary permissions to write to the new repository.
    *   To solve this, I identified the service account's email and granted it the "Artifact Registry Writer" role. This allowed the build process to successfully push the container image.

3.  **Implementing New Features (Logo Update):**
    *   When asked to update the logo, my first step was to figure out where to store the new image. I created an `assets` directory inside `src` to keep the project organized.
    *   I then updated the `App.tsx` component, importing the new logo and replacing the existing icon with an `<img>` tag. This led to a new TypeScript error because the compiler didn't know how to handle `.png` files.
    *   To resolve this, I created a `declarations.d.ts` file to inform the TypeScript compiler that `.png` files are valid modules, a standard practice in modern web development.

4.  **Final Deployment:**
    *   With all the fixes and new features in place, I re-ran the build and deploy process. This time, all steps were successful, and the updated application was deployed as a new version on Cloud Run.

5.  **Full Application Redesign & Workflow Optimization (Session Feb 27):**
    *   The primary objective was to transition the entire application to a new visual identity based on a provided redesign specification. This involved moving away from standard UI components to a bespoke, industrial dark theme (`#0D0D0D`) with high-intensity accents.
    *   I restructured the application into three main functional zones: the **Anomaly Triage Center**, the **Agentic Engine**, and **Pipeline Topology**.
    *   For the Agentic Engine, I expanded the maintenance workflow to 7 distinct, actionable steps. I implemented contextual UI logic to ensure that "Next Step" buttons are always tied to the current active state, improving user focus.
    *   I updated the SVG visualizations to be reactive. Now, once maintenance is finalized, the system state dynamically transitions from alert (red/blue) to optimal (green) across all screens simultaneously.
    *   Finally, I verified the integrity of the build and successfully deployed the redesigned artifact to the project's production environment.

6. **Single-Port React & Node.js Integration (Session Mar 02):**
    *   The goal was to eliminate CORS and 302 redirect issues in GCP Cloud Workstations by serving the React frontend directly from the Node.js server on a single port (3001).
    *   I refactored `server.js` to serve the `dist` directory and added a catch-all middleware to support client-side routing. I encountered a `path-to-regexp` error with the `*` wildcard in Express 5, which I resolved by using an anonymous `app.use` middleware that serves `index.html` for all non-API requests.
    *   On the frontend, I transitioned API calls in `src/services/api.ts` to relative paths and updated the Vite configuration to proxy requests to `localhost:3001` during development.
    *   I streamlined the project by removing the `cors` package and added a `deploy` script to automate the build and start process.

Throughout this process, I aimed to be methodical, addressing one issue at a time and verifying each change before moving on to the next.

---

### Change History

**Timestamp:** 2026-03-02 14:15:00
- **Change Type:** Refactor
- **Description:** Integrated React frontend and Node.js backend into a single-port deployment on Port 3001. Removed `cors` dependency, updated API calls to relative paths, and implemented SPA-compatible routing in Express.
- **Reasoning:** To eliminate CORS errors and Google Identity Proxy (302 redirect) issues in GCP Cloud Workstations environment.
- **Impact:** Simplified deployment architecture, improved security by using a single origin, and ensured seamless routing for React Router.
- **Verification:** Verified build process with `npm run build` and confirmed server functionality on Port 3001 with `curl`.

---

**Timestamp:** 2026-02-27 04:15:00
- **Change Type:** Feature
- **Description:** Completed a comprehensive UI/UX redesign. Implemented a deep dark theme across all screens, updated the Agentic Engine to a 7-step lifecycle, and modernized the Pipeline Topology view.
- **Reasoning:** To align the application with the new brand identity and operational requirements specified in the redesign documentation.
- **Impact:** Significant improvement in visual clarity, situational awareness for operators, and overall professional aesthetic.
- **Verification:** Built and deployed to Cloud Run (`asset-vol-255093976233`); verified successful rendering and state transitions in the live environment.

---

**Timestamp:** 2026-02-27 04:05:00
- **Change Type:** Enhancement
- **Description:** Optimized the Agentic Engine workflow. Added 7 explicit steps (from Event Received to Safety Closure), implemented contextual action buttons within the timeline, and added reactive "Healthy" states to all SVGs.
- **Reasoning:** To reduce vertical scrolling and provide immediate visual feedback upon maintenance completion.
- **Impact:** Streamlined maintenance management and improved user experience by keeping actions contextual.
- **Verification:** Tested workflow end-to-end; confirmed all nodes and connection lines transition to green upon finalization.

---

**Timestamp:** 2026-02-27 03:50:00
- **Change Type:** Fix
- **Description:** Restored the missing SAP Inventory tab and integrated it into the new design system. Re-added `InventoryItem` types and mock data.
- **Reasoning:** Functionality was lost during the initial redesign phase; required restoration for operational completeness.
- **Impact:** Restores the ability for users to check part availability during maintenance triage.
- **Verification:** Confirmed the Inventory tab is accessible in the sidebar and displays correctly.

---

**Timestamp:** 2026-02-20 15:00:00
- **Change Type:** Fix
- **Description:** Created a `declarations.d.ts` file to provide a module declaration for `.png` files.
- **Reasoning:** The TypeScript compiler was throwing an error ("Cannot find module './assets/Logo.png'") because it did not know how to handle image imports.
- **Impact:** Allows for the import of `.png` files (and other assets if configured) in TypeScript, enabling the use of images as components.
- **Verification:** The `gcloud builds submit` command completed successfully after this file was added.

---

**Timestamp:** 2026-02-20 14:59:00
- **Change Type:** Feature
- **Description:** Replaced the `Cpu` icon in the sidebar with the new `Logo.png` image. This included updating the `lucide-react` import and replacing the `<Cpu>` component with an `<img>` tag in `src/App.tsx`.
- **Reasoning:** To fulfill the user's request to update the application's logo to a custom image for better branding.
- **Impact:** The application's UI is updated to show the new logo in the sidebar, improving its visual identity.
- **Verification:** The change was deployed to Cloud Run and is visible in the running application.

---

**Timestamp:** 2026-02-20 14:58:00
- **Change Type:** Chore
- **Description:** Granted the "Artifact Registry Writer" role to the Cloud Build service account (`255093976233@cloudbuild.gserviceaccount.com`).
- **Reasoning:** The Cloud Build service account did not have the required IAM permissions to push container images to the newly created Artifact Registry repository, which caused the build to fail.
- **Impact:** The Cloud Build pipeline is now able to successfully push images to Artifact Registry, unblocking the deployment process.
- **Verification:** The subsequent `gcloud builds submit` command completed successfully.

---

**Timestamp:** 2026-02-20 14:57:00
- **Change Type:** Chore
- **Description:** Switched the container registry from Google Container Registry (GCR) to Artifact Registry. This included enabling the Artifact Registry API, creating a new Docker repository, and updating the image name in the build and deploy commands.
- **Reasoning:** The push to GCR was failing because the service is deprecated. Artifact Registry is Google Cloud's recommended replacement for managing container images.
- **Impact:** The project now uses a modern and supported container registry, ensuring the stability and maintainability of the CI/CD process.
- **Verification:** The `gcloud builds submit` command with the new Artifact Registry image name was successful.

---

**Timestamp:** 2026-02-20 14:56:00
- **Change Type:** Fix
- **Description:** Fixed multiple TypeScript errors in `src/App.tsx` that were preventing the application from compiling. This involved adding explicit types for component props and state variables (e.g., `useState<ScadaData[]>([])`), and removing unused imports.
- **Reasoning:** The build was failing due to type errors, which blocked the initial deployment. A type-safe codebase is also more maintainable and less prone to runtime errors.
- **Impact:** The application can now be successfully compiled and built, enabling deployment and further development.
- **Verification:** The `gcloud builds submit` command completed successfully after these fixes were applied.
## [Unreleased]
### Added
- Implemented SAP inventory service with Node.js and SQLite backend. This includes API endpoints for fetching, updating, and ordering inventory items, replacing hardcoded data with a persistent and dynamic solution.

## [1.0.0] - 2026-02-27
### Added
- Initial project setup.