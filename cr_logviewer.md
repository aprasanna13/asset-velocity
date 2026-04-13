# Live Agent Execution Console: Technical Design Document

## Section 0: Business Problem & User Value

### The User
Control Room Operators and Operations Supervisors working in high-intensity industrial environments (Field Operations, SCADA, and automated inventory management).

### The Problem
As the system increasingly relies on autonomous agents (e.g., "Agent B") to execute critical triage, load-balancing optimizations, and supply chain adjustments, operators are tasked with monitoring these high-speed automated decisions. Currently, agent activity is output as a generic, unformatted stream of text logs. 

This low-fidelity display introduces three critical risks:
1. **Poor Scannability (Cognitive Overload):** Operators cannot distinguish routine status updates from critical actions or failures at a glance.
2. **Loss of Operational Context:** Investigating the underlying technical details (such as a nested API error or a complex load-balancing calculation) requires the operator to dig through raw text strings, often causing them to lose sight of incoming real-time events.
3. **Handoff Friction:** During shift changes, incoming operators struggle to quickly ascertain what actions the automated agents took during the previous shift, increasing the likelihood of operational blind spots.

### Current System Limitations
The console currently lacks interactive features (no filtering, no expandable details) and provides no visual hierarchy (e.g., color-coded severity badges) to differentiate routine agent updates from critical system changes.

### The Goal
Transform the existing raw text feed into a highly structured, interactive diagnostic console restricted to a strict 50-item memory limit for optimal performance. This feature must provide operators with clear visual hierarchy for immediate anomaly detection, alongside a pop-up detail view that allows for deep technical inspection of agent activity.

---

## Section 1: Technical Implementation Plan (Overview)

### The Core Strategy
To bring this design to life without breaking the current system, we need to upgrade our log system from a simple list of text sentences into a structured system of rich digital cards, capped strictly at 50 items to guarantee high performance.

We will accomplish this by building three major pieces:

### 1. The Data Upgrade (The Blueprint)
Right now, the application treats logs like lines in a notebook—just raw text strings. We will introduce a new "digital form" for each log entry that divides the information into specific compartments:
* **Who did it** (The Agent)
* **When it happened** (Timestamp)
* **How important it is** (Routine, Warning, or Critical)
* **What changed** (The underlying technical payload or data file)

### 2. The Three Main Visual Components

#### A. The Control Header
* **What it does:** Sits at the top of the log view and acts as the command center.
* **Key Features:** Contains filter toggles (e.g., "Show Critical Only").

#### B. The 50-Item Log Feed
* **What it does:** Replaces the current standard text box with a high-performance list limited to exactly 50 visible log entries using simplified indexing/IDs for the ring buffer.
* **Key Features:** It displays each log entry as a neatly aligned, single-line summary. The feed implements **unconditional auto-scrolling** to the bottom on every update (no lock logic). When the user clicks a specific row, a detailed pop-up modal opens to display the full message and key variables.
* **Styling:** Fully inherits the dark, premium hacker-chic Tailwind aesthetic from the parent `WorkflowView.tsx` to ensure a perfectly unified interface.

#### C. The Detail Pop-up Modal
* **What it does:** A focused overlay modal that appears when a log entry is clicked.
* **Key Features:** Displays the full technical details, syntax-highlighted JSON payloads, and execution variables in a clean, dedicated view matching the global aesthetic.

### 3. Fitting into the Ecosystem (Universal Reusability)
* **Plug-and-Play Reusability:** We will design this feature as a standalone, universal container.
* **Safe Translation (Backward Compatibility):** Since many parts of our existing application still send logs as basic text sentences, we will build an internal "Translator" (`LogAdapter`). This Translator will attempt to read legacy text messages and convert them into our new structured format on the fly. **If legacy string parsing fails, it will strictly throw an error with the parsing message.**

---

## Section 2: Alternatives Considered & Ruled Out

During the design process, we evaluated several alternative approaches but ultimately rejected them to ensure the interface remains highly resilient and suitable for real-time operations:

