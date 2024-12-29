import React from 'react';
import { GameResult } from '../types/game';
import { HockeyRink } from './HockeyRink';
import { StatsTable } from './StatsTable';
import { SogSummaryTable } from './SogSummaryTable';

interface GameSummaryViewProps {
  game: GameResult;
  onClose: () => void;
}

export const GameSummaryView: React.FC<GameSummaryViewProps> = ({ game, onClose }) => {
  return (
    <div className="min-h-screen bg-background overflow-auto">
      <div className="max-w-[1800px] mx-auto p-4">
        <div className="glass-effect relative rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover-lift transition-all"
              >
                Back
              </button>
              <h1 className="text-3xl font-bold text-primary">Game Summary</h1>
            </div>
            <div className="text-gray-600">
              {new Date(game.date).toLocaleDateString()}
            </div>
          </div>

          {/* Game Summary */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Total Game Statistics</h2>
            <SogSummaryTable
              stats={game.periodStats.map(period => ({
                teamStats: {
                  [game.homeTeam.name]: {
                    goals: Array(period.homeStats.goals).fill({ location: { x: 0, y: 0 } }),
                    rebounds: Array(period.homeStats.rebounds).fill({ location: { x: 0, y: 0 } }),
                    covered: Array(period.homeStats.covered).fill({ location: { x: 0, y: 0 } }),
                    blocked: Array(period.homeStats.blocked).fill({ location: { x: 0, y: 0 } }),
                    missed: Array(period.homeStats.missed).fill({ location: { x: 0, y: 0 } })
                  },
                  [game.awayTeam.name]: {
                    goals: Array(period.awayStats.goals).fill({ location: { x: 0, y: 0 } }),
                    rebounds: Array(period.awayStats.rebounds).fill({ location: { x: 0, y: 0 } }),
                    covered: Array(period.awayStats.covered).fill({ location: { x: 0, y: 0 } }),
                    blocked: Array(period.awayStats.blocked).fill({ location: { x: 0, y: 0 } }),
                    missed: Array(period.awayStats.missed).fill({ location: { x: 0, y: 0 } })
                  }
                }
              }))}
              currentPeriod={5}
              homeTeam={game.homeTeam.name}
              awayTeam={game.awayTeam.name}
            />
          </div>

          {/* Period Summaries */}
          {game.periodStats.map((periodStats, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">
                {index === 3 ? 'Overtime' : index === 4 ? 'Shootout' : `Period ${index + 1}`}
              </h2>
              <div className="mb-4">
                <StatsTable
                  stats={[{
                    teamStats: {
                      [game.homeTeam.name]: {
                        goals: Array(periodStats.homeStats.goals).fill({ location: { x: 0, y: 0 } }),
                        rebounds: Array(periodStats.homeStats.rebounds).fill({ location: { x: 0, y: 0 } }),
                        covered: Array(periodStats.homeStats.covered).fill({ location: { x: 0, y: 0 } }),
                        blocked: Array(periodStats.homeStats.blocked).fill({ location: { x: 0, y: 0 } }),
                        missed: Array(periodStats.homeStats.missed).fill({ location: { x: 0, y: 0 } })
                      },
                      [game.awayTeam.name]: {
                        goals: Array(periodStats.awayStats.goals).fill({ location: { x: 0, y: 0 } }),
                        rebounds: Array(periodStats.awayStats.rebounds).fill({ location: { x: 0, y: 0 } }),
                        covered: Array(periodStats.awayStats.covered).fill({ location: { x: 0, y: 0 } }),
                        blocked: Array(periodStats.awayStats.blocked).fill({ location: { x: 0, y: 0 } }),
                        missed: Array(periodStats.awayStats.missed).fill({ location: { x: 0, y: 0 } })
                      }
                    }
                  }]}
                  currentPeriod={1}
                  homeTeam={game.homeTeam.name}
                  awayTeam={game.awayTeam.name}
                />
              </div>
              <div className="bg-surface rounded-lg p-4 border border-gray-200">
                <HockeyRink
                  onRinkClick={() => {}}
                  homeTeam={game.homeTeam.name}
                  awayTeam={game.awayTeam.name}
                  currentStats={{
                    [game.homeTeam.name]: {
                      goals: Array(periodStats.homeStats.goals).fill({ location: { x: 0, y: 0 } }),
                      rebounds: Array(periodStats.homeStats.rebounds).fill({ location: { x: 0, y: 0 } }),
                      covered: Array(periodStats.homeStats.covered).fill({ location: { x: 0, y: 0 } }),
                      blocked: Array(periodStats.homeStats.blocked).fill({ location: { x: 0, y: 0 } }),
                      missed: Array(periodStats.homeStats.missed).fill({ location: { x: 0, y: 0 } })
                    },
                    [game.awayTeam.name]: {
                      goals: Array(periodStats.awayStats.goals).fill({ location: { x: 0, y: 0 } }),
                      rebounds: Array(periodStats.awayStats.rebounds).fill({ location: { x: 0, y: 0 } }),
                      covered: Array(periodStats.awayStats.covered).fill({ location: { x: 0, y: 0 } }),
                      blocked: Array(periodStats.awayStats.blocked).fill({ location: { x: 0, y: 0 } }),
                      missed: Array(periodStats.awayStats.missed).fill({ location: { x: 0, y: 0 } })
                    }
                  }}
                  selectedHomeGoalie={game.selectedHomeGoalie}
                  selectedAwayGoalie={game.selectedAwayGoalie}
                  sidesFlipped={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
