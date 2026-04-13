# Layout Directory (`src/components/layout`)

This directory contains the core logic for navigation components and modular structural wrappers for the Field Operations dashboard interface.

## Purpose

The components in this directory are responsible for rendering structural application shells, specifically handling reusable navigation elements (like sidebar toggle controls) that route the user through diagnostic and asset management workflows.

## Contents

*   `SidebarItem.tsx`: A reusable button element acting as a tab control for left-hand navigation.

## Usage

**Basic Example:**

```tsx
import SidebarItem from './components/layout/SidebarItem';
import { LayoutDashboard } from 'lucide-react';

// Utilizing the sidebar control inside a navigation list:
<SidebarItem
    icon={LayoutDashboard}
    label="Command Center"
    active={currentTab === 'dashboard'}
    onClick={() => setCurrentTab('dashboard')}
/>
```

## Agent-to-Agent System Definitions

### Boundary Contracts & The "Front Door" Policy
- **Single Point of Entry**: The component is strictly accessed via the default export `SidebarItem` found in `SidebarItem.tsx`.
- **Interface Contract**: Requires exactly four props:
  - `icon`: A `React.ElementType` (typically a `lucide-react` icon).
  - `label`: A `string` for the human-readable description.
  - `active`: A `boolean` flag dictating whether the orange highlight styling is applied.
  - `onClick`: A `() => void` function pointer to trigger layout view updates.

### Side Effect Transparency
- **State Mutations**: This folder contains purely functional UI renderers. It **does not** execute local state hooks (`useState`), global store updates (`Redux`/`Zustand`), external API calls, or local storage mutations.
- **Event Bubbling**: Standard click handlers bubble directly up through the `onClick` prop, delegating all routing state side effects back to the invoking parent layer.

### Proof of Work: Reasoning Trace
- **Citation 1**: Reviewed `SidebarItem.tsx` (Lines 3-8) to confirm the exact interface contract definitions for `SidebarItemProps`.
- **Citation 2**: Verified the styling state toggles (Lines 13-16) dynamically swap between active (`bg-orange-500/10`) and inactive (`text-zinc-500 hover:bg-zinc-800`) classes safely without external CSS runtime dependencies.
