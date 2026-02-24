import { useState } from 'react';
import {
    Activity,
    AlertTriangle,
    Settings,
    Database,
    Navigation,
    CheckCircle,
    Clock,
    ArrowRight,
    BarChart3,
    Layers,
    Wrench,
    ShieldCheck,
    Package,
    Cpu,
    RefreshCcw,
    Plus,
    Radio
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface ScadaData {
    id: number;
    timestamp: string;
    asset_id: string;
    psi: number;
    temp: number;
    vibration: number;
    status: string;
}

interface SapInventory {
    model: string;
    part_number: string;
    description: string;
    stock_level: number;
    lead_time_days: number;
}

interface PipelineNode {
    id: string;
    current: number;
    max: number;
    role: string;
    status: string;
}

interface StatusBadgeProps {
    status: string;
}

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    active: boolean;
    onClick: () => void;
}


// --- MOCK DATA ---
const INITIAL_SCADA_STREAM: ScadaData[] = [
    { id: 1, timestamp: "2026-02-18T14:00:00Z", asset_id: "COMP-TX-VALLEY-01", psi: 855, temp: 112, vibration: 0.02, status: "Normal" },
    { id: 2, timestamp: "2026-02-18T14:05:00Z", asset_id: "COMP-TX-VALLEY-01", psi: 852, temp: 114, vibration: 0.02, status: "Normal" },
    { id: 4, timestamp: "2026-02-18T14:12:00Z", asset_id: "COMP-TX-VALLEY-02", psi: 850, temp: 110, vibration: 0.01, status: "Normal" }
];

const SAP_INVENTORY: SapInventory[] = [
    { model: "High-Flow Centrifugal", part_number: "GASK-9921-X", description: "Compressor Valve Gasket Kit", stock_level: 12, lead_time_days: 0 },
    { model: "High-Flow Centrifugal", part_number: "SEAL-HT-44", description: "High-Temp Main Shaft Seal", stock_level: 4, lead_time_days: 2 },
    { model: "High-Flow Centrifugal", part_number: "LUBE-SYN-Q", description: "Synthetic Lubricant (5 Gal)", stock_level: 25, lead_time_days: 0 }
];

const PIPELINE_NODES: PipelineNode[] = [
    { id: "COMP-TX-VALLEY-01", current: 100, max: 120, role: "Primary", status: "Active" },
    { id: "COMP-TX-VALLEY-02", current: 100, max: 125, role: "Backup", status: "Active" },
    { id: "COMP-TX-VALLEY-03", current: 100, max: 125, role: "Backup", status: "Active" }
];

// --- COMPONENTS ---

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const styles: { [key: string]: string } = {
        "Normal": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        "Critical Alert": "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse",
        "Maintenance": "bg-amber-500/10 text-amber-400 border-amber-500/20",
        "Active": "bg-blue-500/10 text-blue-400 border-blue-500/20"
    };
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styles[status] || styles["Normal"]}`}>
            {status}
        </span>
    );
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${active
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            } rounded-lg mb-1`}
    >
        <Icon size={18} />
        {label}
    </button>
);

