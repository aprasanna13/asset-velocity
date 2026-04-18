# Design Document: Google Maps Integration for Pipeline Topology

## Section 0: Business Problem Description

**The Problem**: Field operators currently monitor the gas pipeline network using a schematic topology view. While this view is excellent for understanding the logical flow of gas and identifying which nodes are connected, it lacks any real-world geographic context. 

In critical field operations, knowing *what* is happening (e.g., a pressure drop at Node 02) is only half the story. Operators also need to know *where* it is happening. Without geographic anchoring:
*   It is difficult to dispatch field technicians efficiently to the correct physical location.
*   Operators cannot correlate network anomalies with external factors like weather events, terrain challenges, or proximity to populated areas.
*   The physical distance and route of pipelines are obscured, making it harder to assess the scale of a potential leak or maintenance operation.

**The Solution**: We aim to introduce a geographic "Map View" powered by Google Maps, running alongside the existing schematic view. This will allow operators to see the physical layout of the pipeline network in Texas, overlaid with the same high-performance real-time flow and status telemetry they rely on today. This bridges the gap between digital monitoring and physical field operations.

## Section 1: High-Level Technical Plan

**How it fits in the ecosystem**:
The application currently features a "Schematic View" that shows the pipeline network as a simplified diagram. We are adding a second view, the "Geographic Map View". The rest of the dashboard—such as the side panels showing alerts, flow rates, and controls—will remain the same and will work seamlessly with both views.

**The Big Components**:
1.  **The Base Map**: A Google Map layer that provides the real-world background. We will customize its appearance to have a dark theme that matches the rest of the application, removing unnecessary details like city landmarks to keep the focus on operations.
2.  **The Drawing Overlay**: An implementation using `google.maps.OverlayView`. This provides a transparent digital canvas placed directly on top of the map that syncs perfectly with pan and zoom events. This is where we will draw the pipelines, stations, and animations showing gas flow.
3.  **The Interaction Layer**: Invisible native Google Maps `Polyline` and `Marker` objects. These will be used to handle user interactions (clicks, hovers, tooltips) for pipelines and nodes, avoiding the need for custom hit-detection on the canvas.
4.  **The View Switcher**: A simple control (like a toggle button or tabs) that allows the operator to switch back and forth between the diagram view and the map view.

**How they fit together**:
When an operator switches to the Map View, the application loads the Google Map centered on the relevant area in Texas. The **Base Map** handles the geography. The **Interaction Layer** places invisible (or minimally styled) native shapes on the map to handle events. The **Drawing Overlay** (`OverlayView`) takes the GPS coordinates, projects them to screen pixels using the map's projection, and draws the high-performance flow animations on the canvas. This ensures that as you move or zoom the map, the animations and interaction targets stay perfectly aligned with their real-world locations.

## Section 2: Detailed Implementation Plan

This section details every file that will be created or modified to implement the Geographic Map View while retaining the existing Schematic View.

### New Files

#### 1. `src/features/topology/components/GeographicTopologyView.tsx`
*   **Action**: Create
*   **Rationale**: This will be the primary component for the map view. It will host the Google Maps base layer, the `google.maps.OverlayView` for canvas animations, and invisible native polylines/markers for interaction. It will take the entire network graph as a prop to render the nodes and paths. Isolating this in a new file keeps the codebase modular and avoids over-complicating the existing `TopologyView.tsx`.

#### 2. `.env.example`
*   **Action**: Create
*   **Rationale**: To document the required environment variables without exposing actual secrets. We will add a placeholder for `VITE_GOOGLE_MAPS_API_KEY` (since this project uses Vite). The actual `.env` file will be created locally by the user and not committed to source control.

### Modified Files

#### 1. `src/types.ts` (or equivalent core types file)
*   **Action**: Modify
*   **Rationale**: We need to update the data models for nodes and pipelines to support geographic coordinates. Specifically, we need to add `latitude` and `longitude` fields to the `PipelineNode` type, and a path array of coordinates to the pipeline segment definitions.

#### 2. `src/features/topology/components/TopologyView.tsx`
*   **Action**: Modify (Minor)
*   **Rationale**: While we are keeping this schematic view, we may need to make minor adjustments to ensure it ignores the new geographic data fields or to standardize props if it shares data with the new map component.

