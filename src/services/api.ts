// src/services/api.ts
import { InventoryItem, HandoffPayload, DisputeLog } from '@src/types';


const API_BASE_URL = '/api';


export const fetchInventory = async (): Promise<InventoryItem[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/inventory`, {
            method: 'GET',
            // CRITICAL: This allows the browser to send Google Auth cookies
            credentials: 'include', 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            // If you get a 401 or 403 here, you might need to log 
            // into the Workstation URL in a separate tab first.
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching inventory:", error);
        throw error;
    }
};


export const updateInventory = async (partNumber: string, quantity: number): Promise<{ newStockLevel: number, status: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/inventory/${partNumber}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating inventory:", error);
        throw error;
    }
};

export const orderParts = async (partNumber: string, quantity: number): Promise<{ newStockLevel: number, error?: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ part_number: partNumber, quantity })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error ordering parts:", error);
        throw error;
    }
};

export const fetchHandoffBriefing = async (): Promise<HandoffPayload> => {
    // Simulating an API call with mock data that meets the requirements
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                mode: 'Standard',
                threshold: 70,
                criticalEvents: [
                    {
                        id: 'evt-1',
                        severity: 85,
                        category: 'critical',
                        subsystem: 'Pipeline A',
                        title: 'High Pressure Anomaly',
                        description: 'Pressure in section 4 is exceeding normal limits. Requires manual inspection.',
                        timestamp: new Date(Date.now() - 3600000).toISOString(),
                    },
                    {
                        id: 'evt-2',
                        severity: 75,
                        category: 'critical',
                        subsystem: 'Compressor B',
                        title: 'Vibration Warning',
                        description: 'Compressor B showing abnormal vibration patterns. Maintenance team notified.',
                        timestamp: new Date(Date.now() - 1800000).toISOString(),
                    }
                ],
                routineEvents: [
                    {
                        id: 'evt-3',
                        severity: 20,
                        category: 'routine',
                        subsystem: 'Cooling System',
                        title: 'Routine Sensor Check',
                        description: 'All sensors in cooling system calibrated successfully.',
                        timestamp: new Date(Date.now() - 7200000).toISOString(),
                    },
                    {
                        id: 'evt-4',
                        severity: 10,
                        category: 'routine',
                        subsystem: 'Power Backup',
                        title: 'Battery Status Update',
                        description: 'Backup batteries holding 98% charge.',
                        timestamp: new Date(Date.now() - 5400000).toISOString(),
                    }
                ],
                decisionLogic: {
                    outcome: 'Delayed scheduled maintenance on Compressor B by 4 hours.',
                    factors: [
                        'Incoming severe weather pattern detected (high risk for outdoor crew).',
                        'Backup cooling capacity is sufficient to handle delayed compressor repair.',
                        'Grid load is currently at peak demand, maximizing uptime priority.'
                    ]
                }
            });
        }, 500);
    });
};

export const submitHandoffAudit = async (pin: string, readReceipts: string[]): Promise<{ success: boolean }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Submitting read receipts:', readReceipts);
            if (pin === '1234') { // Mock valid PIN
                resolve({ success: true });
            } else {
                reject(new Error('Invalid PIN. Verification failed.'));
            }
        }, 300);
    });
};

export const rejectHandoff = async (dispute: DisputeLog): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Handoff rejected with dispute:', dispute);
            resolve({ success: true });
        }, 300);
    });
};
