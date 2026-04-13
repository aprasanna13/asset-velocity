import React from 'react';
import { X, HelpCircle } from 'lucide-react';
import { EvidencePayload } from '../../types';

interface ExplainabilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    evidence: EvidencePayload | null;
}

export const ExplainabilityModal: React.FC<ExplainabilityModalProps> = ({ isOpen, onClose, evidence }) => {
    if (!isOpen || !evidence) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-[550px] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 text-white flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-2 text-blue-400">
                        <HelpCircle size={24} />
                        <h2 className="text-lg font-black tracking-wider uppercase">Anomaly Explainability</h2>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-col gap-5">
                    {/* Formula */}
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Evaluation Formula</span>
                        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl font-mono text-sm text-orange-400">
                            {evidence.formula}
                        </div>
                    </div>

                    {/* Variables Table */}
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Dynamic Variables</span>
                        <div className="border border-zinc-800 rounded-xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-800/50 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                                        <th className="p-3 font-bold">Variable</th>
                                        <th className="p-3 font-bold">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(evidence.variables).map(([key, val], idx) => (
                                        <tr key={key} className={`text-sm border-b border-zinc-800/50 ${idx % 2 === 0 ? 'bg-zinc-900/20' : 'bg-zinc-950/40'}`}>
                                            <td className="p-3 text-zinc-300 font-medium">{key}</td>
                                            <td className="p-3 font-mono text-blue-400">{val}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Confidence Score */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
                            <span>Confidence Score</span>
                            <span className="text-blue-400">{evidence.confidence_score}%</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                style={{ width: `${evidence.confidence_score}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end pt-4 border-t border-zinc-800">
                    <button
                        onClick={onClose}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
