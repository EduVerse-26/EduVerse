'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getClassPerformance } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, AlertTriangle, GraduationCap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PerformancePage() {
  const [batch, setBatch] = useState('2024');
  const [section, setSection] = useState('A');

  const { data: performance, isLoading } = useQuery({ 
    queryKey: ['hodPerformance', batch, section], 
    queryFn: () => getClassPerformance(batch, section) 
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Department Performance</h1>
          <p className="text-muted-foreground mt-2">Monitor academic metrics and identify students needing support.</p>
        </div>
        <div className="flex gap-3">
          <Select value={batch} onValueChange={setBatch}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">Batch 2024</SelectItem>
              <SelectItem value="2025">Batch 2025</SelectItem>
            </SelectContent>
          </Select>
          <Select value={section} onValueChange={setSection}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Section A</SelectItem>
              <SelectItem value="B">Section B</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Avg. Attendance</p>
                <p className="text-3xl font-bold">{performance?.averageAttendance || 0}%</p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Avg. Marks</p>
                <p className="text-3xl font-bold">{performance?.averageMarks || 0}%</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Top Performers</p>
                <p className="text-3xl font-bold">{performance?.topPerformers?.length || 0}</p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/30">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">At Risk Students</p>
                <p className="text-3xl font-bold text-red-500">{performance?.lowPerformers?.length || 0}</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subject Distribution</CardTitle>
            <CardDescription>Average marks across courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performance?.subjectDistribution || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="courseName" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="averageMarks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Needs Attention</CardTitle>
            <CardDescription>Students below threshold</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performance?.lowPerformers?.map((student, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-red-500/20 bg-red-500/5 rounded-lg">
                  <div>
                    <p className="font-medium">{student.studentName}</p>
                    <p className="text-sm text-muted-foreground">{student.studentId}</p>
                  </div>
                  <Badge variant="destructive" className="bg-red-500">
                    {student.percentage}% Avg
                  </Badge>
                </div>
              ))}
              {(!performance?.lowPerformers || performance.lowPerformers.length === 0) && (
                <div className="py-8 text-center text-muted-foreground">
                  No students currently flagged as at risk.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
