# **Design Evolution & Changelog: Field Operations POC**

**Project:** Agentic Field Operations for Energy

**Target Audience:** Energy Executives & Field Engineers (Exxon, Halliburton, etc.)

**Status:** Design Refinement Phase Complete

## **1\. Executive Summary of Changes**

The initial PRD focused on a "headless" automation flow. Through rigorous "edge-case" analysis, the design has evolved into a **Human-in-the-Loop (HITL)** system that prioritizes explainability, safety guardrails, and operational continuity during high-risk periods like shift handoffs.

## **2\. Comprehensive Changelog**

| Component | Change Type | Description | Rationale |
| :---- | :---- | :---- | :---- |
| **Asset State Logic** | **Enhancement** | Added **"Degrading"** state between "Normal" and "Critical." | Real-world equipment rarely fails instantly. This allows the Agent to show proactive logic (pre-fetching manuals/parts) before a crisis occurs. |
| **Control Logic** | **Structural** | Shifted from Autonomous Write to **Human-Approved Write**. | Energy stakeholders require a "Human-in-the-Loop" for SCADA intervention to manage liability and physical safety risks. |
| **Safety** | **New Feature** | Added **Admin-Only Guardrail Configuration**. | Prevents "Agent Hallucination" from causing physical damage. Hard limits on Pressure/Delta % are enforced at the system level. |
| **UI/UX** | **New Feature** | **Interactive Shift Handoff Timeline**. | Replaces static logs with a chronological, drill-down view of Agent decisions to bridge the context gap between outgoing and incoming operators. |
| **Collaboration** | **New Feature** | **"Top 3 Priorities" Dashboard**. | Forces the Agent to synthesize data into actionable intelligence immediately upon operator login. |
| **Explainability** | **New Feature** | **Natural Language "Why?" Button**. | Every Agent recommendation must be backed by a logic summary (e.g., "Proposed shift based on Node 02 capacity vs. Grid demand"). |
| **System Integrations** | **Future-Proofing** | **Multimodal "Field Evidence" Slot**. | Placeholder for Gemini Vision integration where technicians can upload photos for automated part/damage identification. |
| **Error Handling** | **Logic** | **Failed Write Protocol**. | Defined the behavior for SCADA write failures: The Agent alerts the human immediately and provides a "Plan B" alternative. |

## **3\. Updated Functional Requirements**

### **3.1 The "Degrading" Workflow (Passive Monitoring)**

* **Logic:** The system utilizes ML to filter sensor noise.  
* **Agent Behavior:** When an asset enters "Degrading" status, the Agent logs the trend and quietly pre-processes the logistics (checking SAP, identifying technicians). It remains "passive" (Choice A) to avoid alert fatigue until the operator initiates a query or the state shifts to Critical.

### **3.2 Automated Operational Briefing (Handoff)**

* At shift change, the Agent generates a summary of all active events.  
* **Interactive Element:** The operator can click any event in the timeline to see the specific telemetry data and Agent-to-Agent "negotiations" (e.g., Maintenance Agent vs. Weather Agent) that led to a decision.

### **3.3 The "Command Console"**

* **SCADA Feedback:** Upon clicking "Approve," the UI displays a real-time command log:  
  1. SENDING\_COMMAND  
  2. VALIDATING\_PRESSURE  
  3. SCADA\_ACK\_RECEIVED  
* If the write fails, the Agent must present a "Retry" or "Alternative Routing" option.

### **3.4 Governance & Safety Limits**

* **Admin View:** Only Admins can set the "Hard Ceilings" for equipment (e.g., Max 950 PSI).  
* **Operator View:** Operators see these limits as "grayed out" boundaries. The Agent is strictly forbidden from proposing any action that exceeds these Admin-defined parameters.

## **4\. Unresolved "Edge" Considerations (For Future Discussion)**

* **Economic ROI:** Integrating "Cost of Inaction" (dollars per hour of downtime) into the priority logic.  
* **Override Protocol:** Defining how an Operator can bypass an Admin guardrail in a "Life/Safety" emergency.  
* **Voice-to-Action:** Enabling field technicians to close tickets via natural language speech.

**Approval:** This document now serves as the updated source of truth for the Field Operations POC development.
