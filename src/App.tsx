import { useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import logo from './assets/Logo.png';
import {
    Activity,
    AlertTriangle,
    Settings,
    Database,
    CheckCircle,
    Clock,
    ArrowRight,
    BarChart3,
    Package,
    Search,
    Bell,
    User,
    History,
    Zap,
    GitBranch,
    Play,
    Layers,
    Plus,
    ShieldCheck
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface ScadaData {
    id: number;
    timestamp: string;
    asset_id: string;
    psi: number;
    temp: number;
    vibration: number;
    status: "Normal" | "Critical Alert" | "Maintenance" | "Active";
}

interface InventoryItem {
    id: number;
    model_compatibility: string;
    part_number: string;
    description: string;
    stock_level: number;
    lead_time_days: number;
    warehouse_id: string;
    status?: "Low Stock" | "Available"; // Add status for frontend display
}

interface PipelineNode {
    id: string;
    current: number;
    max: number;
    role: "Primary" | "Backup" | "Distribution";
    status: "Active" | "Maintenance" | "Active (Boosted)" | "Normal" | "Compensating";
    name: string;
}


// --- MOCK DATA ---
const INITIAL_SCADA_STREAM: ScadaData[] = [
    { id: 1, timestamp: "2026-02-18T14:00:00Z", asset_id: "COMP-TX-VALLEY-01", psi: 855, temp: 112, vibration: 0.02, status: "Normal" },
    { id: 2, timestamp: "2026-02-18T14:05:00Z", asset_id: "COMP-TX-VALLEY-01", psi: 852, temp: 114, vibration: 0.02, status: "Normal" },
    { id: 4, timestamp: "2026-02-18T14:12:00Z", asset_id: "COMP-TX-VALLEY-02", psi: 850, temp: 110, vibration: 0.01, status: "Normal" }
];

const INITIAL_PIPELINE_NODES: PipelineNode[] = [
    { id: "COMP-TX-VALLEY-01", name: "NODE 01", current: 100, max: 120, role: "Primary", status: "Active" },
    { id: "COMP-TX-VALLEY-02", name: "NODE 02", current: 100, max: 125, role: "Backup", status: "Active" },
    { id: "COMP-TX-VALLEY-03", name: "NODE 03", current: 100, max: 125, role: "Backup", status: "Active" }
];


// --- COMPONENTS ---

const StatusBadge = ({ status }: { status: ScadaData['status'] }) => {
    const styles: Record<ScadaData['status'], string> = {
        "Normal": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        "Critical Alert": "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse",
        "Maintenance": "bg-amber-500/10 text-amber-400 border-amber-500/20",
        "Active": "bg-blue-500/10 text-blue-400 border-blue-500/20"
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${styles[status] || styles["Normal"]}`}>
            {status === 'Critical Alert' ? 'TRIAGE' : status === 'Normal' ? 'IDLE' : status}
        </span>
    );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: React.ElementType, label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${active
            ? 'bg-orange-500/10 text-orange-500 border-r-2 border-orange-500'
            : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
            } mb-1`}
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
    const [nodes, setNodes] = useState<PipelineNode[]>(INITIAL_PIPELINE_NODES);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);

    useEffect(() => {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const address = new PublicKey('6c5yNnYHj38Q7m5o43RjY7eX8zW1hL8KxZ2b7c4g5m6'); // Replace with a valid Solana address
        connection.getBalance(address).then(balance => {
            console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
        });
    }, []);

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
        setActiveTab('alerts');
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
                addLog("[Agent B] Event received. Metadata validation complete.");
                setWorkflowStep(2);
            },
            () => {
                addLog("[Agent B] SAP Inventory Lookup: GASK-9921-X identified.");
                setWorkflowStep(3);
            },
            () => {
                addLog("[Agent B] Verify Stock: Part confirmed in Warehouse TX-S-04.");
                // Trigger backend PATCH request to decrement stock
                fetch('http://localhost:3001/api/inventory/GASK-9921-X', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantity: -1 }) // Decrement stock by 1
                })
                .then(response => response.json())
                .then(data => {
                    if (data.newStockLevel !== undefined) {
                        setInventory(prev => prev.map(item =>
                            item.part_number === 'GASK-9921-X' ? { ...item, stock_level: data.newStockLevel, status: data.newStockLevel < 5 ? 'Low Stock' : 'Available' } : item
                        ));
                        addLog(`[Agent B] Stock for GASK-9921-X decremented. New stock: ${data.newStockLevel}`);
                    } else if (data.error) {
                        addLog(`[Agent B] Error decrementing stock: ${data.error}`);
                    }
                })
                .catch(error => addLog(`[Agent B] Network error decrementing stock: ${error.message}`));
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

    const completeMaintenance = () => {
        if (!activeWorkflow) return;
        addLog("[Agent B] Safety Verified. Closing ticket and returning unit to Primary role.");
        setNodes(INITIAL_PIPELINE_NODES);
        setWorkflowStep(8);
        setAlerts(prev => prev.filter(a => a.id !== activeWorkflow.id));
        setStream(prev => prev.map(item => item.id === activeWorkflow.id ? { ...item, status: 'Normal', psi: 850, vibration: 0.02 } : item));
    };

    return (
        <div className={`flex h-screen font-sans selection:bg-orange-500/30 overflow-hidden bg-[#0d0d0d] text-zinc-400`}>
            {/* Sidebar */}
            <div className={`w-64 border-r flex flex-col p-6 z-20 bg-[#0d0d0d] border-zinc-900`}>
                <div className="flex items-center gap-3 mb-12">
                    <div className="bg-orange-600 p-1.5 rounded-lg shadow-lg shadow-orange-900/20">
                        <img src={logo} alt="Velocity Logo" className="w-5 h-5 invert brightness-0" />
                    </div>
                    <h1 className={`font-black tracking-tighter text-xl text-white`}>Velocity</h1>
                </div>

                <nav className="flex-1 -mx-2">
                    <SidebarItem icon={Activity} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <SidebarItem icon={AlertTriangle} label="Anomalies" active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} />
                    <SidebarItem icon={Zap} label="Agentic Engine" active={activeTab === 'workflow'} onClick={() => setActiveTab('workflow')} />
                    <SidebarItem icon={Package} label="Inventory" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
                    <SidebarItem icon={GitBranch} label="Pipeline" active={activeTab === 'nodes'} onClick={() => setActiveTab('nodes')} />
                </nav>

                <div className="mt-auto">
                    <div className="h-0.5 w-full bg-zinc-900 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-blue-600 w-2/3 shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>
                    </div>
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Agent A Active</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Header */}
                <header className={`h-20 flex items-center justify-between px-10 border-b z-10 bg-[#0d0d0d]/80 border-zinc-900/50 backdrop-blur-md`}>
                    <div className={`flex items-center gap-4 px-4 py-2 rounded-xl border w-96 bg-zinc-900/50 border-zinc-800/50`}>
                        <Search size={18} className="text-zinc-600" />
                        <input type="text" placeholder="Search Assets..." className={`bg-transparent border-none outline-none text-sm placeholder-zinc-600 w-full text-white`} />
                    </div>

                    <div className="flex items-center gap-10 text-right">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">Throughput</span>
                            <span className={`text-sm font-black tracking-tighter text-white`}>500.0 MMcf / d</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">Agents Online</span>
                            <span className={`text-sm font-black tracking-tighter text-white`}>24</span>
                        </div>

                        <button
                            onClick={simulateAnomaly}
                            className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-orange-900/20 active:scale-95"
                        >
                            Simulate Anomaly
                        </button>

                        <div className={`flex items-center gap-4 border-l pl-10 border-zinc-900`}>
                            <div className="relative cursor-pointer text-zinc-400 hover:text-white transition-colors">
                                <Bell size={20} />
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-600 rounded-full border-2 border-[#0d0d0d]"></div>
                            </div>
                            <div className={`p-2 rounded-xl cursor-pointer transition-colors border bg-zinc-900 border-zinc-800 hover:bg-zinc-800`}>
                                <Settings size={20} />
                            </div>
                            <div className="w-10 h-10 bg-orange-600/20 rounded-full border border-orange-500/20 flex items-center justify-center overflow-hidden cursor-pointer">
                                <User size={24} className="text-orange-500" />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    {/* DASHBOARD TAB */}
                    {activeTab === 'dashboard' && (
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
                                    <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Velocity Score</p>
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
                    )}

                    {/* INVENTORY TAB */}
                    {activeTab === 'inventory' && (
                        <div className="animate-in fade-in duration-500 space-y-8">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight mb-1">SAP Mock Inventory Lookup</h2>
                                    <p className="text-zinc-500 text-sm font-medium">Critical Spares & Maintenance Assets</p>
                                </div>
                                <button
                                    onClick={() => {
                                        fetch('http://localhost:3001/api/orders', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ part_number: 'GASK-9921-X', quantity: 10 }) // Example: Order 10 units of GASK-9921-X
                                        })
                                        .then(response => response.json())
                                        .then(data => {
                                            if (data.newStockLevel !== undefined) {
                                                setInventory(prev => prev.map(item =>
                                                    item.part_number === 'GASK-9921-X' ? { ...item, stock_level: data.newStockLevel, status: data.newStockLevel < 5 ? 'Low Stock' : 'Available' } : item
                                                ));
                                                addLog(`[Agent B] Ordered 10 units of GASK-9921-X. New stock: ${data.newStockLevel}`);
                                            } else if (data.error) {
                                                addLog(`[Agent B] Error ordering parts: ${data.error}`);
                                            }
                                        })
                                        .catch(error => addLog(`[Agent B] Network error ordering parts: ${error.message}`));
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
                                            <th className="px-8 py-4 text-center">Stock Level</th>
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
                    )}

                    {/* ANOMALIES TAB (Agent A) - Image 1 */}
                    {activeTab === 'alerts' && (
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
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
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
                                                {`> GET telemetry.val01.psi\n> 852.4, 850.1, 848.2, 645.0 [ALARM]\n> GET telemetry.val01.vib_rms\n> 0.12, 0.14, 0.42, 0.85 [CRIT]`}
                                            </pre>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button className="flex-1 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 py-3.5 rounded-2xl text-xs font-bold border border-zinc-800 transition-colors uppercase tracking-widest">View Raw SCADA</button>
                                        <button className="flex-1 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 py-3.5 rounded-2xl text-xs font-bold border border-zinc-800 transition-colors uppercase tracking-widest">Ignore False Positive</button>
                                        <button onClick={() => startWorkflow(alerts[0] || INITIAL_SCADA_STREAM[0])} className="flex-[1.5] bg-orange-600 hover:bg-orange-500 text-black py-3.5 rounded-2xl text-xs font-black transition-all shadow-xl shadow-orange-900/30 flex items-center justify-center gap-2 uppercase tracking-widest">
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
                    )}

                    {/* AGENTIC ENGINE (Tab 'workflow') - Image 2 */}
                    {activeTab === 'workflow' && (
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

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
                                {/* Workflow Timeline */}
                                <div className="bg-[#1c1a16] border border-zinc-800/50 rounded-3xl p-10 flex flex-col overflow-hidden">
                                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-10">
                                        <GitBranch size={16} className="text-orange-500" /> Workflow Timeline
                                    </h3>
                                    <div className="flex-1 space-y-12 relative overflow-y-auto pr-4 custom-scrollbar">
                                        <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-zinc-800/50"></div>

                                        {[
                                            { id: 1, title: 'Event Received', desc: 'Vibration spike detected at 04:12 UTC' },
                                            { id: 2, title: 'SAP Inventory Lookup', desc: 'GASK-9921-X Found in Region 4' },
                                            { id: 3, title: 'Verify Stock', desc: '14 units available in TX-S-04' },
                                            { id: 4, title: 'Load Balancing Optimization', desc: 'Recalculating flow distribution...' },
                                            { id: 5, title: 'Orchestration & Notify', desc: 'Alerts dispatched to Ops and Field Teams' },
                                            { id: 6, title: 'Execution Phase', desc: 'Replacement in progress (Est. 42 min)' },
                                            { id: 7, title: 'Safety & QA Closure', desc: 'Awaiting digital closure signature' },
                                        ].map((step) => (
                                            <div key={step.id} className="flex gap-8 relative z-10">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg ${workflowStep >= step.id ? 'bg-emerald-500 text-black shadow-emerald-900/20' : step.id === workflowStep + 1 ? 'bg-orange-500 text-black animate-pulse' : 'bg-zinc-900 text-zinc-600 border border-zinc-800'}`}>
                                                    {workflowStep >= step.id ? <CheckCircle size={18} /> : step.id}
                                                </div>
                                                <div className="flex-1 pt-1">
                                                    <h4 className={`text-base font-black tracking-tight ${workflowStep >= step.id ? 'text-white' : 'text-zinc-600'}`}>{step.title}</h4>
                                                    <p className={`text-xs mt-1 font-medium ${workflowStep >= step.id ? 'text-zinc-500' : 'text-zinc-700'}`}>{step.desc}</p>
                                                    
                                                    {/* Contextual Action Buttons */}
                                                    {step.id === workflowStep + 1 && workflowStep < 7 && (
                                                        <button onClick={nextStep} className="mt-4 bg-orange-600 hover:bg-orange-500 text-black px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-900/20 flex items-center gap-2">
                                                            Proceed to next step <ArrowRight size={12} />
                                                        </button>
                                                    )}
                                                    {step.id === 7 && workflowStep === 7 && (
                                                        <button onClick={completeMaintenance} className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2">
                                                            Finalize Maintenance <CheckCircle size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 pt-8 border-t border-zinc-800/50">
                                        <h4 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-4">Live Agent Event Logs</h4>
                                        <div className="h-32 overflow-y-auto space-y-2 pr-2 custom-scrollbar font-mono text-[10px]">
                                            {logs.length === 0 ? (
                                                <p className="text-zinc-700 italic">No agent activity logged.</p>
                                            ) : (
                                                logs.map((log, i) => (
                                                    <div key={i} className="text-zinc-500 border-l border-zinc-800 pl-3 py-0.5">
                                                        {log}
                                                    </div>
                                                ))
                                            )}
                                        </div>
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
                                                    <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">SKUID</p>
                                                    <p className="text-sm font-bold text-white tracking-tight">GASK-9921-X</p>
                                                </div>
                                                <div>
                                                    <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">Stock Level</p>
                                                    <p className="text-sm font-black text-emerald-500 tracking-tight">14 Units</p>
                                                </div>
                                                <div>
                                                    <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">Warehouse</p>
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
                        </div>
                    )}

                    {/* PIPELINE TOPOLOGY (Tab 'nodes') - Image 3 */}
                    {activeTab === 'nodes' && (
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
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
