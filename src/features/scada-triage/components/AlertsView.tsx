import React from 'react';
import { ScadaData } from '@src/types';
import {
    History,
    Zap,
    ArrowRight,
    Database,
    Clock,
    Activity
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_SCADA_STREAM: ScadaData[] = [
    { id: 1, timestamp: "2026-02-18T14:00:00Z", asset_id: "COMP-TX-VALLEY-01", psi: 855, temp: 112, vibration: 0.02, status: "Normal" },
    { id: 2, timestamp: "2026-02-18T14:05:00Z", asset_id: "COMP-TX-VALLEY-01", psi: 852, temp: 114, vibration: 0.02, status: "Normal" },
    { id: 4, timestamp: "2026-02-18T14:12:00Z", asset_id: "COMP-TX-VALLEY-02", psi: 850, temp: 110, vibration: 0.01, status: "Normal" }
];

interface AlertsViewProps {
    alerts: ScadaData[];
    activeWorkflow: ScadaData | null;
    startWorkflow: (alert: ScadaData) => void;
}

const AlertsView: React.FC<AlertsViewProps> = ({ alerts, activeWorkflow, startWorkflow }) => {
    return (
        <div className="flex flex-1 h-full gap-6 overflow-hidden animate-in slide-in-from-right-4 duration-500">
            {/* Left Column: Alerts List */}
            <div className="w-80 bg-zinc-900/30 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-zinc-800">
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
                        Recent Critical Alerts
                        <span className="bg-orange-600 text-[10px] text-white px-1.5 py-0.5 rounded-full font-black">14 LIVE</span>
                    </h3>
                </div>
                <div className="overflow-y-auto flex-1">
                    <table className="w-full text-left">
                        <thead className="text-[9px] text-zinc-600 uppercase font-black sticky top-0 bg-zinc-900/90 backdrop-blur-sm z-10 border-b border-zinc-800">
                            <tr>
                                <th className="px-4 py-3">Asset ID</th>
                                <th className="px-4 py-3">PSI</th>
                                <th className="px-4 py-3">Vib.</th>
                                <th className="px-4 py-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {alerts.map((alert) => (
                                <tr key={alert.id} className={`hover:bg-zinc-800/30 cursor-pointer transition-colors ${activeWorkflow?.id === alert.id ? 'bg-orange-500/5' : ''}`} onClick={() => startWorkflow(alert)}>
                                    <td className="px-4 py-4 text-[11px] font-bold text-orange-500">{alert.asset_id}</td>
                                    <td className="px-4 py-4 text-[10px] font-mono text-zinc-400">
                                        {alert.psi}
                                        {alert.psi < 650 && <span className="text-orange-500 ml-0.5">↓</span>}
                                    </td>
                                    <td className="px-4 py-4 text-[10px] font-mono text-blue-400">{alert.vibration}</td>
                                    <td className="px-4 py-4 text-right">
                                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-500 uppercase">TRIAGE</span>
                                    </td>
                                </tr>
                            ))}
                            {/* Fillers to match image */}
                            <tr className="border-t border-zinc-800/50"><td className="px-4 py-4 text-[11px] font-bold text-zinc-400">RIDGE-04</td><td className="px-4 py-4 text-[10px] font-mono text-zinc-500">712</td><td className="px-4 py-4 text-[10px] font-mono text-zinc-500">0.12</td><td className="px-4 py-4 text-right"><span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 uppercase">IDLE</span></td></tr>
                            <tr className="border-t border-zinc-800/50"><td className="px-4 py-4 text-[11px] font-bold text-zinc-400">PORT-92</td><td className="px-4 py-4 text-[10px] font-mono text-zinc-500">698</td><td className="px-4 py-4 text-[10px] font-mono text-zinc-500">0.08</td><td className="px-4 py-4 text-right"><span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 uppercase">IDLE</span></td></tr>
                            <tr className="border-t border-zinc-800/50"><td className="px-4 py-4 text-[11px] font-bold text-zinc-400 text-red-500">PEAK-11</td><td className="px-4 py-4 text-[10px] font-mono text-red-500">892 ↑</td><td className="px-4 py-4 text-[10px] font-mono text-zinc-500">1.44</td><td className="px-4 py-4 text-right"><span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 uppercase">CRIT</span></td></tr>
                            <tr className="border-t border-zinc-800/50"><td className="px-4 py-4 text-[11px] font-bold text-zinc-400">BASE-03</td><td className="px-4 py-4 text-[10px] font-mono text-zinc-500">705</td><td className="px-4 py-4 text-[10px] font-mono text-zinc-500">0.05</td><td className="px-4 py-4 text-right"><span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 uppercase">IDLE</span></td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.8)]"></div>
                    <span className="text-[10px] font-bold text-zinc-500">Agent A Active</span>
                    <div className="ml-auto flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-3/4"></div>
                    </div>
                </div>
            </div>

            {/* Main Analysis Column */}
            <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-3xl font-black text-white tracking-tight">Anomaly Triage Center</h2>
                            <span className="bg-orange-600/10 text-orange-500 text-[10px] font-black px-2 py-0.5 rounded border border-orange-500/20 uppercase tracking-widest">AGENT A - MONITORING</span>
                        </div>
                        <p className="text-zinc-500 text-sm font-medium">Industrial Operations Surveillance Pipeline</p>
                    </div>
                    <button className="flex items-center gap-2 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 px-4 py-2 rounded-xl text-xs font-bold border border-zinc-800 transition-colors">
                        <History size={16} /> History
                    </button>
                </div>

                <div className="bg-[#1a1c18] border border-zinc-800/50 rounded-3xl p-10 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-3xl font-black text-white">COMP-TX-VALLEY-01</h3>
                                <span className="bg-orange-600 text-black text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter shadow-lg shadow-orange-600/20">HIGH INTENSITY ANOMALY</span>
                            </div>
                            <p className="text-zinc-500 text-sm font-medium">Location: Texas Sector G-42 · Node Type: Compressor Station</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Confidence Score</p>
                            <p className="text-5xl font-black text-blue-400 tracking-tighter">94.2%</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Time Since Event</p>
                            <p className="text-5xl font-black text-white tracking-tighter">04:12 <span className="text-lg text-zinc-600 font-bold ml-1">min</span></p>
                        </div>
                    </div>

                    {/* Chart Placeholder */}
                    <div className="space-y-4 mb-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vibration (mm/s)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">PSI Inlet</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic">Real-time SCADA Feed (T-30s)</span>
                        </div>
                        <div className="h-44 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 p-6 relative flex items-end">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 150">
                                <path d="M0 80 Q 50 60, 100 100 T 200 80 T 300 120 T 400 50 T 500 90 T 600 70 T 700 100 T 800 60" fill="none" stroke="#60a5fa" strokeWidth="2.5" />
                                <path d="M0 120 Q 50 140, 100 110 T 200 130 T 300 100 T 400 140 T 500 110 T 600 120 T 700 90 T 800 110" fill="none" stroke="#f97316" strokeWidth="2.5" />
                                <circle cx="620" cy="74" r="5" fill="#60a5fa" className="animate-pulse" />
                                <text x="630" y="70" fill="white" fontSize="10" fontWeight="bold">0.85mm Peak</text>
                                <circle cx="650" cy="115" r="5" fill="#f97316" className="animate-pulse" />
                                <text x="660" y="125" fill="white" fontSize="10" fontWeight="bold">645 PSI</text>
                            </svg>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-10">
                        <div className="bg-[#0d0d0d]/60 border border-zinc-800 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-orange-600/10 rounded-lg text-orange-500"><Zap size={16} /></div>
                                <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Agent A: Classification Logic</h4>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">RULE_01_THRESHOLD</p>
                                    <p className="text-sm font-bold text-white">Threshold Breach Detected: <span className="text-orange-500">PSI &lt; 650</span></p>
                                </div>
                                <div className="pt-4 border-t border-zinc-800">
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">SIGNATURE_MATCH</p>
                                    <p className="text-sm font-bold text-white">Cavitation Pattern (Vibration Resonance @ 44Hz)</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#0d0d0d]/60 border border-zinc-800 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-blue-600/10 rounded-lg text-blue-400"><Database size={16} /></div>
                                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Raw Telemetry Snippet</h4>
                            </div>
                            <pre className="text-[10px] font-mono text-zinc-500 leading-relaxed overflow-hidden">
                                {`> GET telemetry.val01.psi
> 852.4, 850.1, 848.2, 645.0 [ALARM]
> GET telemetry.val01.vib_rms
> 0.12, 0.14, 0.42, 0.85 [CRIT]`}
                            </pre>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex-1 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 py-3.5 rounded-2xl text-xs font-bold border border-zinc-800 transition-colors uppercase tracking-widest">View Raw SCADA</button>
                        <button className="flex-1 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 py-3.5 rounded-2xl text-xs font-bold border border-zinc-800 transition-colors uppercase tracking-widest">Ignore False Positive</button>
                        <button onClick={() => startWorkflow(alerts[0] || INITIAL_SCADA_STREAM[0])} className="flex-[1.5] bg-orange-600 hover:bg-orange-500 text-black px-3 py-1.5 rounded-2xl text-xs font-black transition-all shadow-xl shadow-orange-900/30 flex items-center justify-center gap-2 uppercase tracking-widest">
                            Hand off to Agent B <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 flex items-center gap-5">
                        <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-400"><Clock size={28} /></div>
                        <div>
                            <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">Operating Temp</p>
                            <p className="text-2xl font-black text-white tracking-tighter">142.6°F <span className="text-xs font-bold text-zinc-600 ml-2 uppercase">Normal</span></p>
                        </div>
                    </div>
                    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 flex items-center gap-5">
                        <div className="p-3 bg-orange-600/10 rounded-2xl text-orange-500"><Activity size={28} /></div>
                        <div>
                            <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">Last Maintenance</p>
                            <p className="text-2xl font-black text-white tracking-tighter">Jan 12, 2024</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertsView;