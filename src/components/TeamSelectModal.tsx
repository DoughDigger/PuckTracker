import React from 'react';

interface TeamSelectModalProps {
  homeTeam: string;
  awayTeam: string;
  onSelect: (teamName: string) => void;
  onClose: () => void;
}

export const TeamSelectModal: React.FC<TeamSelectModalProps> = ({
  homeTeam,
  awayTeam,
  onSelect,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-xl shadow-2xl max-w-md w-full p-6 glass-effect">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-400">Select Team</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onSelect(homeTeam)}
            className="w-full text-left p-4 rounded-lg border border-orange-500/30 hover:bg-orange-500/10 transition-colors text-white hover-lift"
          >
            {homeTeam}
          </button>
          <button
            onClick={() => onSelect(awayTeam)}
            className="w-full text-left p-4 rounded-lg border border-orange-500/30 hover:bg-orange-500/10 transition-colors text-white hover-lift"
          >
            {awayTeam}
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg hover-lift transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};