const App = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stream, setStream] = useState<ScadaData[]>(INITIAL_SCADA_STREAM);
    const [alerts, setAlerts] = useState<ScadaData[]>([]);
    const [activeWorkflow, setActiveWorkflow] = useState<ScadaData | null>(null);
    const [workflowStep, setWorkflowStep] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [nodes, setNodes] = useState<PipelineNode[]>(PIPELINE_NODES);

    // Simulation Logic
    const simulateAnomaly = () => {
        const newAnomaly: ScadaData = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            asset_id: "COMP-TX-VALLEY-01",
            psi: 645,
            temp: 158,
            vibration: 0.85,
            status: "Critical Alert"
        };

        setStream(prev => [newAnomaly, ...prev]);
        setAlerts(prev => [newAnomaly, ...prev]);
        addLog(`[SCADA] High-frequency signal breach detected on COMP-TX-VALLEY-01. Vibration: 0.85mm.`);
    };

    const startWorkflow = (alert: ScadaData) => {
        setActiveWorkflow(alert);
        setWorkflowStep(1);
        setActiveTab('workflow');
        addLog(`[Agent A] Triage complete. Detected anomaly in ${alert.asset_id}. Passing to Agent B for lifecycle automation.`);
    };

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
    };

    const nextStep = () => {
        const steps = [
            () => {
                addLog("[Agent B] Accessing SAP API... Dependency lookup initiated.");
                setWorkflowStep(2);
            },
            () => {
                addLog("[Agent B] Inventory confirmed: GASK-9921-X in stock. Part reserved.");
                setWorkflowStep(3);
            },
            () => {
                addLog("[Agent B] Load Balancing: Increasing Backup Node output by 8.5% to maintain 500 MMcf/d.");
                setNodes(prev => prev.map(n => {
                    if (n.id === "COMP-TX-VALLEY-01") return { ...n, current: 0, status: "Maintenance" };
                    return { ...n, current: n.current + 8.5, status: "Active (Boosted)" };
                }));
                setWorkflowStep(4);
            },
            () => {
                addLog("[Agent B] Notifications dispatched to Field Ops and Maintenance teams.");
                setWorkflowStep(5);
            },
            () => {
                addLog("[Agent B] Waiting for digital safety signature...");
                setWorkflowStep(6);
            }
        ];
        if (steps[workflowStep - 1]) steps[workflowStep - 1]();
    };

    const completeMaintenance = () => {
        if (!activeWorkflow) return;
        addLog("[Agent B] Safety Verified. Closing ticket and returning unit to Primary role.");
        setNodes(PIPELINE_NODES);
        setWorkflowStep(7);
        setAlerts(prev => prev.filter(a => a.id !== activeWorkflow.id));
        setStream(prev => prev.map(item => item.id === activeWorkflow.id ? { ...item, status: 'Normal', psi: 850, vibration: 0.02 } : item));
    };

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
            {/* Sidebar */}
            <div className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col p-4">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Cpu size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-white tracking-tight">VELOCITY</h1>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Agentic Asset POC</p>
                    </div>
                </div>

                <nav className="flex-1">
                    <SidebarItem icon={Activity} label="Operational Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <SidebarItem icon={AlertTriangle} label="Anomaly Triage" active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} />
                    <SidebarItem icon={RefreshCcw} label="Workflow Engine" active={activeTab === 'workflow'} onClick={() => setActiveTab('workflow')} />
                    <SidebarItem icon={Package} label="SAP Inventory" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
                    <SidebarItem icon={Navigation} label="Pipeline Topology" active={activeTab === 'nodes'} onClick={() => setActiveTab('nodes')} />
                </nav>

                <div className="mt-auto p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-semibold text-slate-300">Agents Online</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">System processing 1.2k SCADA signals / sec.</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-slate-950">
                <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-sm font-semibold text-slate-400 capitalize">{activeTab.replace('_', ' ')}</h2>
                        {activeWorkflow && <div className="h-4 w-[1px] bg-slate-800"></div>}
                        {activeWorkflow && <span className="text-xs font-mono text-blue-400">Task: {activeWorkflow.asset_id}</span>}
                    </div>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={simulateAnomaly}
                            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-rose-900/20"
                        >
                            <Radio size={14} className="animate-pulse" />
                            Simulate Anomaly
                        </button>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Throughput</span>
                            <span className="text-xs font-mono text-emerald-400 font-bold">500.0 MMcf/d</span>
                        </div>
                        <div className="bg-slate-800 p-2 rounded-full cursor-pointer hover:bg-slate-700 transition-colors">
                            <Settings size={18} />
                        </div>
                    </div>
                </header>

                <main className="p-8 max-w-7xl mx-auto">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className={`bg-slate-900 border p-6 rounded-2xl transition-all duration-300 ${alerts.length > 0 ? 'border-rose-500/50 shadow-lg shadow-rose-900/20' : 'border-slate-800'}`}>
                                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Critical Anomalies</p>
                                    <p className={`text-4xl font-bold ${alerts.length > 0 ? 'text-rose-400' : 'text-white'}`}>{alerts.length}</p>
                                    <div className={`mt-4 flex items-center text-xs gap-1 font-medium ${alerts.length > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`}>
                                        <AlertTriangle size={14} /> {alerts.length > 0 ? 'Action Required' : 'System Clear'}
                                    </div>
                                </div>
                                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Velocity Score</p>
                                    <p className="text-4xl font-bold text-white">94%</p>
                                    <div className="mt-4 flex items-center text-xs text-emerald-400 gap-1 font-medium">
                                        <BarChart3 size={14} /> +2.4% Efficiency
                                    </div>
                                </div>
                                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Avg Triage Latency</p>
                                    <p className="text-4xl font-bold text-white">1.2s</p>
                                    <div className="mt-4 flex items-center text-xs text-blue-400 gap-1 font-medium">
                                        <Clock size={14} /> Headless Processing
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <Database size={18} className="text-blue-500" />
                                        Live SCADA Stream (Filtered)
                                    </h3>
                                    <button className="text-xs font-semibold text-blue-400 hover:text-blue-300">View History</button>
                                </div>
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-bold tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Timestamp</th>
                                            <th className="px-6 py-4">Asset ID</th>
                                            <th className="px-6 py-4">PSI</th>
                                            <th className="px-6 py-4">Temp (°F)</th>
                                            <th className="px-6 py-4">Vibration</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {
                                            stream.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors animate-in slide-in-from-top-1 duration-300">
                                                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{new Date(item.timestamp).toLocaleTimeString()}</td>
                                                    <td className="px-6 py-4 font-bold">{item.asset_id}</td>
                                                    <td className={`px-6 py-4 font-mono ${item.psi < 700 ? 'text-rose-400' : ''}`}>{item.psi}</td>
                                                    <td className={`px-6 py-4 font-mono ${item.temp > 150 ? 'text-rose-400' : ''}`}>{item.temp}</td>
                                                    <td className={`px-6 py-4 font-mono ${item.vibration > 0.5 ? 'text-rose-400 font-bold' : ''}`}>{item.vibration}mm</td>
                                                    <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                                                    <td className="px-6 py-4">
                                                        {
                                                            item.status === 'Critical Alert' ? (
                                                                <button
                                                                    onClick={() => startWorkflow(item)}
                                                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-900/20"
                                                                >
                                                                    Run Agent B <ArrowRight size={14} />
                                                                </button>
                                                            ) : <span className="text-slate-600">—</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {
                        activeTab === 'workflow' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="lg:col-span-2 space-y-6">
                                    {!activeWorkflow ? (
                                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 mb-2">
                                                <RefreshCcw size={32} />
                                            </div>
                                            <h3 className="text-xl font-bold">No Active Lifecycle Workflow</h3>
                                            <p className="text-slate-400 max-w-sm">Use the Dashboard to start a lifecycle automation for a detected critical anomaly.</p>
                                            <button onClick={() => { simulateAnomaly(); setActiveTab('dashboard'); }} className="text-blue-400 text-sm font-bold flex items-center gap-2">
                                                <Plus size={16} /> Simulate Anomaly to Begin
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                                            <div className="px-8 py-6 bg-slate-800/30 border-b border-slate-800">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-xl font-bold flex items-center gap-3 mb-1">
                                                            <Wrench className="text-blue-500" /> Maintenance Lifecycle: {activeWorkflow.asset_id}
                                                        </h3>
                                                        <p className="text-sm text-slate-400">Automated Optimization Workflow</p>
                                                    </div>
                                                    <StatusBadge status={workflowStep === 7 ? "Normal" : "Maintenance"} />
                                                </div>
                                            </div>

                                            <div className="p-8">
                                                <div className="relative">
                                                    <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-slate-800"></div>

                                                    {
                                                        [
                                                            { id: 1, title: 'Triage Packet Received', sub: 'Agent A handoff: Meta-data validated.', btn: 'Acknowledge Packet' },
                                                            { id: 2, title: 'SAP Inventory Lookup', sub: 'Confirming Part: GASK-9921-X.', btn: 'Verify Stock' },
                                                            { id: 3, title: 'Load Balancing Optimization', sub: 'Nodes COMP-TX-02/03 boosting output.', btn: 'Apply Re-balancing' },
                                                            { id: 4, title: 'Orchestration & Notify', sub: 'Maintenance window scheduled: 18:00.', btn: 'Dispatch Teams' },
                                                            { id: 5, title: 'Execution Phase', sub: 'Field personnel performing repairs.', btn: 'Inspect Repair' }
                                                        ].map((step) => (
                                                            <div key={step.id} className={`flex gap-6 mb-8 transition-opacity duration-300 ${workflowStep >= step.id ? 'opacity-100' : 'opacity-30'}`}>
                                                                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold ${workflowStep > step.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' : workflowStep === step.id ? 'bg-blue-600 text-white border-4 border-slate-900 shadow-lg shadow-blue-900/20' : 'bg-slate-800 text-slate-500'}`}>
                                                                    {workflowStep > step.id ? <CheckCircle size={18} /> : step.id}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-white">{step.title}</h4>
                                                                    <p className="text-sm text-slate-400">{step.sub}</p>
                                                                    {
                                                                        workflowStep === step.id && (
                                                                            <button onClick={nextStep} className="mt-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold border border-blue-500 flex items-center gap-2 transition-all active:scale-95">
                                                                                {step.btn} <ArrowRight size={14} />
                                                                            </button>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                        ))}

                                                    <div className={`flex gap-6 transition-opacity duration-300 ${workflowStep >= 6 ? 'opacity-100' : 'opacity-30'}`}>
                                                        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold ${workflowStep >= 7 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' : workflowStep === 6 ? 'bg-blue-600 text-white border-4 border-slate-900 shadow-lg shadow-blue-900/20' : 'bg-slate-800 text-slate-500'}`}>
                                                            {workflowStep >= 7 ? <CheckCircle size={18} /> : 6}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-white">Safety & QA Closure</h4>
                                                            <p className="text-sm text-slate-400 mb-4">Unit restart authorization required.</p>
                                                            {
                                                                workflowStep === 6 && (
                                                                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                                                        <label className="flex items-center gap-3 cursor-pointer group">
                                                                            <input type="checkbox" className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500" onChange={(e) => e.target.checked && completeMaintenance()} />
                                                                            <span className="text-sm font-medium group-hover:text-white transition-colors underline decoration-blue-500/30 underline-offset-4">Digitally verify safety check and close ticket</span>
                                                                        </label>
                                                                    </div>
                                                                )}
                                                            {
                                                                workflowStep === 7 && (
                                                                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium flex items-center gap-2">
                                                                        <ShieldCheck size={18} /> Asset Velocity Restored. Ticket Closed.
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[400px] flex flex-col">
                                        <h3 className="text-xs uppercase font-bold text-slate-500 tracking-widest mb-4 flex items-center gap-2">
                                            <Activity size={14} className="text-blue-500" />
                                            Agent Event Logs
                                        </h3>
                                        <div className="flex-1 overflow-auto space-y-3 font-mono text-[11px] leading-relaxed scrollbar-hide">
                                            {
                                                logs.length === 0 ? (
                                                    <p className="text-slate-700 italic">No activity detected.</p>
                                                ) : (
                                                    logs.map((log, i) => (
                                                        <div key={i} className="text-slate-300 border-l-2 border-slate-800 pl-3">
                                                            {log}
                                                        </div>
                                                    ))
                                                )}
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                        <h3 className="text-xs uppercase font-bold text-slate-500 tracking-widest mb-4">Pipeline Load Visual</h3>
                                        <div className="space-y-4">
                                            {
                                                nodes.map(node => (
                                                    <div key={node.id}>
                                                        <div className="flex justify-between text-xs mb-1 font-medium">
                                                            <span className="text-slate-400">{node.id}</span>
                                                            <span className={node.current > 100 ? 'text-blue-400' : 'text-slate-500'}>{node.current} / {node.max}</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all duration-1000 ${node.status.includes('Boosted') ? 'bg-blue-500' : node.status === 'Maintenance' ? 'bg-slate-700' : 'bg-slate-500'}`}
                                                                style={{ width: `${(node.current / node.max) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    {
                        activeTab === 'inventory' && (
                            <div className="animate-in fade-in duration-500">
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                                    <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between">
                                        <h3 className="text-xl font-bold">SAP Mock Inventory Lookup</h3>
                                        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-bold border border-slate-700">
                                            <Plus size={16} /> Order Parts
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-bold tracking-wider">
                                                <tr>
                                                    <th className="px-8 py-4">Model Compatibility</th>
                                                    <th className="px-8 py-4">Part #</th>
                                                    <th className="px-8 py-4">Description</th>
                                                    <th className="px-8 py-4">Stock Level</th>
                                                    <th className="px-8 py-4">Lead Time</th>
                                                    <th className="px-8 py-4">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800">
                                                {
                                                    SAP_INVENTORY.map((item, idx) => (
                                                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                                                            <td className="px-8 py-4 font-medium text-slate-300">{item.model}</td>
                                                            <td className="px-8 py-4 font-mono text-xs">{item.part_number}</td>
                                                            <td className="px-8 py-4 text-slate-400">{item.description}</td>
                                                            <td className="px-8 py-4 font-bold">{item.stock_level}</td>
                                                            <td className="px-8 py-4 text-slate-400">{item.lead_time_days === 0 ? 'Immediate' : `${item.lead_time_days} days`}</td>
                                                            <td className="px-8 py-4">
                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.stock_level > 5 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                                                    {item.stock_level > 5 ? 'Available' : 'Low Stock'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                    {
                        activeTab === 'alerts' && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                {
                                    alerts.length === 0 ? (
                                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-12 text-center">
                                            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle size={32} />
                                            </div>
                                            <h3 className="text-xl font-bold text-white">System Healthy</h3>
                                            <p className="text-slate-400">No anomalies detected. Use the Simulate button to trigger a lifecycle.</p>
                                        </div>
                                    ) : (
                                        alerts.map((alert, i) => (
                                            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-rose-900/10">
                                                <div className="px-8 py-6 border-b border-rose-500/20 bg-rose-500/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-rose-500 p-2 rounded-lg text-white">
                                                            <AlertTriangle size={20} />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold text-white">Triage Event: {alert.asset_id}</h3>
                                                            <p className="text-xs text-rose-400 font-medium tracking-tight">Vibration Breach: {alert.vibration}mm</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => startWorkflow(alert)}
                                                        className="bg-white text-slate-950 hover:bg-slate-200 px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95"
                                                    >
                                                        Launch Lifecycle Agent
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-4 gap-4 p-8">
                                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Asset Model</p>
                                                        <p className="text-sm font-semibold">High-Flow Centrifugal</p>
                                                    </div>
                                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Telemetry Origin</p>
                                                        <p className="text-sm font-semibold font-mono">VALLEY-ST-01</p>
                                                    </div>
                                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Observed PSI</p>
                                                        <p className="text-sm font-semibold text-rose-400 font-mono">{alert.psi}</p>
                                                    </div>
                                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Timestamp</p>
                                                        <p className="text-sm font-semibold font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                            </div>
                        )}

                    {
                        activeTab === 'nodes' && (
                            <div className="animate-in zoom-in-95 duration-500">
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-bold flex items-center gap-3">
                                            <Navigation className="text-blue-500" /> Permian-East-Line Topography
                                        </h3>
                                    </div>

                                    <div className="relative h-[400px] border border-slate-800 rounded-xl bg-slate-950 overflow-hidden flex items-center justify-center p-12">
                                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                                        <div className="relative w-full flex items-center justify-between max-w-4xl z-10">
                                            <div className="absolute h-1 top-1/2 left-0 right-0 bg-slate-800 -translate-y-1/2 -z-10"></div>

                                            {
                                                nodes.map((node) => (
                                                    <div key={node.id} className="relative group">
                                                        <div className={`w-32 h-32 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-500 ${node.status === 'Maintenance' ? 'bg-slate-900 border-rose-500/50 shadow-2xl shadow-rose-500/20' : node.status.includes('Boosted') ? 'bg-blue-900/30 border-blue-500/50' : 'bg-slate-800 border-slate-700 shadow-xl'}`}>
                                                            <div className={`p-2 rounded-lg mb-2 ${node.status === 'Maintenance' ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                                                                <Layers size={20} />
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{node.id}</span>
                                                            <span className="text-xs font-mono font-bold mt-1 tracking-tighter">{node.current.toFixed(1)} MMcf</span>
                                                        </div>
                                                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 text-center">
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{node.status}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                </main>
            </div>
        </div>
    );
};

export default App;
