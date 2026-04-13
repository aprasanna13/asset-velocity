# **Product Requirements Document: Field Operations (POC)**

**Project Name:** Field Operations

**Target Asset:** Natural Gas Pipeline Compressor

**Version:** 1.0 (Feb 18, 2026\)

## **1\. Executive Summary**

The goal of this POC is to demonstrate a rapid "headless" agentic workflow that optimizes the lifecycle of critical pipeline assets. The system addresses two primary bottlenecks:

1. **Alert Triage:** Filtering thousands of high-frequency SCADA signals to identify actionable anomalies.  
2. **Maintenance Inertia:** Automating the logistical tail of maintenance (parts retrieval, scheduling, and load balancing) to maintain throughput.

This system also includes an interactive **Command Center** (UI Hub) to transform static notifications into real-time triage, batch event processing, and direct system intervention.

## **2\. Problem Statement**

Operators currently struggle to differentiate between standard operational fluctuations and critical failure precursors. When an event is identified, the manual process of checking SAP for parts, coordinating downtime, and calculating pipeline compensation (load balancing) creates "velocity" loss, resulting in reduced throughput and potential safety risks.

## **3\. Agent Architecture**

### **Agent A: SCADA Triage Agent (Headless)**

* **Role:** Signal Processing & Filtering.  
* **Logic:** \* Ingest high-frequency SCADA telemetry.  
  * Apply a classifier (Operational vs. Anomaly).  
  * **Thresholds:** Critical if PSI \< 650, Temp \> 150°F, or Vibration \> 0.50mm.  
* **Output:** Actionable "Anomaly Event" packets containing metadata (Asset ID, Location, Telemetry Signature).

### **Agent B: Maintenance Lifecycle Agent (Headless)**

* **Role:** Workflow Automation & Optimization.  
* **Logic:** \* **Trigger:** Receives Anomaly Event from Agent A.  
  * **Step 1: SAP Lookup:** Query inventory for specific asset model dependencies (Gaskets, Seals, Lube).  
  * **Step 2: Scheduling:** Identify the next maintenance window (e.g., 18:00 \- 22:00 local).  
  * **Step 3: Load Balancing:** Proactively calculate output increases for adjacent pipeline compressors to maintain pressure.  
  * **Step 4: Orchestration:** Generate notifications for Ground Staff (Maintenance) and Operations (Scheduling).  
  * **Step 5: QA Closure:** Monitor for "Safety Check Complete" status and close the ticket.

### **3.3. Command Center (UI Hub)**

* **Role:** Real-time Triage & System Intervention.
* **Logic:**
  * **Alert Categorization:** Group by severity (Red=Critical/Vibration, Yellow=Warning/Latency, Blue=Info).
  * **Live Feed & Intelligent Batching:** Group high-frequency events (e.g., node status changes) to prevent alert fatigue.
  * **Simulation Management:** Centralized hub for simulation status and Quick Kill.
  * **Technical Health Monitoring:** Warnings for triage latency > 5s.

## **4\. Maintenance Workflow Lifecycle**

1. **SCADA Trigger:** Asset COMP-TX-VALLEY-01 exhibits high vibration and low PSI.  
2. **Triage:** Agent A filters the stream, labels event as **Critical**, and kicks Agent B.  
3. **Dependency Retrieval:** Agent B "calls" SAP; confirms Gasket Kit GASK-9921-X is in stock.  
4. **Optimization:** Agent B calculates that COMP-TX-VALLEY-02 and 03 must increase output by 8.5% to negate the flow loss.  
5. **Downtime Notification:** Operations is notified of a 4-hour maintenance window.  
6. **Safety & QA:** Following repair, the safety inspector logs a digital check; Agent B closes the event in the system.

## **5\. Test Data (Synthetic)**

Use the following data sets to feed the prototype in AI Labs.

### **Dataset 1: SCADA Telemetry (scada\_stream.json)**

