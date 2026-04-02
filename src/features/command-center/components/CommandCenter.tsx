// src/features/command-center/components/CommandCenter.tsx

import React, { useState } from 'react';
import { X, Bell, ShieldCheck, AlertCircle, AlertTriangle, Info, UserPlus } from 'lucide-react';
import { AppNotification, FieldAgent } from '../types';

interface CommandCenterProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: AppNotification[];
    onAcknowledge: (id: string) => void;
    onAssign: (id: string, agentId: string) => void;
    onStopSimulation: () => void;
    isSimulating: boolean;
}

const mockAgents: FieldAgent[] = [
    { id: 'agent-1', name: 'Agent Alpha', status: 'online' },
    { id: 'agent-2', name: 'Agent Bravo', status: 'online' },
    { id: 'agent-3', name: 'Agent Charlie', status: 'online' },
];

const CommandCenter: React.FC<CommandCenterProps> = ({
    isOpen,
    onClose,
    notifications,
    onAcknowledge,
    onAssign,
    onStopSimulation,
    isSimulating
}) => {
    const [selectedAgents, setSelectedAgents] = useState<{ [key: string]: string }>({});

    if (!isOpen) return null;

    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case 'critical':
                return 'border-rose-500/50 bg-rose-500/10 text-rose-400';
            case 'warning':
                return 'border-amber-500/50 bg-amber-500/10 text-amber-400';
            case 'info':
                return 'border-blue-500/50 bg-blue-500/10 text-blue-400';
            default:
                return 'border-zinc-800 bg-zinc-900/50 text-zinc-400';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'critical':
                return <AlertCircle size={16} className="text-rose-400" />;
            case 'warning':
                return <AlertTriangle size={16} className="text-amber-400" />;
            case 'info':
                return <Info size={16} className="text-blue-400" />;
            default:
                return <Bell size={16} className="text-zinc-400" />;
        }
    };

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-[#0d0d0d] border-l border-zinc-800 z-[100] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
                <h2 className="font-bold flex items-center gap-2 text-white">
                    <Bell size={18} className="text-orange-500" />
                    Command Center
                </h2>
                <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            {isSimulating && (
                <div className="p-4 bg-orange-500/10 border-b border-orange-500/30 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-orange-400">Simulation Active</p>
                        <p className="text-[10px] text-zinc-500">SIM-2026-0402 | Vibration Spike</p>
                    </div>
                    <button 
                        onClick={onStopSimulation}
                        className="text-xs font-black text-white bg-orange-600 hover:bg-orange-500 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        STOP SIMULATION
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <div className="bg-emerald-500/20 p-4 rounded-full">
                            <ShieldCheck size={32} className="text-emerald-400" />
                        </div>
                        <div>
                            <p className="font-bold text-white">System Clear</p>
                            <p className="text-xs text-zinc-500 mt-1">24 Agents Online</p>
                        </div>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div key={notif.id} className={`p-4 rounded-xl border ${getPriorityStyles(notif.priority)} transition-all duration-300`}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    {getPriorityIcon(notif.priority)}
                                    <span className="font-bold text-xs uppercase tracking-wider">{notif.priority}</span>
                                </div>
                                <span className="text-[10px] text-zinc-500">{new Date(notif.timestamp).toLocaleTimeString()}</span>
                            </div>
                            
                            <p className="text-sm text-white mb-3">{notif.message}</p>

                            {notif.asset_info && (
                                <div className="text-[10px] text-zinc-400 bg-black/30 p-2 rounded-lg mb-3">
                                    <p><span className="font-bold">Asset:</span> {notif.asset_info.id}</p>
                                    <p><span className="font-bold">Location:</span> {notif.asset_info.location}</p>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => onAcknowledge(notif.id)}
                                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold py-2 rounded-lg transition-colors"
                                >
                                    Acknowledge
                                </button>
                                
                                <div className="relative flex-1">
                                    <select 
                                        value={selectedAgents[notif.id] || ''}
                                        onChange={(e) => {
                                            setSelectedAgents({ ...selectedAgents, [notif.id]: e.target.value });
                                            if (e.target.value) onAssign(notif.id, e.target.value);
                                        }}
                                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold py-2 px-3 rounded-lg border-none appearance-none outline-none pr-8 transition-colors cursor-pointer"
                                    >
                                        <option value="" disabled>Assign Agent...</option>
                                        {mockAgents.map(agent => (
                                            <option key={agent.id} value={agent.id} className="bg-zinc-900">{agent.name}</option>
                                        ))}
                                    </select>
                                    <UserPlus size={14} className="absolute right-3 top-2.5 text-zinc-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommandCenter;
