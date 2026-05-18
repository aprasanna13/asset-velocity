### Environment Settings:
- **GCP Project ID**: pr-tftest
- **BigQuery Dataset Name**: field_ops_ds
- **GCP Region**: us
- **Project Folder**: SQL folder. All generated analytical database assets and scripts should be placed inside this dedicated folder to keep the repository organized.

---

## Step 1: Hybrid Database & Table Design

Precise column types, integrity constraints, and security measures have been applied. Primary and Foreign Key declarations are mapped across both engines; note that **BigQuery does not enforce PK/FK integrity constraints natively**, meaning all relational integrity and de-duplication must be rigorously enforced in the application backend middleware layer.

### I. Operational Datastore (bigquery)

These tables manage fast operational updates, inventory levels, real-time alerts, and operator transitional signatures requiring instant write feedback and row-level locking.

#### 1. Physical Asset Registry (`assets`)
- **Purpose**: Defines physical equipment assets, safe operating thresholds, and physical maintenance metrics.
- **Columns**:
  - `id` (STRING, PRIMARY KEY): Asset identifier (e.g., `'COMP-TX-VALLEY-01'`).
  - `name` (STRING NOT NULL): Full display name (e.g., `'Midland Station'`).
  - `type` (STRING NOT NULL): Classification (e.g., `'Compressor Station'`, `'Distribution Hub'`).
  - `location` (STRING NOT NULL): Section/sector name (e.g., `'Texas Sector G-42'`).
  - `operating_temp_limit` (FLOAT64 NOT NULL): Max temperature safe limit.
  - `last_maintenance_date` (DATE): Last physical checkup date.
  - `status` (STRING NOT NULL): Active status code (e.g., `'Normal'`, `'Critical Alert'`, `'Maintenance'`).

#### 2. Topological Grid Nodes (`pipeline_nodes`)
- **Purpose**: Maps physical grid station labels and finite coordinate attributes dynamically for real-time UI flow maps.
- **Columns**:
  - `id` (STRING, PRIMARY KEY): References `assets(id)`.
  - `name` (STRING NOT NULL): Station label name (e.g., `'Odessa Station'`).
  - `current_flow` (FLOAT64 NOT NULL): Throughput metrics in MMcf/d.
  - `max_flow` (FLOAT64 NOT NULL): Pipeline node throughput ceiling.
  - `role` (STRING NOT NULL): Grid capability (`'Primary'`, `'Backup'`, `'Distribution'`).
  - `status` (STRING NOT NULL): Health status (`'Active'`, `'Maintenance'`, `'Compensating'`, etc.).
  - `lat` (FLOAT64 NOT NULL): Map latitude coordinate.
  - `lng` (FLOAT64 NOT NULL): Map longitude coordinate.
  - `schematic_x` (INTEGER NOT NULL): Schematic canvas X coordinate layout.
  - `schematic_y` (INTEGER NOT NULL): Schematic canvas Y coordinate layout.

#### 3. Schematic Grid Connections (`pipeline_paths`)
- **Purpose**: Maps segmented paths and connections between topology nodes.
- **Columns**:
  - `id` (INTEGER PRIMARY KEY AUTOINCREMENT): Unique segment path identifier.
  - `from_node_id` (STRING NOT NULL): References `pipeline_nodes(id)`.
  - `to_node_id` (STRING NOT NULL): References `pipeline_nodes(id)`.
  - `status` (STRING NOT NULL): Connect segment logic state (`'Active Flow'`, `'Compensating Flow'`, `'Standby'`).

#### 4. Warehouse Spares Inventory (`inventory`)
- **Purpose**: Holds spare items, vendor shipping records, and inventory stock levels.
- **Columns**:
  - `id` (INTEGER PRIMARY KEY AUTOINCREMENT): Spares item record unique code.
  - `model_compatibility` (STRING NOT NULL): Equipment type compatibility (e.g., `'High-Flow Centrifugal'`).
  - `part_number` (STRING UNIQUE NOT NULL): Unique SKU/part number (e.g., `'GASK-9921-X'`).
  - `description` (STRING NOT NULL): Detailed part overview.
  - `stock_level` (INTEGER NOT NULL): Current warehoused spares units (enforced `>= 0` in backend).
  - `lead_time_days` (INTEGER NOT NULL): Vendor shipping limits (0 represents immediate availability).
  - `warehouse_id` (STRING NOT NULL): Warehousing location identifier.

