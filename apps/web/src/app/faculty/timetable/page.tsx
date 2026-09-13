'use client';

import { useQuery } from '@tanstack/react-query';
import { getFacultyTimetable } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TimetablePage() {
  const { data: timetable, isLoading } = useQuery({
    queryKey: ['facultyTimetable', 'fac-1'],
    queryFn: () => getFacultyTimetable('fac-1'),
  });

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Faculty Weekly Timetable</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Assigned lecture hours, laboratory practicals, and tutorial sessions</p>
        </div>
      </div>

      <div className="space-y-5">
        {days.map((day) => {
          const daySlots = timetable?.filter((s) => s.day === day).sort((a, b) => a.period - b.period) || [];
          if (daySlots.length === 0) return null;
          const isToday = day === today;

          return (
            <Card key={day} className={`border shadow-xs overflow-hidden ${isToday ? 'border-primary/40' : 'border-border/70'}`}>
              <CardHeader className={`py-3 px-6 border-b flex flex-row items-center justify-between ${isToday ? 'bg-primary/5 border-primary/20' : 'bg-muted/40 border-border/70'}`}>
                <CardTitle className="capitalize text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  {day}
                </CardTitle>
                {isToday && (
                  <Badge variant="default" className="text-[10px] py-0 px-2">
                    Today
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-4 md:p-5 flex flex-col sm:flex-row gap-4 sm:items-center hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center sm:items-start flex-row sm:flex-col gap-2 min-w-[130px] shrink-0">
                        <Badge variant="outline" className="font-mono text-xs text-foreground">
                          Period {slot.period}
                        </Badge>
                        <span className="flex items-center text-xs text-muted-foreground font-mono">
                          <Clock className="w-3.5 h-3.5 mr-1 text-muted-foreground/70" />
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm text-foreground truncate">{slot.courseName}</h3>
                            <p className="text-xs text-muted-foreground">{slot.courseCode}</p>
                          </div>
                          <Badge
                            variant={slot.type === 'lab' ? 'info' : 'outline'}
                            className="text-xs capitalize shrink-0"
                          >
                            {slot.type}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground/70" />
                            Room {slot.room}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-muted-foreground/70" />
                            Batch {slot.batch} • Section {slot.section}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
