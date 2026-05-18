# Design Document: Automated Operational Briefing (Handoff)

## Section 0: The Business Problem

In large-scale industrial operations (such as pipeline networks, chemical plants, and automated manufacturing), shift handovers represent one of the most vulnerable periods in the operational lifecycle. During these critical transition windows, an outgoing operator carries complex, hard-won situational context about active hazards, pending maintenance tasks, and non-linear system anomalies. This operational context must be transferred to an incoming operator safely, accurately, and completely before they assume command of the facility.

Historically, this transfer relies on informal verbal briefings or static, text-heavy logs. This creates three severe operational risks:

1.  **Context Loss & Cognitive Overload**: Incoming operators are overwhelmed by a high volume of routine automated logs (noise), increasing the probability that they will miss a critical, unresolved hazard (signal).
2.  **Lack of AI Explainability**: When automated agents make operational decisions (e.g., choosing to delay maintenance due to incoming weather), incoming operators often view the system as a "black box." Without a rapid way to understand the trade-offs and constraints behind those decisions, operators either blindly trust the automation or unnecessarily override it, both of which degrade system efficiency and safety.
3.  **Ambiguous Liability**: If an industrial disaster occurs shortly after a shift change, regulatory auditors and safety inspectors struggle to prove whether the incoming operator was explicitly aware of the specific hazard prior to taking control.

### Core Goal
The objective is to build an **Automated Operational Briefing system** that automatically synthesizes active infrastructure events into a high-priority, noise-filtered overview during shift transitions, **while preserving critical manual observations from the outgoing operator**. It must instantly clarify complex multi-agent decisions, maintain an airtight legal compliance trail for liability, and protect the operator from missing critical information—all without introducing unnecessary interface friction or preventing the control room from responding immediately to a sudden, real-time crisis.

---

## Section 1: Technical Implementation Plan

At its core, this feature acts as an intelligent filter and digital sign-off sheet that runs exactly when an operator takes over a shift. Instead of forcing the user to read raw system logs, it automatically sorts the information into "urgent" and "routine" categories and tracks what the operator has seen.

Here are the major components and how they work together within the current application:

### 1. The Main Handoff Controller & Trigger Mechanism
*   **Explicit Trigger**: The handoff is initiated manually by the outgoing operator clicking a "Commence Handoff" button, which captures their current user session and prompts them to input **Outgoing Operator Notes** (subjective context that cannot be captured by telemetry).
*   **Context-Aware Sorting**: The controller queries the database for active events. Instead of a hardcoded threshold, the severity threshold is dynamically set based on the current plant operational mode (e.g., Standard = 70+, Storm/Emergency = 50+).
*   **State Freezing**: During the review process, the active list is visually frozen to prevent operators from chasing a moving target. Any real-time alarms that fire during the review are handled strictly by the Emergency Alert Shield.

### 2. The Two-Tab Display Interface (with Pagination)
To prevent operators from getting overwhelmed, the screen is split into two distinct pages:
*   **The Critical Briefing (Front Page)**: This is the default view. It shows active hazards, unresolved system warnings, outgoing manual notes, and key operational decisions. To prevent secondary overload during major incidents, items are grouped by subsystem (e.g., Pipeline A, Compressor B) with mandatory acknowledgment per group.
*   **The Full Shift Log (Back Page)**: A completely separate tab containing routine tasks (like minor sensor checks) that occurred throughout the day.

### 3. The Decision Map & Explainability
When the system automatically makes a complex choice (like delaying a repair because a storm is coming), operators need to understand *why*. This component renders a simplified visual graphic supported by plain-text bullet points to minimize cognitive load. It maps the primary driving factors (e.g., Weather Severity, Crew Availability) directly to the outcome.

### 4. The Emergency Alert Shield & Context Recovery
If a major alarm goes off while the incoming operator is reading their handoff report, this component dims the entire screen and forces a high-priority alert window to the front. Once the user acknowledges the danger, the system highlights the exact UI element they were focused on prior to the interruption.

