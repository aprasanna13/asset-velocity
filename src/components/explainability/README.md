# Explainability Directory (`src/components/explainability`)

This directory contains the core logic for rendering real-time diagnostic explanations and mathematical proofs behind automated agentic anomaly detection.

## Purpose

The components in this directory are responsible for providing transparent, human-readable mathematical rationales (formulas, live variables, and confidence scoring) whenever a critical structural threshold violation is flagged by the triage engine. This ensures operational accountability and satisfies human-in-the-loop verification requirements.

## Contents

*   `ExplainabilityModal.tsx`: The primary full-featured intercept window that breaks down complex anomaly evaluation logic into accessible tables and progress metrics.
*   `README.md`: This documentation file.

## Implementation Details & Edge Cases

### `ExplainabilityModal.tsx`
- **Core Flow**: Renders a high-priority floating modal (`z-50`) over a darkened blur backdrop when an active diagnostic explanation is requested by the operator. It displays the exact formula, a dynamically mapped variable table, and a visual confidence gauge.
- **Edge Cases Handled**:
  - **Null Safety / Short-Circuiting**: The component explicitly checks `if (!isOpen || !evidence) return null;`. If the modal is toggled open but the underlying `evidence` payload fails to load or is null, it safely short-circuits rendering to prevent runtime destructuring errors on `evidence.variables`.
  - **Variable Mapping Robustness**: Iterates over dynamic variable payloads via standard `Object.entries(evidence.variables)`, ensuring any arbitrary set of telemetry data metrics can be rendered safely without hardcoded key dependencies.
  - **Visual Gauge Overflow Protection**: Uses inline dynamic styling (`style={{ width: `${evidence.confidence_score}%` }}`) constrained inside a strict `overflow-hidden` full-width rounded bar to prevent CSS rendering overflow regardless of percentage values.

## Usage

**Basic Example:**

```tsx
import { ExplainabilityModal } from './components/explainability/ExplainabilityModal';
import { EvidencePayload } from '../types';

// Constructing a mock or real diagnostic payload
const mockEvidence: EvidencePayload = {
    formula: "abs(TEMP - BASELINE) > THRESHOLD",
    variables: {
        TEMP: "142.5 °C",
        BASELINE: "100.0 °C",
        THRESHOLD: "40.0 °C"
    },
    confidence_score: 98.4
};

// Inside your rendering hierarchy:
<ExplainabilityModal
    isOpen={showExplanation}
    onClose={() => setShowExplanation(false)}
    evidence={mockEvidence}
/>
```
