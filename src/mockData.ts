import { AppNotification } from './features/command-center/types';
import { OverrideLog } from './types';

export const mockNotifications: AppNotification[] = [
    {
        id: 'notif-critical-1',
        priority: 'critical',
        timestamp: new Date().toISOString(),
        message: 'Critical anomaly detected on COMP-TX-VALLEY-01. High vibration detected.',
        asset_info: { id: 'COMP-TX-VALLEY-01', location: 'Texas Valley' },
        actions: [{ label: 'Acknowledge' }, { label: 'Execute Mitigation' }],
        status: 'unread',
        evidence: {
            formula: 'Vibration > Threshold * 1.5 + Baseline',
            variables: {
                'Current Vibration': '0.85 mm',
                'Threshold': '0.50 mm',
                'Baseline': '0.02 mm'
            },
            confidence_score: 98.5
        }
    }
];

export const initialOverrideLogs: OverrideLog[] = [
    {
        id: 'log-1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        asset_id: 'COMP-TX-VALLEY-01',
        operator_pin: '****',
        status: 'SUCCESS',
        justification: 'Confirmed safe operating window with field engineers.'
    },
    {
        id: 'log-2',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        asset_id: 'COMP-TX-VALLEY-02',
        operator_pin: '****',
        status: 'FAILED_ATTEMPT',
        justification: 'Invalid PIN attempt.'
    }
];
