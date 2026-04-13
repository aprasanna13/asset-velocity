import React from 'react';
import { ScadaData, PipelineNode, InventoryItem, ExecutionLog } from '@src/types';
import { ExecutionConsole } from '../../../components/ExecutionConsole/ExecutionConsole';
import {
    Zap,
    GitBranch,
    CheckCircle,
    ArrowRight,
    Package,
    Layers,
    Play
} from 'lucide-react';
import { updateInventory } from '@src/services/api';

interface WorkflowViewProps {
    activeWorkflow: ScadaData | null;
    workflowStep: number;
    logs: ExecutionLog[];
    completeMaintenance: () => void;
    setNodes: React.Dispatch<React.SetStateAction<PipelineNode[]>>;
    // INITIAL_PIPELINE_NODES: PipelineNode[]; // Removed
    setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
    addLog: (msg: string) => void;
    setWorkflowStep: React.Dispatch<React.SetStateAction<number>>;
    // setActiveTab: React.Dispatch<React.SetStateAction<string>>; // Removed
}

const WorkflowView: React.FC<WorkflowViewProps> = ({
    activeWorkflow,
    workflowStep,
    logs,
    completeMaintenance,
    setNodes,
    // INITIAL_PIPELINE_NODES, // Removed
    setInventory,
    addLog,
    setWorkflowStep,
    // setActiveTab // Removed
}) => {
    // Moved the steps logic here from App.tsx
    const nextStepLocal = () => {
        const steps = [
            () => {
                addLog("[Agent B] Event received. Metadata validation complete.");
                setWorkflowStep(2);
            },
            () => {
                addLog("[Agent B] SAP Inventory Lookup: GASK-9921-X identified.");
                setWorkflowStep(3);
            },
            async () => { // Make this step async
                addLog("[Agent B] Verify Stock: Part confirmed in Warehouse TX-S-04.");
                try {
                    const data = await updateInventory('GASK-9921-X', -1); // Use the API function
                    if (data.newStockLevel !== undefined) {
                        setInventory(prev => prev.map(item =>
                            item.part_number === 'GASK-9921-X' ? { ...item, stock_level: data.newStockLevel, status: data.newStockLevel < 5 ? 'Low Stock' : 'Available' } : item
                        ));
                        addLog(`[Agent B] Stock for GASK-9921-X decremented. New stock: ${data.newStockLevel}`);
                    }
                } catch (error: any) {
                    addLog(`[Agent B] Network error decrementing stock: ${error.message}`);
                }
                setWorkflowStep(4);
            },
            () => {
                addLog("[Agent B] Load Balancing Optimization: Recalculating flow distribution.");
                setNodes(prev => prev.map(n => {
                    if (n.id === "COMP-TX-VALLEY-01") return { ...n, current: 0, status: "Maintenance" };
                    return { ...n, current: n.current + 8.5, status: "Active (Boosted)" };
                }));
                setWorkflowStep(5);
            },
            () => {
                addLog("[Agent B] Orchestration & Notify: Dispatched alerts to operations.");
                setWorkflowStep(6);
            },
            () => {
                addLog("[Agent B] Execution Phase: Field team performing valve replacement.");
                setWorkflowStep(7);
            },
            () => {
                addLog("[Agent B] Safety & QA Closure: Awaiting digital signature...");
                setWorkflowStep(8);
            }
        ];
        if (steps[workflowStep - 1]) steps[workflowStep - 1]();
    };

    return (
        <div className="flex flex-col h-full gap-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-1">Automated Maintenance Lifecycle</h2>
                    <p className="text-zinc-500 text-sm font-medium">Active Instance: <span className="text-orange-500 font-bold uppercase tracking-wider">{activeWorkflow?.asset_id || 'COMP-TX-VALLEY-01'}</span></p>
                </div>
                <div className="bg-blue-600/10 text-blue-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-blue-500/20 flex items-center gap-2 uppercase tracking-widest">
                    <Zap size={14} fill="currentColor" /> Agent B Active
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                {/* Workflow Timeline */}
                {/* Workflow Timeline */}
                <div className="bg-[#1c1a16] border border-zinc-800/50 rounded-3xl p-6 flex flex-col overflow-hidden">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <GitBranch size={16} className="text-orange-500" /> Workflow Timeline
                    </h3>
                    <div className="h-[360px] overflow-y-auto pr-3 custom-scrollbar relative flex flex-col gap-2.5">
                        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-zinc-800/50"></div>

                        {[
                            { id: 1, title: 'Event Received', desc: 'Vibration spike detected at 04:12 UTC' },
                            { id: 2, title: 'SAP Inventory Lookup', desc: 'GASK-9921-X Found in Region 4' },
                            { id: 3, title: 'Verify Stock', desc: '14 units available in TX-S-04' },
                            { id: 4, title: 'Load Balancing Optimization', desc: 'Recalculating flow distribution...' },
                            { id: 5, title: 'Orchestration & Notify', desc: 'Alerts dispatched to Ops and Field Teams' },
                            { id: 6, title: 'Execution Phase', desc: 'Replacement in progress (Est. 42 min)' },
                            { id: 7, title: 'Safety & QA Closure', desc: 'Awaiting digital signature' },
                        ].map((step) => {
                            const isCompleted = workflowStep >= step.id;
                            const isActive = step.id === workflowStep + 1 || (step.id === 7 && workflowStep === 7);
                            const isFuture = !isCompleted && !isActive;

                            return (
                                <div key={step.id} className={`relative flex w-full items-center justify-between rounded-xl border pl-8 pr-4 py-2 transition-all ${
                                    isCompleted ? 'bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-800/30' :
                                    isActive ? 'bg-zinc-800/30 border-orange-500/50 shadow-md shadow-orange-500/5' :
                                    'bg-zinc-900/10 border-zinc-800/30 opacity-60'
                                }`}>
                                    {/* Connector Line */}
                                    {!isFuture && (
                                        <div className={`absolute left-0 top-0 w-0.5 ${
                                            isCompleted ? 'h-full bg-emerald-500' : 'h-full bg-gradient-to-b from-emerald-500 to-orange-500'
                                        }`}></div>
                                    )}

                                    {/* Icon */}
                                    <div className={`absolute left-[3px] flex h-4 w-4 items-center justify-center rounded-full bg-[#1c1a16] border-2 ${
                                        isCompleted ? 'border-emerald-500 text-emerald-500' :
                                        isActive ? 'border-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.3)]' :
                                        'border-zinc-700'
                                    }`}>
                                        {isCompleted ? (
                                            <CheckCircle size={10} />
                                        ) : isActive ? (
                                            <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                                        ) : null}
                                    </div>

                                    {/* Content Left */}
                                    <div className="flex flex-col">
                                        <h4 className={`text-xs font-bold ${isCompleted ? 'text-white' : isActive ? 'text-orange-500' : 'text-zinc-500'}`}>
                                            {step.id}. {step.title}
                                        </h4>
                                        {isActive && (
                                            <p className="text-[9px] mt-0.5 text-zinc-400">
                                                {step.desc}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions / Right Side */}
                                    {isActive ? (
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 rounded bg-orange-500/10 px-2 py-0.5">
                                                <span className="h-1 w-1 rounded-full bg-orange-500 animate-ping"></span>
                                                <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">ACTIVE</span>
                                            </div>

                                            {step.id === workflowStep + 1 && workflowStep < 7 && (
                                                <button onClick={nextStepLocal} className="flex h-6 px-3 items-center justify-center rounded-md bg-orange-600 hover:bg-orange-500 text-black text-[9px] font-black uppercase tracking-widest transition-all shadow-md shadow-orange-900/20 gap-1.5">
                                                    Proceed <ArrowRight size={10} />
                                                </button>
                                            )}
                                            {step.id === 7 && workflowStep === 7 && (
                                                <button onClick={completeMaintenance} className="flex h-6 px-3 items-center justify-center rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-900/20 gap-1.5">
                                                    Finalize <CheckCircle size={10} />
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-[9px] text-zinc-600 font-medium">{step.desc}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side Panels */}
                <div className="flex flex-col gap-8">
                    <div className="bg-[#1c1a16] border border-zinc-800/50 rounded-3xl p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Package size={16} className="text-orange-500" /> SAP Inventory Detail
                            </h3>
                            <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-black px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">Stock Confirmed</span>
                        </div>
                        <div className="flex gap-8">
                            <div className="w-24 h-24 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-center">
                                <Layers size={44} className="text-zinc-700" />
                            </div>
                            <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-6">
                                <div>
                                    <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">Part Name</p>
                                    <p className="text-sm font-bold text-white tracking-tight">Compressor Gasket</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">SKUID</p>
                                    <p className="text-sm font-bold text-white tracking-tight">GASK-9921-X</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Stock Level</p>
                                    <p className="text-sm font-black text-emerald-500 tracking-tight">14 Units</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Warehouse</p>
                                    <p className="text-sm font-bold text-white tracking-tight">TX-S-04</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1c1a16] border border-zinc-800/50 rounded-3xl p-8 relative flex-1">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <GitBranch size={16} className="text-orange-500" /> Load Balancing Preview
                            </h3>
                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">Simulation Mode: Real-time Re-route</span>
                        </div>

                        <div className="flex-1 flex flex-col justify-center items-center py-4">
                            <div className="relative w-full h-40">
                                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200">
                                    <line x1="100" y1="100" x2="200" y2="50" stroke={workflowStep === 8 ? "#10b981" : "#333"} strokeWidth="1.5" strokeDasharray={workflowStep === 8 ? "0" : "5"} />
                                    <line x1="100" y1="100" x2="200" y2="150" stroke={workflowStep === 8 ? "#10b981" : "#333"} strokeWidth="1.5" strokeDasharray={workflowStep === 8 ? "0" : "5"} />
                                    <line x1="200" y1="50" x2="300" y2="100" stroke={workflowStep === 8 ? "#10b981" : "#2563eb"} strokeWidth="3" />
                                    <line x1="200" y1="150" x2="300" y2="100" stroke="#10b981" strokeWidth="3" />

                                    {/* VALLEY-01 (Faulty -> Healthy) */}
                                    <rect x="85" y="85" width="30" height="30" rx="6" fill={workflowStep === 8 ? "#10b981" : "#ef4444"} className={workflowStep === 8 ? "" : "animate-pulse"} />
                                    {workflowStep === 8 ? (
                                        <CheckCircle x="92" y="92" size={16} className="text-white" />
                                    ) : (
                                        <path d="M92 92 L108 108 M108 92 L92 108" stroke="white" strokeWidth="2" />
                                    )}

                                    {/* VALLEY-02 (Compensating -> Healthy) */}
                                    <rect x="185" y="35" width="30" height="30" rx="6" fill={workflowStep === 8 ? "#10b981" : "#2563eb"} />
                                    {workflowStep === 8 ? <CheckCircle x="192" y="42" size={16} className="text-white" /> : <Zap x="192" y="42" size={16} className="text-white" />}

                                    {/* VALLEY-03 (Compensating -> Healthy) */}
                                    <rect x="185" y="135" width="30" height="30" rx="6" fill="#10b981" />
                                    {workflowStep === 8 ? <CheckCircle x="192" y="142" size={16} className="text-white" /> : <Zap x="192" y="142" size={16} className="text-white" />}

                                    {/* Destination HUB */}
                                    <circle cx="310" cy="100" r="15" fill={workflowStep === 8 ? "#10b981" : "#333"} />
                                    <Play x="303" y="93" size={14} className={workflowStep === 8 ? "text-white" : "text-zinc-500"} />
                                </svg>

                                {/* Labels */}
                                <div className="absolute top-[45%] left-[5%] text-center">
                                    <p className="text-[10px] font-black text-white">VALLEY-01</p>
                                    <p className={`text-[9px] font-black uppercase tracking-tighter ${workflowStep === 8 ? "text-emerald-500" : "text-red-500"}`}>
                                        {workflowStep === 8 ? "100% HEALTHY" : "-94% LOAD"}
                                    </p>
                                </div>
                                <div className="absolute top-[10%] left-[55%] text-left">
                                    <p className="text-[10px] font-black text-white">VALLEY-02</p>
                                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter shadow-lg ${workflowStep === 8 ? "bg-emerald-500 text-white" : "bg-blue-600 text-white shadow-blue-600/30"}`}>
                                        {workflowStep === 8 ? "OPTIMAL" : "8.5% INCREASE"}
                                    </span>
                                </div>
                                <div className="absolute top-[75%] left-[55%] text-left">
                                    <p className="text-[10px] font-black text-white">VALLEY-03</p>
                                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter shadow-lg ${workflowStep === 8 ? "bg-emerald-500 text-white" : "bg-emerald-500 text-white shadow-emerald-600/30"}`}>
                                        {workflowStep === 8 ? "OPTIMAL" : "+8.5% INCREASE"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-zinc-800/50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                <p className="text-[10px] font-bold text-zinc-600 uppercase italic tracking-tighter">Agent B is calculating optimal flow for TX Grid Section 04...</p>
                            </div>
                            <button className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-400 transition-colors">View Full Schematic</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full-Width Decoupled Execution Console */}
            <div className="h-72 flex flex-col">
                <ExecutionConsole logs={logs} />
            </div>
        </div>
    );
};

export default WorkflowView;
