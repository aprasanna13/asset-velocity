import Fuse from 'fuse.js';
import { SearchResult, ExecutionLog } from '../../../types';

const fuseOptions = {
    keys: ['message', 'agent', 'severity'],
    threshold: 0.3,
};

export const searchLogs = (logs: ExecutionLog[], query: string): SearchResult[] => {
    if (!query) return [];

    const fuse = new Fuse(logs, fuseOptions);
    const results = fuse.search(query);

    return results.map(({ item }) => ({
        id: `log-${item.id}`,
        title: `${item.agent} [${item.severity}]`,
        subtitle: item.message,
        type: 'log',
        action: {
            type: 'OPEN_DRAWER',
            payload: item,
        },
    }));
};
