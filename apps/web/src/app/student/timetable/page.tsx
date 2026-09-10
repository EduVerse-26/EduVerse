'use client';

import { useQuery } from '@tanstack/react-query';
import { getTimetable } from '@eduverse/api';
import { DAYS_OF_WEEK, PERIODS } from '@eduverse/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

export default function StudentTimetablePage() {
  const [view, setView] = useState<'weekly' | 'daily'>('weekly');
  const { data: timetable } = useQuery({
    queryKey: ['timetable', '2024', 'A'],
    queryFn: () => getTimetable('2024', 'A'),
  });

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Timetable</h2>
          <p className="text-muted-foreground">Your class schedule for Semester 3</p>
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as 'weekly' | 'daily')}>
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === 'weekly' ? (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="p-3 text-left font-medium text-muted-foreground w-20">Period</th>
                  {DAYS_OF_WEEK.map(day => (
                    <th key={day.value} className={`p-3 text-center font-medium ${day.value === today ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}>
                      {day.short}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERIODS.map(period => (
                  <tr key={period.period} className="border-b border-border/50">
                    <td className="p-3 text-xs text-muted-foreground">
                      <div className="font-medium">P{period.period}</div>
                      <div>{period.start}</div>
                    </td>
                    {DAYS_OF_WEEK.map(day => {
                      const slot = timetable?.slots.find(s => s.day === day.value && s.period === period.period);
                      const isToday = day.value === today;
                      return (
                        <td key={day.value} className={`p-2 text-center ${isToday ? 'bg-primary/5' : ''}`}>
                          {slot ? (
                            slot.type === 'break' ? (
                              <div className="text-xs text-muted-foreground italic">Break</div>
                            ) : (
                              <div className={`p-2 rounded-lg text-xs ${
                                slot.type === 'lab' ? 'bg-blue-500/10 border border-blue-500/20' :
                                slot.type === 'tutorial' ? 'bg-emerald-500/10 border border-emerald-500/20' :
                                'bg-primary/10 border border-primary/20'
                              }`}>
                                <p className="font-semibold">{slot.courseCode}</p>
                                <p className="text-muted-foreground truncate">{slot.courseName}</p>
                                <p className="text-muted-foreground/70 mt-0.5">{slot.room}</p>
                              </div>
                            )
                          ) : (
                            <div className="text-xs text-muted-foreground/30">—</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {PERIODS.map(period => {
            const slot = timetable?.slots.find(s => s.day === today && s.period === period.period);
            return (
              <Card key={period.period} className={slot && slot.type !== 'break' ? 'border-primary/20' : ''}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-xs text-muted-foreground">Period {period.period}</p>
                    <p className="font-mono text-sm">{period.start}</p>
                    <p className="text-[10px] text-muted-foreground">{period.end}</p>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  {slot ? (
                    slot.type === 'break' ? (
                      <div className="flex-1 text-center text-muted-foreground italic">☕ Break</div>
                    ) : (
                      <div className="flex-1">
                        <p className="font-semibold">{slot.courseName}</p>
                        <p className="text-sm text-muted-foreground">{slot.facultyName} • {slot.room}</p>
                      </div>
                    )
                  ) : (
                    <div className="flex-1 text-muted-foreground/50">No class</div>
                  )}
                  {slot && slot.type !== 'break' && (
                    <Badge variant={slot.type === 'lab' ? 'info' : slot.type === 'tutorial' ? 'success' : 'outline'}>
                      {slot.type}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
