import React from 'react';
import { HandoffEvent } from '../../../types';

interface Props {
    events: HandoffEvent[];
}

export const ShiftLogView: React.FC<Props> = ({ events }) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-sm font-black text-white tracking-widest uppercase">Routine Shift Log</h2>
                <p className="text-xs text-zinc-500 mt-1">Historical tracking of standard automated operational activities throughout the shift.</p>
            </div>
            
            <div className="divide-y divide-zinc-800/50 border border-zinc-800/50 rounded-2xl bg-zinc-900/20 backdrop-blur-sm overflow-hidden shadow-2xl">
                {events.map(evt => (
                    <div key={evt.id} className="p-5 hover:bg-zinc-800/20 transition-all">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <span className="text-[9px] font-black text-orange-500 bg-orange-950/40 border border-orange-900/40 px-2.5 py-1 rounded tracking-widest uppercase">
                                    {evt.subsystem}
                                </span>
                                <h4 className="font-black text-sm text-zinc-200 mt-3 tracking-wide">{evt.title}</h4>
                                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{evt.description}</p>
                            </div>
                            <span className="text-[9px] font-mono text-zinc-600 tracking-tighter">
                                {new Date(evt.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
