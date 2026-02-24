# **Product Requirements Document: Agentic Asset Velocity (POC)**

**Project Name:** Agentic Asset Velocity

**Target Asset:** Natural Gas Pipeline Compressor

**Version:** 1.0 (Feb 18, 2026\)

## **1\. Executive Summary**

The goal of this POC is to demonstrate a rapid "headless" agentic workflow that optimizes the lifecycle of critical pipeline assets. The system addresses two primary bottlenecks:

1. **Alert Triage:** Filtering thousands of high-frequency SCADA signals to identify actionable anomalies.  
2. **Maintenance Inertia:** Automating the logistical tail of maintenance (parts retrieval, scheduling, and load balancing) to maintain throughput.

## **2\. Problem Statement**

Operators currently struggle to differentiate between standard operational fluctuations and critical failure precursors. When an event is identified, the manual process of checking SAP for parts, coordinating downtime, and calculating pipeline compensation (load balancing) creates "velocity" loss, resulting in reduced throughput and potential safety risks.

## **3\. Agent Architecture**

### **Agent A: SCADA Triage Agent (Headless)**

* **Role:** Signal Processing & Filtering.  
* **Logic:** \* Ingest high-frequency SCADA telemetry.  
  * Apply a classifier (Operational vs. Anomaly).  
  * **Thresholds:** Critical if PSI \< 650, Temp \> 150°F, or Vibration \> 0.50mm.  
* **Output:** Actionable "Anomaly Event" packets containing metadata (Asset ID, Location, Telemetry Signature).

### **Agent B: Maintenance Lifecycle Agent (Headless)**

* **Role:** Workflow Automation & Optimization.  
* **Logic:** \* **Trigger:** Receives Anomaly Event from Agent A.  
  * **Step 1: SAP Lookup:** Query inventory for specific asset model dependencies (Gaskets, Seals, Lube).  
  * **Step 2: Scheduling:** Identify the next maintenance window (e.g., 18:00 \- 22:00 local).  
  * **Step 3: Load Balancing:** Proactively calculate output increases for adjacent pipeline compressors to maintain pressure.  
  * **Step 4: Orchestration:** Generate notifications for Ground Staff (Maintenance) and Operations (Scheduling).  
  * **Step 5: QA Closure:** Monitor for "Safety Check Complete" status and close the ticket.

## **4\. Maintenance Workflow Lifecycle**

1. **SCADA Trigger:** Asset COMP-TX-VALLEY-01 exhibits high vibration and low PSI.  
2. **Triage:** Agent A filters the stream, labels event as **Critical**, and kicks Agent B.  
3. **Dependency Retrieval:** Agent B "calls" SAP; confirms Gasket Kit GASK-9921-X is in stock.  
4. **Optimization:** Agent B calculates that COMP-TX-VALLEY-02 and 03 must increase output by 8.5% to negate the flow loss.  
5. **Downtime Notification:** Operations is notified of a 4-hour maintenance window.  
6. **Safety & QA:** Following repair, the safety inspector logs a digital check; Agent B closes the event in the system.

## **5\. Test Data (Synthetic)**

Use the following data sets to feed the prototype in AI Labs.

### **Dataset 1: SCADA Telemetry (scada\_stream.json)**

```

[
  {"id": 1, "timestamp": "2026-02-18T14:00:00Z", "asset_id": "COMP-TX-VALLEY-01", "psi": 855, "temp": 112, "vibration": "0.02mm", "status": "Normal"},
  {"id": 2, "timestamp": "2026-02-18T14:05:00Z", "asset_id": "COMP-TX-VALLEY-01", "psi": 852, "temp": 114, "vibration": "0.02mm", "status": "Normal"},
  {"id": 3, "timestamp": "2026-02-18T14:10:00Z", "asset_id": "COMP-TX-VALLEY-01", "psi": 645, "temp": 158, "vibration": "0.85mm", "status": "Critical Alert"},
  {"id": 4, "timestamp": "2026-02-18T14:12:00Z", "asset_id": "COMP-TX-VALLEY-02", "psi": 850, "temp": 110, "vibration": "0.01mm", "status": "Normal"}
]

```

### **Dataset 2: SAP Inventory Lookup (sap\_mock.csv)**

```

model,part_number,description,stock_level,lead_time_days
High-Flow Centrifugal,GASK-9921-X,Compressor Valve Gasket Kit,12,0
High-Flow Centrifugal,SEAL-HT-44,High-Temp Main Shaft Seal,4,2
High-Flow Centrifugal,LUBE-SYN-Q,Synthetic Lubricant (5 Gal),25,0

```

### **Dataset 3: Pipeline Topography (pipeline\_nodes.json)**

```

{
  "segment": "Permian-East-Line",
  "target_flow": "500 MMcf/d",
  "nodes": [
    {"id": "COMP-TX-VALLEY-01", "current": 100, "max": 120, "role": "Primary"},
    {"id": "COMP-TX-VALLEY-02", "current": 100, "max": 125, "role": "Backup"},
    {"id": "COMP-TX-VALLEY-03", "current": 100, "max": 125, "role": "Backup"}
  ]
}

```

## **6\. Success Criteria**

* **Validation:** Customer stakeholders (Exxon, Halliburton) confirm the workflow logic aligns with field operations.  
* **Latency:** Agent B initiates the lifecycle within \< 5 seconds of the Critical Alert detection.  
* **Accuracy:** Load balancing calculation correctly redistributes missing PSI to operational nodes.
