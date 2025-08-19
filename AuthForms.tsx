import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export function AuthForms() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    acceptTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, signUp } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };
    
    return requirements;
  };

  const isPasswordValid = (password: string) => {
    const requirements = validatePassword(password);
    return Object.values(requirements).every(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setError(error);
        }
      } else {
        // Validation for signup
        if (!formData.fullName.trim()) {
          setError('Full name is required');
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        
        if (!isPasswordValid(formData.password)) {
          setError('Password does not meet requirements');
          return;
        }
        
        if (!formData.acceptTerms) {
          setError('You must accept the terms and conditions');
          return;
        }

        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        if (error) {
          setError(error);
        } else {
          setSuccess('Account created successfully! You can now sign in.');
          setIsLogin(true);
          setFormData({
            email: formData.email,
            password: '',
            confirmPassword: '',
            fullName: '',
            acceptTerms: false
          });
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = !isLogin ? validatePassword(formData.password) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl">💡</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Skill Friend
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your AI-Powered Learning Companion
            </p>
          </div>

          {/* Form Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isLogin ? 'Welcome Back!' : 'Join Skill Friend'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {isLogin ? 'Sign in to continue your learning journey' : 'Create your account and start learning today'}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4">
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />
              
              {!isLogin && passwordRequirements && (
                <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                  <div className={`${passwordRequirements.length ? 'text-green-600 line-through' : 'text-gray-500'}`}>
                    At least 8 characters
                  </div>
                  <div className={`${passwordRequirements.uppercase ? 'text-green-600 line-through' : 'text-gray-500'}`}>
                    One uppercase letter
                  </div>
                  <div className={`${passwordRequirements.lowercase ? 'text-green-600 line-through' : 'text-gray-500'}`}>
                    One lowercase letter
                  </div>
                  <div className={`${passwordRequirements.number ? 'text-green-600 line-through' : 'text-gray-500'}`}>
                    One number
                  </div>
                  <div className={`${passwordRequirements.special ? 'text-green-600 line-through' : 'text-gray-500'} col-span-2`}>
                    One special character
                  </div>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {!isLogin && (
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                  }
                />
                <Label htmlFor="acceptTerms" className="text-sm leading-relaxed">
                  I agree to the Terms of Service and Privacy Policy
                </Label>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Switch Form */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              variant="ghost"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
                setFormData({
                  email: formData.email,
                  password: '',
                  confirmPassword: '',
                  fullName: '',
                  acceptTerms: false
                });
              }}
              className="mt-1"
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
