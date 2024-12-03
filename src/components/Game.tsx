import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { HockeyRink } from './HockeyRink';
import { StatsTable } from './StatsTable';
import { SogSummaryTable } from './SogSummaryTable';

export const Game: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [clickLocation, setClickLocation] = useState<{ x: number; y: number } | null>(null);
  const [sidesFlipped, setSidesFlipped] = useState(false);
  
  const {
    homeTeam,
    awayTeam,
    currentPeriod,
    stats,
    recordAction,
    nextPeriod,
    previousPeriod,
    undoLastAction,
    actionHistory,
    selectedHomeGoalie,
    selectedAwayGoalie
  } = useGameStore();

  const handleRinkClick = (location: { x: number; y: number }) => {
    setClickLocation(location);
  };

  const handleTeamSelect = (teamName: string) => {
    setSelectedTeam(teamName);
  };

  const handleActionSelect = (action: string) => {
    if (selectedTeam && clickLocation) {
      recordAction(selectedTeam, action, clickLocation);
      setSelectedTeam(null);
      setClickLocation(null);
    }
  };

  const currentStats = stats[currentPeriod - 1]?.teamStats || {};
  const periodLabel = currentPeriod === 4 ? 'Overtime' : 
                     currentPeriod === 5 ? 'Shootout' : 
                     `Period ${currentPeriod}`;

  const shotTypes = [
    { id: 'GOAL', label: 'Goal', color: 'bg-green-500', large: true },
    { id: 'COVERED', label: 'Covered', color: 'bg-gray-500', large: true },
    { id: 'REBOUND', label: 'Rebound', color: 'bg-yellow-500' },
    { id: 'BLOCKED', label: 'Blocked', color: 'bg-purple-500' },
    { id: 'MISSED', label: 'Missed', color: 'bg-red-500' }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-[1800px] mx-auto">
        <div className="glass-effect rounded-xl shadow-lg p-6">
          {/* Header section */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/roster')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-12 py-6 rounded-lg hover-lift transition-all text-2xl"
              >
                Back
              </button>
              <h1 className="text-4xl font-bold text-primary">{periodLabel}</h1>
            </div>
            <div className="flex space-x-4">
              {currentPeriod > 1 && (
                <button
                  onClick={previousPeriod}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-12 py-6 rounded-lg hover-lift transition-all text-2xl"
                >
                  Previous Period
                </button>
              )}
              {currentPeriod < 5 && (
                <button
                  onClick={nextPeriod}
                  className="bg-primary hover:bg-primary-dark text-white px-12 py-6 rounded-lg hover-lift transition-all text-2xl"
                >
                  Next Period
                </button>
              )}
              {currentPeriod === 5 && (
                <button
                  onClick={() => navigate('/summary')}
                  className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-lg hover-lift transition-all text-2xl"
                >
                  Summary
                </button>
              )}
            </div>
          </div>

          {/* Summary Tables */}
          <div className="mb-6">
            <SogSummaryTable
              stats={stats}
              currentPeriod={currentPeriod}
              homeTeam={homeTeam.name}
              awayTeam={awayTeam.name}
            />
          </div>

          {/* Period Stats */}
          <div className="mb-6">
            <StatsTable
              stats={stats}
              currentPeriod={currentPeriod}
              homeTeam={homeTeam.name}
              awayTeam={awayTeam.name}
            />
          </div>

          {/* Main content area with rink and controls */}
          <div className="flex gap-6">
            {/* Rink container (65%) */}
            <div className="w-[65%] bg-surface rounded-lg p-4 border border-gray-200">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setSidesFlipped(!sidesFlipped)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-4 rounded-lg hover-lift transition-all text-xl"
                >
                  Flip Sides
                </button>
              </div>
              <HockeyRink
                onRinkClick={handleRinkClick}
                homeTeam={homeTeam.name}
                awayTeam={awayTeam.name}
                currentStats={currentStats}
                selectedHomeGoalie={selectedHomeGoalie}
                selectedAwayGoalie={selectedAwayGoalie}
                sidesFlipped={sidesFlipped}
              />
            </div>

            {/* Controls container (35%) */}
            <div className="w-[35%] flex flex-col gap-6">
              {/* Team Selection */}
              <div className="flex flex-col gap-6">
                <button
                  onClick={() => handleTeamSelect(homeTeam.name)}
                  className={`w-full py-12 rounded-xl text-4xl font-medium transition-all ${
                    selectedTeam === homeTeam.name
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {homeTeam.name || 'My Team'} Shot
                </button>
                <button
                  onClick={() => handleTeamSelect(awayTeam.name)}
                  className={`w-full py-12 rounded-xl text-4xl font-medium transition-all ${
                    selectedTeam === awayTeam.name
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {awayTeam.name || 'Other Team'} Shot
                </button>
              </div>

              {/* Shot Type Selection */}
              <div className="grid grid-cols-2 gap-6">
                {shotTypes.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleActionSelect(action.id)}
                    disabled={!selectedTeam}
                    className={`${
                      action.large ? 'col-span-2' : 'col-span-1'
                    } py-12 rounded-xl text-4xl font-medium transition-all ${
                      !selectedTeam
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : `${action.color} text-white hover:opacity-90`
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Undo Button */}
              <button
                onClick={undoLastAction}
                disabled={!actionHistory.length || actionHistory[actionHistory.length - 1].period !== currentPeriod}
                className={`w-full py-12 rounded-xl text-4xl font-medium transition-all ${
                  !actionHistory.length || actionHistory[actionHistory.length - 1].period !== currentPeriod
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                Undo Last Shot
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};