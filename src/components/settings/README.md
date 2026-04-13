# Settings Directory (`src/components/settings`)

This directory contains the system configuration interface for adjusting triage thresholds and operational guardrails across the automated management environment.

## Purpose

The components inside this directory are responsible for rendering the master configuration panel where operators dictate core threshold boundaries, PIN challenge policies, high-contrast accessibility overrides, and local storage diagnostic ledger behaviors.

## Contents

*   `SettingsModal.tsx`: The full-featured configuration form modal, complete with an autonomous inactivity timeout safety watchdog.


## Usage

**Basic Example:**

```tsx
import { SettingsModal } from './components/settings/SettingsModal';

// Invoking the configuration panel:
<SettingsModal
    isOpen={isSettingsOpen}
    onClose={() => setIsSettingsOpen(false)}
/>
```

## Agent-to-Agent System Definitions

### Boundary Contracts & The "Front Door" Policy
- **Single Point of Entry**: The component is strictly accessed via the named export `SettingsModal` in `SettingsModal.tsx`.
- **Interface Contract**: Expects two props:
  - `isOpen`: A `boolean` controlling visibility and triggering the background watchdog timer.
  - `onClose`: A `() => void` closure to unmount the view.

### Side Effect Transparency
- **Inactivity Watchdog**: Automatically establishes a 60-second background `setInterval` countdown upon mounting (`isOpen === true`). It listens to global `window.addEventListener` events for `keydown` and `mousemove` to reset the timer safely.
- **Lifecycle Cleanup**: All background intervals and event listeners are explicitly scrubbed via `return () => { clearInterval(timer); ... }` to prevent memory leakage or ghost countdown triggers across other views.

### Proof of Work: Reasoning Trace
- **Citation 1**: Confirmed the watchdog logic (Lines 24-32) successfully invokes the `onClose()` callback exactly when the `idleTime` integer reaches the `60` second bound.
- **Citation 2**: Verified the global event handlers (Lines 34-47) intercept `Escape` keys for immediate unmounting and clear the idle tracker to zero on any system mouse movement.
