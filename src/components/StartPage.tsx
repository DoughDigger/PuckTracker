import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

export const StartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    homeTeam,
    awayTeam,
    gameDate,
    setHomeTeamName,
    setAwayTeamName,
    setGameDate,
  } = useGameStore();

  useEffect(() => {
    if (!homeTeam.name) setHomeTeamName('Tigers');
    if (!awayTeam.name) setAwayTeamName('Other');
  }, [homeTeam.name, awayTeam.name, setHomeTeamName, setAwayTeamName]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Wrapper container */}
      <div className="max-w-4xl w-full px-6">
        {/* Glass Effect Card */}
        <div className="bg-black/50 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-orange-500/20">
          {/* Content Centering */}
          <div className="flex flex-col items-center text-center">
            {/* Page Title */}
            <h1 className="text-6xl font-bold mb-16 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Hockey Stats Tracker
            </h1>

            {/* Form Inputs */}
            <div className="w-full max-w-4xl space-y-10">
              {/* Game Date Input */}
              <div className="flex flex-col items-center">
                <label className="block text-2xl font-medium text-orange-400 mb-4">
                  Game Date
                </label>
                <input
                  type="date"
                  value={gameDate || ''}
                  onChange={(e) => setGameDate(e.target.value)}
                  className="w-full p-4 text-xl bg-black/50 border border-orange-500/30 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center hover:border-orange-500/50"
                />
              </div>

              {/* My Team Input */}
              <div className="flex flex-col items-center">
                <label className="block text-2xl font-medium text-orange-400 mb-4">
                  My Team
                </label>
                <input
                  type="text"
                  value={homeTeam.name || ''}
                  onChange={(e) => setHomeTeamName(e.target.value)}
                  className="w-full p-4 text-xl bg-black/50 border border-orange-500/30 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center hover:border-orange-500/50"
                  placeholder="Enter my team name"
                />
              </div>

              {/* Other Team Input */}
              <div className="flex flex-col items-center">
                <label className="block text-2xl font-medium text-orange-400 mb-4">
                  Other Team
                </label>
                <input
                  type="text"
                  value={awayTeam.name || ''}
                  onChange={(e) => setAwayTeamName(e.target.value)}
                  className="w-full p-4 text-xl bg-black/50 border border-orange-500/30 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center hover:border-orange-500/50"
                  placeholder="Enter other team name"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-12 mt-24">
                <button
                  onClick={() => navigate('/roster')}
                  disabled={!homeTeam.name || !awayTeam.name}
                  className="h-52 w-52 md:h-64 md:w-64 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg text-3xl font-semibold transition-transform transform hover:scale-105 shadow-lg shadow-orange-500/30"
                >
                  Start Game
                </button>
                <button
                  onClick={() => navigate('/johns-method')}
                  disabled={!homeTeam.name || !awayTeam.name}
                  className="h-52 w-52 md:h-64 md:w-64 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-lg text-3xl font-semibold transition-transform transform hover:scale-105 shadow-lg"
                >
                  John's Method
                </button>
                <button
                  onClick={() => navigate('/stats')}
                  className="h-52 w-52 md:h-64 md:w-64 bg-black/50 border border-orange-500/30 hover:border-orange-500/50 text-white rounded-lg text-3xl font-semibold transition-transform transform hover:scale-105 shadow-lg"
                >
                  Game History
                </button>
                <button
                  onClick={() => navigate('/analysis')}
                  className="h-52 w-52 md:h-64 md:w-64 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white rounded-lg text-3xl font-semibold transition-transform transform hover:scale-105 shadow-lg"
                >
                  Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
