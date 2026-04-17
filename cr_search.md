# Design Document: Global Search

## Section 0: The Business Problem

### Overview
The Field Operations application serves operators managing complex, high-stakes industrial environments (such as pipeline networks and SCADA telemetry). These operators are responsible for monitoring live data, responding to critical anomalies, and executing maintenance workflows. 

### The Problem
As the system grows in complexity, information becomes siloed across different specialized views (e.g., the network map in Topology, stock tables in Maintenance, and streaming logs in the Execution Console). 

Currently, operators face two major friction points when trying to find information:
1.  **High Cognitive Load**: To find a specific asset or log, operators must manually navigate to the correct screen and scan dense tables or logs. This is slow and prone to human error in high-stress situations.
2.  **Loss of Situational Awareness**: Navigating away from a critical view (like SCADA triage) to look up a part in the Inventory view forces the operator to lose sight of live telemetry. In industrial operations, this split-second loss of context can be dangerous.

### The Solution
We are solving this by implementing a **context-aware, categorized search bar** in the application header. This search reduces noise by prioritizing results matching the user's current screen, and it prevents loss of situational awareness by opening results in non-disruptive overlays (like drawers or modals) or highlighting them in place (like on the map) instead of forcing full-page navigation.

---

## Section 1: Technical Implementation Plan

### The Big Components
To build this feature, we need to create three main parts:
1.  **The Search Bar**: This is the visible box at the top of the screen where the operator types. It will also handle displaying the dropdown list of results.
2.  **The Search Brain**: This is the invisible logic that connects the search bar to the rest of the app. It listens to what the operator types, waits for a split second so it doesn't slow down the app, and then asks for results.
3.  **The Data Connectors**: These are small, dedicated helpers. We will have one for each type of data (one for Logs, one for Parts, and one for Network Nodes). Each helper only needs to know how to read its specific list of data and find matches.

### How They Fit Together
*   When an operator types a word into the **Search Bar**, the **Search Brain** receives that word.
*   The Search Brain then asks all the **Data Connectors** to find anything that matches that word in their respective areas.
*   Once the connectors reply with their matches, the Search Brain looks at what screen the operator is currently viewing. It sorts the results so that matches relevant to that screen appear at the top.
*   Finally, the Search Brain sends this sorted list back to the Search Bar to display in the dropdown.

### How it Fits in the Ecosystem
This search feature acts as a wrapper or a "lens" over the existing application. 
*   It does not change how the Inventory, SCADA system, or Logs work. 
*   It simply reads the data that is already flowing through the app and presents it in a unified way. 
*   Because it only reads data and opens information in overlays (like drawers or pop-ups), it is a low-risk addition that won't interfere with critical live operations.

---

## Section 2: Alternatives Considered

During the design process, we considered three other ways to build this feature but decided against them:

### 1. The "All-in-One" Search Function
*   **The Idea**: Put all the logic for searching logs, parts, and nodes into one giant block of instructions.
*   **Why We Ruled It Out**: While this is the easiest way to start, it becomes a mess as the application grows. Every time we add a new feature to the app, we would have to rewrite parts of this giant function, increasing the risk of breaking the search feature.

### 2. Screen-Specific Search Only
*   **The Idea**: Don't have a global search at all. If you are on the Maintenance screen, you can only search for parts. If you are on the SCADA screen, you can only search for nodes.
*   **Why We Ruled It Out**: This forces the operator to do more work. If they are on the Maintenance screen but suddenly need to find a specific node on the map, they would have to click over to the SCADA screen first before they could search for it. This adds unnecessary steps in a high-stress environment.

### 3. Using a Heavy Third-Party Search Tool
*   **The Idea**: Install a specialized, complex search library to handle the searching.
*   **Why We Ruled It Out**: The amount of data we are searching through right now (like the 50-item log list) is small. Standard web capabilities are more than fast enough to handle this. Adding a heavy external tool would slow down the application loading time for no real benefit. We can always add one later if our data grows to thousands of items.

---

## Section 3: Detailed Implementation Plan

To bring this feature to life, we will need to create **5 new files** and modify **3 existing files**. Here is the breakdown:

### New Files to Create

