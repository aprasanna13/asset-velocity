import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [idleTime, setIdleTime] = useState(0);

    // Form states (mocking persistence for now)
    const [threshold, setThreshold] = useState<number>(850);
    const [requirePin, setRequirePin] = useState<boolean>(true);
    const [highContrast, setHighContrast] = useState<boolean>(false);
    const [auditDest, setAuditDest] = useState<string>('Local Storage');

    useEffect(() => {
        if (!isOpen) {
            setIdleTime(0);
            return;
        }

        const timer = setInterval(() => {
            setIdleTime((prev) => {
                if (prev >= 60) {
                    onClose();
                    return 0;
                }
                return prev + 1;
            });
        }, 1000);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
            // Reset idle timer on any key press
            setIdleTime(0);
        };

        const handleMouseMove = () => {
            setIdleTime(0);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            clearInterval(timer);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-[500px] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 text-white flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div>
                        <h2 className="text-lg font-black tracking-wider uppercase">Consolidated Settings</h2>
                        <p className="text-xs text-zinc-400">Modal auto-closes in {60 - idleTime}s of inactivity</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Fields */}
                <div className="flex flex-col gap-5">
                    {/* Field 1 */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Safety Intercept Threshold (Max Override Allowable Pressure - PSI)
                        </label>
                        <input
                            type="number"
                            value={threshold}
                            onChange={(e) => setThreshold(Number(e.target.value))}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white w-full focus:outline-none focus:border-orange-500"
                        />
                    </div>

                    {/* Field 2 */}
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Require Supervisor PIN for Critical Mitigation
                        </label>
                        <input
                            type="checkbox"
                            checked={requirePin}
                            onChange={(e) => setRequirePin(e.target.checked)}
                            className="w-4 h-4 accent-orange-500"
                        />
                    </div>

                    {/* Field 3 */}
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Enable High-Contrast Emergency Display
                        </label>
                        <input
                            type="checkbox"
                            checked={highContrast}
                            onChange={(e) => setHighContrast(e.target.checked)}
                            className="w-4 h-4 accent-orange-500"
                        />
                    </div>

                    {/* Field 4 */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Audit Destination
                        </label>
                        <select
                            value={auditDest}
                            onChange={(e) => setAuditDest(e.target.value)}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white w-full focus:outline-none focus:border-orange-500"
                        >
                            <option value="Local Storage">Local Storage</option>
                            <option value="Cloud Ledger">Cloud Ledger</option>
                            <option value="None">None</option>
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end pt-4 border-t border-zinc-800">
                    <button
                        onClick={onClose}
                        className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-black px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-900/20"
                    >
                        Save & Close
                    </button>
                </div>
            </div>
        </div>
    );
};