#### 3. `src/App.tsx` (or the parent component rendering the topology view)
*   **Action**: Modify
*   **Rationale**: We need to implement the UI control (toggle or tabs) that allows operators to switch between the "Schematic View" and the "Geographic View". This component will hold the state for the active view and render the appropriate component.

#### 4. `package.json`
*   **Action**: Modify
*   **Rationale**: We need to add the `@googlemaps/react-wrapper` package to handle the loading of the Google Maps JavaScript API script in a clean, React-idiomatic way.

## Section 3: Advanced Technical Considerations

This section outlines advanced considerations for performance, UI behavior, and data handling to ensure a production-grade implementation.

### 1. Performance & Optimization
*   **Line Simplification**: To optimize rendering performance and avoid visual clutter at low zoom levels (when viewing large areas), we will use a small utility library (like `simplify-js`) to implement the Douglas-Peucker line simplification algorithm to reduce the density of path points rendered on the canvas.
*   **Animation Lifecycle**: The `requestAnimationFrame` loop used for flow animations must be actively managed. When the operator switches away from the Geographic Map View to the Schematic View, the animation loop must be stopped to conserve system resources.
*   **Data Throttling**: To prevent the browser from locking up during high-frequency telemetry updates, data feeds will be throttled to ensure the UI does not attempt to re-render more than 60 times per second.

### 2. UI & Map Configuration
*   **Disabling Tilt and Rotation**: To ensure the 2D Canvas overlay remains perfectly aligned with the map, 3D tilt and rotation will be disabled in the map options (`tilt: 0`, `rotateControl: false`).
*   **Layering**: The Canvas overlay will be placed in an appropriate Google Maps pane (e.g., below labels if context is needed, or labels will be removed via styling) to ensure pipeline data and map context do not obscure each other inappropriately.

### Security & API Key Management
The Google Maps API key will **not** be stored in the source code. It will be stored in an environment variable named `VITE_GOOGLE_MAPS_API_KEY` in a local `.env` file. In production (Cloud Run), this will be managed via environment variables or Secret Manager.

## Section 4: Supplemental Data & Specifications

### 1. Mock Data (Texas Network)
To cover the locations and test the implementation, we will use the following synthetic data for 4 nodes and connecting paths:

**Nodes:**
*   **Node 1 (Permian Basin - Midland)**: `{ id: "node_1", name: "Midland Station", lat: 31.9973, lng: -102.0779 }`
*   **Node 2 (Odessa)**: `{ id: "node_2", name: "Odessa Station", lat: 31.8457, lng: -102.3677 }`
*   **Node 3 (San Angelo)**: `{ id: "node_3", name: "San Angelo Hub", lat: 31.4638, lng: -100.4370 }`
*   **Node 4 (Houston Hub)**: `{ id: "node_4", name: "Houston Terminal", lat: 29.7604, lng: -95.3698 }`

**Paths (Pipelines):**
*   **Path 1 (Midland to Odessa)**: Points connecting Node 1 and Node 2.
*   **Path 2 (Odessa to San Angelo)**: Points connecting Node 2 and Node 3.
*   **Path 3 (San Angelo to Houston)**: Points connecting Node 3 and Node 4.

### 2. Google Maps Style (Dark Theme)
Use the following JSON style array to create the dark theme for the map:

```json
[
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
  { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#3c3c3c" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#8a8a8a" }] },
  { "featureType": "transit", "stylers": [{ "visibility": "off" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
]
```

### 3. Acceptance Criteria
The feature will be considered complete and successful when:
1.  **Visual Parity**: The network graph renders correctly on the map, with nodes and paths aligned with their geographic coordinates.
2.  **Performance**: The canvas rendering loop maintains a target of 60fps during flow animations.
3.  **Responsiveness**: The map and overlay respond smoothly to pan and zoom interactions.
4.  **Interaction**: Clicking or hovering on invisible native polylines/markers triggers the correct information tooltips or actions.
5.  **Toggle Functionality**: The operator can switch between Schematic and Geographic views without loss of application state.
