import React, { useState } from 'react';
import { useHandoff } from '../../hooks/useHandoff';
import { CriticalBriefingView } from './components/CriticalBriefingView';
import { ShiftLogView } from './components/ShiftLogView';
import { InfluenceGraph } from './components/InfluenceGraph';
import { EmergencyInterceptOverlay } from './components/EmergencyInterceptOverlay';
import { DisputeModal } from './components/DisputeModal';

export const HandoffContainer: React.FC = () => {
    const {
        payload,
        loading,
        error,
        acknowledgedIds,
        acknowledgeEvent,
        submitAudit,
        submitRejection
    } = useHandoff();

    const [activeTab, setActiveTab] = useState<'critical' | 'routine'>('critical');
    const [showDispute, setShowDispute] = useState(false);
    const [showEmergency, setShowEmergency] = useState(false);
    const [isActive, setIsActive] = useState(false);

    if (loading) return <div className="p-6 text-zinc-500 font-mono text-sm animate-pulse">Loading Handoff Snapshot...</div>;
    if (error) return <div className="p-6 text-red-500 font-black tracking-wider text-sm">ERROR: {error}</div>;
    if (!payload) return <div className="p-6 text-zinc-600 font-mono text-sm">No operational payload detected.</div>;

    if (!isActive) {
        return (
            <div className="p-10 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl max-w-xl mx-auto my-12 text-center backdrop-blur-md shadow-2xl">
                <div className="w-12 h-12 bg-orange-600/20 rounded-xl border border-orange-500/30 flex items-center justify-center mx-auto mb-6 text-orange-500 text-xl">
                    🛡️
                </div>
                <h2 className="text-xl font-black text-white tracking-wide mb-2">END OF SHIFT: READY FOR HANDOFF</h2>
                <p className="text-xs text-zinc-400 mb-8 leading-relaxed">
                    The outgoing operator must trigger this briefing to lock the current operational telemetry and transfer system command to the incoming shift safely.
                </p>
                <button 
                    onClick={() => setIsActive(true)}
                    className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-xl shadow-lg shadow-orange-900/20 tracking-widest text-xs uppercase transition-all active:scale-95 w-full"
                >
                    Commence Operator Handoff
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto my-6 p-8 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl shadow-2xl backdrop-blur-sm relative">
            {/* Debug controls to demonstrate Emergency Intercept */}
            <div className="absolute top-6 right-6 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-[10px] shadow-inner flex items-center gap-3">
                <span className="font-black text-zinc-500 tracking-widest uppercase">Debug</span>
                <button 
                    onClick={() => setShowEmergency(true)}
                    className="px-3 py-1.5 bg-red-950 border border-red-800 text-red-400 rounded-lg font-black tracking-wider hover:bg-red-900 hover:text-white transition-colors"
                >
                    🚨 Trigger Emergency Alarm
                </button>
            </div>

            <div className="mb-8 border-b border-zinc-800/80 pb-6">
                <h1 className="text-2xl font-black text-white tracking-wider uppercase">Automated Operational Briefing</h1>
                <div className="flex items-center gap-6 mt-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    <span>Mode: <span className="text-orange-500 font-black">{payload.mode}</span></span>
                    <span>Threshold: <span className="text-white font-black">{payload.threshold}+</span></span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-3 mb-8">
                <button 
                    onClick={() => setActiveTab('critical')}
                    className={`px-6 py-3 font-black rounded-xl text-xs tracking-wider uppercase transition-all ${activeTab === 'critical' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'bg-zinc-900/80 text-zinc-500 border border-zinc-800/50 hover:text-zinc-300'}`}
                >
                    Critical Hazards (Action Required)
                </button>
                <button 
                    onClick={() => setActiveTab('routine')}
                    className={`px-6 py-3 font-black rounded-xl text-xs tracking-wider uppercase transition-all ${activeTab === 'routine' ? 'bg-zinc-700 text-white shadow-lg' : 'bg-zinc-900/80 text-zinc-500 border border-zinc-800/50 hover:text-zinc-300'}`}
                >
                    Full Shift Log
                </button>
            </div>

            {/* Tab Content */}
            <div className="mb-8">
                {activeTab === 'critical' ? (
                    <CriticalBriefingView 
                        events={payload.criticalEvents}
                        acknowledgedIds={acknowledgedIds}
                        onAcknowledge={acknowledgeEvent}
                        onSubmitAudit={submitAudit}
                        onReject={() => setShowDispute(true)}
                    />
                ) : (
                    <ShiftLogView events={payload.routineEvents} />
                )}
            </div>

            {/* Decision Logic Explainability */}
            <div className="mt-10">
                <InfluenceGraph decision={payload.decisionLogic} />
            </div>

            {/* Modals / Overlays */}
            {showEmergency && (
                <EmergencyInterceptOverlay onDismiss={() => setShowEmergency(false)} />
            )}

            {showDispute && (
                <DisputeModal 
                    onSubmit={submitRejection}
                    onCancel={() => setShowDispute(false)}
                />
            )}
        </div>
    );
};
