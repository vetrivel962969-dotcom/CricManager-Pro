
import { type Tournament, type Player, type Team, PlayerRole, MatchStatus, TournamentFormat } from './types';

// Unassigned Players for Auction
export const UNASSIGNED_PLAYERS: Player[] = [
    { id: 101, name: 'Chris Morris', age: 35, role: PlayerRole.ALL_ROUNDER, basePrice: 200, stats: { matches: 0, runs: 0, wickets: 0, highestScore: 0, bestBowling: 'N/A' } },
    { id: 102, name: 'David Warner', age: 35, role: PlayerRole.BATSMAN, basePrice: 200, stats: { matches: 0, runs: 0, wickets: 0, highestScore: 0, bestBowling: 'N/A' } },
    { id: 103, name: 'Pat Cummins', age: 29, role: PlayerRole.BOWLER, basePrice: 150, stats: { matches: 0, runs: 0, wickets: 0, highestScore: 0, bestBowling: 'N/A' } },
    { id: 104, name: 'Ben Stokes', age: 31, role: PlayerRole.ALL_ROUNDER, basePrice: 200, stats: { matches: 0, runs: 0, wickets: 0, highestScore: 0, bestBowling: 'N/A' } },
    { id: 105, name: 'Jonny Bairstow', age: 32, role: PlayerRole.WICKET_KEEPER, basePrice: 150, stats: { matches: 0, runs: 0, wickets: 0, highestScore: 0, bestBowling: 'N/A' } },
    { id: 106, name: 'Rashid Khan', age: 23, role: PlayerRole.BOWLER, basePrice: 200, stats: { matches: 0, runs: 0, wickets: 0, highestScore: 0, bestBowling: 'N/A' } },
    { id: 107, name: 'Quinton de Kock', age: 29, role: PlayerRole.WICKET_KEEPER, basePrice: 150, stats: { matches: 0, runs: 0, wickets: 0, highestScore: 0, bestBowling: 'N/A' } },
    { id: 108, name: 'Jason Holder', age: 30, role: PlayerRole.ALL_ROUNDER, basePrice: 100, stats: { matches: 0, runs: 0, wickets: 0, highestScore: 0, bestBowling: 'N/A' } },
    { id: 109, name: 'Mitchell Starc', age: 32, role: PlayerRole.BOWLER, basePrice: 200, stats: { matches: 0, runs: 0, wickets: 0, highestScore: 0, bestBowling: 'N/A' } },
    { id: 110, name: 'Nicholas Pooran', age: 26, role: PlayerRole.WICKET_KEEPER, basePrice: 100, stats: { matches: 0, runs: 0, wickets: 0, highestScore: 0, bestBowling: 'N/A' } },
];


// Tournament Data
export const TOURNAMENT_DATA: Tournament = {
  id: 1,
  name: 'Mini IPL Championship 2024',
  format: TournamentFormat.LEAGUE,
  location: 'India',
  matchOvers: 20,
  teams: [],
  fixtures: [],
  pointsTable: [],
};
