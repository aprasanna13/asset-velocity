import { useState, useEffect } from 'react';
import { InventoryItem } from '@src/types'; // Import InventoryItem type
import { fetchInventory } from '@src/services/api'; // Changed import path and removed .js extension

const useInventory = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]); // Typed state

    useEffect(() => {
        const getInventory = async () => {
            try {
                const data: InventoryItem[] = await fetchInventory(); // Typed data
                setInventory(data);
            } catch (error) {
                console.error("Could not fetch inventory:", error);
            }
        };

        getInventory();
    }, []);

    return { inventory, setInventory };
};

export default useInventory;
