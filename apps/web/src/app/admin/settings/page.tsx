'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, ShieldCheck, Mail, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
          <p className="text-muted-foreground mt-2">Manage global configurations and preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-3 bg-muted/50">
            <Settings className="w-4 h-4" /> General
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <ShieldCheck className="w-4 h-4" /> Security
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Mail className="w-4 h-4" /> Notifications
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Database className="w-4 h-4" /> Backups
          </Button>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Institution Details</CardTitle>
              <CardDescription>Update the core details of the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="instName">Institution Name</Label>
                <Input id="instName" defaultValue="EduVerse University" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instEmail">Contact Email</Label>
                <Input id="instEmail" defaultValue="admin@eduverse.edu" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="academicYear">Current Academic Year</Label>
                <Input id="academicYear" defaultValue="2024-2025" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Enable or disable platform features globally.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                <div>
                  <p className="font-medium">Student Registration</p>
                  <p className="text-sm text-muted-foreground">Allow students to sign up manually.</p>
                </div>
                <Button variant="outline" size="sm">Disabled</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                <div>
                  <p className="font-medium">Coding Exams Module</p>
                  <p className="text-sm text-muted-foreground">Enable the built-in IDE and compiler.</p>
                </div>
                <Button variant="default" size="sm">Enabled</Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