### 5. Security, Dispute Resolution, and Accountability Sign-Offs
This feature connects directly into the existing security rules of the application:
*   **Read Receipts**: Clicking an event silently queues a background log (read receipt).
*   **Mandatory PIN Challenge**: High-risk items require the incoming operator's PIN to complete the shift assumption.
*   **Handoff Rejection Workflow**: The incoming operator has the explicit right to click **"Reject Handoff"** if an unsafe condition is identified that must be resolved by the outgoing shift before control is transferred.
*   **Break-Glass Override**: If authentication fails or an incoming operator is locked out during an active crisis, a secondary "Supervisor Override" (Break-Glass) flow allows immediate command assumption with a flagged audit trail.

---

## Section 2: Alternatives Considered and Rejected

### 1. The "Polite" Warning Banner
*   **What We Considered**: A quiet notification bar at the top of the screen during emergencies while reading the handoff.
*   **Why We Ruled It Out**: "Banner blindness" prevents operators from seeing top-bar alerts when focused on text. The system must be aggressively intrusive during emergencies.

### 2. Fully Automated Context (No Manual Entry)
*   **What We Considered**: Relying entirely on system telemetry to generate the briefing.
*   **Why We Ruled It Out**: Automated systems cannot detect physical anomalies (unusual sounds, smells, or physical access blockages). Manual observation fields are mandatory for a complete briefing.

### 3. The Completely "Soft" Sign-Off (No PINs at all)
*   **What We Considered**: Completing handover by clicking on items without PIN verification.
*   **Why We Ruled It Out**: Does not hold up in legal liability investigations. We must require a formal PIN challenge for major hazards to ensure true accountability.

---

## Section 3: Detailed Technical Implementation Plan

To execute this architecture cleanly without disrupting the existing application stability, we will create a dedicated domain zone and modify select global entry points.

### New Files to Create

#### 1. Main Feature Orchestration
*   **`src/features/handoff/HandoffContainer.tsx`**
    *   **Rationale**: Master controller coordinating tab selection, the freeze/queue state logic, outgoing manual note capture, and rejection workflows.

#### 2. Presentation & UI Components
*   **`src/features/handoff/components/CriticalBriefingView.tsx`**
    *   **Rationale**: Displays high-severity items (grouped by subsystem) and integrates liability locks.
*   **`src/features/handoff/components/ShiftLogView.tsx`**
    *   **Rationale**: Secondary historical tab for routine items.
*   **`src/features/handoff/components/InfluenceGraph.tsx`**
    *   **Rationale**: Renders decision logic using standard visual representations and localized plain-text explanations.
*   **`src/features/handoff/components/EmergencyInterceptOverlay.tsx`**
    *   **Rationale**: High-priority full-screen intercept modal covering the reading pane during real-time alarms.
*   **`src/features/handoff/components/DisputeModal.tsx`**
    *   **Rationale**: Interface for documenting handoff rejections or missing prerequisites.

#### 3. State and Offline Support
*   **`src/hooks/useHandoff.ts`**
    *   **Rationale**: Custom hook managing state, dynamic severity thresholds, and queuing read-receipts in `localStorage` if the network degrades (Offline Mode support).

---

### Existing Files to Modify

#### 1. [src/types.ts](file:///usr/local/google/home/prasannaankem/Code/Field%20Operations/src/types.ts)
*   **Rationale**: Add `HandoffEvent`, `HandoffPayload`, `DisputeLog`, and `BreakGlassAudit` interfaces.

#### 2. [src/services/api.ts](file:///usr/local/google/home/prasannaankem/Code/Field%20Operations/src/services/api.ts)
*   **Rationale**: Implement endpoints:
    *   `fetchHandoffBriefing()`: Retrieves the synthesized snapshot of active hazards and decisions.
    *   `submitHandoffAudit()`: Submits PIN sign-offs and queued read-receipts.
    *   `rejectHandoff()`: Submits a formal dispute log.

#### 3. [src/App.tsx](file:///usr/local/google/home/prasannaankem/Code/Field%20Operations/src/App.tsx)
*   **Rationale**: Update global routing to intercept the dashboard view when a handoff session is initiated by the outgoing shift.
