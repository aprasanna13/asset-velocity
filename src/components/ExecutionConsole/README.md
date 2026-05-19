# Execution Console Component Module

This directory houses the interactive, high-performance execution log console used for real-time tracking, filtering, and auditing of active backend services and agent telemetry streams (e.g., SCADA monitors and mitigation scripts).

It is designed with strict UI performance boundaries, utilizing memoized list items, auto-scrolling behavior, and standard volume caps (ring buffering concept) to ensure interface responsiveness in high-throughput environments.

## Component Architecture & Files

The module consists of four core files:

### 1. [ExecutionConsole.tsx](file:///usr/local/google/home/prasannaankem/Code/Field%20Operations/src/components/ExecutionConsole/ExecutionConsole.tsx)
The orchestrating React component that mounts and manages the console layout. Key operational characteristics:
*   **Auto-Scroll**: Unconditionally snaps the scrollbar to the bottom of the feed as new active logs arrive.
*   **Active Filtering**: Allows developers to toggle view filters by severity (`Critical`, `Warning`, `Routine`) and by emitting agent source (e.g. `TelemetryAgent`, `TriageAgent`).
*   **Filtered View Warning**: Displays a high-visibility flashing indicator overlay when filters are active, alerting developers that a subset of logs is currently concealed.
*   **Volume Cap (Ring Buffer)**: Dynamically trims list rendering to the **last 50 items** to prevent DOM bloat and maintain UI responsiveness during high-frequency telemetry bursts.

### 2. [LogAdapter.ts](file:///usr/local/google/home/prasannaankem/Code/Field%20Operations/src/components/ExecutionConsole/LogAdapter.ts)
A technical data-formatting parser. Key responsibilities:
*   **Regex Parsing**: Extracts timestamp, emitting agent string, and log text from standard unstructured console strings (e.g. `"[10:15:00] [TriageAgent] Check completed"`).
*   **Heuristic Severity Tagging**: Scans message contents for critical terms (such as `critical`, `breach`, `failed`) to tag severity dynamically as `Critical`, `Warning`, or `Routine`.
*   **Data Structure Mapping**: Maps strings into structured `ExecutionLog` types, including assigning a randomized key ID.

### 3. [LogRow.tsx](file:///usr/local/google/home/prasannaankem/Code/Field%20Operations/src/components/ExecutionConsole/LogRow.tsx)
A highly optimized list row item component. Key details:
*   **Performance Optimization**: Wrapped in `React.memo` to prevent unnecessary row re-renders when new entries are appended to the parent console list.
*   **Display Grid**: Renders aligned columns for timestamp, severity tags (color-coded), emitting agent, and truncated messages.

### 4. [LogDetailModal.tsx](file:///usr/local/google/home/prasannaankem/Code/Field%20Operations/src/components/ExecutionConsole/LogDetailModal.tsx)
An overlay detail portal. Key capabilities:
*   **Technical Payload Auditing**: Renders a detailed, syntax-highlighted JSON technical payload block (in retro terminal green) for advanced system diagnosis.
*   **Full Message Reading**: Bypasses the row truncation, allowing operators to read verbose debug blocks and trace actions.
