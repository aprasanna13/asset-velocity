import React, { useState } from 'react';

interface Props {
    onSubmit: (reason: string, notes?: string) => Promise<void>;
    onCancel: () => void;
}

export const DisputeModal: React.FC<Props> = ({ onSubmit, onCancel }) => {
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleConfirm = async () => {
        setSubmitting(true);
        await onSubmit(reason, notes);
        setSubmitting(false);
        onCancel(); // Close modal after submission
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border-t-4 border-yellow-500">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span>⛔</span> Reject Operational Handoff
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                    You are formally rejecting the assumption of this shift. Please document the specific unsafe condition or missing requirement.
                </p>

                <div className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Reason for Rejection (Required)</label>
                        <input 
                            type="text" 
                            placeholder="e.g., Missing safety sign-off for Valve 3"
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-yellow-500"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Notes</label>
                        <textarea 
                            placeholder="Detail any observations from the outgoing operator..."
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-yellow-500 h-24"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button 
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 text-sm"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirm}
                        disabled={!reason || submitting}
                        className={`px-4 py-2 font-bold text-white rounded-md text-sm shadow ${reason && !submitting ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        {submitting ? 'Submitting...' : 'Confirm Rejection'}
                    </button>
                </div>
            </div>
        </div>
    );
};
