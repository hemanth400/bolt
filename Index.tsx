import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthForms } from '@/components/AuthForms';
import { AppLayout } from '@/components/AppLayout';
import { SetupNotice } from '@/components/SetupNotice';
import { HeroSection } from '@/components/sections/HeroSection';
import { CoursesSection } from '@/components/sections/CoursesSection';
import { GamesSection } from '@/components/sections/GamesSection';
import { Loader2 } from 'lucide-react';
import { hasValidSupabaseConfig } from '@/lib/supabase';

export default function Index() {
  const { user, loading, isDemo } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show setup notice if Supabase is not configured
  if (!hasValidSupabaseConfig()) {
    return <SetupNotice />;
  }

  if (!user) {
    return <AuthForms />;
  }

  return (
    <AppLayout>
      <HeroSection />
      <CoursesSection />
      <GamesSection />
    </AppLayout>
  );
}
