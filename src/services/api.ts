// src/services/api.ts
import { InventoryItem } from '@src/types'; // Import necessary types

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
