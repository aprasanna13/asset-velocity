import React from 'react';
import { X } from 'lucide-react';
import { ExecutionLog } from '../../types';

interface LogDetailModalProps {
    log: ExecutionLog;
    onClose: () => void;
}

export const LogDetailModal: React.FC<LogDetailModalProps> = ({ log, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-black/80 flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-black tracking-widest uppercase
                            ${log.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                              log.severity === 'Warning' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                              'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                            {log.severity}
                        </span>
                        <span className="text-sm font-bold text-white">{log.agent}</span>
                        <span className="text-xs text-zinc-500">{log.timestamp}</span>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
                    <div>
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Message</h4>
                        <p className="text-sm text-zinc-200 font-mono bg-zinc-900/50 p-3 rounded-lg border border-zinc-900">
                            {log.message}
                        </p>
                    </div>

                    {log.payload && (
                        <div className="flex-1 flex flex-col">
                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Technical Payload</h4>
                            <pre className="flex-1 bg-zinc-950 p-4 rounded-lg border border-zinc-900 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed shadow-inner">
                                {JSON.stringify(log.payload, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
