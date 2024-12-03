import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { GoalieSelectModal } from './GoalieSelectModal';
import { Player } from '../types/team';
import { getPlayers } from '../db';

export const GameSetup: React.FC = () => {
  const navigate = useNavigate();
  const [showHomeGoalieSelect, setShowHomeGoalieSelect] = useState(false);
  const [showAwayGoalieSelect, setShowAwayGoalieSelect] = useState(false);
  const [homeGoalies, setHomeGoalies] = useState<Player[]>([]);
  const [awayGoalies, setAwayGoalies] = useState<Player[]>([]);
  
  const { 
    homeTeam, 
    awayTeam, 
    setSelectedGoalie,
    selectedHomeGoalie,
    selectedAwayGoalie 
  } = useGameStore();

  useEffect(() => {
    if (!homeTeam.name || !awayTeam.name) {
      navigate('/');
    }
  }, [homeTeam.name, awayTeam.name, navigate]);

  useEffect(() => {
    const loadGoalies = async () => {
      const homePlayers = await getPlayers('home');
      const awayPlayers = await getPlayers('away');
      setHomeGoalies(homePlayers.filter(p => p.position === 'Goalie'));
      setAwayGoalies(awayPlayers.filter(p => p.position === 'Goalie'));
    };
    loadGoalies();
  }, []);

  const handleGoalieSelect = (teamType: 'home' | 'away', player: Player) => {
    setSelectedGoalie(teamType, player);
    if (teamType === 'home') {
      setShowHomeGoalieSelect(false);
    } else {
      setShowAwayGoalieSelect(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="glass-effect rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-primary">
                Team Rosters
              </h1>
              <div className="text-gray-700">
                {homeTeam.name} vs {awayTeam.name}
              </div>
            </div>
            
            <div className="w-full space-y-8">
              {/* My Team Section */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-semibold text-primary">{homeTeam.name}</h2>
                    <div className="text-gray-600">
                      In net: {selectedHomeGoalie ? (
                        <span className="text-primary">
                          #{selectedHomeGoalie.number} {selectedHomeGoalie.name.split(' ').slice(-1)[0]}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">select a goalie</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <span className="text-gray-700">Select Goalie</span>
                    <button
                      onClick={() => setShowHomeGoalieSelect(true)}
                      className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg hover-lift transition-all"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>

              {/* Other Team Section */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-semibold text-primary">{awayTeam.name}</h2>
                    <div className="text-gray-600">
                      In net: {selectedAwayGoalie ? (
                        <span className="text-primary">
                          #{selectedAwayGoalie.number} {selectedAwayGoalie.name.split(' ').slice(-1)[0]}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">select a goalie</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <span className="text-gray-700">Select Goalie</span>
                    <button
                      onClick={() => setShowAwayGoalieSelect(true)}
                      className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg hover-lift transition-all"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover-lift transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => navigate('/roster-edit')}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg text-lg font-semibold hover-lift transition-all"
                >
                  Edit Rosters
                </button>
              </div>

              <button
                onClick={() => navigate('/game')}
                className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover-lift transition-all"
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      </div>

      {showHomeGoalieSelect && (
        <GoalieSelectModal
          goalies={homeGoalies}
          teamName={homeTeam.name}
          onSelect={(player) => handleGoalieSelect('home', player)}
          onClose={() => setShowHomeGoalieSelect(false)}
        />
      )}

      {showAwayGoalieSelect && (
        <GoalieSelectModal
          goalies={awayGoalies}
          teamName={awayTeam.name}
          onSelect={(player) => handleGoalieSelect('away', player)}
          onClose={() => setShowAwayGoalieSelect(false)}
        />
      )}
    </div>
  );
};