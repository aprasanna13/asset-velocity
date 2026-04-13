import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ChallengeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (pin: string, justification: string) => boolean;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [pin, setPin] = useState('');
    const [justification, setJustification] = useState('');
    const [isShaking, setIsShaking] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!pin || !justification) {
            setError('Both PIN and justification are required.');
            triggerShake();
            return;
        }

        const success = onSubmit(pin, justification);
        if (!success) {
            setError('Invalid Supervisor PIN.');
            triggerShake();
            setPin('');
        } else {
            // Reset
            setPin('');
            setJustification('');
            setError('');
        }
    };

    const triggerShake = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div
                className={`relative w-[450px] bg-zinc-900 border border-orange-500/50 rounded-2xl shadow-2xl p-6 text-white flex flex-col gap-5 transition-transform duration-100 ${
                    isShaking ? 'translate-x-2 -translate-x-2' : ''
                }`}
                style={{
                    animation: isShaking ? 'shake 0.5s' : 'none',
                }}
            >
                {/* Inject shake keyframes inline for simplicity */}
                <style>
                    {`
                        @keyframes shake {
                            0%, 100% { transform: translateX(0); }
                            25% { transform: translateX(-10px); }
                            75% { transform: translateX(10px); }
                        }
                    `}
                </style>

                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-2 text-orange-500">
                        <AlertTriangle size={24} />
                        <h2 className="text-lg font-black tracking-wider uppercase">Supervisor Authorization Required</h2>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <p className="text-xs text-zinc-400 leading-relaxed">
                    This mitigation action exceeds standard automated safety limits. Please provide a supervisor PIN (1234) and a justification to proceed.
                </p>

                {error && <div className="text-xs font-bold text-red-500 bg-red-950/50 border border-red-900 p-2 rounded">{error}</div>}

                {/* Form Fields */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Supervisor PIN</label>
                        <input
                            type="password"
                            maxLength={4}
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white w-full focus:outline-none focus:border-orange-500 font-mono tracking-widest"
                            placeholder="****"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Justification</label>
                        <textarea
                            rows={3}
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handleSubmit()}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white w-full focus:outline-none focus:border-orange-500 resize-none"
                            placeholder="Enter reason for override..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                    <button
                        onClick={onClose}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-black px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-900/20"
                    >
                        Authorize Override
                    </button>
                </div>
            </div>
        </div>
    );
};
