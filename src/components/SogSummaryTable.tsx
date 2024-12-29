import React from 'react';

interface SogSummaryTableProps {
  stats: any[];
  currentPeriod: number;
  homeTeam: string;
  awayTeam: string;
}

export const SogSummaryTable: React.FC<SogSummaryTableProps> = ({
  stats,
  currentPeriod,
  homeTeam,
  awayTeam
}) => {
  const calculatePeriodStats = (teamName: string, period: number) => {
    if (period > currentPeriod || !stats[period - 1]?.teamStats[teamName]) {
      return { sog: '-', goals: '-' };
    }

    const periodStats = stats[period - 1].teamStats[teamName];
    const totalShots = (periodStats.goals?.length || 0) +
                      (periodStats.rebounds?.length || 0) +
                      (periodStats.blocked?.length || 0) +
                      (periodStats.covered?.length || 0) +
                      (periodStats.missed?.length || 0);
    const missed = periodStats.missed?.length || 0;
    const blocked = periodStats.blocked?.length || 0;
    const goals = periodStats.goals?.length || 0;
    const sog = totalShots - missed - blocked;

    return { sog, goals };
  };

  const calculateTotals = (teamName: string) => {
    let totalSog = 0;
    let totalGoals = 0;
    let validPeriods = 0;
    let totalShotsForHit = 0;
    let totalHits = 0;
    let totalShotsAgainst = 0;
    let totalGoalsAgainst = 0;

    for (let period = 1; period <= 4; period++) {
      if (period > currentPeriod || !stats[period - 1]?.teamStats[teamName]) continue;

      const periodStats = stats[period - 1].teamStats[teamName];
      const opponentStats = stats[period - 1]?.teamStats[teamName === homeTeam ? awayTeam : homeTeam];

      if (periodStats) {
        const totalShots = (periodStats.goals?.length || 0) +
                         (periodStats.rebounds?.length || 0) +
                         (periodStats.blocked?.length || 0) +
                         (periodStats.covered?.length || 0) +
                         (periodStats.missed?.length || 0);
        const missed = periodStats.missed?.length || 0;
        const blocked = periodStats.blocked?.length || 0;
        const sog = totalShots - missed - blocked;
        const goals = periodStats.goals?.length || 0;

        totalSog += sog;
        totalGoals += goals;
        totalShotsForHit += totalShots;
        totalHits += (totalShots - missed - blocked);
        validPeriods++;

        if (opponentStats) {
          const oppSog = (opponentStats.goals?.length || 0) +
                        (opponentStats.rebounds?.length || 0) +
                        (opponentStats.covered?.length || 0);
          const oppGoals = opponentStats.goals?.length || 0;
          totalShotsAgainst += oppSog;
          totalGoalsAgainst += oppGoals;
        }
      }
    }

    if (currentPeriod === 5 && stats[4]?.teamStats[teamName]) {
      const shootoutStats = stats[4].teamStats[teamName];
      const shootoutGoals = shootoutStats.goals?.length || 0;
      totalGoals += shootoutGoals;
    }

    const hitPercentage = totalShotsForHit > 0 
      ? ((totalHits / totalShotsForHit) * 100).toFixed(1)
      : '0.0';

    const savePercentage = totalShotsAgainst > 0
      ? (((totalShotsAgainst - totalGoalsAgainst) / totalShotsAgainst) * 100).toFixed(1)
      : '0.0';

    return {
      totalSog,
      totalGoals,
      hitPercentage,
      savePercentage
    };
  };

  const cellClass = "custom-cell py-1 px-2 text-white text-right w-12";
  const headerClass = "py-1 px-2 text-orange-400 text-center text-sm w-12 font-medium";
  const totalCellClass = "custom-cell py-1 px-2 text-white text-center w-14 border-l border-orange-500/30";
  const percentCellClass = "py-1 px-2 text-white text-center w-16 border-l border-orange-500/30";

  return (
    <div className="flex space-x-4">
      {/* Goals Table */}
      <div className="bg-black rounded-lg border border-orange-500/30 inline-block">
        <table className="table-fixed">
          <thead>
            <tr className="border-b border-orange-500/30">
              <th className="py-1 px-2 text-orange-400 text-center w-20">Goals</th>
              <th className={headerClass}>P1</th>
              <th className={headerClass}>P2</th>
              <th className={headerClass}>P3</th>
              <th className={headerClass}>OT</th>
              <th className={headerClass}>SO</th>
              <th className={`${headerClass} border-l border-orange-500/30`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {[homeTeam, awayTeam].map((team) => {
              const totals = calculateTotals(team);
              return (
                <tr key={`goals-${team}`} className="border-b border-orange-500/20">
                  <td className="py-1 px-2 text-white text-center">{team}</td>
                  {[1, 2, 3, 4, 5].map((period) => {
                    const stats = calculatePeriodStats(team, period);
                    return (
                      <td key={period} className={cellClass}>
                        {stats.goals !== '-' ? stats.goals : '-'}
                      </td>
                    );
                  })}
                  <td className={totalCellClass}>{totals.totalGoals}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* SOG Table */}
      <div className="bg-black rounded-lg border border-orange-500/30 inline-block">
        <table className="table-fixed">
          <thead>
            <tr className="border-b border-orange-500/30">
              <th className="py-1 px-2 text-orange-400 text-center w-20">Shots</th>
              <th className={headerClass}>P1</th>
              <th className={headerClass}>P2</th>
              <th className={headerClass}>P3</th>
              <th className={headerClass}>OT</th>
              <th className={headerClass}>SO</th>
              <th className={`${headerClass} border-l border-orange-500/30`}>Total</th>
              <th className={`${headerClass} border-l border-orange-500/30`}>Sv%</th>
              <th className={`${headerClass} border-l border-orange-500/30`}>Hit%</th>
            </tr>
          </thead>
          <tbody>
            {[homeTeam, awayTeam].map((team) => {
              const totals = calculateTotals(team);
              return (
                <tr key={`sog-${team}`} className="border-b border-orange-500/20">
                  <td className="py-1 px-2 text-white text-right">{team}</td>
                  {[1, 2, 3, 4, 5].map((period) => {
                    const stats = calculatePeriodStats(team, period);
                    return (
                      <td key={period} className={cellClass}>
                        {stats.sog !== '-' ? stats.sog : '-'}
                      </td>
                    );
                  })}
                  <td className={totalCellClass}>{totals.totalSog}</td>
                  <td className={percentCellClass}>{totals.savePercentage}%</td>
                  <td className={percentCellClass}>{totals.hitPercentage}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};