import Fuse from 'fuse.js';
import { STATIC_INVENTORY } from '../../../hooks/useInventory';
import { SearchResult } from '../../../types';

const fuseOptions = {
    keys: ['part_number', 'description', 'model_compatibility'],
    threshold: 0.3,
};

const fuse = new Fuse(STATIC_INVENTORY, fuseOptions);

export const searchInventory = (query: string): SearchResult[] => {
    if (!query) return [];

    const results = fuse.search(query);

    return results.map(({ item }) => ({
        id: `part-${item.id}`,
        title: item.part_number,
        subtitle: item.description,
        type: 'part',
        action: {
            type: 'OPEN_DRAWER',
            payload: item,
        },
    }));
};
