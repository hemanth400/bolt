@@ .. @@
 export function GamesSection() {
   const [games, setGames] = useState<Game[]>([]);
   const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
   const [loading, setLoading] = useState(true);
   const [playingGame, setPlayingGame] = useState<string | null>(null);
   const [selectedGame, setSelectedGame] = useState<Game | null>(null);
   const [gameModalOpen, setGameModalOpen] = useState(false);
   const { user, refreshProfile } = useAuth();
 
+  // Static games data
+  const staticGames = [
+    {
+      id: '1',
+      title: 'Python Code Challenge',
+      description: 'Solve Python coding problems and earn points!',
+      icon: '🐍',
+      points_reward: 100,
+      created_at: new Date().toISOString()
+    },
+    {
+      id: '2',
+      title: 'Java Algorithm Race',
+      description: 'Race against time to solve Java algorithms.',
+      icon: '☕',
+      points_reward: 150,
+      created_at: new Date().toISOString()
+    },
+    {
+      id: '3',
+      title: 'Frontend Debug Master',
+      description: 'Find and fix bugs in HTML, CSS, and JavaScript code.',
+      icon: '🔧',
+      points_reward: 120,
+      created_at: new Date().toISOString()
+    }
+  ];
+
+  // Static leaderboard data
+  const staticLeaderboard = [
+    { id: '1', full_name: 'Alice Johnson', points: 850 },
+    { id: '2', full_name: 'Bob Smith', points: 720 },
+    { id: '3', full_name: 'Carol Davis', points: 680 },
+    { id: '4', full_name: 'David Wilson', points: 540 },
+    { id: '5', full_name: 'Emma Brown', points: 420 }
+  ];
+
   useEffect(() => {
-    fetchData();
+    // Use static data instead of fetching from database
+    setGames(staticGames);
+    setLeaderboard(staticLeaderboard);
+    setLoading(false);
   }, []);
 
-  const fetchData = async () => {
-    try {
-      const [gamesResponse, leaderboardResponse] = await Promise.all([
-        supabase.from('games').select('*').order('created_at', { ascending: true }),
-        supabase.from('leaderboard').select('*').order('points', { ascending: false }).limit(10)
-      ]);
-
-      if (gamesResponse.error) {
-        console.error('Error fetching games:', gamesResponse.error);
-      } else {
-        setGames(gamesResponse.data || []);
-      }
-
-      if (leaderboardResponse.error) {
-        console.error('Error fetching leaderboard:', leaderboardResponse.error);
-      } else {
-        setLeaderboard(leaderboardResponse.data || []);
-      }
-    } catch (error) {
-      console.error('Error fetching data:', error);
-    } finally {
-      setLoading(false);
-    }
-  };
-
   const handlePlayGame = (game: Game) => {
     if (!user) {
       toast({
@@ -88,7 +118,7 @@
 
       // Refresh user profile and leaderboard
       await refreshProfile();
-      await fetchData();
+      // No need to fetch data as we're using static data
 
     } catch (error) {
       console.error('Error completing game:', error);