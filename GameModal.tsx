import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { CheckCircle, Code, Timer, Trophy } from 'lucide-react';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: {
    id: string;
    title: string;
    description: string;
    icon: string;
    points_reward: number;
  };
  onComplete: (gameId: string, points: number) => Promise<void>;
  isPlaying: boolean;
}

export function GameModal({ isOpen, onClose, game, onComplete, isPlaying }: GameModalProps) {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [gameStarted, setGameStarted] = useState(false);

  const gameProblems = {
    'Python Code Challenge': {
      problem: `Write a Python function that finds the maximum element in a list:

def find_max(numbers):
    # Your code here
    pass

# Example: find_max([1, 5, 3, 9, 2]) should return 9`,
      placeholder: `def find_max(numbers):
    # Write your solution here
    return max(numbers)`
    },
    'Java Algorithm Race': {
      problem: `Write a Java method that reverses a string:

public class Solution {
    public String reverseString(String str) {
        // Your code here
        return "";
    }
}

// Example: reverseString("hello") should return "olleh"`,
      placeholder: `public String reverseString(String str) {
    // Write your solution here
    return new StringBuilder(str).reverse().toString();
}`
    },
    'Frontend Debug Master': {
      problem: `Fix the CSS bug in this code to center the text:

<div class="container">
    <p>This text should be centered</p>
</div>

.container {
    width: 100%;
    height: 200px;
    background: #f0f0f0;
    /* Add CSS properties to center the text */
}`,
      placeholder: `.container {
    width: 100%;
    height: 200px;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
}`
    }
  };

  const currentProblem = gameProblems[game.title as keyof typeof gameProblems];

  const handleStartGame = () => {
    setGameStarted(true);
    setCode(currentProblem?.placeholder || '');
    
    // Start timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      return;
    }
    
    await onComplete(game.id, game.points_reward);
    onClose();
    setGameStarted(false);
    setCode('');
    setTimeLeft(300);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentProblem) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{game.icon}</span>
            {game.title}
          </DialogTitle>
          <DialogDescription>
            {game.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {!gameStarted ? (
            // Game Start Screen
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="text-6xl mb-4">{game.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{game.title}</h3>
                <p className="text-muted-foreground mb-4">{game.description}</p>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Reward: +{game.points_reward} points
                </Badge>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Challenge Preview:
                </h4>
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {currentProblem.problem.split('\n').slice(0, 3).join('\n')}...
                </pre>
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Timer className="h-4 w-4" />
                  5 minutes
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  {game.points_reward} points
                </div>
              </div>

              <Button onClick={handleStartGame} size="lg">
                Start Challenge
              </Button>
            </div>
          ) : (
            // Game Playing Screen
            <div className="flex flex-col h-full">
              {/* Timer */}
              <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
                <Badge variant={timeLeft < 60 ? "destructive" : "secondary"}>
                  <Timer className="mr-1 h-3 w-3" />
                  {formatTime(timeLeft)}
                </Badge>
                <Badge variant="outline">
                  {game.points_reward} points
                </Badge>
              </div>

              {/* Problem Statement */}
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">Challenge</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm whitespace-pre-wrap text-muted-foreground bg-muted/50 p-3 rounded">
                    {currentProblem.problem}
                  </pre>
                </CardContent>
              </Card>

              {/* Code Editor */}
              <div className="flex-1 mb-4">
                <label className="block text-sm font-medium mb-2">Your Solution:</label>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Write your code here..."
                  className="font-mono text-sm min-h-[200px] resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmit}
                  disabled={isPlaying || !code.trim() || timeLeft === 0}
                  className="flex-1"
                >
                  {isPlaying ? (
                    <>Submitting...</>
                  ) : timeLeft === 0 ? (
                    'Time Up!'
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Submit Solution
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
