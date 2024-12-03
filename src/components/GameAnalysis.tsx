import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllGames } from '../db';
import { GameResult } from '../types/game';
import { HockeyRink } from './HockeyRink';

interface CombinedStats {
  goals: Array<{ location: { x: number; y: number } }>;
  rebounds: Array<{ location: { x: number; y: number } }>;
  missed: Array<{ location: { x: number; y: number } }>;
  blocked: Array<{ location: { x: number; y: number } }>;
  covered: Array<{ location: { x: number; y: number } }>;
  totalGoals: number;
  totalShots: number;
  totalShotsOnGoal: number;
  totalMissed: number;
  totalBlocked: number;
}

export const GameAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<GameResult[]>([]);
  const [selectedGames, setSelectedGames] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(0);
  const [teams, setTeams] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [combinedStats, setCombinedStats] = useState<CombinedStats | null>(null);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const allGames = await getAllGames();
      setGames(allGames.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));

      const uniqueTeams = new Set<string>();
      allGames.forEach(game => {
        uniqueTeams.add(game.homeTeam.name);
        uniqueTeams.add(game.awayTeam.name);
      });
      setTeams(Array.from(uniqueTeams));
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameSelect = (game: GameResult) => {
    setSelectedGames(prev => {
      const isSelected = prev.some(g => g.id === game.id);
      if (isSelected) {
        return prev.filter(g => g.id !== game.id);
      } else {
        return [...prev, game];
      }
    });
  };

  const combineGameStats = () => {
    if (!selectedGames.length || !selectedTeam) return;

    const combinedTeamStats: CombinedStats = {
      goals: [],
      rebounds: [],
      missed: [],
      blocked: [],
      covered: [],
      totalGoals: 0,
      totalShots: 0,
      totalShotsOnGoal: 0,
      totalMissed: 0,
      totalBlocked: 0,
    };

    selectedGames.forEach(game => {
      const isHome = game.homeTeam.name === selectedTeam;
      const teamTotals = isHome ? game.homeTotal : game.awayTotal;

      // Add shot locations
      if (teamTotals.goals > 0) combinedTeamStats.goals.push(...Array(teamTotals.goals).fill({ location: { x: 0, y: 0 } }));
      if (teamTotals.rebounds > 0) combinedTeamStats.rebounds.push(...Array(teamTotals.rebounds).fill({ location: { x: 0, y: 0 } }));
      if (teamTotals.missed > 0) combinedTeamStats.missed.push(...Array(teamTotals.missed).fill({ location: { x: 0, y: 0 } }));
      if (teamTotals.blocked > 0) combinedTeamStats.blocked.push(...Array(teamTotals.blocked).fill({ location: { x: 0, y: 0 } }));
      if (teamTotals.covered > 0) combinedTeamStats.covered.push(...Array(teamTotals.covered).fill({ location: { x: 0, y: 0 } }));

      // Update totals
      combinedTeamStats.totalGoals += teamTotals.goals;
      combinedTeamStats.totalShots += teamTotals.totalShots;
      combinedTeamStats.totalShotsOnGoal += teamTotals.shotsOnGoal;
      combinedTeamStats.totalMissed += teamTotals.missed;
      combinedTeamStats.totalBlocked += teamTotals.blocked;
    });

    setCombinedStats(combinedTeamStats);
  };

  useEffect(() => {
    combineGameStats();
  }, [selectedGames, selectedTeam, selectedPeriod]);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-effect rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Game Analysis</h1>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover-lift transition-all"
            >
              Back to Home
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-600 py-8">Loading games...</div>
          ) : (
            <div className="space-y-6">
              {/* Filters */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Team
                  </label>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select a team</option>
                    {teams.map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Period
                  </label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value={0}>All Periods</option>
                    <option value={1}>Period 1</option>
                    <option value={2}>Period 2</option>
                    <option value={3}>Period 3</option>
                    <option value={4}>Overtime</option>
                    <option value={5}>Shootout</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Game Selection */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Select Games</h2>
                <div className="grid grid-cols-1 gap-3">
                  {games
                    .filter(game => game.homeTeam.name === selectedTeam || game.awayTeam.name === selectedTeam)
                    .filter(game => {
                      if (!dateRange.start || !dateRange.end) return true;
                      const gameDate = new Date(game.date);
                      return gameDate >= new Date(dateRange.start) && gameDate <= new Date(dateRange.end);
                    })
                    .map(game => (
                      <div
                        key={game.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedGames.some(g => g.id === game.id)
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 hover:border-primary/50'
                        }`}
                        onClick={() => handleGameSelect(game)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">
                              {game.homeTeam.name} vs {game.awayTeam.name}
                            </span>
                            <span className="text-gray-500 ml-2">
                              {new Date(game.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-lg font-bold">
                            {game.homeTotal.goals} - {game.awayTotal.goals}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Combined Stats Display */}
              {combinedStats && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Combined Statistics</h2>
                    <div className="grid grid-cols-5 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Total Goals</h3>
                        <p className="text-2xl font-bold text-gray-900">
                          {combinedStats.totalGoals}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Total Shots</h3>
                        <p className="text-2xl font-bold text-gray-900">
                          {combinedStats.totalShots}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Shots on Goal</h3>
                        <p className="text-2xl font-bold text-gray-900">
                          {combinedStats.totalShotsOnGoal}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Missed</h3>
                        <p className="text-2xl font-bold text-gray-900">
                          {combinedStats.totalMissed}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Blocked</h3>
                        <p className="text-2xl font-bold text-gray-900">
                          {combinedStats.totalBlocked}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Combined Shot Chart */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Combined Shot Chart</h2>
                    <HockeyRink
                      onRinkClick={() => {}}
                      homeTeam={selectedTeam}
                      awayTeam=""
                      currentStats={{ [selectedTeam]: combinedStats }}
                      selectedHomeGoalie={null}
                      selectedAwayGoalie={null}
                      sidesFlipped={false}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};