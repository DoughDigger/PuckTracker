import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { PlayerInput } from './PlayerInput';
import { RosterModal } from './RosterModal';
import { getPlayers } from '../db';
import { Player } from '../types/team';

export const RosterEdit: React.FC = () => {
  const navigate = useNavigate();
  const [showHomePlayerInput, setShowHomePlayerInput] = useState(false);
  const [showAwayPlayerInput, setShowAwayPlayerInput] = useState(false);
  const [showHomeRoster, setShowHomeRoster] = useState(false);
  const [showAwayRoster, setShowAwayRoster] = useState(false);
  const [homePlayers, setHomePlayers] = useState<Player[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);
  
  const { homeTeam, awayTeam } = useGameStore();

  useEffect(() => {
    if (!homeTeam.name || !awayTeam.name) {
      navigate('/');
      return;
    }
    
    const loadPlayers = async () => {
      const homePlayersList = await getPlayers('home');
      const awayPlayersList = await getPlayers('away');
      setHomePlayers(homePlayersList);
      setAwayPlayers(awayPlayersList);
    };
    loadPlayers();
  }, [homeTeam.name, awayTeam.name, navigate, showHomePlayerInput, showAwayPlayerInput]);

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto glass-effect rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
            Edit Rosters
          </h1>
          <div className="text-orange-400">
            <div>{homeTeam.name} vs {awayTeam.name}</div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Home Team Section */}
          <div className="bg-black rounded-xl p-6 neon-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-orange-400">{homeTeam.name}</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowHomeRoster(true)}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg hover-lift transition-all"
                  disabled={homePlayers.length === 0}
                >
                  View Roster
                </button>
                <button
                  onClick={() => setShowHomePlayerInput(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg hover-lift transition-all"
                >
                  Add Player
                </button>
              </div>
            </div>
          </div>

          {/* Away Team Section */}
          <div className="bg-black rounded-xl p-6 neon-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-orange-400">{awayTeam.name}</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAwayRoster(true)}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg hover-lift transition-all"
                  disabled={awayPlayers.length === 0}
                >
                  View Roster
                </button>
                <button
                  onClick={() => setShowAwayPlayerInput(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg hover-lift transition-all"
                >
                  Add Player
                </button>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/roster')}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover-lift transition-all"
            >
              Back to Team Setup
            </button>
          </div>
        </div>

        {showHomePlayerInput && (
          <PlayerInput
            teamType="home"
            onClose={() => setShowHomePlayerInput(false)}
          />
        )}

        {showAwayPlayerInput && (
          <PlayerInput
            teamType="away"
            onClose={() => setShowAwayPlayerInput(false)}
          />
        )}

        {showHomeRoster && (
          <RosterModal
            players={homePlayers}
            teamName={homeTeam.name}
            onClose={() => setShowHomeRoster(false)}
          />
        )}

        {showAwayRoster && (
          <RosterModal
            players={awayPlayers}
            teamName={awayTeam.name}
            onClose={() => setShowAwayRoster(false)}
          />
        )}
      </div>
    </div>
  );
};