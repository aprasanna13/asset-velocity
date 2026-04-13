// src/features/command-center/types.ts

import { EvidencePayload } from '@src/types';

export type NotificationPriority = 'critical' | 'warning' | 'info';

export interface AppNotification {
    id: string;
    priority: NotificationPriority;
    timestamp: string;
    message: string;
    asset_info?: {
        id: string;
        location: string;
    };
    actions?: { label: string }[];
    status?: 'unread' | 'read' | 'acknowledged';
    evidence?: EvidencePayload;
}

export interface FieldAgent {
    id: string;
    name: string;
    status: 'online' | 'offline';
}
