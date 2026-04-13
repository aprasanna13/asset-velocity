# Auth Directory (`src/components/auth`)

This directory contains the user authentication portal and human-in-the-loop supervisor authorization challenges for the Field Operations Agentic Management System.

## Purpose

The components within this directory are responsible for securing access to the main triage dashboard and enforcing agentic safety guardrails when automated remediation plans exceed standard risk thresholds. They ensure full operator accountability by requiring multi-factor inputs (credentials or PINs accompanied by operational justifications).

## Contents

*   `Login.tsx`: The primary full-screen entry portal for operator access control.
*   `ChallengeModal.tsx`: A reusable, high-priority intercept modal requiring a supervisor PIN and explicit text justification before executing critical infrastructure commands.
*   `README.md`: This documentation file.

## Implementation Details & Edge Cases

### `Login.tsx`
- **Core Flow**: Renders a full-screen modal with an industrial dark-themed layout. Validates a standard `username` and `password` combination against a hardcoded string (`test123` for both).
- **Edge Cases Handled**:
  - **Incorrect Credentials**: If inputs do not match the required string, an inline red error message (`Invalid username or password`) is displayed beneath the fields.
  - **Prevention of Default Behavior**: Standard HTML form submission is intercepted via `e.preventDefault()` to ensure zero-refresh single-page architecture behavior.

### `ChallengeModal.tsx`
- **Core Flow**: Blocks background interactions via a darkened backdrop (`bg-black/60 backdrop-blur-sm`) and requires the operator to input a 4-digit Supervisor PIN (`1234`) alongside a mandatory operational reason for overriding system safety limits.
- **Edge Cases Handled**:
  - **Empty Validation**: If either the PIN or justification field is empty upon submission, the system rejects the request with an error message (`Both PIN and justification are required.`) and triggers an interactive UI shake animation.
  - **Invalid PIN**: Submitting any PIN other than `1234` clears the PIN field immediately, displays `Invalid Supervisor PIN.`, and triggers the error shake.
  - **Animation Handling**: The horizontal shake effect is injected locally via an inline `<style>` block defining keyframes to prevent dependency overhead on external CSS libraries.
  - **Keyboard Support**: Captures the `Enter` key inside the PIN input for rapid submission.

## Usage

**Login Portal Usage:**
```tsx
import Login from './components/auth/Login';

// Inside a top-level component:
<Login onLogin={() => setIsAuthenticated(true)} />
```

**Supervisor Authorization Usage:**
```tsx
import { ChallengeModal } from './components/auth/ChallengeModal';

// Managing state and intercepting critical execution:
<ChallengeModal
    isOpen={showChallenge}
    onClose={() => setShowChallenge(false)}
    onSubmit={(pin, justification) => {
        if (pin === '1234') {
            console.log(`Override authorized: ${justification}`);
            return true;
        }
        return false;
    }}
/>
```
