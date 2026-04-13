import React from 'react';

interface Props {
    decision: {
        outcome: string;
        factors: string[];
    };
}

export const InfluenceGraph: React.FC<Props> = ({ decision }) => {
    return (
        <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-700 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                <span>🤖</span> System Decision Explainability Map
            </h3>
            <p className="text-sm text-slate-400">The automation engine executed the following decision based on active constraints:</p>
            
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Outcome Executed</div>
                <div className="text-lg font-bold text-green-400 mt-1">{decision.outcome}</div>
            </div>

            <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Primary Driving Factors</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {decision.factors.map((factor, idx) => (
                        <div key={idx} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-sm flex items-start gap-2">
                            <span className="text-blue-400 font-bold">→</span>
                            <span>{factor}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
