# Search Query Adapters

This directory contains specialized adapters for normalizing search queries and transforming raw dataset matches into a unified schema.

## Overview

To support multi-source global search, each data source implements a custom query adapter. These adapters leverage **Fuse.js** for lightweight, client-side fuzzy matching with fine-tuned sensitivity thresholds.

## Files

### [inventoryAdapter.ts](file:///usr/local/google/home/prasannaankem/Code/Field%20Operations/src/components/Search/adapters/inventoryAdapter.ts)
* **Purpose:** Performs fuzzy-search matching on spare parts inventories and equipment metadata.
* **Keys Searched:** `part_number`, `description`, `model_compatibility`
* **Target Action:** Returns a `SearchResult` with an `OPEN_DRAWER` action containing the matching inventory `item` payload.
* **Threshold:** `0.3` (strict fuzzy matching).

### [logAdapter.ts](file:///usr/local/google/home/prasannaankem/Code/Field%20Operations/src/components/Search/adapters/logAdapter.ts)
* **Purpose:** Performs fuzzy-search matching on active SCADA telemetry and background execution log flows.
* **Keys Searched:** `message`, `agent`, `severity`
* **Target Action:** Returns a `SearchResult` with an `OPEN_DRAWER` action containing the matching log `item` payload.
* **Threshold:** `0.3` (strict fuzzy matching).

### [nodeAdapter.ts](file:///usr/local/google/home/prasannaankem/Code/Field%20Operations/src/components/Search/adapters/nodeAdapter.ts)
* **Purpose:** Performs fuzzy-search matching on geographic/schematic pipeline topology nodes.
* **Keys Searched:** `name`, `id`, `role`, `status`
* **Target Action:** Returns a `SearchResult` with a `HIGHLIGHT_MAP` action containing the node's `id` payload.
* **Threshold:** `0.3` (strict fuzzy matching).

## Integration Pattern

Each adapter exposes a standard query function conforming to the signature:

```typescript
(dataList: DataType[], query: string) => SearchResult[]
```

These standardized arrays are compiled and prioritized by the parent `useSearch` hook to yield a unified search feed.
