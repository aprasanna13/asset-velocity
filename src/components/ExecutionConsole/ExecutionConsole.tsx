import React, { useState, useRef, useEffect } from 'react';
import { Filter, AlertTriangle } from 'lucide-react';
import { ExecutionLog } from '../../types';
import { LogRow } from './LogRow';
import { LogDetailModal } from './LogDetailModal';

interface ExecutionConsoleProps {
    logs: ExecutionLog[];
}

export const ExecutionConsole: React.FC<ExecutionConsoleProps> = ({ logs }) => {
    const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'Critical' | 'Warning' | 'Routine'>('ALL');
    const [filterAgent, setFilterAgent] = useState<string>('ALL');
    const [selectedLog, setSelectedLog] = useState<ExecutionLog | null>(null);
    const feedRef = useRef<HTMLDivElement>(null);

    // Unconditional auto-scroll to bottom on every update
    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
    }, [logs]);

    // Apply filters
    const filteredLogs = logs.filter(log => {
        const matchesSeverity = filterSeverity === 'ALL' || log.severity === filterSeverity;
        const matchesAgent = filterAgent === 'ALL' || log.agent === filterAgent;
        return matchesSeverity && matchesAgent;
    });

    // Enforce 50-item rendering limit (simplified ring buffer concept)
    const displayedLogs = filteredLogs.slice(-50);

    // Extract unique agents for filter dropdown
    const uniqueAgents = ['ALL', ...Array.from(new Set(logs.map(l => l.agent)))];

    const isFiltered = filterSeverity !== 'ALL' || filterAgent !== 'ALL';

    return (
        <div className="flex flex-col h-full border border-zinc-900 rounded-2xl bg-zinc-950 overflow-hidden">
            {/* Control Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-900 bg-[#0d0d0d]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter size={14} className="text-zinc-500" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Filter:</span>
                    </div>

                    {/* Severity Filter */}
                    <select 
                        value={filterSeverity} 
                        onChange={(e) => setFilterSeverity(e.target.value as any)}
                        className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 px-2.5 py-1 rounded-lg outline-none cursor-pointer"
                    >
                        <option value="ALL">All Severities</option>
                        <option value="Critical">Critical Only</option>
                        <option value="Warning">Warnings Only</option>
                        <option value="Routine">Routine Only</option>
                    </select>

                    {/* Agent Filter */}
                    <select 
                        value={filterAgent} 
                        onChange={(e) => setFilterAgent(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 px-2.5 py-1 rounded-lg outline-none cursor-pointer"
                    >
                        {uniqueAgents.map(agent => (
                            <option key={agent} value={agent}>{agent === 'ALL' ? 'All Agents' : agent}</option>
                        ))}
                    </select>
                </div>

                {/* Persistent Warning Indicator for Filtered State */}
                {isFiltered && (
                    <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-lg">
                        <AlertTriangle size={14} className="text-orange-400 animate-pulse" />
                        <span className="text-[10px] font-black tracking-wider text-orange-400 uppercase">Filtered View Active</span>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        {displayedLogs.length} Items (Capped at 50)
                    </span>
                </div>
            </div>

            {/* Log Feed */}
            <div 
                ref={feedRef}
                className="flex-1 overflow-y-auto divide-y divide-zinc-900 bg-zinc-950/50 font-mono"
            >
                {displayedLogs.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-xs text-zinc-600 uppercase tracking-widest">
                        No logs match criteria
                    </div>
                ) : (
                    displayedLogs.map(log => (
                        <LogRow key={log.id} log={log} onClick={setSelectedLog} />
                    ))
                )}
            </div>

            {/* Detail Modal Overlay */}
            {selectedLog && (
                <LogDetailModal 
                    log={selectedLog} 
                    onClose={() => setSelectedLog(null)} 
                />
            )}
        </div>
    );
};
