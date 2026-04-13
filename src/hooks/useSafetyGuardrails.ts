import { useState, useEffect } from 'react';
import { OverrideLog } from '../types';

const LOGS_STORAGE_KEY = 'field_ops_override_logs';

export const useSafetyGuardrails = (initialLogs: OverrideLog[]) => {
    const [logs, setLogs] = useState<OverrideLog[]>([]);
    const [isChallengeOpen, setIsChallengeOpen] = useState(false);
    const [activeAssetId, setActiveAssetId] = useState<string>('');

    useEffect(() => {
        const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
        if (storedLogs) {
            try {
                setLogs(JSON.parse(storedLogs));
            } catch (e) {
                setLogs(initialLogs);
                localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(initialLogs));
            }
        } else {
            setLogs(initialLogs);
            localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(initialLogs));
        }
    }, [initialLogs]);

    const interceptAction = (actionType: string, assetId: string, _justificationRequired: boolean = true) => {
        if (actionType === 'Execute Mitigation') {
            setActiveAssetId(assetId);
            setIsChallengeOpen(true);
            return true; // Intercepted
        }
        return false; // Not intercepted
    };

    const logOverride = (status: 'SUCCESS' | 'FAILED_ATTEMPT', justification: string, pin: string = '****') => {
        const newLog: OverrideLog = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            asset_id: activeAssetId || 'UNKNOWN',
            operator_pin: pin === '1234' ? '****' : pin,
            status,
            justification
        };

        const updatedLogs = [newLog, ...logs];
        setLogs(updatedLogs);
        localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updatedLogs));
    };

    const validatePin = (pin: string, justificationText: string): boolean => {
        if (pin === '1234' && justificationText.trim().length > 0) {
            logOverride('SUCCESS', justificationText, pin);
            setIsChallengeOpen(false);
            return true;
        } else {
            logOverride('FAILED_ATTEMPT', justificationText || 'Invalid PIN attempt', pin);
            return false;
        }
    };

    return {
        logs,
        isChallengeOpen,
        setIsChallengeOpen,
        interceptAction,
        validatePin
    };
};
