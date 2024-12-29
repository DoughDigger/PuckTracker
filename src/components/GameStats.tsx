import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllGames, deleteGame } from '../db';
import { GameResult } from '../types/game';
import { downloadCSV } from '../utils/csvExport';
import { GameSummaryView } from './GameSummaryView';

export const GameStats: React.FC = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [selectedGameSummary, setSelectedGameSummary] = useState<GameResult | null>(null);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const allGames = await getAllGames();
      setGames(allGames.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setShowDeleteConfirm(id);
  };

  const handleDeleteConfirm = async (id: number) => {
    if (!id) return;
    
    try {
      setDeletingId(id);
      await deleteGame(id);
      await loadGames();
    } catch (error) {
      console.error('Error deleting game:', error);
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  const getGameResult = (game: GameResult, isHomeTeam: boolean) => {
    const homeGoals = game.homeTotal.goals;
    const awayGoals = game.awayTotal.goals;
    
    if (homeGoals === awayGoals) return "T";
    if (isHomeTeam) {
      return homeGoals > awayGoals ? "W" : "L";
    }
    return awayGoals > homeGoals ? "W" : "L";
  };

  const handleExportCSV = () => {
    if (games.length > 0) {
      downloadCSV(games);
    }
  };

  const handleViewSummary = (game: GameResult) => {
    setSelectedGameSummary(game);
  };

  const cellClass = "py-3 px-4 text-white text-right";
  const headerClass = "py-3 px-4 text-orange-400 text-right font-medium text-sm uppercase tracking-wider";
  const resultClass = (result: string) => `py-3 px-4 text-white text-center font-bold ${
    result === 'W' ? 'text-green-500' : 
    result === 'L' ? 'text-red-500' : 
    'text-yellow-500'
  }`;

  if (selectedGameSummary) {
    return (
      <GameSummaryView 
        game={selectedGameSummary} 
        onClose={() => setSelectedGameSummary(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-[1600px] mx-auto">
        <div className="glass-effect rounded-xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-orange-400">Game History</h1>
            <div className="flex space-x-4">
              <button
                onClick={handleExportCSV}
                disabled={games.length === 0}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg hover-lift transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export CSV
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg hover-lift transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading games...</div>
          ) : games.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No games recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-orange-500/30">
                    <th className="py-3 px-4 text-orange-400 text-right font-medium text-sm uppercase tracking-wider">Date</th>
                    <th className="py-3 px-4 text-orange-400 text-right font-medium text-sm uppercase tracking-wider">Teams</th>
                    <th className="py-3 px-4 text-orange-400 text-right font-medium text-sm uppercase tracking-wider">Goalies</th>
                    <th className="py-3 px-4 text-orange-400 text-center font-medium text-sm uppercase tracking-wider">Result</th>
                    <th className={`${headerClass} border-l border-orange-500/30`}>GA</th>
                    <th className={headerClass}>SOG</th>
                    <th className={`${headerClass} border-l border-orange-500/30`}>Covered</th>
                    <th className={headerClass}>Rebound</th>
                    <th className={headerClass}>Blocked</th>
                    <th className={headerClass}>Missed</th>
                    <th className={headerClass}>Total</th>
                    <th className={`${headerClass} border-l border-orange-500/30`}>Sv%</th>
                    <th className={headerClass}>Hit%</th>
                    <th className="py-3 px-4 text-orange-400 text-center font-medium text-sm uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => (
                    <React.Fragment key={`game-${game.id}`}>
                      {/* Home Team Row */}
                      <tr className="border-b border-orange-500/20">
                        <td rowSpan={2} className="py-3 px-4 text-white">
                          {new Date(game.date).toLocaleDateString()}
                        </td>
                        <td rowSpan={2} className="py-3 px-4 text-white">
                          {game.homeTeam.name} vs {game.awayTeam.name}
                        </td>
                        <td className="py-3 px-4 text-white">
                          {game.selectedHomeGoalie ? 
                            `${game.selectedHomeGoalie.name} (#${game.selectedHomeGoalie.number})` : 
                            'N/A'
                          }
                        </td>
                        <td className={resultClass(getGameResult(game, true))}>
                          {getGameResult(game, true)}
                        </td>
                        <td className={`${cellClass} border-l border-orange-500/30`}>{game.awayTotal.goals}</td>
                        <td className={cellClass}>{game.homeTotal.shotsOnGoal}</td>
                        <td className={`${cellClass} border-l border-orange-500/30`}>{game.homeTotal.covered}</td>
                        <td className={cellClass}>{game.homeTotal.rebounds}</td>
                        <td className={cellClass}>{game.homeTotal.blocked}</td>
                        <td className={cellClass}>{game.homeTotal.missed}</td>
                        <td className={cellClass}>{game.homeTotal.totalShots}</td>
                        <td className={`${cellClass} border-l border-orange-500/30`}>{game.homeSavePercentage}%</td>
                        <td className={cellClass}>{game.homeHitPercentage}%</td>
                        <td rowSpan={2} className="py-3 px-4 text-center">
                          <div className="flex flex-col space-y-2">
                            <button
                              onClick={() => handleViewSummary(game)}
                              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm hover-lift transition-all"
                            >
                              View Summary
                            </button>
                            {showDeleteConfirm === game.id ? (
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => handleDeleteConfirm(game.id!)}
                                  disabled={deletingId === game.id}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm hover-lift transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={handleDeleteCancel}
                                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm hover-lift transition-all"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleDeleteClick(game.id!)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm hover-lift transition-all"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {/* Away Team Row */}
                      <tr className="border-b border-orange-500/20 bg-black/30">
                        <td className="py-3 px-4 text-white">
                          {game.selectedAwayGoalie ? 
                            `${game.selectedAwayGoalie.name} (#${game.selectedAwayGoalie.number})` : 
                            'N/A'
                          }
                        </td>
                        <td className={resultClass(getGameResult(game, false))}>
                          {getGameResult(game, false)}
                        </td>
                        <td className={`${cellClass} border-l border-orange-500/30`}>{game.homeTotal.goals}</td>
                        <td className={cellClass}>{game.awayTotal.shotsOnGoal}</td>
                        <td className={`${cellClass} border-l border-orange-500/30`}>{game.awayTotal.covered}</td>
                        <td className={cellClass}>{game.awayTotal.rebounds}</td>
                        <td className={cellClass}>{game.awayTotal.blocked}</td>
                        <td className={cellClass}>{game.awayTotal.missed}</td>
                        <td className={cellClass}>{game.awayTotal.totalShots}</td>
                        <td className={`${cellClass} border-l border-orange-500/30`}>{game.awaySavePercentage}%</td>
                        <td className={cellClass}>{game.awayHitPercentage}%</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};