
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Fixtures from './components/Fixtures';
import Teams from './components/Teams';
import PointsTable from './components/PointsTable';
import LiveScore from './components/LiveScore';
import Stats from './components/Stats';
import MvpTracker from './components/MvpTracker';
import Settings from './components/Settings';
import Login from './components/Login';
import Tournaments from './components/Tournaments';
import Auction from './components/Auction';
import PlayerPool from './components/PlayerPool';
import Storage from './components/Storage';
import ConfirmationModal from './components/ConfirmationModal';
import TrophyIcon from './components/icons/TrophyIcon';
import { type View, type Player, type Team, type AdminUser, type Match, MatchStatus, type Scorecard, type Tournament, TournamentFormat, type Theme, type CapturedMoment } from './types';
import { TOURNAMENT_DATA, UNASSIGNED_PLAYERS } from './constants';


// --- Start of Auth Service Mock ---
const authService = {
  login: (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock credentials check
        if (username === 'admin' && password === 'password') {
          const mockToken = 'mock-jwt-token-for-cricmanager-pro';
          localStorage.setItem('authToken', mockToken);
          resolve(true);
        } else {
          reject(new Error('Invalid username or password'));
        }
      }, 500); // Simulate network delay
    });
  },
  
  register: (username, email, password) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate successful registration and login
            const mockToken = 'mock-jwt-token-for-cricmanager-pro';
            localStorage.setItem('authToken', mockToken);
            resolve(true);
        }, 500);
    });
  },

  logout: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('authToken');
        resolve(true);
      }, 200);
    });
  },

  verifyToken: () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const token = localStorage.getItem('authToken');
            if (token === 'mock-jwt-token-for-cricmanager-pro') {
                resolve(true);
            } else {
                localStorage.removeItem('authToken');
                reject(new Error('Invalid token'));
            }
        }, 300);
    });
  },
};
// --- End of Auth Service Mock ---


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [activeView, setActiveView] = useState<View>('DASHBOARD');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(null);
  const [unassignedPlayers, setUnassignedPlayers] = useState<Player[]>([]);
  const [unsoldPlayers, setUnsoldPlayers] = useState<Player[]>([]);
  const [capturedMoments, setCapturedMoments] = useState<CapturedMoment[]>([]);
  const [adminUser, setAdminUser] = useState<AdminUser>({ name: 'Admin', avatarUrl: 'https://i.pravatar.cc/150?u=admin' });
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [theme, setTheme] = useState<Theme>('dark');
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const selectedTournament = useMemo(() => tournaments.find(t => t.id === selectedTournamentId), [tournaments, selectedTournamentId]);

  // Load state from local storage or set defaults on initial load
  useEffect(() => {
    const verifyAuth = async () => {
        try {
            await authService.verifyToken();
            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
        } finally {
            setIsLoadingAuth(false);
        }
    };
    verifyAuth();

    try {
        const savedStateJSON = localStorage.getItem('CricManagerAppState');
        if (savedStateJSON) {
            const savedState = JSON.parse(savedStateJSON);
            if (savedState.tournaments) setTournaments(savedState.tournaments);
            if (savedState.selectedTournamentId) setSelectedTournamentId(savedState.selectedTournamentId);
            if (savedState.unassignedPlayers) setUnassignedPlayers(savedState.unassignedPlayers);
            if (savedState.unsoldPlayers) setUnsoldPlayers(savedState.unsoldPlayers);
            if (savedState.capturedMoments) setCapturedMoments(savedState.capturedMoments);
        } else {
            setTournaments([TOURNAMENT_DATA]);
            setSelectedTournamentId(TOURNAMENT_DATA.id);
            setUnassignedPlayers(UNASSIGNED_PLAYERS);
        }
    } catch (error) {
        console.error("Failed to load or parse app state from localStorage:", error);
        setTournaments([TOURNAMENT_DATA]);
        setSelectedTournamentId(TOURNAMENT_DATA.id);
        setUnassignedPlayers(UNASSIGNED_PLAYERS);
    }

    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
  }, []);
  
  // Save state to local storage whenever it changes
  useEffect(() => {
    if (isLoadingAuth) return; // Don't save during initial auth check
    try {
        const appState = {
            tournaments,
            selectedTournamentId,
            unassignedPlayers,
            unsoldPlayers,
            capturedMoments,
        };
        localStorage.setItem('CricManagerAppState', JSON.stringify(appState));
    } catch (error) {
        console.error("Failed to save app state to localStorage:", error);
    }
}, [tournaments, selectedTournamentId, unassignedPlayers, unsoldPlayers, capturedMoments, isLoadingAuth]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleLogin = async (username, password) => {
    await authService.login(username, password);
    setIsAuthenticated(true);
  };

  const handleRegister = async (username, email, password) => {
    await authService.register(username, email, password);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setActiveView('DASHBOARD'); // Reset to default view on logout
  };

  const updateTournamentData = (updateFn: (tournament: Tournament) => Tournament) => {
    setTournaments(prevTournaments =>
      prevTournaments.map(t =>
        t.id === selectedTournamentId ? updateFn(t) : t
      )
    );
  };

  const handleAddPlayer = (teamId: number, newPlayerData: Omit<Player, 'id' | 'stats' | 'isCaptain'>) => {
    const newPlayer: Player = {
      ...newPlayerData,
      id: Date.now(), // Simple unique ID generation
      stats: { matches: 0, runs: 0, wickets: 0, highestScore: 0, bestBowling: 'N/A' },
      isCaptain: false,
    };
    updateTournamentData(tournament => ({
      ...tournament,
      teams: tournament.teams.map(team =>
        team.id === teamId ? { ...team, players: [...team.players, newPlayer] } : team
      ),
    }));
  };

  const handleAddNewTeam = (newTeamData: Omit<Team, 'id' | 'players'>) => {
    const newTeam: Team = { ...newTeamData, id: Date.now(), players: [] };
    updateTournamentData(tournament => ({
      ...tournament,
      teams: [...tournament.teams, newTeam],
    }));
  };

  const handleUpdateAdmin = (updatedAdmin: AdminUser) => {
    setAdminUser(updatedAdmin);
  };
  
  const handleUpdateTeam = (updatedTeam: Team) => {
    updateTournamentData(tournament => ({
      ...tournament,
      teams: tournament.teams.map(team =>
        team.id === updatedTeam.id ? updatedTeam : team
      ),
    }));
  };

  const handleUpdateTournament = (updatedTournament: Tournament) => {
    setTournaments(tournaments.map(t => t.id === updatedTournament.id ? updatedTournament : t));
  };
  
  const handleAddTournament = (newTournamentData: Omit<Tournament, 'id' | 'teams' | 'fixtures' | 'pointsTable'>) => {
      const newTournament: Tournament = {
          ...newTournamentData,
          id: Date.now(),
          teams: [],
          fixtures: [],
          pointsTable: [],
      };
      setTournaments(prev => [...prev, newTournament]);
  };

  const handleCloneTournament = (tournamentId: number) => {
    const tournamentToClone = tournaments.find(t => t.id === tournamentId);
    if (!tournamentToClone) return;

    const clonedTournament: Tournament = {
      ...JSON.parse(JSON.stringify(tournamentToClone)), // Deep copy to duplicate teams and players
      id: Date.now(),
      name: `${tournamentToClone.name} (Copy)`,
      fixtures: [],
      pointsTable: [],
      teams: tournamentToClone.teams.map(team => ({
        ...team,
        players: team.players.map(player => ({
          ...player,
          stats: { matches: 0, runs: 0, wickets: 0, highestScore: 0, bestBowling: 'N/A' },
        })),
      })),
    };

    setTournaments(prev => [...prev, clonedTournament]);
  };

  const handleDeactivateTournament = () => {
    setSelectedTournamentId(null);
  };

  const handleDeleteTournament = (tournamentId: number) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament || tournament.id === selectedTournamentId) return;

    setConfirmation({
        isOpen: true,
        title: `Delete Tournament: ${tournament.name}`,
        message: 'Are you sure you want to delete this tournament? This action is permanent and cannot be undone.',
        onConfirm: () => {
            setTournaments(prev => prev.filter(t => t.id !== tournamentId));
        }
    });
  };

  const handleDeleteTeam = (teamId: number) => {
    if (!selectedTournament) return;
    const team = selectedTournament.teams.find(t => t.id === teamId);
    if (!team) return;

    setConfirmation({
      isOpen: true,
      title: `Delete Team: ${team.name}`,
      message: 'Are you sure you want to delete this team? This action cannot be undone and will remove all associated players.',
      onConfirm: () => {
        updateTournamentData(tournament => ({
          ...tournament,
          teams: tournament.teams.filter(t => t.id !== teamId),
        }));
      },
    });
  };

  const handleDeletePlayer = (teamId: number, playerId: number) => {
    if (!selectedTournament) return;
    const team = selectedTournament.teams.find(t => t.id === teamId);
    const player = team?.players.find(p => p.id === playerId);
    if (!player || !team) return;

    setConfirmation({
        isOpen: true,
        title: `Delete Player: ${player.name}`,
        message: `Are you sure you want to remove ${player.name} from ${team.name}?`,
        onConfirm: () => {
          updateTournamentData(tournament => ({
            ...tournament,
            teams: tournament.teams.map(t =>
              t.id === teamId
                ? { ...t, players: t.players.filter(p => p.id !== playerId) }
                : t
            ),
          }));
        }
    });
  };

  const handleUpdatePlayer = (teamId: number, updatedPlayer: Player) => {
    updateTournamentData(tournament => ({
      ...tournament,
      teams: tournament.teams.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            players: team.players.map(player => 
              player.id === updatedPlayer.id ? updatedPlayer : player
            ),
          };
        }
        return team;
      }),
    }));
  };

  const handleAddUnassignedPlayer = (newPlayerData: Omit<Player, 'id' | 'stats'>) => {
    const newPlayer: Player = {
      ...newPlayerData,
      id: Date.now(),
      stats: { matches: 0, runs: 0, wickets: 0, highestScore: 0, bestBowling: 'N/A' },
    };
    setUnassignedPlayers(prev => [...prev, newPlayer].sort((a,b) => a.name.localeCompare(b.name)));
  };
  
  const handleUpdateUnassignedPlayer = (updatedPlayer: Player) => {
    setUnassignedPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
  };
  
  const handleDeleteUnassignedPlayer = (playerId: number) => {
    const player = unassignedPlayers.find(p => p.id === playerId);
    if (!player) return;

    setConfirmation({
        isOpen: true,
        title: `Delete Player: ${player.name}`,
        message: `Are you sure you want to remove ${player.name} from the auction pool? This action cannot be undone.`,
        onConfirm: () => {
          setUnassignedPlayers(prev => prev.filter(p => p.id !== playerId));
        }
    });
  };

  const handleCreateFixture = (newMatchData: { teamA: Team; teamB: Team; venue: string; dateTime: string; }) => {
    const newMatch: Match = {
      ...newMatchData,
      id: Date.now(),
      status: MatchStatus.UPCOMING,
      result: 'Upcoming',
    };
    updateTournamentData(tournament => ({
      ...tournament,
      fixtures: [...tournament.fixtures, newMatch].sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()),
    }));
  };

  const handleStartMatch = (matchId: number) => {
    updateTournamentData(tournament => ({
      ...tournament,
      fixtures: tournament.fixtures.map(match =>
        match.id === matchId
          ? {
              ...match,
              status: MatchStatus.LIVE,
              scorecard: match.scorecard || { teamAScore: 0, teamAWickets: 0, teamAOvers: 0, teamBScore: 0, teamBWickets: 0, teamBOvers: 0 },
            }
          : match
      ),
    }));
    setActiveView('LIVE_SCORE');
  };

  const handleEndMatch = (matchId: number, finalScorecard: Scorecard, result: string) => {
    updateTournamentData(tournament => ({
      ...tournament,
      fixtures: tournament.fixtures.map(match =>
        match.id === matchId
          ? { ...match, status: MatchStatus.COMPLETED, scorecard: finalScorecard, result: result }
          : match
      ),
    }));
    setActiveView('FIXTURES');
  };

  const handlePlayerSold = (winningTeamId: number, player: Player, finalBid: number) => {
    setUnassignedPlayers(prev => prev.filter(p => p.id !== player.id));

    updateTournamentData(tournament => ({
        ...tournament,
        teams: tournament.teams.map(team => {
            if (team.id === winningTeamId) {
                return {
                    ...team,
                    players: [...team.players, { ...player, stats: { matches: 0, runs: 0, wickets: 0, highestScore: 0, bestBowling: 'N/A' }}],
                    budget: team.budget - finalBid,
                };
            }
            return team;
        }),
    }));
  };
  
  const handlePlayerUnsold = (player: Player) => {
    setUnassignedPlayers(prev => prev.filter(p => p.id !== player.id));
    setUnsoldPlayers(prev => [...prev, player]);
  };

  const handleRestartAuctionForUnsold = () => {
    setUnassignedPlayers(unsoldPlayers);
    setUnsoldPlayers([]);
  };
  
  const handleAddCapturedMoment = (moment: CapturedMoment) => {
    setCapturedMoments(prev => [moment, ...prev]);
  };

  const handleDeleteCapturedMoment = (momentId: number) => {
    setConfirmation({
        isOpen: true,
        title: 'Delete Media',
        message: 'Are you sure you want to permanently delete this captured moment?',
        onConfirm: () => {
            setCapturedMoments(prev => prev.filter(m => m.id !== momentId));
        }
    });
  };

  const closeConfirmation = () => {
    setConfirmation({ ...confirmation, isOpen: false });
  };

  const handleToggleCamera = () => {
      setIsCameraEnabled(prev => !prev);
  }

  const handleResetCameraSettings = () => {
    setIsCameraEnabled(true);
  };

  const handleResetAppData = () => {
    setConfirmation({
        isOpen: true,
        title: 'Reset All Data',
        message: 'Are you sure you want to reset all application data? This will delete all tournaments, teams, and players, and cannot be undone.',
        onConfirm: () => {
            localStorage.removeItem('CricManagerAppState');
            window.location.reload();
        }
    });
  };

  if (isLoadingAuth) {
    return (
        <div className="flex h-screen bg-background items-center justify-center">
            <TrophyIcon className="w-16 h-16 text-secondary animate-pulse" />
        </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} onRegister={handleRegister} />;
  }
  
  if (!selectedTournament && tournaments.length > 0) {
    return (
        <div className="flex h-screen bg-background font-sans items-center justify-center p-4">
            <div className="text-center bg-card p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-text-primary">No Tournament Selected</h1>
                <p className="text-text-secondary mt-2">Please select a tournament from the tournaments page.</p>
                <button onClick={() => setActiveView('TOURNAMENTS')} className="mt-6 bg-primary hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                    Go to Tournaments
                </button>
            </div>
        </div>
    )
  }

  const renderView = () => {
    if (!selectedTournament) {
        return <Tournaments tournaments={tournaments} onAddTournament={handleAddTournament} onUpdateTournament={handleUpdateTournament} onDeleteTournament={handleDeleteTournament} onCloneTournament={handleCloneTournament} onSelectTournament={setSelectedTournamentId} onDeactivateTournament={handleDeactivateTournament} activeTournamentId={selectedTournamentId} />;
    }
    switch (activeView) {
      case 'DASHBOARD':
        return <Dashboard tournament={selectedTournament} setActiveView={setActiveView} />;
      case 'FIXTURES':
        return <Fixtures matches={selectedTournament.fixtures} teams={selectedTournament.teams} onAddFixture={handleCreateFixture} onStartMatch={handleStartMatch} />;
      case 'TEAMS':
        return <Teams teams={selectedTournament.teams} onAddPlayer={handleAddPlayer} onAddTeam={handleAddNewTeam} onDeleteTeam={handleDeleteTeam} onDeletePlayer={handleDeletePlayer} onUpdatePlayer={handleUpdatePlayer} onUpdateTeam={handleUpdateTeam} setActiveView={setActiveView} />;
      case 'PLAYER_POOL':
        return <PlayerPool 
            unassignedPlayers={unassignedPlayers} 
            onAddPlayer={handleAddUnassignedPlayer} 
            onUpdatePlayer={handleUpdateUnassignedPlayer} 
            onDeletePlayer={handleDeleteUnassignedPlayer}
        />;
      case 'POINTS_TABLE':
        return <PointsTable pointsTable={selectedTournament.pointsTable} />;
      case 'LIVE_SCORE':
        const liveMatch = selectedTournament.fixtures.find(m => m.status === 'LIVE');
        return liveMatch ? <LiveScore match={liveMatch} isCameraEnabled={isCameraEnabled} onEndMatch={handleEndMatch} onAddCapturedMoment={handleAddCapturedMoment} /> : <div className="text-center p-8">No live match currently.</div>;
      case 'STATS':
        return <Stats teams={selectedTournament.teams} />;
      case 'MVP':
        return <MvpTracker teams={selectedTournament.teams} />;
       case 'STORAGE':
        return <Storage 
                    tournaments={tournaments} 
                    capturedMoments={capturedMoments} 
                    onDeleteMoment={handleDeleteCapturedMoment}
                />;
      case 'SETTINGS':
        return <Settings 
                    adminUser={adminUser} 
                    onUpdateAdmin={handleUpdateAdmin} 
                    isCameraEnabled={isCameraEnabled}
                    onToggleCamera={handleToggleCamera}
                    onResetCameraSettings={handleResetCameraSettings}
                    theme={theme}
                    onToggleTheme={handleToggleTheme}
                    onResetAppData={handleResetAppData}
                />;
      case 'TOURNAMENTS':
        return <Tournaments tournaments={tournaments} onAddTournament={handleAddTournament} onUpdateTournament={handleUpdateTournament} onDeleteTournament={handleDeleteTournament} onCloneTournament={handleCloneTournament} onSelectTournament={setSelectedTournamentId} onDeactivateTournament={handleDeactivateTournament} activeTournamentId={selectedTournamentId} />;
      case 'AUCTION':
        return <Auction 
                    teams={selectedTournament.teams} 
                    unassignedPlayers={unassignedPlayers} 
                    onPlayerSold={handlePlayerSold} 
                    unsoldPlayers={unsoldPlayers}
                    onPlayerUnsold={handlePlayerUnsold}
                    onRestartAuction={handleRestartAuctionForUnsold}
                />;
      default:
        return <Dashboard tournament={selectedTournament} setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-background font-sans">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isOpen={isSidebarOpen} 
        setOpen={setSidebarOpen} 
        onLogout={handleLogout} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedTournament && <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} adminUser={adminUser} tournamentName={selectedTournament.name} />}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
       <ConfirmationModal 
          isOpen={confirmation.isOpen}
          onClose={closeConfirmation}
          onConfirm={confirmation.onConfirm}
          title={confirmation.title}
          message={confirmation.message}
      />
    </div>
  );
};

export default App;
