import { ScadaData } from '../../types';

const StatusBadge = ({ status }: { status: ScadaData['status'] }) => {
    const styles: Record<ScadaData['status'], string> = {
        "Normal": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        "Critical Alert": "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse",
        "Maintenance": "bg-amber-500/10 text-amber-400 border-amber-500/20",
        "Active": "bg-blue-500/10 text-blue-400 border-blue-500/20"
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${styles[status] || styles["Normal"]}`}>
            {status === 'Critical Alert' ? 'TRIAGE' : status === 'Normal' ? 'IDLE' : status}
        </span>
    );
};

export default StatusBadge;