'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, ShieldCheck, Mail, Database, Check } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Platform Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage global configurations, campus parameters, and security policies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Subnav */}
        <div className="md:col-span-1 space-y-1.5">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'general'
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>General</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'security'
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Security</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'notifications'
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span>Notifications</span>
          </button>
          <button
            onClick={() => setActiveTab('backups')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'backups'
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <Database className="w-4 h-4 shrink-0" />
            <span>Backups</span>
          </button>
        </div>

        {/* Right Content */}
        <div className="md:col-span-3 space-y-6">
          <Card className="rounded-2xl border-border/70 bg-card shadow-xs">
            <CardHeader className="pb-4 pt-5 px-6">
              <CardTitle className="text-base font-bold text-foreground">Institution Details</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Update the core details of the platform.</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="instName" className="text-xs font-semibold text-foreground">Institution Name</Label>
                <Input id="instName" defaultValue="EduVerse University" className="h-10 rounded-xl border-border/80 text-sm shadow-xs" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instEmail" className="text-xs font-semibold text-foreground">Contact Email</Label>
                <Input id="instEmail" defaultValue="admin@eduverse.edu" className="h-10 rounded-xl border-border/80 text-sm shadow-xs" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="academicYear" className="text-xs font-semibold text-foreground">Current Academic Year</Label>
                <Input id="academicYear" defaultValue="2024-2025" className="h-10 rounded-xl border-border/80 text-sm shadow-xs" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 bg-card shadow-xs">
            <CardHeader className="pb-4 pt-5 px-6">
              <CardTitle className="text-base font-bold text-foreground">Feature Controls</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Enable or disable platform modules institutional-wide.</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-3.5">
              <div className="flex items-center justify-between p-4 border border-border/60 rounded-xl bg-muted/20">
                <div>
                  <p className="font-semibold text-sm text-foreground">Student Self-Registration</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Allow students to sign up manually without administrator approval.</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl text-xs font-medium">Disabled</Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-border/60 rounded-xl bg-muted/20">
                <div>
                  <p className="font-semibold text-sm text-foreground">Coding Exams Module</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Enable the built-in Monaco IDE, test runner, and automated grading engine.</p>
                </div>
                <Button variant="default" size="sm" className="rounded-xl text-xs font-medium shadow-xs">Enabled</Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} className="gap-2 rounded-xl text-sm font-medium shadow-xs">
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
