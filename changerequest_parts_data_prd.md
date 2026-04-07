# Change Request PRD: Add Dummy Parts Data

**Project:** Field Operations
**Feature:** Inventory / Parts Screen Data Enrichment
**Status:** Draft

---

### **1. Executive Summary**
The current Inventory screen uses a minimal set of mock data (5 items). To better demonstrate the capabilities of the grid, search, and filtering features, this request defines a comprehensive set of dummy parts data to be added to the system. This will provide a more realistic and data-rich experience for users and stakeholders during demonstrations.

---

### **2. Goals & Objectives**
*   **Enhance Visual Fidelity:** Populate the parts table with enough data to require scrolling and demonstrate layout stability.
*   **Support Search & Filtering:** Provide varied data (different models, warehouses, statuses) to test search and filter functionalities effectively.
*   **Maintain Realism:** Use part names, numbers, and descriptions that are relevant to natural gas pipeline compressors.

---

### **3. Technical Data Schema**
The dummy data must adhere to the existing `InventoryItem` interface defined in `src/types.ts`:

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | number | Unique identifier |
| `model_compatibility` | string | Compressor model or general category |
| `part_number` | string | Unique part identifier (alphanumeric) |
| `description` | string | Human-readable description of the part |
| `stock_level` | number | Current quantity in stock |
| `lead_time_days` | number | Days to restock if empty |
| `warehouse_id` | string | Identifier for the storage location |
| `status` | string | "Low Stock" or "Available" (Optional, derived or explicit) |

---

### **4. Proposed Dummy Data Set**

Here is the proposed set of 15 additional dummy items to be added:

| id | model_compatibility | part_number | description | stock_level | lead_time_days | warehouse_id | status |
|:---|:---|:---|:---|:---|:---|:---|:---|
| 4 | High-Flow Centrifugal | FLTR-oil-01 | Main Oil Filter Element | 50 | 2 | WH-TX-01 | Available |
| 5 | High-Flow Centrifugal | VLV-BYP-02 | Bypass Valve Rebuild Kit | 3 | 5 | WH-TX-01 | Low Stock |
| 6 | High-Flow Centrifugal | SENS-VIB-03 | High-Temp Vibration Sensor | 12 | 1 | WH-TX-02 | Available |
| 7 | High-Flow Centrifugal | BRG-MAIN-04 | Main Shaft Roller Bearing | 2 | 10 | WH-TX-01 | Low Stock |
| 8 | High-Flow Centrifugal | GSKT-HEAD-05 | Cylinder Head Gasket Set | 15 | 3 | WH-TX-02 | Available |
| 9 | Reciprocating XL | PIST-RING-06 | Compression Ring Set set | 20 | 4 | WH-OK-01 | Available |
| 10 | Reciprocating XL | VLV-SUC-07 | Suction Valve Assembly | 5 | 7 | WH-OK-01 | Available |
| 11 | Reciprocating XL | SENS-PRES-08 | Digital Pressure Transducer | 8 | 2 | WH-OK-02 | Available |
| 12 | General | LUBE-GEAR-09 | Industrial Gear Oil (5 Gal) | 30 | 0 | WH-TX-01 | Available |
| 13 | General | CLEAN-SOLV-10 | Degreasing Solvent (1 Gal) | 45 | 0 | WH-TX-02 | Available |
| 14 | High-Flow Centrifugal | O-RING-KIT-11 | Viton O-Ring Assortment | 100 | 1 | WH-TX-01 | Available |
| 15 | Reciprocating XL | PLUG-IGN-12 | Industrial Spark Plug | 40 | 1 | WH-OK-01 | Available |
| 16 | High-Flow Centrifugal | COUPLING-13 | Flexible Shaft Coupling | 1 | 14 | WH-TX-02 | Low Stock |
| 17 | General | H2S-DET-14 | Portable H2S Gas Detector | 6 | 3 | WH-TX-01 | Available |
| 18 | Reciprocating XL | CON-ROD-15 | Connecting Rod Bearing Kit | 4 | 8 | WH-OK-02 | Available |

---

### **5. Success Criteria**
*   The parts screen displays all new items correctly.
*   Search functionality finds items by part number or model.
*   "Low Stock" status is visually distinct (if implemented in UI).
*   No regression in parts screen loading or rendering performance.
