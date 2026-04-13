# Maintenance Components Directory (`src/features/maintenance/components`)

This directory contains the high-fidelity UI operational views for managing industrial lifecycle workflows and tracking automated warehouse component stocks within the Field Operations dashboard.

## Purpose

The components inside this directory render the primary operator oversight screens, specifically managing step-by-step pipeline closure procedures and triggering automated inventory replenishment requests via external SAP-mock endpoints.

## Contents

*   `InventoryView.tsx`: The tabular stock-tracking screen displaying warehouse status alongside dynamic "Order Parts" API actions.
*   `WorkflowView.tsx`: The highly responsive 7-step automated operational closure tracker, equipped with pipeline load balancing preview diagrams and full-width execution logs.

## Usage

**Inventory View Usage:**

```tsx
import InventoryView from './features/maintenance/components/InventoryView';

<InventoryView
    inventory={inventoryState}
    setInventory={setInventoryState}
    addLog={(msg) => console.log(msg)}
/>
```

**Workflow View Usage:**

```tsx
import WorkflowView from './features/maintenance/components/WorkflowView';

<WorkflowView
    workflowStep={currentStep}
    setWorkflowStep={setCurrentStep}
    logs={agentLogs}
    completeMaintenance={resetPipelineAction}
/>
```

## Agent-to-Agent System Definitions

### Boundary Contracts & The "Front Door" Policy
- **InventoryView Entry**: Default export `InventoryView`. Prop Contract: `inventory` (array), `setInventory` (state dispatcher), and `addLog` (string closure).
- **WorkflowView Entry**: Default export `WorkflowView`. Prop Contract: `workflowStep` (number), `setWorkflowStep` (dispatcher), `logs` (string array), and `completeMaintenance` (closure).

### Side Effect Transparency
- **API Intercepts (`InventoryView`)**: Initiates asynchronous data fetching via `orderParts('GASK-9921-X', 10)`. Handles both successful network updates by mutating local state arrays and reports standard catch errors up via the `addLog` bubbling callback.
- **Layout Overflow Policies (`WorkflowView`)**: The primary layout splits vertically without parent container `overflow-hidden` constraints to allow standard full-page scrolling for smaller resolution displays.

### Proof of Work: Reasoning Trace
- **Citation 1**: Confirmed `InventoryView.tsx` (Lines 21-35) successfully dispatches a stock update payload and appends an operator log via `addLog` upon executing network promises.
- **Citation 2**: Verified `WorkflowView.tsx` isolates the execution console into a standalone, full-width footer container completely decoupled from the 7-step tracking cards.
