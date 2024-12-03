export interface Player {
  id?: number;
  number: string;
  name: string;
  position: string;
  teamType?: string;
  createdAt?: string;
}

export interface Team {
  name: string;
  players: Player[];
}

export interface Location {
  x: number;
  y: number;
}

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