#### 5. Shift Handover briefings (`handoff_briefings`)
- **Purpose**: Persists snapshots of shift transfer conditions and critical decisions created at transition.
- **Columns**:
  - `id` (INTEGER PRIMARY KEY AUTOINCREMENT): Handover snapshot session code.
  - `mode` (STRING NOT NULL): Shift conditions (`'Standard'`, `'Storm/Emergency'`).
  - `threshold` (INTEGER NOT NULL): Severity filter threshold.
  - `outcome` (STRING NOT NULL): AI explainability outcome summary.
  - `timestamp` (TIMESTAMP NOT NULL): Briefing snapshot lock date-time.

#### 6. Shift Handoff Hazard Records (`handoff_events`)
- **Purpose**: Tracks individual alarms, issues, and hazard events associated with a shift briefing. All items must be marked acknowledged before transition completes.
- **Columns**:
  - `id` (STRING PRIMARY KEY): Hazard event unique trace identifier.
  - `briefing_id` (INTEGER NOT NULL): References `handoff_briefings(id)`.
  - `severity` (INTEGER NOT NULL): Issue priority severity score (0-100).
  - `category` (STRING NOT NULL): Classification (`'critical'`, `'routine'`).
  - `subsystem` (STRING NOT NULL): Subsystem locked name (e.g., `'Pipeline A'`).
  - `title` (STRING NOT NULL): Title body.
  - `description` (STRING NOT NULL): Narrative details.
  - `timestamp` (TIMESTAMP NOT NULL)
  - `acknowledged` (BOOLEAN NOT NULL): Explicit Operator verification signature status.

#### 7. Shift Handover Legal Disputes (`dispute_logs`)
- **Purpose**: Records command disputes and rejections submitted during transition workflows.
- **Columns**:
  - `id` (INTEGER PRIMARY KEY AUTOINCREMENT): Dispute entry tracing code.
  - `briefing_id` (INTEGER NOT NULL): References `handoff_briefings(id)`.
  - `reason` (STRING NOT NULL): Mandated non-empty rejection reason statement.
  - `timestamp` (TIMESTAMP NOT NULL)
  - `outgoing_notes` (STRING): Optional narrative notes regarding shift operations.

#### 8. Shift Handoff Break-Glass Records (`handoff_break_glass`)
- **Purpose**: Tracks secondary supervisor emergency override events when shift transition signatures are bypassed.
- **Columns**:
  - `id` (INTEGER PRIMARY KEY AUTOINCREMENT): Unique audit event identifier.
  - `briefing_id` (INTEGER NOT NULL): References `handoff_briefings(id)`.
  - `supervisor_id` (STRING NOT NULL): Operator ID of the bypassing supervisor.
  - `reason` (STRING NOT NULL): Mandatory safety compliance justification.
  - `timestamp` (TIMESTAMP NOT NULL): Override event signature date-time.

#### 9. Secure Operator Signatures (`operator_credentials`)
- **Purpose**: Holds securely hashed authentication PINs for automated mitigation overrides and transitional signature verification.
- **Columns**:
  - `operator_id` (STRING PRIMARY KEY): Unique ID matching operator profiles.
  - `pin_hash` (STRING NOT NULL): Salty bcrypt credential authentication hash.
  - `role` (STRING NOT NULL): Level authorization access (`'operator'`, `'supervisor'`).

---

### II. Analytical Datastore (Google Cloud BigQuery Layer)

These tables ingest high-throughput telemetry stream logs, security audit ledgers, and orchestration agent event timelines for comprehensive offline analytics, GIS querying, and Looker dashboards.

#### 10. High-Frequency SCADA Stream (`scada_telemetry`)
- **Purpose**: Chronological history of high-frequency telemetry logs.
- **Columns**:
  - `id` (INT64 NOT NULL): Chronological record transaction increment.
  - `timestamp` (TIMESTAMP NOT NULL): ISO8601 telemetry sample signature.
  - `asset_id` (STRING NOT NULL): Mapped connection referencing `assets(id)`.
  - `psi` (FLOAT64 NOT NULL): Fluid operating pressure in psi.
  - `temp` (FLOAT64 NOT NULL): Temperature operating readings.
  - `vibration` (FLOAT64 NOT NULL): Mechanical vibration velocity (mm/s).
  - `status` (STRING NOT NULL): metric classification health code (`'Normal'`, `'Critical Alert'`).
