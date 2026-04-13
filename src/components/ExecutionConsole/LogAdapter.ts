import { ExecutionLog } from '../../types';

export const parseRawLogToStructured = (rawString: string): ExecutionLog => {
    // Standard pattern: optional timestamp bracket [HH:MM:SS], then [Agent/Source], then the message
    const regex = /^(?:\[(.*?)\]\s*)?\[(.*?)\]\s*(.*)$/;
    const match = rawString.match(regex);

    if (!match) {
        throw new Error(`Failed to parse log string: ${rawString}`);
    }

    const time = match[1];
    const agent = match[2];
    const message = match[3];

    let severity: 'Routine' | 'Warning' | 'Critical' = 'Routine';
    
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('critical') || lowerMsg.includes('breach') || lowerMsg.includes('error') || lowerMsg.includes('failed')) {
        severity = 'Critical';
    } else if (lowerMsg.includes('warning') || lowerMsg.includes('latency') || lowerMsg.includes('high')) {
        severity = 'Warning';
    }

    return {
        id: Math.random().toString(36).substring(2, 11),
        agent: agent || 'System',
        timestamp: time || new Date().toLocaleTimeString(),
        severity,
        message,
        payload: { raw: rawString }
    };
};
