import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { DemoModeBanner } from '@/components/DemoModeBanner';
import { HeroSection } from '@/components/sections/HeroSection';
import { CoursesSection } from '@/components/sections/CoursesSection';
import { GamesSection } from '@/components/sections/GamesSection';

interface DemoAppProps {
  showBanner?: boolean;
}

export function DemoApp({ showBanner = true }: DemoAppProps) {
  return (
    <>
      {showBanner && <DemoModeBanner />}
      <AppLayout>
        <HeroSection />
        <CoursesSection />
        <GamesSection />
      </AppLayout>
    </>
  );
}