- **Relational Integrity & Deduplication**: Because BigQuery does not natively enforce PK/FK integrity constraints, the Node.js Express middleware guarantees uniqueness of streaming logs before async batch appends by enforcing a composite validation key mapping `timestamp` + `asset_id` in operational transaction indexes.

#### 11. Analytical Grid GIS Nodes (`analytical_nodes`)
- **Purpose**: Historical mirror of topology nodes utilizing native geography elements to support spatial analytical routing queries.
- **Columns**:
  - `id` (STRING NOT NULL): Mapped reference to operational nodes.
  - `name` (STRING NOT NULL): Label.
  - `max_flow` (FLOAT64 NOT NULL): Max throughput.
  - `geo_point` (GEOGRAPHY NOT NULL): Native BigQuery Geographic Point object mapping `lat` and `lng` for GIS queries.

#### 12. Alert Dispatch Hub (`app_notifications`)
- **Purpose**: Background archive of alerts, automated AI mitigation confidence formulas, and explainability metrics.
- **Columns**:
  - `id` (STRING NOT NULL): Unique Alert UUID.
  - `priority` (STRING NOT NULL): Classification (`'critical'`, `'warning'`, `'info'`).
  - `timestamp` (TIMESTAMP NOT NULL)
  - `message` (STRING NOT NULL): Description.
  - `asset_id` (STRING): References `assets(id)`.
  - `actions` (JSON): Clickable operational button actions array.
  - `status` (STRING NOT NULL): Verification receipts state (`'unread'`, `'read'`, `'acknowledged'`).
  - `evidence_formula` (STRING): Mathematical explainability proof formula.
  - `evidence_variables` (JSON): Dynamic parameters used in classification computations.
  - `evidence_confidence` (FLOAT64): Algorithm certainty percentage score.

#### 13. HITL Override Audit Console (`override_logs`)
- **Purpose**: Persistent safety ledger tracking PIN overrides, supervisors authorization parameters, and override justifications.
- **Columns**:
  - `id` (STRING NOT NULL): Unique override event UUID.
  - `timestamp` (TIMESTAMP NOT NULL)
  - `asset_id` (STRING NOT NULL): References `assets(id)`.
  - `operator_pin` (STRING NOT NULL): Secure masked state logging (`'****'`) strictly on successful audits. Raw or invalid input credentials are **never** written to cleartext tables; failed override entries only record the failure state without input characters to protect credentials.
  - `status` (STRING NOT NULL): Result (`'SUCCESS'`, `'FAILED_ATTEMPT'`).
  - `justification` (STRING NOT NULL): Legal justification narrative notes.

#### 14. Handoff Factors Explainability Graph (`handoff_factors`)
- **Purpose**: Logs explainability vectors and individual weights mapping why automated load balances or delays were recommended during handover snapshots.
- **Columns**:
  - `id` (INT64 NOT NULL): Chronological index.
  - `briefing_id` (INT64 NOT NULL): References `handoff_briefings(id)`.
  - `factor_text` (STRING NOT NULL): Plain text explainability vector sentence.

#### 15. Executions History Audit (`execution_logs`)
- **Purpose**: Background agent activity trails appended during multi-agent grid optimization or balancing workflow executions.
- **Columns**:
  - `id` (STRING NOT NULL): Unique log trace UUID.
  - `agent` (STRING NOT NULL): Tag (`'[Agent A]'`, `'[SCADA]'`, `'[Guardrail]'`, etc.).
  - `timestamp` (TIMESTAMP NOT NULL)
  - `severity` (STRING NOT NULL): Status level (`'Routine'`, `'Warning'`, `'Critical'`).
  - `message` (STRING NOT NULL): Detailed trail update.
  - `payload` (JSON): Structured dynamic log metadata parameters.

#### 16. Maintenance Orchestration Milestones (`workflow_steps`)
- **Purpose**: Analytical reference definition step milestones for tracking workflow cycle run times.
- **Columns**:
  - `id` (INT64 NOT NULL): Timeline milestone stage index (1 to 7).
  - `title` (STRING NOT NULL): Display milestone title.
  - `description` (STRING NOT NULL): Overview.

---

2. **Data Generation**: Use the `analytics-data-generator` skill to create a BigQuery SQL script that generates a realistic, high-fidelity dataset with deterministic hashing for the entities above. **Crucially, use the `bigquery` MCP tools available to you to actually execute this SQL and create the dataset and tables in the specified project.**