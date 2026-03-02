// @ts-nocheck
import React from 'react';
import { ScadaData, PipelineNode } from '@src/types'; // Changed import path
import {
    AlertTriangle,
    Settings,
    ShieldCheck,
    ArrowRight,
    Play,
    Zap
} from 'lucide-react';

interface TopologyViewProps {
    alerts: ScadaData[];
    nodes: PipelineNode[];
    workflowStep: number;
}

const TopologyView: React.FC<TopologyViewProps> = ({ alerts, nodes, workflowStep }) => {
    return (
        <div className="flex flex-col h-full gap-8 animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-1">Permian-East-Line: Topology View</h2>
                    <p className="text-zinc-500 text-sm font-medium">Real-time Network Flow Distribution</p>
                </div>
                                <div className="flex items-center gap-4">
                                                    {alerts.length > 0 ? (
                                                        <div className="bg-red-500/10 text-red-500 text-[10px] font-black px-4 py-1.5 rounded-full border border-red-500/20 flex items-center gap-2 uppercase tracking-widest">
                                                            <AlertTriangle size={14} /> Critical Anomaly Detected
                                                        </div>
                                                    ) : (
                                                        <div className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-4 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-2 uppercase tracking-widest">
                                                            <ShieldCheck size={14} /> System Optimal
                                                        </div>
                                                    )}
                                                    <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-colors">
                                                        <Settings size={20} />
                                                    </button>
                                                </div>
                                
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 overflow-hidden">
                {/* Network Stats Column */}
                <div className="lg:col-span-1 space-y-6 flex flex-col">
                    <div className="bg-[#1c1a16] border border-zinc-800/50 rounded-3xl p-8">
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">Target Flow</p>
                        <p className="text-3xl font-black text-white tracking-tighter">500.0 <span className="text-sm font-bold text-zinc-600 ml-1">MMcf/d</span></p>
                    </div>

                    <div className="bg-[#1c1a16] border border-zinc-800/50 rounded-3xl p-8 border-l-4 border-l-red-500">
                        <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-1">Current Flow</p>
                        <p className="text-3xl font-black text-red-500 tracking-tighter">492.0 <span className="text-sm font-bold text-red-900 ml-1">MMcf/d</span></p>
                        <div className="mt-4 flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-red-500/80 uppercase tracking-tighter animate-pulse">Slight Deficit (-1.6%)</span>
                        </div>
                    </div>

                    <div className="bg-[#1c1a16] border border-zinc-800/50 rounded-3xl p-8 border-l-4 border-l-orange-500">
                        <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-1">Compensation Gain</p>
                        <p className="text-3xl font-black text-orange-500 tracking-tighter">+17.0 <span className="text-sm font-bold text-orange-900 ml-1">MMcf/d</span></p>
                    </div>

                    <div className="mt-auto bg-[#1c1a16] border border-zinc-800/50 rounded-3xl p-8 shadow-2xl">
                        <h4 className="text-lg font-black text-white tracking-tight mb-2">Schedule Downtime</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed mb-8 font-medium italic">Requires rerouting an additional 42 MMcf/d to South-Western bypass.</p>
                        <button className="w-full bg-orange-600 text-black py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-orange-500 transition-colors">Initiate Schedule</button>
                    </div>
                </div>

                {/* Topology Graph Column */}
                <div className="lg:col-span-3 bg-[#1c1a16] border border-zinc-800/50 rounded-[3rem] relative flex items-center justify-center p-12 overflow-hidden shadow-inner">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                    
                    <div className="relative w-full max-w-3xl aspect-[16/9]">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 800 450">
                            {/* Connections */}
                            <line x1="200" y1="225" x2="400" y2="100" stroke="#ef4444" strokeWidth="2" strokeDasharray="6" className="opacity-30" />
                            <line x1="200" y1="225" x2="400" y2="350" stroke="#ef4444" strokeWidth="2" strokeDasharray="6" className="opacity-30" />
                            <line x1="400" y1="100" x2="650" y2="225" stroke="#3b82f6" strokeWidth="4" strokeDasharray="10 2" className="animate-[dash_20s_linear_infinite]" />
                            <line x1="400" y1="350" x2="650" y2="225" stroke="#3b82f6" strokeWidth="4" strokeDasharray="10 2" className="animate-[dash_20s_linear_infinite]" />

                            <style>{`
                                @keyframes dash {
                                    to { stroke-dashoffset: -1000; }
                                }
                            `}</style>

                                                                        {/* Node 1 - Critical */}
                                                                        <g transform="translate(140, 165)">
                                                                            <filter id="shadow1" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceAlpha" stdDeviation="5"/><feOffset dx="0" dy="4"/><feComponentTransfer><feFuncA type="linear" slope="0.1"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                                                                            <rect width="120" height="120" rx="32" fill="#0d0d0d" filter="url(#shadow1)" stroke={nodes[0].status === 'Maintenance' ? '#ef4444' : '#10b981'} strokeWidth="2" />
                                                                            <rect x="35" y="20" width="50" height="50" rx="14" fill={nodes[0].status === 'Maintenance' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'} />
                                                                            {nodes[0].status === 'Maintenance' ? <AlertTriangle x="47" y="32" size={26} className="text-red-500" /> : <ShieldCheck x="47" y="32" size={26} className="text-emerald-500" />}
                                                                            <text x="60" y="85" textAnchor="middle" fontSize="9" fontWeight="800" fill="#444" className="uppercase tracking-widest">{nodes[0].name}</text>
                                                                            <text x="60" y="100" textAnchor="middle" fontSize="10" fontWeight="900" fill="white" className="tracking-tight uppercase">{nodes[0].id}</text>
                                                                            {nodes[0].status === 'Maintenance' ? (
                                                                                <>
                                                                                    <rect x="15" y="130" width="90" height="18" rx="6" fill="#ef4444" />
                                                                                    <text x="60" y="142" textAnchor="middle" fontSize="7" fontWeight="900" fill="white" className="uppercase tracking-widest">Maintenance Required</text>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <rect x="30" y="130" width="60" height="18" rx="6" fill="rgba(16, 185, 129, 0.2)" />
                                                                                    <text x="60" y="142" textAnchor="middle" fontSize="7" fontWeight="900" fill="#10b981" className="uppercase tracking-widest">Operational</text>
                                                                                </>
                                                                            )}
                                                                            <circle cx="105" cy="15" r="5" fill={nodes[0].status === 'Maintenance' ? '#ef4444' : '#10b981'} className={nodes[0].status === 'Maintenance' ? "animate-pulse" : ""} />
                                                                        </g>
                                            
                                                                        {/* Node 2 - Compensating */}
                                                                        <g transform="translate(340, 40)">
                                                                            <rect width="120" height="120" rx="32" fill="#0d0d0d" filter="url(#shadow1)" stroke={nodes[1].status.includes('Boosted') ? '#3b82f6' : '#10b981'} strokeWidth="2" />
                                                                            <rect x="35" y="20" width="50" height="50" rx="14" fill={nodes[1].status.includes('Boosted') ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)'} />
                                                                            {nodes[1].status.includes('Boosted') ? <Zap x="47" y="32" size={26} className="text-blue-500" /> : <ShieldCheck x="47" y="32" size={26} className="text-emerald-500" />}
                                                                            <text x="60" y="85" textAnchor="middle" fontSize="9" fontWeight="800" fill="#444" className="uppercase tracking-widest">{nodes[1].name}</text>
                                                                            <text x="60" y="100" textAnchor="middle" fontSize="10" fontWeight="900" fill="white" className="tracking-tight uppercase">{nodes[1].id}</text>
                                                                            {nodes[1].status.includes('Boosted') ? (
                                                                                <>
                                                                                    <rect x="30" y="130" width="60" height="18" rx="6" fill="rgba(59, 130, 246, 0.2)" />
                                                                                    <text x="60" y="142" textAnchor="middle" fontSize="7" fontWeight="900" fill="#3b82f6" className="uppercase tracking-widest">Compensating</text>
                                                                                    <text x="60" y="162" textAnchor="middle" fontSize="10" fontWeight="900" fill="#3b82f6" className="tracking-tight">● {nodes[1].current.toFixed(1)} MMcf</text>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <rect x="30" y="130" width="60" height="18" rx="6" fill="rgba(16, 185, 129, 0.2)" />
                                                                                    <text x="60" y="142" textAnchor="middle" fontSize="7" fontWeight="900" fill="#10b981" className="uppercase tracking-widest">Healthy</text>
                                                                                </>
                                                                            )}
                                                                        </g>
                                            
                                                                        {/* Node 3 - Compensating */}
                                                                        <g transform="translate(340, 290)">
                                                                            <rect width="120" height="120" rx="32" fill="#0d0d0d" filter="url(#shadow1)" stroke={nodes[2]?.status.includes('Boosted') ? '#3b82f6' : '#10b981'} strokeWidth="2" />
                                                                            <rect x="35" y="20" width="50" height="50" rx="14" fill={nodes[2]?.status.includes('Boosted') ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)'} />
                                                                            {nodes[2]?.status.includes('Boosted') ? <Zap x="47" y="32" size={26} className="text-blue-500" /> : <ShieldCheck x="47" y="32" size={26} className="text-emerald-500" />}
                                                                            <text x="60" y="85" textAnchor="middle" fontSize="9" fontWeight="800" fill="#444" className="uppercase tracking-widest">{nodes[2]?.name}</text>
                                                                            <text x="60" y="100" textAnchor="middle" fontSize="10" fontWeight="900" fill="white" className="tracking-tight uppercase">{nodes[2]?.id}</text>
                                                                            {nodes[2]?.status.includes('Boosted') ? (
                                                                                <>
                                                                                    <rect x="30" y="130" width="60" height="18" rx="6" fill="rgba(59, 130, 246, 0.2)" />
                                                                                    <text x="60" y="142" textAnchor="middle" fontSize="7" fontWeight="900" fill="#3b82f6" className="uppercase tracking-widest">Compensating</text>
                                                                                    <text x="60" y="162" textAnchor="middle" fontSize="10" fontWeight="900" fill="#3b82f6" className="tracking-tight">● {nodes[2]?.current.toFixed(1)} MMcf</text>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <rect x="30" y="130" width="60" height="18" rx="6" fill="rgba(16, 185, 129, 0.2)" />
                                                                                    <text x="60" y="142" textAnchor="middle" fontSize="7" fontWeight="900" fill="#10b981" className="uppercase tracking-widest">Healthy</text>
                                                                                </>
                                                                            )}
                                                                        </g>
                                                                                        {/* Distribution Node */}
                                            <g transform="translate(600, 165)">
                                                <circle cx="60" cy="60" r="50" fill="#0d0d0d" filter="url(#shadow1)" stroke="#333" strokeWidth="1" />
                                                <ArrowRight x="47" y="47" size={26} className="text-zinc-700" />
                                                <text x="60" y="130" textAnchor="middle" fontSize="9" fontWeight="800" fill="#444" className="uppercase tracking-widest">Distribution</text>
                                                <text x="60" y="145" textAnchor="middle" fontSize="11" fontWeight="900" fill="white" className="tracking-tighter uppercase">Main Hub Alpha</text>
                                            </g>
                                        </svg>
                                    </div>

                                    {/* Legend Overlay */}
                                    <div className="absolute bottom-10 right-10 bg-[#0d0d0d]/80 backdrop-blur-md border border-zinc-800 rounded-3xl p-6 shadow-2xl w-56">
                                        <h5 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-4">Network Legend</h5>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Fault / Maintenance</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Compensating Flow</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-0.5 bg-zinc-800"></div>
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Standby Nodes</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
    );
};

export default TopologyView;
