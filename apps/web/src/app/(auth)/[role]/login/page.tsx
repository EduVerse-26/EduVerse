'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@eduverse/validation';
import { ROLES, ROLE_DASHBOARD_PATHS } from '@eduverse/config';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const DEMO_ACCOUNTS = [
  { email: 'hod.cs@eduverse.edu', password: 'password', role: 'hod' as const, label: 'HOD', icon: '📋' },
  { email: 'faculty1@eduverse.edu', password: 'password', role: 'faculty' as const, label: 'Faculty', icon: '👨‍🏫' },
  { email: 'student1@eduverse.edu', password: 'password', role: 'student' as const, label: 'Student', icon: '🎓' },
];

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const currentRole = (params.role as string) || 'student';
  const roleTitle = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);
  
  const { login, switchRole } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const result = await login(data.email, data.password, currentRole);
      if (result.success) {
        toast.success(`Welcome to EduVerse ${roleTitle} Portal!`);
        router.push(ROLE_DASHBOARD_PATHS[currentRole as keyof typeof ROLE_DASHBOARD_PATHS] || '/student');
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground selection:bg-primary/10 selection:text-primary">
      {/* Left Panel - Chic SaaS Brand Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-[#0B0F19] text-white border-r border-slate-800/80 overflow-hidden">
        {/* Subtle geometric background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.15),_transparent_40%)] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Top brand header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md shadow-primary/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">EduVerse</h1>
            <p className="text-[11px] font-medium tracking-wider uppercase text-slate-400 mt-1">Unified Campus OS</p>
          </div>
        </div>

        {/* Center editorial message */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Academic Management</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Unified workspace for modern campus administration.
          </h2>
          
          <p className="text-slate-400 text-base leading-relaxed mb-8">
            Effortlessly coordinate curriculum, automated attendance, coding assessments, student counseling, and department analytics in a clean, unified interface.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              'Real-Time Attendance',
              'Monaco Coding IDE',
              'Course Management',
              'Student Counseling',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-800/50 border border-slate-700/60 text-slate-300 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-6">
          <p>© {new Date().getFullYear()} EduVerse Platform Inc.</p>
          <p className="text-slate-400">Project Management Edition</p>
        </div>
      </div>

      {/* Right Panel - Clean Minimal Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md shadow-primary/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-foreground">EduVerse</span>
              <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Campus OS</p>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Sign in to EduVerse</h2>
            <p className="text-sm text-muted-foreground mt-1">{roleTitle} Portal - Enter your credentials to continue.</p>
          </div>

          {/* Quick Access - Demo Roles */}
          <div className="space-y-2.5">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-2.5">
              {DEMO_ACCOUNTS.filter(a => a.role === currentRole).map((account) => (
                <button
                  key={account.role}
                  type="button"
                  className="p-3 text-left rounded-xl border border-border/70 bg-card hover:border-primary/50 hover:bg-muted/40 transition-all duration-150 shadow-xs flex flex-col justify-between group col-span-2"
                  onClick={() => quickLogin(account)}
                  disabled={isSubmitting}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-base">{account.icon}</span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-muted/60 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                      Demo Login
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{account.label} Access</p>
                    <p className="text-[10px] text-muted-foreground truncate w-full mt-0.5">{account.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/70" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground font-medium">or continue with email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@eduverse.edu"
                {...register('email')}
                className={`h-10 rounded-xl border-border/80 text-sm shadow-xs ${errors.email ? 'border-destructive' : ''}`}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password')}
                  className={`h-10 rounded-xl border-border/80 text-sm shadow-xs pr-10 ${errors.password ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10 rounded-xl text-sm font-semibold shadow-xs"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground pt-2">
            Tip: Click the demo role badge above for instant single-click entry.
          </p>
        </div>
      </div>
    </div>
  );
}
