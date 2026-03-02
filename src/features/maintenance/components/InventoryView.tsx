import React from 'react';
import { InventoryItem } from '@src/types';
import { Plus, Package } from 'lucide-react';
import { orderParts } from '@src/services/api'; // Removed .js extension

interface InventoryViewProps {
    inventory: InventoryItem[];
    setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
    addLog: (msg: string) => void;
}

const InventoryView: React.FC<InventoryViewProps> = ({ inventory, setInventory, addLog }) => {
    return (
        <div className="animate-in fade-in duration-500 space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-1">SAP Mock Inventory Lookup</h2>
                    <p className="text-zinc-500 text-sm font-medium">Critical Spares & Maintenance Assets</p>
                </div>
                <button
                    onClick={async () => {
                        try {
                            const data = await orderParts('GASK-9921-X', 10); // Use the API function
                            if (data.newStockLevel !== undefined) {
                                setInventory(prev => prev.map(item =>
                                    item.part_number === 'GASK-9921-X' ? { ...item, stock_level: data.newStockLevel, status: data.newStockLevel < 5 ? 'Low Stock' : 'Available' } : item
                                ));
                                addLog(`[Agent B] Ordered 10 units of GASK-9921-X. New stock: ${data.newStockLevel}`);
                            } else if (data.error) {
                                addLog(`[Agent B] Error ordering parts: ${data.error}`);
                            }
                        } catch (error: any) {
                            addLog(`[Agent B] Network error ordering parts: ${error.message}`);
                        }
                    }}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-black px-6 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-orange-900/20 active:scale-95 uppercase tracking-widest"
                >
                    <Plus size={16} /> Order Parts
                </button>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
                    <h3 className="font-bold flex items-center gap-2 text-white">
                        <Package size={18} className="text-orange-500" />
                        Warehouse TX-S-04 Stock
                    </h3>
                    <button className="text-xs font-bold text-blue-400 hover:text-blue-300">Advanced Search</button>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-8 py-4">Model Compatibility</th>
                            <th className="px-8 py-4">Part #</th>
                            <th className="px-8 py-4">Description</th>
                            <th className="px-8 py-4">Stock Level</th>
                            <th className="px-8 py-4">Lead Time</th>
                            <th className="px-8 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {inventory.map((item, idx) => (
                            <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                                <td className="px-8 py-4 font-bold text-white">{item.model_compatibility}</td>
                                <td className="px-8 py-4 font-mono text-xs text-orange-500">{item.part_number}</td>
                                <td className="px-8 py-4 text-zinc-400">{item.description}</td>
                                <td className="px-8 py-4 font-black text-white text-center">{item.stock_level}</td>
                                <td className="px-8 py-4 text-zinc-500">{item.lead_time_days === 0 ? 'Immediate' : `${item.lead_time_days} days`}</td>
                                <td className="px-8 py-4 text-right">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${item.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryView;
