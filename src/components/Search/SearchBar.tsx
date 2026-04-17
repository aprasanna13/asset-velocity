import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Package, Terminal, GitBranch } from 'lucide-react';
import { useSearchContext } from './SearchContext';
import { useSearch } from './useSearch';
import { ExecutionLog, PipelineNode, SearchResult } from '../../types';

interface SearchBarProps {
    logs: ExecutionLog[];
    nodes: PipelineNode[];
    currentTab: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ logs, nodes, currentTab }) => {
    const { searchQuery, setSearchQuery, results, executeAction } = useSearchContext();
    const { loading } = useSearch({ logs, nodes, currentTab });
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleResultClick = (result: SearchResult) => {
        executeAction(result);
        setIsOpen(false);
        setSearchQuery('');
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'part': return <Package size={14} className="text-orange-500" />;
            case 'log': return <Terminal size={14} className="text-blue-500" />;
            case 'node': return <GitBranch size={14} className="text-emerald-500" />;
            default: return null;
        }
    };

    return (
        <div className="relative w-96" ref={dropdownRef}>
            <div className={`flex items-center gap-4 px-4 py-2 rounded-xl border bg-zinc-900/50 border-zinc-800/50 backdrop-blur-md focus-within:border-orange-500/50 transition-all`}>
                <Search size={18} className="text-zinc-600" />
                <input
                    type="text"
                    placeholder="Search Assets, Logs, Nodes..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className={`bg-transparent border-none outline-none text-sm placeholder-zinc-600 w-full text-white`}
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-zinc-600 hover:text-white">
                        <X size={16} />
                    </button>
                )}
            </div>

            {isOpen && (searchQuery || loading) && (
                <div className="absolute top-full mt-2 w-full bg-[#0d0d0d] border border-zinc-800 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto backdrop-blur-lg bg-opacity-95">
                    {loading ? (
                        <div className="p-4 text-xs text-zinc-600 uppercase tracking-widest text-center">Searching...</div>
                    ) : results.length === 0 ? (
                        <div className="p-4 text-xs text-zinc-600 uppercase tracking-widest text-center">No results found</div>
                    ) : (
                        <div className="py-2">
                            {results.map((result) => (
                                <div
                                    key={result.id}
                                    onClick={() => handleResultClick(result)}
                                    className="px-4 py-3 hover:bg-zinc-900/50 cursor-pointer flex items-center gap-3 border-b border-zinc-900 last:border-b-0"
                                >
                                    <div className="p-1.5 bg-zinc-800 rounded-lg">
                                        {getIcon(result.type)}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className="text-sm font-bold text-white">{result.title}</span>
                                        {result.subtitle && (
                                            <span className="text-xs text-zinc-500 truncate">{result.subtitle}</span>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase text-zinc-700 tracking-widest">
                                        {result.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
