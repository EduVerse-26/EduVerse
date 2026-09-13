'use client';

import { useQuery } from '@tanstack/react-query';
import { getTimetable } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export default function TimetablePage() {
  const [batch, setBatch] = useState('2024');
  const [section, setSection] = useState('A');

  const { data: timetable, isLoading } = useQuery({ 
    queryKey: ['hodTimetable', batch, section], 
    queryFn: () => getTimetable(batch, section) 
  });

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Department Master Timetable</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Comprehensive schedule overview across batches, faculty, and lecture halls</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={batch} onValueChange={setBatch}>
            <SelectTrigger className="w-[120px] h-9 text-xs rounded-xl">
              <SelectValue placeholder="Batch" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs">
              <SelectItem value="2024">Batch 2024</SelectItem>
              <SelectItem value="2025">Batch 2025</SelectItem>
            </SelectContent>
          </Select>
          <Select value={section} onValueChange={setSection}>
            <SelectTrigger className="w-[120px] h-9 text-xs rounded-xl">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs">
              <SelectItem value="A">Section A</SelectItem>
              <SelectItem value="B">Section B</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {days.map((day) => {
          const daySlots = timetable?.slots?.filter((s) => s.day === day).sort((a, b) => a.period - b.period) || [];
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
                            <UserCircle className="w-3.5 h-3.5 text-muted-foreground/70" />
                            {slot.facultyName}
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
