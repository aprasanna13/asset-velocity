// src/types.ts

export interface ScadaData {
    id: number;
    timestamp: string;
    asset_id: string;
    psi: number;
    temp: number;
    vibration: number;
    status: "Normal" | "Critical Alert" | "Maintenance" | "Active";
}

export interface InventoryItem {
    id: number;
    model_compatibility: string;
    part_number: string;
    description: string;
    stock_level: number;
    lead_time_days: number;
    warehouse_id: string;
    status?: "Low Stock" | "Available"; // Add status for frontend display
}

export interface PipelineNode {
    id: string;
    current: number;
    max: number;
    role: "Primary" | "Backup" | "Distribution";
    status: "Active" | "Maintenance" | "Active (Boosted)" | "Normal" | "Compensating";
    name: string;
    lat?: number;
    lng?: number;
}

export interface EvidencePayload {
    formula: string;
    variables: { [key: string]: string | number };
    confidence_score: number;
}

export interface OverrideLog {
    id: string;
    timestamp: string;
    asset_id: string;
    operator_pin: string;
    status: 'SUCCESS' | 'FAILED_ATTEMPT';
    justification: string;
}

export interface HandoffEvent {
    id: string;
    severity: number;
    category: 'critical' | 'routine';
    subsystem: string;
    title: string;
    description: string;
    timestamp: string;
    acknowledged?: boolean;
}

export interface HandoffPayload {
    mode: 'Standard' | 'Storm/Emergency';
    threshold: number;
    criticalEvents: HandoffEvent[];
    routineEvents: HandoffEvent[];
    decisionLogic: {
        outcome: string;
        factors: string[];
    };
}

export interface DisputeLog {
    reason: string;
    timestamp: string;
    outgoingOperatorNotes?: string;
}

export interface BreakGlassAudit {
    supervisorId: string;
    timestamp: string;
    reason: string;
}

export interface StructuredLogPayload {
    [key: string]: any;
}

export interface ExecutionLog {
    id: string;
    agent: string;
    timestamp: string;
    severity: 'Routine' | 'Warning' | 'Critical';
    message: string;
    payload?: StructuredLogPayload;
}

export interface SearchResult {
    id: string;
    title: string;
    subtitle?: string;
    type: 'log' | 'part' | 'node';
    action: {
        type: 'NAVIGATE' | 'OPEN_DRAWER' | 'HIGHLIGHT_MAP';
        payload: unknown;
    };
}

