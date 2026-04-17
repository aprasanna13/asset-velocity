# Master Components Directory (`src/components`)

This document serves as the consolidated reference index for all modular UI elements utilized across the Field Operations frontend environment. It aggregates the individual functional requirements, system boundaries, and agentic proof-of-work traces from all nested component subdirectories.

---

## 1. Auth Subsystem (`src/components/auth`)

This directory contains the user authentication portal and human-in-the-loop supervisor authorization challenges.

### Purpose
Securing access to the triage dashboard and enforcing agentic safety guardrails when automated plans exceed standard limits by requiring multi-factor operator accountability.

### Contents
*   `Login.tsx`: The primary full-screen entry portal for operator access control.
*   `ChallengeModal.tsx`: A reusable intercept modal requiring a supervisor PIN and explicit text justification before executing critical commands.

### Implementation Details & Edge Cases
#### `Login.tsx`
- **Core Flow**: Renders a full-screen modal with an industrial layout. Validates against hardcoded strings (`test123`).
- **Edge Cases**: Displays `Invalid username or password` inline on mismatch and intercepts standard form behaviors via `e.preventDefault()`.

#### `ChallengeModal.tsx`
- **Core Flow**: Requires the operator to input a 4-digit PIN (`1234`) and a mandatory justification reason.
- **Edge Cases**: Triggers an interactive UI horizontal shake on empty fields or invalid PINs using local inline `<style>` keyframe definitions.

### Usage Examples
```tsx
import Login from './components/auth/Login';
import { ChallengeModal } from './components/auth/ChallengeModal';

<Login onLogin={() => setIsAuthenticated(true)} />

<ChallengeModal
    isOpen={showChallenge}
    onClose={() => setShowChallenge(false)}
    onSubmit={(pin, justification) => pin === '1234'}
/>
```

---

## 2. Explainability Subsystem (`src/components/explainability`)

This directory contains the logic for rendering real-time mathematical proofs behind automated anomaly detection.

### Purpose
Providing transparent, human-readable mathematical rationales (formulas, variables, and confidence metrics) to satisfy human-in-the-loop verification requirements.

### Contents
*   `ExplainabilityModal.tsx`: Full-featured intercept window detailing complex evaluation logic.

### Implementation Details & Edge Cases
- **Null Safety / Short-Circuiting**: Explicitly checks `if (!isOpen || !evidence) return null;` to prevent runtime mapping errors.
- **Variable Robustness**: Parses dynamic variable maps securely using `Object.entries(evidence.variables)`.

### Usage Examples
```tsx
import { ExplainabilityModal } from './components/explainability/ExplainabilityModal';

<ExplainabilityModal
    isOpen={showExplanation}
    onClose={() => setShowExplanation(false)}
    evidence={mockEvidencePayload}
/>
```

---

## 3. Layout Subsystem (`src/components/layout`)

This directory contains structural navigation wrappers for the dashboard interface.

### Purpose
Rendering application shells, specifically handling left-hand sidebar tab elements.

### Contents
*   `SidebarItem.tsx`: A reusable button acting as a tab control.

### Agent-to-Agent Definitions
#### Boundary Contracts
- **Entry**: Default export `SidebarItem` inside `SidebarItem.tsx`.
- **Props**: `icon`, `label`, `active`, and `onClick`.

#### Side Effect Transparency
- Purely functional rendering without local hook mutations or global external side effects. Delegates event bubbling directly upward.

### Usage Examples
```tsx
import SidebarItem from './components/layout/SidebarItem';

<SidebarItem
    icon={LayoutDashboard}
    label="Command Center"
    active={currentTab === 'dashboard'}
    onClick={() => setCurrentTab('dashboard')}
/>
```

---

## 4. Settings Subsystem (`src/components/settings`)

This directory contains configuration forms for triage thresholds and guardrail limits.

### Purpose
Rendering the master configuration panel for adjusting threshold overrides, PIN challenge toggles, and audit destination settings.

### Contents
*   `SettingsModal.tsx`: Configuration modal equipped with an autonomous background watchdog.

### Agent-to-Agent Definitions
#### Boundary Contracts
- **Entry**: Named export `SettingsModal`.
- **Props**: `isOpen` and `onClose`.

#### Side Effect Transparency
- **Inactivity Watchdog**: Uses a 60-second background interval bound to window event listeners (`keydown`/`mousemove`) with explicit component cleanup to scrub timers upon unmounting.

### Usage Examples
```tsx
import { SettingsModal } from './components/settings/SettingsModal';

<SettingsModal
    isOpen={isSettingsOpen}
    onClose={() => setIsSettingsOpen(false)}
/>
```

---

## 5. Shared UI Subsystem (`src/components/shared`)

This directory contains ubiquitous UI micro-elements (tags and badges).

### Purpose
Standardizing status condition tags compliant with industrial SCADA condition states.

### Contents
*   `StatusBadge.tsx`: Functional mapping utility translating status strings to visual badges.

### Agent-to-Agent Definitions
#### Boundary Contracts
- **Entry**: Default export `StatusBadge`.
- **Props**: Expects `status` as `ScadaData['status']`.

#### Side Effect Transparency
- Fully stateless without React state tracking or external DOM manipulations. Employs direct utility dictionaries for styling fallbacks.

### Usage Examples
```tsx
import StatusBadge from './components/shared/StatusBadge';

<StatusBadge status="Critical Alert" />
```

---

## 6. Execution Console Subsystem (`src/components/ExecutionConsole`)

This directory contains the high-performance, interactive execution console for rendering structured logs.

### Purpose
Replacing static log outputs with an interactive, filtered, and auto-scrolling diagnostic console to monitor agent operations and system events.

### Contents
*   `ExecutionConsole.tsx`: The primary container for the log viewer.
*   `LogAdapter.ts`: Utility to parse raw string logs into structured formats.
*   `LogRow.tsx`: Optimized component for rendering individual log entries.
*   `LogDetailModal.tsx`: Modal for viewing detailed log payloads.

### Implementation Details
- **Performance**: Uses `React.memo` for `LogRow` to prevent unnecessary re-renders.
- **Memory Management**: Enforces a 50-item limit for log retention (ring buffer).
- **UX**: Supports unconditional auto-scrolling to the bottom and severity-based color coding.

### Usage Examples
```tsx
import { ExecutionConsole } from './components/ExecutionConsole/ExecutionConsole';

<ExecutionConsole logs={structuredLogs} />
```

