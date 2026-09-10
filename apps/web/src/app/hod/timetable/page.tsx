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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Master Timetable</h1>
          <p className="text-muted-foreground mt-2">View department schedules across batches and sections.</p>
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

      <div className="grid gap-6">
        {days.map((day) => {
          const daySlots = timetable?.slots?.filter(s => s.day === day).sort((a, b) => a.period - b.period) || [];
          
          if (daySlots.length === 0) return null;
          
          return (
            <Card key={day} className="overflow-hidden">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <CardTitle className="capitalize text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {day}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {daySlots.map((slot) => (
                    <div key={slot.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center hover:bg-muted/10 transition-colors">
                      <div className="flex items-center sm:items-start flex-row sm:flex-col gap-2 sm:gap-1 min-w-[120px]">
                        <Badge variant="outline" className="w-fit font-mono">Period {slot.period}</Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-lg">{slot.courseName}</h3>
                            <p className="text-sm text-muted-foreground">{slot.courseCode}</p>
                          </div>
                          <Badge variant={slot.type === 'lab' ? 'default' : 'secondary'} className="capitalize">
                            {slot.type}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            Room {slot.room}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <UserCircle className="w-4 h-4" />
                            {slot.facultyName}
                          </div>
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
