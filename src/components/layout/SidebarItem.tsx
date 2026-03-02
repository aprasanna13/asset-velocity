import React from 'react';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    active: boolean;
    onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${active
            ? 'bg-orange-500/10 text-orange-500 border-r-2 border-orange-500'
            : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
            } mb-1`}
    >
        <Icon size={18} />
        {label}
    </button>
);

export default SidebarItem;