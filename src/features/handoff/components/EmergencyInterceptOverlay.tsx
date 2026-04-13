import React from 'react';

interface Props {
    onDismiss: () => void;
}

export const EmergencyInterceptOverlay: React.FC<Props> = ({ onDismiss }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col justify-center items-center text-white p-6">
            <div className="bg-red-900 border-4 border-red-600 rounded-2xl p-8 max-w-xl w-full text-center shadow-2xl animate-pulse">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-3xl font-black tracking-wide text-red-200">EMERGENCY INTERCEPT</h2>
                <p className="text-lg mt-4 font-semibold">A real-time critical alarm has fired during your handoff review.</p>
                <p className="text-sm text-red-300 mt-2">
                    The handoff review has been paused. You must address the immediate operational hazard before continuing.
                </p>
                <button 
                    onClick={onDismiss}
                    className="mt-8 px-8 py-4 bg-red-600 hover:bg-red-500 text-white text-xl font-black rounded-lg shadow-lg tracking-wider w-full transition"
                >
                    ACKNOWLEDGE EMERGENCY INTERRUPT
                </button>
            </div>
        </div>
    );
};
