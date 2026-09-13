'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudents } from '@eduverse/api';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { GraduationCap, Search, Mail, Phone, Upload, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@eduverse/utils';

export default function HodStudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: students, isLoading } = useQuery({
    queryKey: ['students', 'dept-1'],
    queryFn: () => getStudents('dept-1'),
  });

  const filtered = students?.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.batch.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Student Roster & Directory</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Enrolled student records across academic batches and section allocations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            Bulk CSV
          </Button>
          <Button size="sm" className="h-9 gap-1.5">
            <UserPlus className="w-3.5 h-3.5" />
            Add Student
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by student name, roll number, or batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl"
          />
        </div>
        <div className="flex gap-2">
          <select className="h-10 rounded-xl border border-border/80 bg-background px-3 py-2 text-xs font-medium focus-visible:ring-2 focus-visible:ring-primary/20">
            <option value="">All Batches</option>
            <option value="2024">Batch 2024</option>
            <option value="2023">Batch 2023</option>
            <option value="2022">Batch 2022</option>
          </select>
          <select className="h-10 rounded-xl border border-border/80 bg-background px-3 py-2 text-xs font-medium focus-visible:ring-2 focus-visible:ring-primary/20">
            <option value="">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
      ) : filtered?.length === 0 ? (
        <Card className="border border-border/70 rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
              <GraduationCap className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground">No students matched</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">Adjust search keywords or section filters above.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered?.map(s => (
            <Card key={s.id} className="border border-border/70 hover:border-border transition-all shadow-xs group">
              <CardContent className="p-5 flex items-start gap-3.5">
                <Avatar className="w-11 h-11 rounded-xl border border-border/70 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {getInitials(s.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                      {s.name}
                    </h3>
                    <Badge variant={s.isActive ? "success" : "secondary"} className="text-[10px] shrink-0">
                      {s.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{s.rollNumber}</p>
                  
                  <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted border border-border/60 text-muted-foreground">
                      Batch {s.batch}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted border border-border/60 text-muted-foreground">
                      Sem {s.semester}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted border border-border/60 text-muted-foreground">
                      Sec {s.section}
                    </span>
                  </div>
                  
                  <div className="pt-2.5 mt-2 border-t border-border/50 space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
                      <span className="truncate font-mono text-[11px]">{s.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
                      <span className="font-mono text-[11px]">{s.phone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