```

[
  {"id": 1, "timestamp": "2026-02-18T14:00:00Z", "asset_id": "COMP-TX-VALLEY-01", "psi": 855, "temp": 112, "vibration": "0.02mm", "status": "Normal"},
  {"id": 2, "timestamp": "2026-02-18T14:05:00Z", "asset_id": "COMP-TX-VALLEY-01", "psi": 852, "temp": 114, "vibration": "0.02mm", "status": "Normal"},
  {"id": 3, "timestamp": "2026-02-18T14:10:00Z", "asset_id": "COMP-TX-VALLEY-01", "psi": 645, "temp": 158, "vibration": "0.85mm", "status": "Critical Alert"},
  {"id": 4, "timestamp": "2026-02-18T14:12:00Z", "asset_id": "COMP-TX-VALLEY-02", "psi": 850, "temp": 110, "vibration": "0.01mm", "status": "Normal"}
]

```

### **Dataset 2: SAP Inventory Lookup (sap\_mock.csv)**

```

model,part_number,description,stock_level,lead_time_days
High-Flow Centrifugal,GASK-9921-X,Compressor Valve Gasket Kit,12,0
High-Flow Centrifugal,SEAL-HT-44,High-Temp Main Shaft Seal,4,2
High-Flow Centrifugal,LUBE-SYN-Q,Synthetic Lubricant (5 Gal),25,0

```

### **Dataset 3: Pipeline Topography (pipeline\_nodes.json)**

```

{
  "segment": "Permian-East-Line",
  "target_flow": "500 MMcf/d",
  "nodes": [
    {"id": "COMP-TX-VALLEY-01", "current": 100, "max": 120, "role": "Primary"},
    {"id": "COMP-TX-VALLEY-02", "current": 100, "max": 125, "role": "Backup"},
    {"id": "COMP-TX-VALLEY-03", "current": 100, "max": 125, "role": "Backup"}
  ]
}

```

### **5.4 Technical Data Schema for Notifications**

| Field | Type | Description | Example |
| :---- | :---- | :---- | :---- |
| notification\_id | String | Unique Identifier | "8821-XP" |
| priority | Enum | Level of urgency | "critical", "warning", "info" |
| asset\_info | Object | Target hardware details | {"id": "COMP-TX-VALLEY-01", "location": "Texas Valley"} |
| actions | Array | UI buttons to render | \[{"label": "Acknowledge"}, {"label": "Assign"}\] |

## **6\. Success Criteria**

* **Validation:** Customer stakeholders (Exxon, Halliburton) confirm the workflow logic aligns with field operations.  
* **Latency:** Agent B initiates the lifecycle within \< 5 seconds of the Critical Alert detection.  
* **Accuracy:** Load balancing calculation correctly redistributes missing PSI to operational nodes.
* **Triage Efficiency:** Goal of <30s from notification receipt to "Acknowledge" click.
* **Navigation Reduction:** 20% decrease in clicks to the "Anomalies" sidebar tab.
* **System Stability:** Zero "Stream Connection Lost" notifications persisting longer than 10s without automated retry logs.

## **7\. Revision History & Changelog**

This section consolidates all historical changes, decisions, and technical implementations for the Field Operations platform.

### **Change History**

**Timestamp:** 2026-04-07 18:18:00
- **Change Type:** Documentation
- **Description:** Created `prd_settings.md` to detail the functional and non-functional specifications for a new Settings Configuration Panel.
- **Reasoning:** To fulfill the user's request to generate a PRD covering SCADA telemetry control, Agentic Engine automation parameters, alert routing, and UI preferences.
- **Impact:** Establishes a clear blueprint for implementing user settings within the Field Operations platform.
- **Verification:** Verified successful creation of the PRD markdown document in the repository root.

---

**Timestamp:** 2026-04-07 13:08:00
- **Change Type:** Documentation
- **Description:** Updated the root `README.md` to incorporate detailed summaries of all major subdirectories (`src/`, `backend/`, `dist/`).
- **Reasoning:** To fulfill the user's request to synthesize the subdirectory READMEs and root-level files into a comprehensive top-level documentation file.
- **Impact:** Centralized and enhanced repository structure and setup documentation.
- **Verification:** Verified successful file overwrite and correct markdown formatting.

