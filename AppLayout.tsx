import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Moon, Sun, Menu, User, BarChart3, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, profile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              <span className="text-xl font-bold">Skill Friend</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection('home')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('courses')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Courses
              </button>
              <button
                onClick={() => scrollToSection('games')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Games
              </button>
              <button
                onClick={() => scrollToSection('leaderboard')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Leaderboard
              </button>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {/* User Menu */}
              {user && profile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'User')}&background=random&color=fff`} 
                        />
                        <AvatarFallback>
                          {(profile.full_name || profile.email).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:flex flex-col items-start">
                        <span className="text-sm font-medium">{profile.full_name || 'User'}</span>
                        <span className="text-xs text-muted-foreground">{profile.points} pts</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium">{profile.full_name}</p>
                      <p className="text-xs text-muted-foreground">{profile.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Learning Progress
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => scrollToSection('home')}
                  className="text-left px-2 py-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('courses')}
                  className="text-left px-2 py-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Courses
                </button>
                <button
                  onClick={() => scrollToSection('games')}
                  className="text-left px-2 py-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Games
                </button>
                <button
                  onClick={() => scrollToSection('leaderboard')}
                  className="text-left px-2 py-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Leaderboard
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💡</span>
                <span className="text-xl font-bold">Skill Friend</span>
              </div>
              <p className="text-muted-foreground">
                Empowering learners everywhere with friendly AI.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-3">Navigate</h4>
                <div className="space-y-2 text-sm">
                  <button
                    onClick={() => scrollToSection('home')}
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => scrollToSection('courses')}
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Courses
                  </button>
                  <button
                    onClick={() => scrollToSection('games')}
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Games
                  </button>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Support</h4>
                <div className="space-y-2 text-sm">
                  <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                    Help Center
                  </a>
                  <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                    Contact Us
                  </a>
                  <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Skill Friend. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
