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

