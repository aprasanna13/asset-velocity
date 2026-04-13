import React from 'react';
import { ExecutionLog } from '../../types';

interface LogRowProps {
    log: ExecutionLog;
    onClick: (log: ExecutionLog) => void;
}

export const LogRow: React.FC<LogRowProps> = React.memo(({ log, onClick }) => {
    return (
        <div 
            onClick={() => onClick(log)}
            className="flex items-center gap-4 px-4 py-2 border-b border-zinc-900 hover:bg-zinc-900/30 cursor-pointer transition-colors group text-xs"
        >
            <span className="text-zinc-600 font-mono w-20 shrink-0 text-[10px]">
                {log.timestamp}
            </span>

            <span className={`px-2 py-0.5 rounded font-black tracking-wider uppercase text-[9px] shrink-0 w-16 text-center
                ${log.severity === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                  log.severity === 'Warning' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 
                  'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}
            >
                {log.severity}
            </span>

            <span className="font-sans font-bold text-zinc-400 shrink-0 w-20 truncate">
                [{log.agent}]
            </span>

            <span className="font-mono text-zinc-300 truncate flex-1 group-hover:text-white transition-colors">
                {log.message}
            </span>
        </div>
    );
});

LogRow.displayName = 'LogRow';
