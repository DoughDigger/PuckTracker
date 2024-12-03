import { create } from 'zustand';
import { Player, Team, Location, GameStats } from '../types/team';

interface TeamStats {
  goals: { location: Location }[];
  rebounds: { location: Location }[];
  missed: { location: Location }[];
  blocked: { location: Location }[];
  covered: { location: Location }[];
}

interface GameState {
  homeTeam: Team;
  awayTeam: Team;
  gameDate: string;
  currentPeriod: number;
  stats: GameStats[];
  actionHistory: {
    period: number;
    teamName: string;
    action: string;
    location: Location;
  }[];
  selectedHomeGoalie: Player | null;
  selectedAwayGoalie: Player | null;

  // Actions
  setHomeTeamName: (name: string) => void;
  setAwayTeamName: (name: string) => void;
  setGameDate: (date: string) => void;
  addPlayerToTeam: (teamType: 'home' | 'away', player: Omit<Player, 'id'>) => void;
  setSelectedGoalie: (teamType: 'home' | 'away', player: Player | null) => void;
  recordAction: (teamName: string, action: string, location: Location) => void;
  nextPeriod: () => void;
  previousPeriod: () => void;
  undoLastAction: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  homeTeam: { name: '', players: [] },
  awayTeam: { name: '', players: [] },
  gameDate: new Date().toISOString().split('T')[0],
  currentPeriod: 1,
  stats: [{ period: 1, teamStats: {} }],
  actionHistory: [],
  selectedHomeGoalie: null,
  selectedAwayGoalie: null,

  setHomeTeamName: (name) => set((state) => ({
    homeTeam: { ...state.homeTeam, name }
  })),

  setAwayTeamName: (name) => set((state) => ({
    awayTeam: { ...state.awayTeam, name }
  })),

  setGameDate: (date) => set({ gameDate: date }),

  addPlayerToTeam: (teamType, player) => set((state) => {
    const team = teamType === 'home' ? 'homeTeam' : 'awayTeam';
    return {
      [team]: {
        ...state[team],
        players: [...state[team].players, player]
      }
    };
  }),

  setSelectedGoalie: (teamType, player) => set(() => ({
    ...(teamType === 'home' 
      ? { selectedHomeGoalie: player }
      : { selectedAwayGoalie: player }
    )
  })),

  recordAction: (teamName, action, location) => set((state) => {
    const currentStats = [...state.stats];
    const currentPeriodStats = currentStats[state.currentPeriod - 1];

    if (!currentPeriodStats.teamStats[teamName]) {
      currentPeriodStats.teamStats[teamName] = {
        goals: [],
        rebounds: [],
        missed: [],
        blocked: [],
        covered: []
      } as TeamStats;
    }

    const actionMap: Record<string, keyof TeamStats> = {
      'GOAL': 'goals',
      'REBOUND': 'rebounds',
      'MISSED': 'missed',
      'BLOCKED': 'blocked',
      'COVERED': 'covered'
    };

    const actionType = actionMap[action];
    if (actionType && currentPeriodStats.teamStats[teamName][actionType]) {
      (currentPeriodStats.teamStats[teamName][actionType] as { location: Location }[]).push({ location });
    }

    return {
      stats: currentStats,
      actionHistory: [
        ...state.actionHistory,
        { period: state.currentPeriod, teamName, action, location }
      ]
    };
  }),

  nextPeriod: () => set((state) => {
    const nextPeriod = state.currentPeriod + 1;
    if (nextPeriod > 5) return state;

    return {
      currentPeriod: nextPeriod,
      stats: [
        ...state.stats,
        { period: nextPeriod, teamStats: {} }
      ]
    };
  }),

  previousPeriod: () => set((state) => ({
    currentPeriod: Math.max(1, state.currentPeriod - 1)
  })),

  undoLastAction: () => set((state) => {
    const lastAction = state.actionHistory[state.actionHistory.length - 1];
    if (!lastAction || lastAction.period !== state.currentPeriod) return state;

    const newStats = [...state.stats];
    const currentPeriodStats = newStats[state.currentPeriod - 1];
    const teamStats = currentPeriodStats.teamStats[lastAction.teamName] as TeamStats;

    const actionMap: Record<string, keyof TeamStats> = {
      'GOAL': 'goals',
      'REBOUND': 'rebounds',
      'MISSED': 'missed',
      'BLOCKED': 'blocked',
      'COVERED': 'covered'
    };

    const actionType = actionMap[lastAction.action];
    if (actionType && teamStats && teamStats[actionType]) {
      teamStats[actionType] = teamStats[actionType].slice(0, -1);
    }

    return {
      stats: newStats,
      actionHistory: state.actionHistory.slice(0, -1)
    };
  })
}));