#### 1. `src/components/Search/SearchBar.tsx`
*   **What it is**: The visual user interface component for the search box and the dropdown results list.
*   **Why it's necessary**: We need a dedicated place to handle the operator's input, show the results visually, and handle mouse and keyboard navigation within the dropdown.

#### 2. `src/components/Search/useSearch.ts`
*   **What it is**: A custom React hook that contains the "brain" of the search feature.
*   **Why it's necessary**: To keep the code clean, we want to separate the logic (waiting for the user to stop typing, calling the data connectors, and sorting results) from the visual component (`SearchBar.tsx`).

#### 3. `src/components/Search/adapters/inventoryAdapter.ts`
*   **What it is**: A small helper function dedicated to searching the inventory list.
*   **Why it's necessary**: It isolates the specific logic needed to find matching parts, keeping the main search hook simple and focused.

#### 4. `src/components/Search/adapters/logAdapter.ts`
*   **What it is**: A small helper function dedicated to searching the execution logs.
*   **Why it's necessary**: It isolates the logic needed to scan text in the log buffer, ensuring we can optimize log searching independently if needed later.

#### 5. `src/components/Search/adapters/nodeAdapter.ts`
*   **What it is**: A small helper function dedicated to searching the topology network nodes.
*   **Why it's necessary**: It isolates the logic needed to find matches on node IDs and sensor names.

### Existing Files to Modify

#### 1. `src/App.tsx`
*   **What needs to change**: We need to import the new `SearchBar` component and place it inside the existing `<header>` element (currently rendered around line 199). We also need to pass the `currentTab` state to it so it knows the current context.
*   **Why it's necessary**: This is the only way to make the search bar visible in the global header across all screens.

#### 2. `src/types.ts`
*   **What needs to change**: We need to add new Type definitions for `SearchResult` and possibly the adapter interfaces.
*   **Why it's necessary**: To maintain the strict TypeScript standards of the project and ensure type safety across the new search components.

#### 3. `src/components/README.md`
*   **What needs to change**: We need to add a new section (Section 7) describing the Search Subsystem, its purpose, and contents.
*   **Why it's necessary**: To keep the project documentation up to date with the new architecture, as required by the project rules.

---

## Section 4: Agreed Implementation Details

Based on the technical review and follow-up decisions, the following specific details have been agreed upon for the initial implementation:

1.  **Data Source**: 
    *   Use available static data for inventory and nodes (e.g., `STATIC_INVENTORY` in `useInventory.ts`, `INITIAL_PIPELINE_NODES` in `App.tsx`).
    *   For Logs, consume the same `logs` array used by `ExecutionConsole` (passed via props or shared context).
    *   No backend integration for now.
2.  **State Management**: Use React Context to manage search state. The Context file will be saved in the `src/components/Search/` folder (e.g., `SearchContext.tsx`).
3.  **Search Algorithm**: Implement fuzzy search using **Fuse.js** to handle typos and approximate matches, keeping it lightweight.
4.  **UI Enhancements**:
    *   **Grouping**: Group results by category (Logs, Parts, Nodes) in the dropdown.
    *   **Pagination**: Include pagination or "Load More" functionality for results.
    *   **States**: Add explicit loading status and a "Zero Results" state with a helpful message.
5.  **Interactions**:
    *   **Shortcuts**: Include global shortcuts (e.g., `Ctrl+K`) to focus the search bar.
    *   **Race Conditions**: Ensure newer searches ignore results from older, pending searches.
6.  **Action Implementation**:
    *   **NAVIGATE**: Updates the application's active tab state (e.g., calling a `setTab` callback passed from `App.tsx`).
    *   **OPEN_DRAWER**: Triggers a side drawer (or modal) by updating state in the `SearchContext`. If a full drawer component doesn't exist, we will implement a slide-over panel or reuse the `ExplainabilityModal` style.
    *   **HIGHLIGHT_MAP**: Sets a `highlightedNodeId` in the shared state (or `SearchContext`) which the `TopologyView` will listen to for highlighting the specific node.
7.  **Result Interface**:
    ```typescript
    export interface SearchResult {
      id: string;
      title: string;
      subtitle?: string;
      type: 'log' | 'part' | 'node';
      action: {
        type: 'NAVIGATE' | 'OPEN_DRAWER' | 'HIGHLIGHT_MAP';
        payload: any; 
      };
    }
    ```
