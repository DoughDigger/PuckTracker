import React from 'react';

interface StatsTableProps {
  stats: any[];
  currentPeriod: number;
  homeTeam: string;
  awayTeam: string;
}

export const StatsTable: React.FC<StatsTableProps> = ({
  stats,
  currentPeriod,
  homeTeam,
  awayTeam
}) => {
  const calculateStats = (teamName: string) => {
    const currentStats = stats[currentPeriod - 1]?.teamStats[teamName] || {
      goals: [],
      rebounds: [],
      missed: [],
      blocked: [],
      covered: []
    };

    const goals = currentStats.goals?.length || 0;
    const rebounds = currentStats.rebounds?.length || 0;
    const missed = currentStats.missed?.length || 0;
    const blocked = currentStats.blocked?.length || 0;
    const covered = currentStats.covered?.length || 0;

    const totalShots = goals + rebounds + missed + blocked + covered;
    const shotsOnGoal = totalShots - missed - blocked;
    
    const opponentStats = stats[currentPeriod - 1]?.teamStats[teamName === homeTeam ? awayTeam : homeTeam] || {
      goals: []
    };
    const goalsAllowed = opponentStats.goals?.length || 0;
    const shotsAgainst = shotsOnGoal;
    const savePercentage = shotsAgainst > 0 
      ? (((shotsAgainst - goalsAllowed) / shotsAgainst) * 100).toFixed(1) 
      : '0.0';
    
    const hitPercentage = totalShots > 0 
      ? (((totalShots - missed - blocked) / totalShots) * 100).toFixed(1) 
      : '0.0';

    return {
      goals,
      rebounds,
      missed,
      blocked,
      covered,
      totalShots,
      shotsOnGoal,
      savePercentage,
      hitPercentage
    };
  };

  const homeStats = calculateStats(homeTeam);
  const awayStats = calculateStats(awayTeam);

  const cellClass = "py-2 px-4 text-white text-center w-[8%]";
  const headerClass = "py-2 px-4 text-orange-400 text-center w-[8%] font-medium";

  return (
    <div className="bg-black rounded-lg p-4 border border-orange-500/30">
      <h3 className="text-xl font-semibold text-orange-400 mb-4">Period Statistics</h3>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-orange-500/30">
              <th className="py-2 px-4 text-orange-400 text-center w-[12%] font-medium">Team</th>
              {/* Group 1: Core Stats */}
              <th className={`${headerClass} border-l border-orange-500/30`}>Goals</th>
              <th className={headerClass}>SOG</th>
              {/* Spacer */}
              <th className="w-[2%] border-l border-orange-500/30"></th>
              {/* Group 2: Detailed Stats */}
              <th className={headerClass}>Covered</th>
              <th className={headerClass}>Rebound</th>
              <th className={headerClass}>Blocked</th>
              <th className={headerClass}>Missed</th>
              <th className={headerClass}>Total</th>
              {/* Spacer */}
              <th className="w-[2%] border-l border-orange-500/30"></th>
              {/* Group 3: Percentages */}
              <th className={headerClass}>Sv%</th>
              <th className={headerClass}>Hit%</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-orange-500/20">
              <td className="py-2 px-4 text-white text-center">{homeTeam}</td>
              {/* Group 1 */}
              <td className={`${cellClass} border-l border-orange-500/30`}>{homeStats.goals}</td>
              <td className={cellClass}>{homeStats.shotsOnGoal}</td>
              {/* Spacer */}
              <td className="border-l border-orange-500/30"></td>
              {/* Group 2 */}
              <td className={cellClass}>{homeStats.covered}</td>
              <td className={cellClass}>{homeStats.rebounds}</td>
              <td className={cellClass}>{homeStats.blocked}</td>
              <td className={cellClass}>{homeStats.missed}</td>
              <td className={cellClass}>{homeStats.totalShots}</td>
              {/* Spacer */}
              <td className="border-l border-orange-500/30"></td>
              {/* Group 3 */}
              <td className={cellClass}>{homeStats.savePercentage}%</td>
              <td className={cellClass}>{homeStats.hitPercentage}%</td>
            </tr>
            <tr>
              <td className="py-2 px-4 text-white text-center">{awayTeam}</td>
              {/* Group 1 */}
              <td className={`${cellClass} border-l border-orange-500/30`}>{awayStats.goals}</td>
              <td className={cellClass}>{awayStats.shotsOnGoal}</td>
              {/* Spacer */}
              <td className="border-l border-orange-500/30"></td>
              {/* Group 2 */}
              <td className={cellClass}>{awayStats.covered}</td>
              <td className={cellClass}>{awayStats.rebounds}</td>
              <td className={cellClass}>{awayStats.blocked}</td>
              <td className={cellClass}>{awayStats.missed}</td>
              <td className={cellClass}>{awayStats.totalShots}</td>
              {/* Spacer */}
              <td className="border-l border-orange-500/30"></td>
              {/* Group 3 */}
              <td className={cellClass}>{awayStats.savePercentage}%</td>
              <td className={cellClass}>{awayStats.hitPercentage}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};