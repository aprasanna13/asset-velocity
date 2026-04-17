import { useState, useEffect } from 'react';
import { useSearchContext } from './SearchContext';
import { searchInventory } from './adapters/inventoryAdapter';
import { searchLogs } from './adapters/logAdapter';
import { searchNodes } from './adapters/nodeAdapter';
import { ExecutionLog, PipelineNode, SearchResult } from '../../types';

interface UseSearchProps {
    logs: ExecutionLog[];
    nodes: PipelineNode[];
    currentTab: string;
}

export const useSearch = ({ logs, nodes, currentTab }: UseSearchProps) => {
    const { searchQuery, setResults } = useSearchContext();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!searchQuery) {
            setResults([]);
            return;
        }

        setLoading(true);
        const handler = setTimeout(() => {
            const inventoryResults = searchInventory(searchQuery);
            const logResults = searchLogs(logs, searchQuery);
            const nodeResults = searchNodes(nodes, searchQuery);

            const allResults = [...inventoryResults, ...logResults, ...nodeResults];

            // Sorting/Prioritization based on current context
            allResults.sort((a, b) => {
                const aMatchesContext = isMatchContext(a, currentTab);
                const bMatchesContext = isMatchContext(b, currentTab);

                if (aMatchesContext && !bMatchesContext) return -1;
                if (!aMatchesContext && bMatchesContext) return 1;
                return 0;
            });

            setResults(allResults);
            setLoading(false);
        }, 300); // Debounce 300ms

        return () => clearTimeout(handler);
    }, [searchQuery, logs, nodes, currentTab, setResults]);

    return { loading };
};

const isMatchContext = (result: SearchResult, currentTab: string): boolean => {
    switch (currentTab) {
        case 'inventory':
            return result.type === 'part';
        case 'alerts':
        case 'workflow':
            return result.type === 'log';
        case 'nodes':
            return result.type === 'node';
        default:
            return false;
    }
};
