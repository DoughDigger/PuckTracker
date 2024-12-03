import React from 'react';
import { Player } from '../types/team';

interface RosterModalProps {
  players: Player[];
  teamName: string;
  onClose: () => void;
}

export const RosterModal: React.FC<RosterModalProps> = ({ players, teamName, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-xl shadow-2xl max-w-4xl w-full p-6 glass-effect">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-400">{teamName} Roster</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-orange-500/30">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                  Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                  First Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                  Last Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                  Position
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-500/30">
              {players.map((player, index) => {
                const [firstName, ...lastNameParts] = player.name.split(' ');
                const lastName = lastNameParts.join(' ');
                return (
                  <tr key={index} className={index % 2 === 0 ? 'bg-black' : 'bg-black/50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {player.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {firstName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {player.position}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-black border border-orange-500/30 hover:bg-black/80 text-white px-6 py-2 rounded-lg hover-lift transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};