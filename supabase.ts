import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return url.includes('supabase.co') || url.includes('localhost');
  } catch {
    return false;
  }
};

const isValidKey = (key: string): boolean => {
  return key && key.length > 20 && !key.includes('your-') && key !== 'your-anon-key-here';
};

// Check if we have valid Supabase credentials
export const hasValidSupabaseConfig = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey));
};

// Create Supabase client with fallback for demo mode
let supabaseClient: any = null;

if (hasValidSupabaseConfig()) {
  try {
    supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    supabaseClient = null;
  }
} else {
  console.warn('⚠️ Supabase not configured. Running in demo mode.');
  // Create a mock client for demo purposes
  supabaseClient = createMockSupabaseClient();
}

export const supabase = supabaseClient;

// Mock Supabase client for demo mode
function createMockSupabaseClient() {
  const mockUsers = [
    { id: '1', full_name: 'Demo User', email: 'demo@example.com', points: 150 },
    { id: '2', full_name: 'Alice Johnson', email: 'alice@example.com', points: 320 },
    { id: '3', full_name: 'Bob Smith', email: 'bob@example.com', points: 280 },
  ];

  const mockCourses = [
    {
      id: '1',
      title: 'React Fundamentals',
      description: 'Learn the basics of React development with hands-on projects.',
      price: 99.00,
      image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'JavaScript Mastery',
      description: 'Master modern JavaScript with ES6+ features and best practices.',
      price: 149.00,
      image_url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Full Stack Development',
      description: 'Build complete web applications from frontend to backend.',
      price: 199.00,
      image_url: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=250&fit=crop',
      created_at: new Date().toISOString()
    }
  ];

  const mockGames = [
    {
      id: '1',
      title: 'Code Challenge',
      description: 'Solve coding problems and earn points!',
      icon: '💻',
      points_reward: 100,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Algorithm Race',
      description: 'Race against time to solve algorithms.',
      icon: '⚡',
      points_reward: 150,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Debug Master',
      description: 'Find and fix bugs in the code.',
      icon: '🔍',
      points_reward: 120,
      created_at: new Date().toISOString()
    }
  ];

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signUp: async (credentials: any) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { 
          data: { user: null, session: null }, 
          error: { message: 'Demo mode: Sign up successful! In production, this would create a real account.' }
        };
      },
      signInWithPassword: async (credentials: any) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { 
          data: { user: null, session: null }, 
          error: { message: 'Demo mode: Please set up Supabase to enable real authentication.' }
        };
      },
      signOut: async () => ({ error: null }),
      onAuthStateChange: (callback: any) => {
        // Return a mock subscription
        return { data: { subscription: { unsubscribe: () => {} } } };
      }
    },
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            if (table === 'profiles') {
              return { data: mockUsers[0], error: null };
            }
            return { data: null, error: null };
          },
          order: (column: string, options?: any) => ({
            limit: (count: number) => ({
              then: async (resolve: any) => {
                if (table === 'leaderboard') {
                  resolve({ data: mockUsers, error: null });
                }
                return { data: [], error: null };
              }
            }),
            then: async (resolve: any) => {
              if (table === 'courses') {
                resolve({ data: mockCourses, error: null });
              } else if (table === 'games') {
                resolve({ data: mockGames, error: null });
              }
              return { data: [], error: null };
            }
          })
        }),
        order: (column: string, options?: any) => ({
          limit: (count: number) => ({
            then: async (resolve: any) => {
              if (table === 'leaderboard') {
                resolve({ data: mockUsers, error: null });
              }
              return { data: [], error: null };
            }
          }),
          then: async (resolve: any) => {
            if (table === 'courses') {
              resolve({ data: mockCourses, error: null });
            } else if (table === 'games') {
              resolve({ data: mockGames, error: null });
            }
            return { data: [], error: null };
          }
        }),
        then: async (resolve: any) => {
          if (table === 'courses') {
            resolve({ data: mockCourses, error: null });
          } else if (table === 'games') {
            resolve({ data: mockGames, error: null });
          } else if (table === 'leaderboard') {
            resolve({ data: mockUsers, error: null });
          }
          return { data: [], error: null };
        }
      }),
      insert: (data: any) => ({
        select: () => ({
          single: async () => ({ data: { id: 'mock-id', ...data }, error: null })
        }),
        then: async (resolve: any) => {
          resolve({ data: null, error: null });
          return { data: null, error: null };
        }
      }),
      upsert: (data: any) => ({
        select: () => ({
          single: async () => ({ data: { id: 'mock-id', ...data }, error: null })
        })
      })
    }),
    rpc: async (functionName: string, params: any) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { data: null, error: null };
    }
  };
}

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string | null;
  created_at: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  points_reward: number;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  full_name: string;
  points: number;
}
