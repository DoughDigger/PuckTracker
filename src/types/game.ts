import { Team, Player, Location } from './team';

export interface GameStats {
  period: number;
  teamStats: {
    [teamName: string]: {
      goals: Array<{ location: Location }>;
      rebounds: Array<{ location: Location }>;
      missed: Array<{ location: Location }>;
      blocked: Array<{ location: Location }>;
      covered: Array<{ location: Location }>;
    }
  }
}

export interface PeriodStats {
  period: number;
  homeStats: {
    goals: number;
    shotsOnGoal: number;
    covered: number;
    rebounds: number;
    blocked: number;
    missed: number;
  };
  awayStats: {
    goals: number;
    shotsOnGoal: number;
    covered: number;
    rebounds: number;
    blocked: number;
    missed: number;
  };
}

export interface GameSummaryData {
  homeTeam: Team;
  awayTeam: Team;
  homeTotal: {
    goals: number;
    shotsOnGoal: number;
    covered: number;
    rebounds: number;
    blocked: number;
    missed: number;
    totalShots: number;
  };
  awayTotal: {
    goals: number;
    shotsOnGoal: number;
    covered: number;
    rebounds: number;
    blocked: number;
    missed: number;
    totalShots: number;
  };
  homeSavePercentage: string;
  awaySavePercentage: string;
  homeHitPercentage: string;
  awayHitPercentage: string;
  selectedHomeGoalie: Player | null;
  selectedAwayGoalie: Player | null;
  date: string;
  periodStats: PeriodStats[];
}

export interface GameResult extends GameSummaryData {
  id?: number;
}