import React from 'react';
import { HockeyRink } from './HockeyRink';
import { StatsTable } from './StatsTable';
import { GameStats } from '../types/game';

interface PeriodSummaryProps {
  periodStats: GameStats;
  periodNumber: number;
  homeTeam: string;
  awayTeam: string;
  selectedHomeGoalie: any;
  selectedAwayGoalie: any;
}

export const PeriodSummary: React.FC<PeriodSummaryProps> = ({
  periodStats,
  periodNumber,
  homeTeam,
  awayTeam,
  selectedHomeGoalie,
  selectedAwayGoalie,
}) => {
  const periodLabel = periodNumber === 4 ? 'Overtime' : 
                     periodNumber === 5 ? 'Shootout' : 
                     `Period ${periodNumber}`;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-primary mb-4">{periodLabel}</h2>
      <div className="mb-4">
        <StatsTable
          stats={[periodStats]}
          currentPeriod={1}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
        />
      </div>
      <div className="bg-surface rounded-lg p-4 border border-gray-200">
        <HockeyRink
          onRinkClick={() => {}}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          currentStats={periodStats.teamStats}
          selectedHomeGoalie={selectedHomeGoalie}
          selectedAwayGoalie={selectedAwayGoalie}
          sidesFlipped={false}
        />
      </div>
    </div>
  );
};