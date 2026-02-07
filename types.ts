
export enum PlayerRole {
  BATSMAN = 'Batsman',
  BOWLER = 'Bowler',
  ALL_ROUNDER = 'All-rounder',
  WICKET_KEEPER = 'WK-Batsman',
}

export interface PlayerStats {
  matches: number;
  runs: number;
  wickets: number;
  highestScore: number;
  bestBowling: string; // e.g., "3/21"
}

export interface Player {
  id: number;
  name: string;
  age: number;
  role: PlayerRole;
  stats: PlayerStats;
  isCaptain?: boolean;
  basePrice?: number;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  logoUrl: string;
  players: Player[];
  budget: number;
}

export enum MatchStatus {
  UPCOMING = 'UPCOMING',
  LIVE = 'LIVE',
  COMPLETED = 'COMPLETED',
}

export interface Scorecard {
  teamAScore: number;
  teamAWickets: number;
  teamAOvers: number;
  teamBScore: number;
  teamBWickets: number;
  teamBOvers: number;
}

export interface Match {
  id: number;
  teamA: Team;
  teamB: Team;
  venue: string;
  dateTime: string;
  status: MatchStatus;
  scorecard?: Scorecard;
  result?: string;
}

export interface PointsTableEntry {
  team: Team;
  matches: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  netRunRate: number;
}

export enum TournamentFormat {
  LEAGUE = 'League',
  KNOCKOUT = 'Knockout',
  GROUP_KNOCKOUT = 'Group + Knockout',
}

export interface Tournament {
  id: number;
  name: string;
  format: TournamentFormat;
  location: string;
  matchOvers: number;
  teams: Team[];
  fixtures: Match[];
  pointsTable: PointsTableEntry[];
}

export interface AdminUser {
    name: string;
    avatarUrl: string;
}

export type Theme = 'light' | 'dark';

export interface CapturedMoment {
  id: number;
  matchId: number;
  matchLabel: string;
  url: string;
  type: 'image' | 'video';
  size: number; // in bytes
}

export type View = 'DASHBOARD' | 'FIXTURES' | 'TEAMS' | 'POINTS_TABLE' | 'LIVE_SCORE' | 'STATS' | 'MVP' | 'SETTINGS' | 'TOURNAMENTS' | 'AUCTION' | 'PLAYER_POOL' | 'STORAGE';
