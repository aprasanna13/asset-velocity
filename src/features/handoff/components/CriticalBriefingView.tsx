import React, { useState } from 'react';
import { HandoffEvent } from '../../../types';

/**
 * CriticalBriefingView
 * Displays all high-severity operational hazards requiring explicit operator acknowledgment.
 * Integrates accountability PIN validation to complete the shift handover.
 */
interface Props {
    events: HandoffEvent[];
    acknowledgedIds: Set<string>;
    onAcknowledge: (id: string) => void;
    onSubmitAudit: (pin: string) => Promise<boolean>;
    onReject: () => void;
}

export const CriticalBriefingView: React.FC<Props> = ({
    events,
    acknowledgedIds,
    onAcknowledge,
    onSubmitAudit,
    onReject
}) => {
    // Local state tracking authentication challenge input and submission errors
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Group incoming active hazards by their specific plant subsystem to minimize cognitive load
    const grouped = events.reduce((acc, evt) => {
        if (!acc[evt.subsystem]) acc[evt.subsystem] = [];
        acc[evt.subsystem].push(evt);
        return acc;
    }, {} as Record<string, HandoffEvent[]>);

    // Validate that every critical item has been explicitly acknowledged by the user
    const allAcknowledged = events.every(e => acknowledgedIds.has(e.id));

    /**
     * handleSubmit
     * Triggers the final API audit payload and manages success/error feedback state.
     */
    const handleSubmit = async () => {
        setError('');
        try {
            await onSubmitAudit(pin);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Audit failed');
        }
    };

    return (
        <div className="space-y-6">
            {/* High-priority visual indicator marking the active state of the handoff view */}
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <h2 className="text-sm font-black text-red-500 tracking-widest uppercase">Critical Operational Briefing</h2>
            </div>
            
            {/* Render a permanent green audit banner upon a successful authentication sign-off */}
            {success ? (
                <div className="p-6 bg-green-950/30 border border-green-800/50 text-green-400 rounded-2xl font-black tracking-wide text-xs uppercase flex items-center gap-4 shadow-inner">
                    <span className="text-2xl">✓</span> SHIFT ASSUMPTION COMPLETED SUCCESSFULLY. LIABILITY AUDIT RECORDED SECURELY.
                </div>
            ) : (
                <>
                    {/* Map through each categorized plant subsystem group independently */}
                    {Object.entries(grouped).map(([subsystem, items]) => (
                        <div key={subsystem} className="border border-zinc-800/80 rounded-2xl p-6 bg-zinc-900/20 shadow-2xl backdrop-blur-sm">
                            {/* Subsystem Title header with inline structural badge lock */}
                            <h3 className="text-xs font-black mb-4 border-b border-zinc-800 pb-3 text-zinc-400 tracking-widest uppercase flex items-center justify-between">
                                <span>{subsystem}</span>
                                <span className="text-[9px] font-bold bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">Subsystem Lock</span>
                            </h3>
                            
                            <div className="space-y-4">
                                {/* Map through every un-acknowledged hazard item in this subsystem */}
                                {items.map(evt => {
                                    const isAck = acknowledgedIds.has(evt.id);
                                    return (
                                        <div key={evt.id} className={`p-5 rounded-xl border transition-all ${isAck ? 'bg-zinc-900/40 border-zinc-800/50 opacity-70' : 'bg-red-950/20 border-red-900/50 shadow-lg shadow-red-950/20'}`}>
                                            <div className="flex justify-between items-start gap-4">
                                                
                                                {/* Descriptive context block showing timestamp and severity ratings */}
                                                <div className="flex-1">
                                                    <span className={`inline-block px-2.5 py-1 text-[9px] font-black rounded mr-3 tracking-wider ${isAck ? 'bg-zinc-800 text-zinc-500' : 'bg-red-600 text-white animate-pulse'}`}>
                                                        SEVERITY: {evt.severity}
                                                    </span>
                                                    <span className={`font-black text-sm tracking-wide ${isAck ? 'text-zinc-400 line-through' : 'text-white'}`}>{evt.title}</span>
                                                    <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{evt.description}</p>
                                                    <span className="text-[9px] text-zinc-600 block mt-4 font-mono tracking-tighter">DETECTED: {new Date(evt.timestamp).toLocaleString()}</span>
                                                </div>
                                                
                                                {/* Conditional validation trigger based on item review state */}
                                                {!isAck ? (
                                                    <button 
                                                        onClick={() => onAcknowledge(evt.id)}
                                                        className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-black shadow-lg tracking-widest uppercase transition-all active:scale-95 whitespace-nowrap"
                                                    >
                                                        Acknowledge Hazard
                                                    </button>
                                                ) : (
                                                    <span className="text-emerald-500 font-black flex items-center gap-2 text-[10px] tracking-wider uppercase bg-emerald-950/30 border border-emerald-800/50 px-4 py-2 rounded-xl shadow-inner">
                                                        ✓ Verified
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Bottom control interface for security PIN submission and handoff rejection */}
                    <div className="border-t border-zinc-800/80 pt-6 mt-8 flex flex-col items-end space-y-4">
                        <div className="flex items-center space-x-4 w-full md:w-auto">
                            <input 
                                type="password" 
                                placeholder="Enter Shift PIN (e.g. 1234)" 
                                className="border border-zinc-800 bg-zinc-900/80 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-center font-mono text-xs tracking-[0.3em] text-white placeholder-zinc-600"
                                value={pin}
                                onChange={e => setPin(e.target.value)}
                            />
                            <button 
                                onClick={handleSubmit}
                                disabled={!allAcknowledged || !pin}
                                className={`px-8 py-3 font-black text-white rounded-xl text-xs tracking-widest uppercase shadow-lg transition-all ${allAcknowledged && pin ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-900/20 active:scale-95' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-800'}`}
                            >
                                Assume Command
                            </button>
                            <button 
                                onClick={onReject}
                                className="px-6 py-3 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-xl font-black hover:bg-zinc-700 shadow-lg tracking-widest uppercase text-xs transition-all active:scale-95"
                            >
                                Reject Handoff
                            </button>
                        </div>
                        
                        {/* Feedback text displaying mandatory sign-off requirements during triage */}
                        {!allAcknowledged && (
                            <p className="text-[10px] text-red-400 font-black tracking-widest uppercase animate-pulse">
                                ⚠️ You must explicitly acknowledge all hazards before assuming shift command.
                            </p>
                        )}
                        {error && <p className="text-[10px] text-red-500 font-black tracking-wider uppercase">{error}</p>}
                    </div>
                </>
            )}
        </div>
    );
};
