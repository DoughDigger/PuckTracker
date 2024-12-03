import { GameResult } from '../types/game';

export const generateCSV = (games: GameResult[]): string => {
  // CSV Headers
  const headers = [
    'Date',
    'Team',
    'Opponent',
    'Goalie',
    'Result',
    'GA',
    'SOG',
    'Covered',
    'Rebound',
    'Blocked',
    'Missed',
    'Total Shots',
    'Sv%',
    'Hit%'
  ].join(',');

  // Generate rows for each team in each game
  const rows = games.flatMap(game => {
    const date = new Date(game.date).toLocaleDateString();
    const getResult = (isHome: boolean) => {
      const homeGoals = game.homeTotal.goals;
      const awayGoals = game.awayTotal.goals;
      if (homeGoals === awayGoals) return "T";
      if (isHome) {
        return homeGoals > awayGoals ? "W" : "L";
      }
      return awayGoals > homeGoals ? "W" : "L";
    };

    // Home team row
    const homeRow = [
      date,
      game.homeTeam.name,
      game.awayTeam.name,
      game.selectedHomeGoalie ? `${game.selectedHomeGoalie.name} (#${game.selectedHomeGoalie.number})` : 'N/A',
      getResult(true),
      game.awayTotal.goals,
      game.homeTotal.shotsOnGoal,
      game.homeTotal.covered,
      game.homeTotal.rebounds,
      game.homeTotal.blocked,
      game.homeTotal.missed,
      game.homeTotal.totalShots,
      `${game.homeSavePercentage}%`,
      `${game.homeHitPercentage}%`
    ].map(value => `"${value}"`).join(',');

    // Away team row
    const awayRow = [
      date,
      game.awayTeam.name,
      game.homeTeam.name,
      game.selectedAwayGoalie ? `${game.selectedAwayGoalie.name} (#${game.selectedAwayGoalie.number})` : 'N/A',
      getResult(false),
      game.homeTotal.goals,
      game.awayTotal.shotsOnGoal,
      game.awayTotal.covered,
      game.awayTotal.rebounds,
      game.awayTotal.blocked,
      game.awayTotal.missed,
      game.awayTotal.totalShots,
      `${game.awaySavePercentage}%`,
      `${game.awayHitPercentage}%`
    ].map(value => `"${value}"`).join(',');

    return [homeRow, awayRow];
  });

  return [headers, ...rows].join('\n');
};

export const downloadCSV = (games: GameResult[]) => {
  const csv = generateCSV(games);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `hockey_stats_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};