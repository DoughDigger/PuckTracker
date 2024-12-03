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
    setGameDate 
  } = useGameStore();

  useEffect(() => {
    if (!homeTeam.name) setHomeTeamName('Tigers');
    if (!awayTeam.name) setAwayTeamName('Other');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto">
        <div className="glass-effect bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-orange-500/20">
          <div className="flex flex-col items-center">
            <h1 className="text-6xl font-bold mb-16 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent text-center">
              Hockey Stats Tracker
            </h1>
            
            <div className="w-full max-w-2xl space-y-10">
              <div className="flex flex-col items-center">
                <label className="block text-2xl font-medium text-orange-400 mb-4">
                  Game Date
                </label>
                <input
                  type="date"
                  value={gameDate}
                  onChange={(e) => setGameDate(e.target.value)}
                  className="w-full p-6 text-xl bg-black/50 border border-orange-500/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-center hover:border-orange-500/50"
                />
              </div>

              <div className="flex flex-col items-center">
                <label className="block text-2xl font-medium text-orange-400 mb-4">
                  My Team
                </label>
                <input
                  type="text"
                  value={homeTeam.name}
                  onChange={(e) => setHomeTeamName(e.target.value)}
                  className="w-full p-6 text-xl bg-black/50 border border-orange-500/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-center hover:border-orange-500/50"
                  placeholder="Enter my team name"
                />
              </div>

              <div className="flex flex-col items-center">
                <label className="block text-2xl font-medium text-orange-400 mb-4">
                  Other Team
                </label>
                <input
                  type="text"
                  value={awayTeam.name}
                  onChange={(e) => setAwayTeamName(e.target.value)}
                  className="w-full p-6 text-xl bg-black/50 border border-orange-500/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-center hover:border-orange-500/50"
                  placeholder="Enter other team name"
                />
              </div>

              <div className="flex flex-col space-y-6 w-full mt-16">
                <button
                  onClick={() => navigate('/roster')}
                  disabled={!homeTeam.name || !awayTeam.name}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-8 rounded-xl text-2xl font-semibold hover-lift transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
                >
                  Start New Game
                </button>

                <button
                  onClick={() => navigate('/johns-method')}
                  disabled={!homeTeam.name || !awayTeam.name}
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-12 py-8 rounded-xl text-2xl font-semibold hover-lift transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  John's Method
                </button>

                <button
                  onClick={() => navigate('/stats')}
                  className="w-full bg-black/50 border border-orange-500/30 hover:border-orange-500/50 text-white px-12 py-8 rounded-xl text-2xl font-semibold hover-lift transition-all shadow-lg"
                >
                  View Game History
                </button>

                <button
                  onClick={() => navigate('/analysis')}
                  className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-12 py-8 rounded-xl text-2xl font-semibold hover-lift transition-all shadow-lg"
                >
                  Game Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};