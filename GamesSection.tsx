import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GameModal } from '@/components/GameModal';
import { supabase, Game, LeaderboardEntry } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2, Trophy, Medal, Award } from 'lucide-react';

export function GamesSection() {
  const [games, setGames] = useState<Game[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingGame, setPlayingGame] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const { user, refreshProfile } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gamesResponse, leaderboardResponse] = await Promise.all([
        supabase.from('games').select('*').order('created_at', { ascending: true }),
        supabase.from('leaderboard').select('*').order('points', { ascending: false }).limit(10)
      ]);

      if (gamesResponse.error) {
        console.error('Error fetching games:', gamesResponse.error);
      } else {
        setGames(gamesResponse.data || []);
      }

      if (leaderboardResponse.error) {
        console.error('Error fetching leaderboard:', leaderboardResponse.error);
      } else {
        setLeaderboard(leaderboardResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = (game: Game) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to play games.",
        variant: "destructive"
      });
      return;
    }

    setSelectedGame(game);
    setGameModalOpen(true);
  };

  const handleGameComplete = async (gameId: string, pointsReward: number) => {
    setPlayingGame(gameId);

    try {
      // Award points by updating profile directly
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          points: (user as any).points + pointsReward,
          updated_at: new Date().toISOString()
        })
        .eq('id', user!.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }

      toast({
        title: "🎉 Congratulations!",
        description: `You earned ${pointsReward} points!`,
      });

      // Refresh user profile and leaderboard
      await refreshProfile();
      await fetchData();

    } catch (error) {
      console.error('Error completing game:', error);
      toast({
        title: "Game Error",
        description: "There was an error completing the game. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPlayingGame(null);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <section id="games" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Coding Games & Leaderboard</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Build games, earn points, and climb the leaderboard!
            </p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>

        {/* Game Modal */}
        {selectedGame && (
          <GameModal
            isOpen={gameModalOpen}
            onClose={() => {
              setGameModalOpen(false);
              setSelectedGame(null);
            }}
            game={selectedGame}
            onComplete={handleGameComplete}
            isPlaying={playingGame === selectedGame.id}
          />
        )}
      </section>
    );
  }

  return (
    <section id="games" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Coding Games & Leaderboard</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build games, earn points, and climb the leaderboard!
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Learners
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboard.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Be the first on the leaderboard!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.map((entry, index) => (
                      <div key={entry.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                        <div className="flex-shrink-0">
                          {getRankIcon(index + 1)}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(entry.full_name || 'User')}&background=random&color=fff`} 
                          />
                          <AvatarFallback>
                            {(entry.full_name || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-grow min-w-0">
                          <p className="font-medium truncate">{entry.full_name || 'Anonymous User'}</p>
                        </div>
                        <Badge variant="secondary">
                          {entry.points} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Games */}
          <div className="lg:col-span-2">
            {games.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No games available right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {games.map((game) => (
                  <Card key={game.id} className="h-full flex flex-col">
                    <CardHeader className="text-center">
                      <div className="text-4xl mb-2">{game.icon || '🎮'}</div>
                      <CardTitle>{game.title}</CardTitle>
                      <CardDescription>{game.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex justify-center">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          +{game.points_reward} pts
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handlePlayGame(game)}
                        disabled={playingGame === game.id}
                      >
                        {playingGame === game.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Playing...
                          </>
                        ) : (
                          'Start Challenge'
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
