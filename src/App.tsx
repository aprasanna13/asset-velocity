import { useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import logo from './assets/Logo.png';
import {
    Activity,
    AlertTriangle,
    Settings,
    Search,
    Bell,
    User,
    Zap,
    GitBranch,
    Package,
    Shield
} from 'lucide-react';

import { ScadaData, PipelineNode, ExecutionLog, EvidencePayload } from '@src/types';
import SidebarItem from '@src/components/layout/SidebarItem';
import DashboardView from '@src/features/scada-triage/components/DashboardView';
import InventoryView from '@src/features/maintenance/components/InventoryView';
import AlertsView from '@src/features/scada-triage/components/AlertsView';
import WorkflowView from '@src/features/maintenance/components/WorkflowView';
import TopologyView from '@src/features/topology/components/TopologyView';
import { HandoffContainer } from '@src/features/handoff/HandoffContainer';
import { parseRawLogToStructured } from './components/ExecutionConsole/LogAdapter';
import useInventory from '@src/hooks/useInventory';
import Login from '@src/components/auth/Login';
import CommandCenter from './features/command-center/components/CommandCenter';
import { AppNotification } from './features/command-center/types';
import { SettingsModal } from './components/settings/SettingsModal';
import { ChallengeModal } from './components/auth/ChallengeModal';
import { ExplainabilityModal } from './components/explainability/ExplainabilityModal';
import { useSafetyGuardrails } from './hooks/useSafetyGuardrails';
import { mockNotifications, initialOverrideLogs } from './mockData';

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


const INITIAL_NOTIFICATIONS: AppNotification[] = [
    {
        id: 'notif-1',
        priority: 'critical',
        timestamp: new Date().toISOString(),
        message: 'Critical anomaly detected on COMP-TX-VALLEY-01. Temperature high.',
        asset_info: { id: 'COMP-TX-VALLEY-01', location: 'Texas Valley' },
        actions: [{ label: 'Acknowledge' }, { label: 'Assign' }],
        status: 'unread'
    },
    {
        id: 'notif-2',
        priority: 'warning',
        timestamp: new Date().toISOString(),
        message: 'Triage Latency exceeding 5s warning.',
        status: 'unread'
    },
    {
        id: 'notif-3',
        priority: 'info',
        timestamp: new Date().toISOString(),
        message: 'System connection stable.',
        status: 'unread'
    }
];

export const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
    const [notifications, setNotifications] = useState<AppNotification[]>([...mockNotifications, ...INITIAL_NOTIFICATIONS]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stream, setStream] = useState<ScadaData[]>(INITIAL_SCADA_STREAM);
    const [alerts, setAlerts] = useState<ScadaData[]>([]);
    const [activeWorkflow, setActiveWorkflow] = useState<ScadaData | null>(null);
    const [workflowStep, setWorkflowStep] = useState(0);
    const [logs, setLogs] = useState<ExecutionLog[]>([]);
    const [nodes, setNodes] = useState<PipelineNode[]>(INITIAL_PIPELINE_NODES);
    const { inventory, setInventory } = useInventory(); // Using custom hook

    // Safety Guardrails State
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const [isExplainOpen, setIsExplainOpen] = useState<boolean>(false);
    const [activeEvidence, setActiveEvidence] = useState<EvidencePayload | null>(null);

    const {
        isChallengeOpen,
        setIsChallengeOpen,
        interceptAction,
        validatePin
    } = useSafetyGuardrails(initialOverrideLogs);

    useEffect(() => {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const address = new PublicKey('6c5yNnYHj38Q7m5o43RjY7eX8zW1hL8KxZ2b7c4g5m6'); // Replace with a valid Solana address
        connection.getBalance(address).then(balance => {
            console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
        });
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

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
        try {
            const rawString = `[${new Date().toLocaleTimeString()}] ${msg}`;
            const structured = parseRawLogToStructured(rawString);
            setLogs(prev => {
                const updated = [...prev, structured];
                return updated.slice(-50);
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
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
            {!isAuthenticated && <Login onLogin={handleLogin} />}
            
            {isAuthenticated && (
                <>
                    {/* Sidebar */}
                    <div className={`w-64 border-r flex flex-col p-6 z-20 bg-[#0d0d0d] border-zinc-900`}>
                        <div className="flex items-center gap-3 mb-12">
                            <div className="bg-orange-600 p-1.5 rounded-lg shadow-lg shadow-orange-900/20">
                                <img src={logo} alt="Field Operations Logo" className="w-5 h-5" />
                            </div>
                            <h1 className={`font-black tracking-[0.2em] text-sm text-white uppercase`}>Field Operations</h1>
                        </div>

                        <nav className="flex-1 -mx-2">
                            <SidebarItem icon={Activity} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                            <SidebarItem icon={Shield} label="Handoff" active={activeTab === 'handoff'} onClick={() => setActiveTab('handoff')} />
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
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Agentic Asset POC</span>
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
                                    <div 
                                        onClick={() => setIsCommandCenterOpen(true)}
                                        className="relative cursor-pointer text-zinc-400 hover:text-white transition-colors"
                                    >
                                        <Bell size={20} />
                                        {notifications.some(n => n.status === 'unread') && (
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-600 rounded-full border-2 border-[#0d0d0d]"></div>
                                        )}
                                    </div>
                                    <div 
                                        onClick={() => setIsSettingsOpen(true)}
                                        className={`p-2 rounded-xl cursor-pointer transition-colors border bg-zinc-900 border-zinc-800 hover:bg-zinc-800`}
                                    >
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
                                <DashboardView stream={stream} alerts={alerts} startWorkflow={startWorkflow} />
                            )}

                            {/* HANDOFF TAB */}
                            {activeTab === 'handoff' && (
                                <HandoffContainer />
                            )}

                            {/* INVENTORY TAB */}
                            {activeTab === 'inventory' && (
                                <InventoryView
                                    inventory={inventory}
                                    setInventory={setInventory}
                                    addLog={addLog}
                                />
                            )}

                            {/* ANOMALIES TAB (Agent A) - Image 1 */}
                            {activeTab === 'alerts' && (
                                <AlertsView
                                    alerts={alerts}
                                    activeWorkflow={activeWorkflow}
                                    startWorkflow={startWorkflow}
                                />
                            )}

                            {/* AGENTIC ENGINE (Tab 'workflow') - Image 2 */}
                            {activeTab === 'workflow' && (
                                <WorkflowView
                                    activeWorkflow={activeWorkflow}
                                    workflowStep={workflowStep}
                                    logs={logs}
                                    completeMaintenance={completeMaintenance}
                                    setNodes={setNodes}
                                    // INITIAL_PIPELINE_NODES={INITIAL_PIPELINE_NODES} // Removed
                                    setInventory={setInventory}
                                    addLog={addLog}
                                    setWorkflowStep={setWorkflowStep}
                                    // setActiveTab={setActiveTab} // Removed
                                />
                            )}

                            {/* PIPELINE TOPOLOGY (Tab 'nodes') - Image 3 */}
                            {activeTab === 'nodes' && (
                                <TopologyView
                                    alerts={alerts}
                                    nodes={nodes}
                                    workflowStep={workflowStep}
                                />
                            )}
                         </main>
                    </div>

                    <CommandCenter
                        isOpen={isCommandCenterOpen}
                        onClose={() => setIsCommandCenterOpen(false)}
                        notifications={notifications}
                        onAcknowledge={(id) => {
                            setNotifications(prev => prev.filter(n => n.id !== id));
                        }}
                        onAssign={(id, agentId) => {
                            addLog(`[Command Center] Notification ${id} assigned to agent ${agentId}`);
                            setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'acknowledged' } : n));
                        }}
                        onStopSimulation={() => {
                            setIsSimulating(false);
                            addLog(`[Command Center] User stopped simulation session.`);
                        }}
                        isSimulating={isSimulating}
                        onWhyClick={(evidence) => {
                            setActiveEvidence(evidence);
                            setIsExplainOpen(true);
                        }}
                        onMitigateClick={(assetId) => {
                            if (interceptAction('Execute Mitigation', assetId, true)) {
                                // Intercepted and opened challenge modal
                            }
                        }}
                    />

                    <SettingsModal
                        isOpen={isSettingsOpen}
                        onClose={() => setIsSettingsOpen(false)}
                    />

                    <ChallengeModal
                        isOpen={isChallengeOpen}
                        onClose={() => setIsChallengeOpen(false)}
                        onSubmit={(pin, justification) => {
                            const success = validatePin(pin, justification);
                            if (success) {
                                addLog(`[Guardrail] Supervisor authorized mitigation override.`);
                                // Here we would normally proceed with the mitigation
                            }
                            return success;
                        }}
                    />

                    <ExplainabilityModal
                        isOpen={isExplainOpen}
                        onClose={() => setIsExplainOpen(false)}
                        evidence={activeEvidence}
                    />

                    {/* Alert Passthrough Mechanism */}
                    {isSettingsOpen && notifications.some(n => n.priority === 'critical' && n.status === 'unread') && (
                        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] bg-red-600 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-2xl border-2 border-white flex items-center gap-3 animate-bounce">
                            <span>🚨 CRITICAL PIPELINE ANOMALY DETECTED! CLOSE SETTINGS IMMEDIATELY!</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
