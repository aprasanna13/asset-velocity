import Fuse from 'fuse.js';
import { SearchResult, PipelineNode } from '../../../types';

const fuseOptions = {
    keys: ['name', 'id', 'role', 'status'],
    threshold: 0.3,
};

export const searchNodes = (nodes: PipelineNode[], query: string): SearchResult[] => {
    if (!query) return [];

    const fuse = new Fuse(nodes, fuseOptions);
    const results = fuse.search(query);

    return results.map(({ item }) => ({
        id: `node-${item.id}`,
        title: item.name,
        subtitle: `${item.role} | ${item.status}`,
        type: 'node',
        action: {
            type: 'HIGHLIGHT_MAP',
            payload: item.id,
        },
    }));
};
