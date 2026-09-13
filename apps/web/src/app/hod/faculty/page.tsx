'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFacultyList } from '@eduverse/api';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { UserCog, Search, Mail, Phone, BookOpen, UserPlus, Upload } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@eduverse/utils';

export default function HodFacultyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: faculty, isLoading } = useQuery({
    queryKey: ['faculty', 'dept-1'],
    queryFn: () => getFacultyList('dept-1'),
  });

  const filtered = faculty?.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Department Faculty Directory</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Faculty staff profiles, teaching designations, and academic specializations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            Bulk Upload
          </Button>
          <Button size="sm" className="h-9 gap-1.5">
            <UserPlus className="w-3.5 h-3.5" />
            Add Faculty
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Filter by name, designation, or specialization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10 rounded-xl"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="border border-border/70 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="w-11 h-11 rounded-xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mt-3" />
            </Card>
          ))}
        </div>
      ) : filtered?.length === 0 ? (
        <Card className="border border-border/70 rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
              <UserCog className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground">No faculty members found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">Try modifying your search criteria or add a new faculty member.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered?.map(f => (
            <Card key={f.id} className="border border-border/70 hover:border-border transition-all shadow-xs group">
              <CardContent className="p-5 md:p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="w-11 h-11 rounded-xl border border-border/70 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {getInitials(f.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                        {f.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">{f.designation}</p>
                    </div>
                  </div>
                  <Badge variant={f.isActive ? "success" : "secondary"} className="text-[10px] shrink-0">
                    {f.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="pt-3 border-t border-border/50 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
                    <span className="truncate font-mono text-[11px]">{f.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
                    <span className="font-mono text-[11px]">{f.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 pt-1">
                    <BookOpen className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0 mt-0.5" />
                    <div className="flex flex-wrap gap-1">
                      {f.specialization.split(',').map(spec => (
                        <span key={spec} className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted/60 border border-border/50 text-muted-foreground">
                          {spec.trim()}
                        </span>
                      ))}
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
