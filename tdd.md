# **Field Operations: Technical Design Document**

## **0. Section Zero: The Business Problem**

### **The Challenge**
Control room operators and field engineers in high-stakes environments (such as natural gas compressor stations) face a dual challenge: **alert overload** and **mitigation delays**. Thousands of sensor signals arrive every minute, making it incredibly difficult to differentiate standard operational noise from impending, critical machinery failures. 

When an anomaly *is* detected, the manual steps required to resolve it—cross-referencing SAP inventory for parts, calculating load-balancing shifts across adjacent pipeline nodes, and scheduling safe maintenance windows—take too long. This "inertia" directly translates to lost pipeline throughput, elevated physical risk, and millions of dollars in downtime.

### **The Constraint**
While artificial intelligence can accelerate data gathering and suggest optimal mitigation strategies, the energy sector cannot afford **AI hallucination**. Allowing an AI to autonomously execute physical control commands without human validation introduces unacceptable liability and catastrophic physical safety risks. 

### **The Goal**
The objective of this system is to deliver an **Agentic triage and automation engine** that eliminates the administrative burden of tracking down parts and calculating safe operational shifts, while enforcing **absolute human accountability**. Every critical action must be transparent, easily understood during high-stress shift handoffs, and firmly bound by system guardrails that protect the infrastructure from accidental damage.

---

## **1. Scope Item: The Consolidated Settings Interface**

### **1.1 Overview**
The Consolidated Settings Interface provides a unified overlay for operators and administrators to configure system parameters, safety guardrails, and visualization preferences without navigating away from the active monitoring dashboard.

### **1.2 User Flow & Accessibility**
* **Access Point:** The interface is accessed via the dedicated Settings icon (gear icon) located in the persistent top-right header toolbar.
* **Presentation:** The interface renders as a centralized modal overlay positioned above the main dashboard view.
* **Keyboard Navigation:** Fully accessible via hotkeys (`ESC` to close instantly).
* **Idle Timeout:** To prevent the modal from obscuring the control room dashboard during shift handoffs or physical absences, the modal automatically closes after **60 seconds of inactivity**.

### **1.3 Component Integration (`src/App.tsx`)**

#### **State Management**
Integration relies on a boolean state toggle managed at the root component level:
```typescript
const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
```

#### **Alert Passthrough Mechanism**
To ensure operators are never blinded to a sudden pipeline breach while configuring settings, the modal utilizes a passthrough index:
* Any `priority: 'critical'` notification arriving while the modal is open triggers a high-visibility floating banner *above* the modal's z-index, accompanied by an audible chime.

---

## **2. Plain English Technical Implementation Plan**

### **2.1 The Big Components**
To make this system work safely and reliably, we are introducing three main moving parts to your existing setup:

1. **The Dashboard (What the Operator Sees):** 
   Adds a **Settings Drawer**, an **Explainability Window** (the "Why?" button), and an **Emergency Challenge Popup** (asking for a supervisor's PIN).

2. **The Gatekeeper (The Intercept Logic):** 
   Catches operator commands attempting to push machinery past safe operational limits and demands dual-key authorization.

3. **The Digital Logbook (Prototype Persistence):** 
   To ensure the prototype behaves like a tamper-proof black box during high-stakes demonstrations, the log leverages browser `localStorage`. This guarantees the audit trail survives browser refreshes (F5) and accidental tab closures, logging both **successful overrides and failed entry attempts**.

---

## **3. Alternatives We Considered and Ruled Out**

### **3.1 Heavy String Bundling vs. Lightweight Lookups**
* **The Idea:** Attach large blocks of raw mathematical evidence directly as string payloads into every single notification object in the array.
* **Why We Ruled It Out:** **Memory bloat and UI lag.** In a real-time control room receiving high-frequency updates, giant string payloads cause React render degradation. Instead, we utilize a lightweight structured object (`EvidencePayload`) to keep the list performant while allowing for highly styled table/chart renderings inside the drawer.

### **3.2 Purely Autonomous Safety Overrides**
* **Why We Ruled It Out:** **Extreme liability.** Regulators require absolute proof of a physical human authorizing high-risk actions.

---

## **4. Detailed Implementation Plan (Static Mock Architecture)**

### **4.1 Static Data & Interfaces**

#### **1. `src/types.ts`** (MODIFY)
* Expand `AppNotification` to include structured explainability data:
  ```typescript
  export interface EvidencePayload {
      formula: string;
      variables: { [key: string]: string | number };
      confidence_score: number;
  }
  ```
* Define a new `OverrideLog` interface that explicitly records success/failure states:
  ```typescript
  export interface OverrideLog {
      id: string;
      timestamp: string;
      asset_id: string;
      operator_pin: string;
      status: 'SUCCESS' | 'FAILED_ATTEMPT';
      justification: string;
  }
  ```

#### **2. `src/mockData.ts`** (NEW)
* **Purpose:** Houses the synthetic mock data payloads and pre-configured override logs.
* **Contents:**
  * `mockNotifications`: An array containing at least one `priority: 'critical'` notification equipped with an `EvidencePayload` object to test the explainability feature.
  * `initialOverrideLogs`: A prepopulated array of `OverrideLog` items demonstrating past successful and failed interventions.

---

### **4.2 Core State & Layout Integration**

#### **3. `src/hooks/useSafetyGuardrails.ts`** (NEW)
* **Rationale:** Abstracts all intercept logic, PIN validation, timeout counters, and `localStorage` persistence away from `App.tsx`.
* **Key Exports:**
  * `interceptAction(actionType: string, justificationRequired: boolean)`: A function triggered when a user clicks any "Execute Mitigation" button associated with a critical notification on the dashboard.
  * `validatePin(pin: string, justificationText: string)`: Validates the entry against the static value `1234` and requires a non-empty justification string before logging a `SUCCESS` state to `localStorage`.

#### **4. `src/App.tsx`** (MODIFY)
* Imports `useSafetyGuardrails` and wires the floating Alert Passthrough UI to ensure maximum visibility during emergencies.

---

### **4.3 Additive UI Modals**

#### **5. `src/components/settings/SettingsModal.tsx`** (NEW)
* **Behavior:** Includes a 60-second idle countdown and `ESC` key listener.
* **UI Elements (Form Fields):**
  * **Safety Intercept Threshold:** Number input field (e.g., "Max Override Allowable Pressure (PSI)").
  * **Dual-Key Authorization:** Toggle switch labeled "Require Supervisor PIN for Critical Mitigation".
  * **Visualization Mode:** Toggle switch labeled "Enable High-Contrast Emergency Display".
  * **Audit Destination:** Dropdown menu with options: `Local Storage`, `Cloud Ledger`, `None`.

#### **6. `src/components/auth/ChallengeModal.tsx`** (NEW)
* **Trigger:** Appears when the operator clicks "Execute Mitigation" on a critical alert.
* **UI Elements:**
  * **PIN Input:** Masked password field for the 4-digit code.
  * **Justification Input:** A text area (minimum 3 rows) requiring the operator to explain the reason for the override.
  * **Submission Feedback:** Shaking animation on failed PIN entry, automatic logging of `FAILED_ATTEMPT` to `localStorage`, and supports instant submission via the `Enter` key.

#### **7. `src/components/explainability/ExplainabilityModal.tsx`** (NEW)
* **Trigger:** Accessed via a "Why?" button rendered inline inside each notification card that contains an `EvidencePayload`.
* **UI Elements:**
  * Displays the raw mathematical formula used to detect the anomaly.
  * A table listing the dynamic variables plugged into the formula.
  * A visual confidence score indicator (e.g., progress bar representing 0-100%).
