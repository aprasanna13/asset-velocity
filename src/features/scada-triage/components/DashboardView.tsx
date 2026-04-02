import React from 'react';
import { ScadaData } from '@src/types'; // Changed import path
import StatusBadge from '@src/components/shared/StatusBadge'; // Changed import path
import {
    AlertTriangle,
    BarChart3,
    Clock,
    Database,
    ArrowRight
} from 'lucide-react';

interface DashboardViewProps {
    stream: ScadaData[];
    alerts: ScadaData[];
    startWorkflow: (alert: ScadaData) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ stream, alerts, startWorkflow }) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`bg-zinc-900/50 border p-6 rounded-2xl transition-all duration-300 ${alerts.length > 0 ? 'border-rose-500/50 shadow-lg shadow-rose-900/20' : 'border-zinc-800'}`}>
                    <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Critical Anomalies</p>
                    <p className={`text-4xl font-black ${alerts.length > 0 ? 'text-rose-400' : 'text-white'}`}> {alerts.length} </p>
                    <div className={`mt-4 flex items-center text-xs gap-1 font-bold ${alerts.length > 0 ? 'text-rose-400 animate-pulse' : 'text-zinc-500'}`}>
                        <AlertTriangle size={14} /> {alerts.length > 0 ? 'Action Required' : 'System Clear'}
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
                    <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Field Score</p>
                    <p className="text-4xl font-black text-white">94%</p>
                    <div className="mt-4 flex items-center text-xs text-emerald-400 gap-1 font-bold">
                        <BarChart3 size={14} /> +2.4% Efficiency
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
                    <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Avg Triage Latency</p>
                    <p className="text-4xl font-black text-white">1.2s</p>
                    <div className="mt-4 flex items-center text-xs text-blue-400 gap-1 font-bold">
                        <Clock size={14} /> Headless Processing
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
                    <h3 className="font-bold flex items-center gap-2 text-white">
                        <Database size={18} className="text-blue-500" />
                        Live SCADA Stream (Filtered)
                    </h3>
                    <button className="text-xs font-bold text-blue-400 hover:text-blue-300">View History</button>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">Asset ID</th>
                            <th className="px-6 py-4">PSI</th>
                            <th className="px-6 py-4">Temp(°F)</th>
                            <th className="px-6 py-4">Vibration</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {stream.map((item) => (
                            <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors animate-in slide-in-from-top-1 duration-300">
                                <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{new Date(item.timestamp).toLocaleTimeString()}</td>
                                <td className="px-6 py-4 font-bold text-white">{item.asset_id}</td>
                                <td className={`px-6 py-4 font-mono ${item.psi < 700 ? 'text-rose-400' : 'text-zinc-400'}`}>{item.psi}</td>
                                <td className={`px-6 py-4 font-mono ${item.temp > 150 ? 'text-rose-400' : 'text-zinc-400'}`}>{item.temp}</td>
                                <td className={`px-6 py-4 font-mono ${item.vibration > 0.5 ? 'text-rose-400 font-bold' : 'text-zinc-400'}`}>{item.vibration}mm</td>
                                <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                                <td className="px-6 py-4">
                                    {item.status === 'Critical Alert' ? (
                                        <button
                                            onClick={() => startWorkflow(item)}
                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black transition-all shadow-lg shadow-blue-900/20"
                                        >
                                            Schedule Maintenance <ArrowRight size={14} />
                                        </button>
                                    ) : <span className="text-zinc-700">—</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardView;