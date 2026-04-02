# Field Operations: Agentic Asset POC

Field Operations is a high-performance, industrial-grade monitoring and maintenance orchestration platform. It leverages an **Agentic Engine** to automate the lifecycle of asset anomalies, from detection to safety closure, providing real-time situational awareness through a bespoke dark-themed interface.

## 🏗 Architecture

Field Operations follows a **Single-Port Integrated Architecture**, designed for seamless deployment in environments like GCP Cloud Workstations and Cloud Run.

-   **Frontend:** A React (TypeScript) SPA built with Vite. It communicates with the backend via relative API paths, eliminating CORS complexities.
-   **Backend:** A Node.js (Express) server that serves the compiled frontend assets and provides a RESTful API for asset and inventory management.
-   **Database:** A persistent SQLite backend managed via `better-sqlite3` for high-performance local data storage.
-   **Routing:** Integrated SPA routing where the Express server serves `index.html` for all non-API requests, allowing React Router to handle client-side navigation.

## 🚀 Setup & Installation

### Prerequisites

-   **Node.js:** v20 or higher
-   **npm:** v10 or higher

### Local Development

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start the Backend (Port 3001):**
    ```bash
    node server.js
    ```

3.  **Start the Frontend (Port 3000):**
    ```bash
    npm run dev
    ```
    *The Vite dev server is pre-configured to proxy `/api` requests to `localhost:3001`.*

### Production Build & Deployment

To build the project and start the integrated server with a single command:
```bash
npm run deploy
```
This script installs dependencies, compiles the TypeScript/Vite frontend into the `dist/` folder, and starts the Node.js server.

## 🛠 Technology Stack

-   **Core:** [React 18](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Node.js](https://nodejs.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Custom Industrial Dark Theme)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Database:** [SQLite](https://www.sqlite.org/) via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Deployment:** [Docker](https://www.docker.com/), [Google Cloud Run](https://cloud.google.com/run), [Google Artifact Registry](https://cloud.google.com/artifact-registry)

## 📁 Project Structure

-   `src/`: React frontend source code.
    -   `features/`: Domain-specific components (Scada Triage, Agentic Engine, Topology).
    -   `services/api.ts`: Centralized API client using relative paths.
-   `server.js`: Express backend and static file server.
-   `database.js`: SQLite initialization and schema management.
-   `dist/`: Production-ready frontend build (generated).
-   `Dockerfile`: Optimized container configuration for Cloud Run.
