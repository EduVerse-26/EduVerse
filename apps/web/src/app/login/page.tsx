'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@eduverse/validation';
import { ROLES, ROLE_DASHBOARD_PATHS } from '@eduverse/config';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const DEMO_ACCOUNTS = [
  { email: 'admin@eduverse.edu', password: 'password', role: 'admin' as const, label: 'Admin', icon: '🏛️' },
  { email: 'hod.cs@eduverse.edu', password: 'password', role: 'hod' as const, label: 'HOD', icon: '📋' },
  { email: 'faculty1@eduverse.edu', password: 'password', role: 'faculty' as const, label: 'Faculty', icon: '👨‍🏫' },
  { email: 'student1@eduverse.edu', password: 'password', role: 'student' as const, label: 'Student', icon: '🎓' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        toast.success('Welcome to EduVerse!');
        // Find role from demo accounts or default
        const account = DEMO_ACCOUNTS.find(a => a.email === data.email);
        router.push(ROLE_DASHBOARD_PATHS[account?.role || 'student']);
      } else {
        toast.error(result.error || 'Login failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickLogin = async (role: typeof DEMO_ACCOUNTS[0]) => {
    setIsSubmitting(true);
    try {
      await switchRole(role.role);
      toast.success(`Signed in as ${role.label}`);
      router.push(ROLE_DASHBOARD_PATHS[role.role]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-sidebar">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary shadow-2xl shadow-primary/30">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">EduVerse</h1>
              <p className="text-sm text-white/50 tracking-widest uppercase">Campus Platform</p>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-white/90 leading-tight mb-6">
            One platform for<br />
            <span className="gradient-text">everything academic</span>
          </h2>
          
          <p className="text-lg text-white/60 max-w-md leading-relaxed mb-10">
            Unifying attendance, timetables, assignments, quizzes, coding exams, marks, performance analytics, and counseling — all in one place.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-md">
            {['Attendance Tracking', 'Live Coding Exams', 'Smart Analytics', 'Student Counseling'].map((feature) => (
              <div key={feature} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-white/70">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">EduVerse</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="text-muted-foreground mt-1">Sign in to your account to continue</p>
          </div>

          {/* Quick Access - Demo Roles */}
          <div>
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">Quick access — Demo</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <Button
                  key={account.role}
                  variant="outline"
                  className="h-auto py-3 px-4 flex flex-col items-start gap-0.5 hover:border-primary/50 hover:bg-primary/5 transition-all"
                  onClick={() => quickLogin(account)}
                  disabled={isSubmitting}
                >
                  <span className="text-lg">{account.icon}</span>
                  <span className="text-sm font-medium">{account.label}</span>
                  <span className="text-[10px] text-muted-foreground truncate w-full">{account.email}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or sign in with email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@eduverse.edu"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password')}
                  className={errors.password ? 'border-destructive' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              variant="glow"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            Use any demo account above to explore the platform. All data is mocked.
          </p>
        </div>
      </div>
    </div>
  );
}
