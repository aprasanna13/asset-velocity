import React, { createContext, useState, useContext, ReactNode } from 'react';
import { SearchResult } from '../../types';

interface SearchContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    results: SearchResult[];
    setResults: (results: SearchResult[]) => void;
    activeAction: { type: 'OPEN_DRAWER'; payload: unknown } | null;
    setActiveAction: (action: { type: 'OPEN_DRAWER'; payload: unknown } | null) => void;
    highlightedNodeId: string | null;
    setHighlightedNodeId: (id: string | null) => void;
    executeAction: (result: SearchResult) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearchContext must be used within a SearchProvider');
    }
    return context;
};

interface SearchProviderProps {
    children: ReactNode;
    onNavigate?: (tab: string) => void;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children, onNavigate }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [activeAction, setActiveAction] = useState<{ type: 'OPEN_DRAWER'; payload: unknown } | null>(null);
    const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

    const executeAction = (result: SearchResult) => {
        const { action, type } = result;
        
        // First navigate to the correct tab based on result type
        if (onNavigate) {
            switch (type) {
                case 'part':
                    onNavigate('inventory');
                    break;
                case 'log':
                    onNavigate('workflow');
                    break;
                case 'node':
                    onNavigate('nodes');
                    break;
            }
        }

        // Then perform specific action
        switch (action.type) {
            case 'NAVIGATE':
                // Navigation already handled above, or we can override if specific payload is provided
                break;
            case 'OPEN_DRAWER':
                setActiveAction({ type: 'OPEN_DRAWER', payload: action.payload });
                break;
            case 'HIGHLIGHT_MAP':
                if (typeof action.payload === 'string') {
                    setHighlightedNodeId(action.payload);
                }
                break;
            default:
                console.warn('Unknown action type:', action.type);
        }
    };

    return (
        <SearchContext.Provider
            value={{
                searchQuery,
                setSearchQuery,
                results,
                setResults,
                activeAction,
                setActiveAction,
                highlightedNodeId,
                setHighlightedNodeId,
                executeAction,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};
