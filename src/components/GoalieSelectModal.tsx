import React from 'react';
import { Player } from '../types/team';

interface GoalieSelectModalProps {
  goalies: Player[];
  teamName: string;
  onSelect: (player: Player) => void;
  onClose: () => void;
}

export const GoalieSelectModal: React.FC<GoalieSelectModalProps> = ({
  goalies,
  teamName,
  onSelect,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-xl shadow-2xl max-w-md w-full p-6 glass-effect">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-400">{teamName} Goalies</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {goalies.length === 0 ? (
          <p className="text-gray-300 text-center py-4">No goalies available. Please add goalies to the roster first.</p>
        ) : (
          <div className="space-y-2">
            {goalies.map((goalie, index) => (
              <button
                key={index}
                onClick={() => onSelect(goalie)}
                className="w-full text-left p-4 rounded-lg border border-orange-500/30 hover:bg-orange-500/10 transition-colors text-white hover-lift"
              >
                <div className="font-semibold">#{goalie.number} {goalie.name}</div>
              </button>
            ))}
          </div>
        )}

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