### 1. Infinite Scrolling / Unbounded Log Growth (Ruled Out)
* **The Concept:** Store and render every single log entry generated during a long shift.
* **Why it was rejected:** Rendering hundreds or thousands of DOM elements causes severe scroll stutter, memory leaks, and UI unresponsiveness. To guarantee real-time reliability, we enforce a strict 50-item visible retention limit using a simplified ring buffer.

### 2. Auto-Scroll Lock Logic (Ruled Out)
* **The Concept:** Implement a feature where scrolling up implicitly or explicitly locks the live feed to prevent jumps.
* **Why it was rejected:** Unnecessary complexity for the first-pass implementation. We opted for **unconditional auto-scrolling** to keep the operator always looking at the most up-to-date automated actions without state management friction.

### 3. Clearing Filters During Shift Handovers (Ruled Out)
* **The Concept:** Whenever a session resets or a shift handoff occurs, automatically wipe out any custom filters (e.g., "Show Errors Only") to ensure the incoming operator starts with a completely unfiltered view.
* **Why it was rejected:** Operators strongly prefer their customized layouts and diagnostic filters to persist across different screens and sessions. To balance user preference with safety, we chose to keep filters active but implemented a highly visible, persistent warning indicator that alerts any incoming operator that they are looking at a filtered timeline.

---

## Section 3: Detailed File Implementation Plan

To fully realize the new Execution Console architecture, we will modify three existing files and create four new feature-specific files inside a dedicated module directory.

### Part 1: Type Definitions

#### [MODIFY] `src/types.ts`
* **Rationale:** Currently, system logs are typed as a flat `string[]`. We must introduce the strongly typed `ExecutionLog` interface using simplified IDs to support advanced metadata, timestamps, severity definitions, and expandable JSON payloads.
* **Scope:** Append `ExecutionLog` and `StructuredLogPayload` interfaces to the existing global exports.

### Part 2: The Core Component Module

#### [NEW] `src/components/ExecutionConsole/ExecutionConsole.tsx`
* **Rationale:** Acts as the primary wrapper component. It provides the universal log container used across different screens.
* **Responsibilities:** 
  * Manages the control bar (filters for Severity and Agent tags).
  * Enforces the strict 50-item log limit using a simplified ring buffer.
  * Implements **unconditional auto-scrolling** to the bottom on every update.
  * Coordinates the active item selection for the pop-up modal.
  * Inherits styling completely from the parent view (`WorkflowView.tsx`).

#### [NEW] `src/components/ExecutionConsole/LogRow.tsx`
* **Rationale:** Renders an individual log entry as a structured, responsive row.
* **Responsibilities:** 
  * Displays the compact layout using Monospace for the log content and Sans-serif for metadata badges.
  * Wrapped in `React.memo` to prevent unnecessary sibling re-renders when new logs arrive.

#### [NEW] `src/components/ExecutionConsole/LogDetailModal.tsx`
* **Rationale:** Provides the full technical inspection overlay.
* **Responsibilities:** 
  * Renders a pop-up overlay triggered by clicking a row.
  * Contains a clearly formatted viewer specifically for inspecting `ExecutionLog.payload` objects.

#### [NEW] `src/components/ExecutionConsole/LogAdapter.ts`
* **Rationale:** A utility service designed to guarantee backward compatibility across the codebase.
* **Responsibilities:** 
  * Provides a `parseRawLogToStructured(rawString: string): ExecutionLog` function that safely intercepts standard plain-text log dispatches.
  * **Strictly throws an error with the failure message** if unstructured text fails to parse correctly.

### Part 3: Application Integration

#### [MODIFY] `src/App.tsx`
* **Rationale:** This file manages the global state for automated workflows and agent guardrails. 
* **Scope:** Modify the global log state definition (`const [logs, setLogs] = useState<ExecutionLog[]>([])`) and implement simplified ring-buffer logic to keep the array capped at 50 entries. Route incoming text messages through the `LogAdapter`.

#### [MODIFY] `src/features/maintenance/components/WorkflowView.tsx`
* **Rationale:** This view currently renders a basic, hardcoded box for the "Live Agent Execution Console".
* **Scope:** Remove the existing static scroll-box implementation and replace it with the fully interactive `<ExecutionConsole logs={logs} />` component.
