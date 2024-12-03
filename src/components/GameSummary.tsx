import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { SogSummaryTable } from './SogSummaryTable';
import { PeriodSummary } from './PeriodSummary';
import { EmailModal } from './EmailModal';
import { saveGameResult } from '../db';
import { GameSummaryData } from '../types/game';
import { calculateGameSummary } from '../utils/gameCalculations';

export const GameSummary: React.FC = () => {
  const navigate = useNavigate();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [gameSummaryData, setGameSummaryData] = useState<GameSummaryData | null>(null);
  
  const { 
    homeTeam, 
    awayTeam, 
    stats,
    selectedHomeGoalie,
    selectedAwayGoalie,
    gameDate
  } = useGameStore();

  useEffect(() => {
    const summaryData = calculateGameSummary(stats, homeTeam, awayTeam, selectedHomeGoalie, selectedAwayGoalie, gameDate);
    setGameSummaryData(summaryData);
  }, [stats, homeTeam, awayTeam, selectedHomeGoalie, selectedAwayGoalie, gameDate]);

  const handleSaveGame = async () => {
    try {
      setSaving(true);
      if (gameSummaryData) {
        await saveGameResult(gameSummaryData);
        navigate('/stats');
      }
    } catch (error) {
      console.error('Error saving game:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!gameSummaryData) return null;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-[1800px] mx-auto">
        <div className="glass-effect rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/game')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover-lift transition-all"
              >
                Back
              </button>
              <h1 className="text-3xl font-bold text-primary">Game Summary</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowEmailModal(true)}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg hover-lift transition-all"
              >
                Email Summary
              </button>
              <button
                onClick={handleSaveGame}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg hover-lift transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Game'}
              </button>
            </div>
          </div>

          {/* Game Summary */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Total Game Statistics</h2>
            <SogSummaryTable
              stats={stats}
              currentPeriod={5}
              homeTeam={homeTeam.name}
              awayTeam={awayTeam.name}
            />
          </div>

          {/* Period Summaries */}
          {stats.map((periodStats, index) => (
            <PeriodSummary
              key={index}
              periodStats={periodStats}
              periodNumber={index + 1}
              homeTeam={homeTeam.name}
              awayTeam={awayTeam.name}
              selectedHomeGoalie={selectedHomeGoalie}
              selectedAwayGoalie={selectedAwayGoalie}
            />
          ))}
        </div>
      </div>

      {showEmailModal && gameSummaryData && (
        <EmailModal
          onClose={() => setShowEmailModal(false)}
          gameData={gameSummaryData}
        />
      )}
    </div>
  );
};