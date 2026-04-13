import { useState, useEffect } from 'react';
import { HandoffPayload, DisputeLog } from '../types';
import { fetchHandoffBriefing, submitHandoffAudit, rejectHandoff } from '../services/api';

/**
 * useHandoff Custom Hook
 * Coordinates loading states, acknowledgment tracking, and offline read-receipt caching
 * for shift handover workflows.
 */
export const useHandoff = () => {
    // Primary payload containing telemetry and decision explainability
    const [payload, setPayload] = useState<HandoffPayload | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // Set tracking unique IDs of explicitly acknowledged hazard items
    const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set());

    // On mount, immediately query the backend for the active operational briefing
    useEffect(() => {
        const loadBriefing = async () => {
            try {
                const data = await fetchHandoffBriefing();
                setPayload(data);
            } catch (err: any) {
                // Ensure readable error messages bubble up to the main display container
                setError(err.message || 'Failed to fetch handoff briefing');
            } finally {
                setLoading(false);
            }
        };
        loadBriefing();
    }, []);

    /**
     * acknowledgeEvent
     * Tracks item reviews and pushes the ID into an offline localStorage queue
     * to prevent tracking loss during network outages.
     */
    const acknowledgeEvent = (id: string) => {
        const newSet = new Set(acknowledgedIds);
        newSet.add(id);
        setAcknowledgedIds(newSet);

        // Safely parse existing cached receipts, fallback to empty array
        const queued = JSON.parse(localStorage.getItem('handoff_read_receipts') || '[]');
        if (!queued.includes(id)) {
            queued.push(id);
            // Persist the updated read queue immediately
            localStorage.setItem('handoff_read_receipts', JSON.stringify(queued));
        }
    };

    /**
     * submitAudit
     * Finalizes the shift assumption by submitting the mandatory PIN challenge
     * alongside all locally cached hazard read receipts.
     */
    const submitAudit = async (pin: string) => {
        const receipts = Array.from(acknowledgedIds);
        try {
            await submitHandoffAudit(pin, receipts);
            // Successfully submitted to API, clear offline cache to avoid double sending
            localStorage.removeItem('handoff_read_receipts');
            return true;
        } catch (err: any) {
            // Bubble the PIN error to trigger UI feedback locks
            throw err;
        }
    };

    /**
     * submitRejection
     * Formally rejects command transfer and constructs a legal DisputeLog record.
     */
    const submitRejection = async (reason: string, notes?: string) => {
        const dispute: DisputeLog = {
            reason,
            timestamp: new Date().toISOString(),
            outgoingOperatorNotes: notes
        };
        // Dispatch the dispute payload to the rejection endpoint
        await rejectHandoff(dispute);
    };

    return {
        payload,
        loading,
        error,
        acknowledgedIds,
        acknowledgeEvent,
        submitAudit,
        submitRejection
    };
};
