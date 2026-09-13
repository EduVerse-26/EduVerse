'use client';

import { useQuery } from '@tanstack/react-query';
import { getTimetable } from '@eduverse/api';
import { DAYS_OF_WEEK, PERIODS } from '@eduverse/config';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, User, Coffee } from 'lucide-react';
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
      {/* Header with Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Timetable & Schedule</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Your academic schedule for Section A • Semester 3</p>
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as 'weekly' | 'daily')}>
          <TabsList className="bg-muted/70 p-1">
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
            <TabsTrigger value="daily">Daily Timeline</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === 'weekly' ? (
        /* Modern Calendar Grid View */
        <Card className="border border-border/70 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-border/70 bg-muted/40">
                  <th className="py-3 px-4 text-left font-semibold text-xs text-muted-foreground uppercase tracking-wider w-28">
                    Time Slot
                  </th>
                  {DAYS_OF_WEEK.map((day) => {
                    const isToday = day.value === today;
                    return (
                      <th
                        key={day.value}
                        className={`py-3 px-3 text-center font-semibold text-xs tracking-wide transition-colors ${
                          isToday ? 'text-primary bg-primary/5' : 'text-muted-foreground'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <span>{day.label}</span>
                          {isToday && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary/10 text-primary font-medium">
                              Today
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {PERIODS.map((period) => (
                  <tr key={period.period} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 text-xs text-muted-foreground align-top">
                      <p className="font-semibold text-foreground">Period {period.period}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">{period.start} - {period.end}</p>
                    </td>
                    {DAYS_OF_WEEK.map((day) => {
                      const slot = timetable?.slots.find((s) => s.day === day.value && s.period === period.period);
                      const isToday = day.value === today;
                      return (
                        <td
                          key={day.value}
                          className={`p-2 align-top text-center ${isToday ? 'bg-primary/[0.02]' : ''}`}
                        >
                          {slot ? (
                            slot.type === 'break' ? (
                              <div className="h-full min-h-[64px] flex items-center justify-center rounded-xl bg-muted/40 border border-dashed border-border/60 text-muted-foreground/60 text-xs">
                                <Coffee className="w-3.5 h-3.5 mr-1" />
                                <span>Break</span>
                              </div>
                            ) : (
                              <div
                                className={`p-2.5 rounded-xl text-left transition-all duration-150 border ${
                                  slot.type === 'lab'
                                    ? 'bg-blue-500/[0.07] border-blue-500/20 text-foreground dark:text-blue-200'
                                    : slot.type === 'tutorial'
                                    ? 'bg-emerald-500/[0.07] border-emerald-500/20 text-foreground dark:text-emerald-200'
                                    : 'bg-primary/[0.07] border-primary/20 text-foreground dark:text-primary'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="font-semibold text-xs tracking-tight">{slot.courseCode}</span>
                                  <Badge
                                    variant="outline"
                                    className={`text-[9px] py-0 px-1 border-transparent ${
                                      slot.type === 'lab'
                                        ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
                                        : slot.type === 'tutorial'
                                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-primary/10 text-primary'
                                    }`}
                                  >
                                    {slot.type}
                                  </Badge>
                                </div>
                                <p className="text-xs text-foreground/80 font-medium truncate mb-1.5">{slot.courseName}</p>
                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                  <MapPin className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{slot.room}</span>
                                </div>
                              </div>
                            )
                          ) : (
                            <div className="h-full min-h-[64px] flex items-center justify-center text-muted-foreground/30 text-xs">
                              —
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Chronological Daily Timeline View */
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-between px-1 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Schedule for Today ({today.toUpperCase()})
            </span>
            <span className="text-xs text-muted-foreground">{PERIODS.length} periods total</span>
          </div>

          <div className="relative pl-6 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-border/70 space-y-3">
            {PERIODS.map((period) => {
              const slot = timetable?.slots.find((s) => s.day === today && s.period === period.period);
              const isBreak = slot?.type === 'break';
              return (
                <div key={period.period} className="relative">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-6 top-4 w-2.5 h-2.5 rounded-full border-2 border-background transition-colors ${
                      slot && !isBreak ? 'bg-primary' : 'bg-muted-foreground/40'
                    }`}
                  />
                  <Card className={`border border-border/70 shadow-xs ${slot && !isBreak ? 'bg-card' : 'bg-muted/30'}`}>
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="text-left w-24 shrink-0">
                          <p className="text-xs font-semibold text-foreground">Period {period.period}</p>
                          <p className="text-[11px] font-mono text-muted-foreground">{period.start}</p>
                        </div>
                        <div className="w-px h-8 bg-border/60 shrink-0" />
                        {slot ? (
                          isBreak ? (
                            <div className="flex items-center gap-2 text-muted-foreground text-xs italic">
                              <Coffee className="w-4 h-4" />
                              <span>Intermission / Lunch Break</span>
                            </div>
                          ) : (
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">{slot.courseName}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                <span className="flex items-center gap-1"><User className="w-3 h-3" />{slot.facultyName || 'Faculty'}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{slot.room}</span>
                              </div>
                            </div>
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground/60 italic">No class scheduled</span>
                        )}
                      </div>
                      {slot && !isBreak && (
                        <Badge
                          variant={slot.type === 'lab' ? 'info' : slot.type === 'tutorial' ? 'success' : 'default'}
                          className="shrink-0 text-xs"
                        >
                          {slot.type}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
