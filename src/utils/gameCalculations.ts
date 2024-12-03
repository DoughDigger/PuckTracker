import { GameSummaryData, GameStats, PeriodStats } from '../types/game';
import { Team, Player } from '../types/team';

export const calculateGameSummary = (
  stats: GameStats[],
  homeTeam: Team,
  awayTeam: Team,
  selectedHomeGoalie: Player | null,
  selectedAwayGoalie: Player | null,
  gameDate: string
): GameSummaryData => {
  const homeTotal = {
    goals: 0,
    shotsOnGoal: 0,
    covered: 0,
    rebounds: 0,
    blocked: 0,
    missed: 0,
    totalShots: 0
  };

  const awayTotal = {
    goals: 0,
    shotsOnGoal: 0,
    covered: 0,
    rebounds: 0,
    blocked: 0,
    missed: 0,
    totalShots: 0
  };

  const periodStats: PeriodStats[] = stats.map((periodStat, index) => {
    const homeStats = periodStat.teamStats[homeTeam.name] || {};
    const awayStats = periodStat.teamStats[awayTeam.name] || {};

    const homeGoals = homeStats.goals?.length || 0;
    const homeCovered = homeStats.covered?.length || 0;
    const homeRebounds = homeStats.rebounds?.length || 0;
    const homeBlocked = homeStats.blocked?.length || 0;
    const homeMissed = homeStats.missed?.length || 0;

    const awayGoals = awayStats.goals?.length || 0;
    const awayCovered = awayStats.covered?.length || 0;
    const awayRebounds = awayStats.rebounds?.length || 0;
    const awayBlocked = awayStats.blocked?.length || 0;
    const awayMissed = awayStats.missed?.length || 0;

    // Update totals
    homeTotal.goals += homeGoals;
    homeTotal.covered += homeCovered;
    homeTotal.rebounds += homeRebounds;
    homeTotal.blocked += homeBlocked;
    homeTotal.missed += homeMissed;

    awayTotal.goals += awayGoals;
    awayTotal.covered += awayCovered;
    awayTotal.rebounds += awayRebounds;
    awayTotal.blocked += awayBlocked;
    awayTotal.missed += awayMissed;

    return {
      period: index + 1,
      homeStats: {
        goals: homeGoals,
        shotsOnGoal: homeGoals + homeRebounds + homeCovered,
        covered: homeCovered,
        rebounds: homeRebounds,
        blocked: homeBlocked,
        missed: homeMissed
      },
      awayStats: {
        goals: awayGoals,
        shotsOnGoal: awayGoals + awayRebounds + awayCovered,
        covered: awayCovered,
        rebounds: awayRebounds,
        blocked: awayBlocked,
        missed: awayMissed
      }
    };
  });

  // Calculate final totals
  homeTotal.totalShots = homeTotal.goals + homeTotal.covered + homeTotal.rebounds + homeTotal.blocked + homeTotal.missed;
  homeTotal.shotsOnGoal = homeTotal.totalShots - homeTotal.missed - homeTotal.blocked;

  awayTotal.totalShots = awayTotal.goals + awayTotal.covered + awayTotal.rebounds + awayTotal.blocked + awayTotal.missed;
  awayTotal.shotsOnGoal = awayTotal.totalShots - awayTotal.missed - awayTotal.blocked;

  const homeSavePercentage = awayTotal.shotsOnGoal > 0
    ? (((awayTotal.shotsOnGoal - awayTotal.goals) / awayTotal.shotsOnGoal) * 100).toFixed(1)
    : '0.0';

  const awaySavePercentage = homeTotal.shotsOnGoal > 0
    ? (((homeTotal.shotsOnGoal - homeTotal.goals) / homeTotal.shotsOnGoal) * 100).toFixed(1)
    : '0.0';

  const homeHitPercentage = homeTotal.totalShots > 0
    ? (((homeTotal.totalShots - homeTotal.missed - homeTotal.blocked) / homeTotal.totalShots) * 100).toFixed(1)
    : '0.0';

  const awayHitPercentage = awayTotal.totalShots > 0
    ? (((awayTotal.totalShots - awayTotal.missed - awayTotal.blocked) / awayTotal.totalShots) * 100).toFixed(1)
    : '0.0';

  return {
    homeTeam,
    awayTeam,
    homeTotal,
    awayTotal,
    homeSavePercentage,
    awaySavePercentage,
    homeHitPercentage,
    awayHitPercentage,
    selectedHomeGoalie,
    selectedAwayGoalie,
    date: gameDate,
    periodStats
  };
};