---

**Timestamp:** 2026-04-07 12:53:00
- **Change Type:** Documentation
- **Description:** Added `README.md` to the `src` directory to detail the frontend source files, components, and feature modules.
- **Reasoning:** To fulfill the user's request to document the structure, modules, and files in the `src` directory.
- **Impact:** Improved developer onboarding and documentation for the frontend codebase.
- **Verification:** Verified file creation and correct markdown content.

---

**Timestamp:** 2026-04-07 12:50:00
- **Change Type:** Documentation
- **Description:** Added `README.md` to the `dist` directory to explain the purpose of the production build files.
- **Reasoning:** To fulfill the user's request to document the contents and purpose of the frontend build artifacts in the `dist` directory.
- **Impact:** Improved developer documentation for the compiled frontend build output.
- **Verification:** Verified file creation and correct markdown content.

---

**Timestamp:** 2026-04-07 12:49:00
- **Change Type:** Documentation
- **Description:** Added `README.md` to the `backend` directory to explain the purpose of the database files.
- **Reasoning:** To fulfill the user's request to document the contents and purpose of the `backend` directory files.
- **Impact:** Improved developer documentation for the backend components.
- **Verification:** Verified file creation and correct markdown content.

---

**Timestamp:** 2026-04-02 16:45:00
- **Change Type:** Feature Implementation
- **Description:** Implemented the Command Center (Notification Flyout) as specified in `changerequest.md`.
- **Logic Followed:**
    1.  **Modularization**: Separated types and component logic into a dedicated feature directory (`src/features/command-center`) to avoid cluttering main layout files.
    2.  **State Driven**: Leveraged React state in the main `App.tsx` to handle open/close transitions and notification mutations (Acknowledge, Assign), passing them as props to the presenter component.
    3.  **Visual Separation**: Used a right-side flyout overlay with z-index isolation to ensure visibility across all views without disrupting dashboard layout.
- **Impact:** Transformed a static bell icon into an interactive hub for system triage and monitoring.
- **Verification:** Verified successful production build (`tsc && vite build`).

---

**Timestamp:** 2026-03-02 16:45:00
- **Change Type:** Feature
- **Description:** Implemented a high-fidelity Secure Access Portal (Login Screen). Added `Login.tsx` component and integrated `isAuthenticated` state management in `App.tsx`.
- **Reasoning:** To provide a secure and professional entry point for the Agentic Asset Management platform that matches the overall industrial design system.
- **Impact:** Core application functionality is now protected by a login gateway, improving the POC's security and user experience.
- **Verification:** Verified login flow with credentials `test123` / `test123`; confirmed UI transitions and state persistence.

---

**Timestamp:** 2026-03-02 16:15:00
- **Change Type:** Deployment
- **Description:** Deployed the integrated Velocity application to Google Cloud Run in the `pr-tftest` project. Updated Dockerfile to support single-port Node.js execution.
- **Reasoning:** To provide a live, production-ready environment that is immune to CORS and Identity Proxy redirect issues.
- **Impact:** The application is now publicly accessible via a Cloud Run URL with full backend and frontend integration.
- **Verification:** Successfully deployed to `https://assetvol-255093976233.us-central1.run.app`.

---

**Timestamp:** 2026-03-02 15:30:00
- **Change Type:** Feature
- **Description:** Applied final branding and UI polish. Updated application title to "Velocity", added "Agentic Asset POC" footer, and integrated the new logo. Updated project metadata in `package.json` and `index.html`.
- **Reasoning:** To align the application with the final product naming and visual identity requirements.
- **Impact:** Professionalized the UI and ensured consistent naming across the codebase and browser tab.
- **Verification:** Verified visual changes via build and manual inspection of the code.

---

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

