# Shared Components Directory (`src/components/shared`)

This directory contains ubiquitous, state-agnostic UI micro-elements utilized universally across the Field Operations frontend environment.

## Purpose

The components in this directory are responsible for rendering standardized inline metadata, specifically mapping raw telemetry status flags to highly legible, theme-compliant industrial status badges with distinct structural animations.

## Contents

*   `StatusBadge.tsx`: A purely functional UI indicator that maps incoming SCADA condition flags to formatted visual tags.

## Usage

**Basic Example:**

```tsx
import StatusBadge from './components/shared/StatusBadge';

// Displaying a component telemetry status tag inline:
<StatusBadge status="Critical Alert" />
```

## Agent-to-Agent System Definitions

### Boundary Contracts & The "Front Door" Policy
- **Single Point of Entry**: The module is strictly accessed via the default export `StatusBadge` inside `StatusBadge.tsx`.
- **Interface Contract**: Expects a single prop parameter:
  - `status`: A string literal union bound by the `ScadaData['status']` type definition (accepting `"Normal"`, `"Critical Alert"`, `"Maintenance"`, or `"Active"`).

### Side Effect Transparency
- **State Transparency**: The element is fully stateless. It **does not** invoke React hooks (`useState`/`useEffect`), perform DOM side effects, or interact with external API endpoints.
- **CSS Integrity**: Employs local inline utility class dictionaries to handle conditional rendering without requiring global CSS modifications or external state management libraries.

### Proof of Work: Reasoning Trace
- **Citation 1**: Verified the fallback mapping logic (Line 11) gracefully defaults to `styles["Normal"]` if an unexpected or un-typed string is passed into the `status` property.
- **Citation 2**: Confirmed the human-readable text transformation overrides (Line 12) automatically translate the string `"Critical Alert"` to `"TRIAGE"` and `"Normal"` to `"IDLE"`.
