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
          <h2 className="text-2xl font-bold">Student Directory</h2>
          <p className="text-muted-foreground">Manage students across all batches and sections</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button variant="glow">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      <div className="flex gap-2 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, roll number, or batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm max-w-[150px]">
          <option value="">All Batches</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>
        <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm max-w-[150px]">
          <option value="">All Sections</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
          <option value="C">Section C</option>
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
      ) : filtered?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <GraduationCap className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium">No students found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered?.map(s => (
            <Card key={s.id} className="group hover:shadow-lg hover:border-primary/20 transition-all">
              <CardContent className="p-4 flex items-start gap-4">
                <Avatar className="w-12 h-12 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary">{getInitials(s.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold truncate pr-2">{s.name}</h3>
                    <Badge variant={s.isActive ? "success" : "secondary"} className="text-[10px] shrink-0">
                      {s.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono mt-0.5">{s.rollNumber}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-[10px] bg-muted/50">Batch {s.batch}</Badge>
                    <Badge variant="outline" className="text-[10px] bg-muted/50">Sem {s.semester}</Badge>
                    <Badge variant="outline" className="text-[10px] bg-muted/50">Sec {s.section}</Badge>
                  </div>
                  
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{s.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>{s.phone}</span>
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
