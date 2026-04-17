import { useState } from 'react';
import { InventoryItem } from '@src/types'; // Import InventoryItem type

export const STATIC_INVENTORY: InventoryItem[] = [
    { id: 1, model_compatibility: 'High-Flow Centrifugal', part_number: 'GASK-9921-X', description: 'Compressor Valve Gasket Kit', stock_level: 12, lead_time_days: 0, warehouse_id: 'TX-S-04', status: 'Available' },
    { id: 2, model_compatibility: 'High-Flow Centrifugal', part_number: 'SEAL-HT-44', description: 'High-Temp Main Shaft Seal', stock_level: 4, lead_time_days: 2, warehouse_id: 'TX-S-04', status: 'Low Stock' },
    { id: 3, model_compatibility: 'High-Flow Centrifugal', part_number: 'LUBE-SYN-Q', description: 'Synthetic Lubricant (5 Gal)', stock_level: 25, lead_time_days: 0, warehouse_id: 'TX-S-04', status: 'Available' },
    { id: 4, model_compatibility: 'High-Flow Centrifugal', part_number: 'FLTR-oil-01', description: 'Main Oil Filter Element', stock_level: 50, lead_time_days: 2, warehouse_id: 'WH-TX-01', status: 'Available' },
    { id: 5, model_compatibility: 'High-Flow Centrifugal', part_number: 'VLV-BYP-02', description: 'Bypass Valve Rebuild Kit', stock_level: 3, lead_time_days: 5, warehouse_id: 'WH-TX-01', status: 'Low Stock' },
    { id: 6, model_compatibility: 'High-Flow Centrifugal', part_number: 'SENS-VIB-03', description: 'High-Temp Vibration Sensor', stock_level: 12, lead_time_days: 1, warehouse_id: 'WH-TX-02', status: 'Available' },
    { id: 7, model_compatibility: 'High-Flow Centrifugal', part_number: 'BRG-MAIN-04', description: 'Main Shaft Roller Bearing', stock_level: 2, lead_time_days: 10, warehouse_id: 'WH-TX-01', status: 'Low Stock' },
    { id: 8, model_compatibility: 'High-Flow Centrifugal', part_number: 'GSKT-HEAD-05', description: 'Cylinder Head Gasket Set', stock_level: 15, lead_time_days: 3, warehouse_id: 'WH-TX-02', status: 'Available' },
    { id: 9, model_compatibility: 'Reciprocating XL', part_number: 'PIST-RING-06', description: 'Compression Ring Set set', stock_level: 20, lead_time_days: 4, warehouse_id: 'WH-OK-01', status: 'Available' },
    { id: 10, model_compatibility: 'Reciprocating XL', part_number: 'VLV-SUC- SUCTION Valve Assembly', description: 'Suction Valve Assembly', stock_level: 5, lead_time_days: 7, warehouse_id: 'WH-OK-01', status: 'Available' },
    { id: 11, model_compatibility: 'Reciprocating XL', part_number: 'SENS-PRES-08', description: 'Digital Pressure Transducer', stock_level: 8, lead_time_days: 2, warehouse_id: 'WH-OK-02', status: 'Available' },
    { id: 12, model_compatibility: 'General', part_number: 'LUBE-GEAR-09', description: 'Industrial Gear Oil (5 Gal)', stock_level: 30, lead_time_days: 0, warehouse_id: 'WH-TX-01', status: 'Available' },
    { id: 13, model_compatibility: 'General', part_number: 'CLEAN-SOLV-10', description: 'Degreasing Solvent (1 Gal)', stock_level: 45, lead_time_days: 0, warehouse_id: 'WH-TX-02', status: 'Available' },
    { id: 14, model_compatibility: 'High-Flow Centrifugal', part_number: 'O-RING-KIT-11', description: 'Viton O-Ring Assortment', stock_level: 100, lead_time_days: 1, warehouse_id: 'WH-TX-01', status: 'Available' },
    { id: 15, model_compatibility: 'Reciprocating XL', part_number: 'PLUG-IGN-12', description: 'Industrial Spark Plug', stock_level: 40, lead_time_days: 1, warehouse_id: 'WH-OK-01', status: 'Available' },
    { id: 16, model_compatibility: 'High-Flow Centrifugal', part_number: 'COUPLING-13', description: 'Flexible Shaft Coupling', stock_level: 1, lead_time_days: 14, warehouse_id: 'WH-TX-02', status: 'Low Stock' },
    { id: 17, model_compatibility: 'General', part_number: 'H2S-DET-14', description: 'Portable H2S Gas Detector', stock_level: 6, lead_time_days: 3, warehouse_id: 'WH-TX-01', status: 'Available' },
    { id: 18, model_compatibility: 'Reciprocating XL', part_number: 'CON-ROD-15', description: 'Connecting Rod Bearing Kit', stock_level: 4, lead_time_days: 8, warehouse_id: 'WH-OK-02', status: 'Low Stock' },
];

const useInventory = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>(STATIC_INVENTORY); // Typed state

    return { inventory, setInventory };
};

export default useInventory;
