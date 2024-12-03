import React from 'react';
import { Player } from '../types/team';

interface PlayerListProps {
  players: Player[];
  title: string;
}

export const PlayerList: React.FC<PlayerListProps> = ({ players, title }) => {
  if (players.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-orange-400 mb-3">{title}</h3>
      <div className="bg-black border border-orange-500/30 rounded-lg p-4">
        <div className="grid grid-cols-4 gap-4 text-sm text-gray-300 mb-2 border-b border-orange-500/30 pb-2">
          <div>Number</div>
          <div>Name</div>
          <div>Position</div>
        </div>
        {players.map((player, index) => (
          <div 
            key={index} 
            className="grid grid-cols-4 gap-4 py-2 border-b border-orange-500/20 last:border-0 text-gray-100"
          >
            <div>#{player.number}</div>
            <div className="col-span-2">{player.name}</div>
            <div>{player.position}</div>
          </div>
        ))}
      </div>
    </div>
  );
};