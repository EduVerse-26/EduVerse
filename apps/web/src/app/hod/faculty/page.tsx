'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFacultyList } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
          <h2 className="text-2xl font-bold">Faculty Management</h2>
          <p className="text-muted-foreground">Manage faculty members in your department</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button variant="glow">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Faculty
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, designation, or specialization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <UserCog className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium">No faculty found</h3>
            <p className="text-sm text-muted-foreground">Adjust your search or add a new faculty member</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered?.map(f => (
            <Card key={f.id} className="group hover:shadow-lg hover:border-primary/20 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary">{getInitials(f.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{f.name}</h3>
                      <p className="text-sm text-muted-foreground">{f.designation}</p>
                    </div>
                  </div>
                  <Badge variant={f.isActive ? "success" : "secondary"} className="text-[10px]">
                    {f.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="truncate">{f.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>{f.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="flex flex-wrap gap-1">
                      {f.specialization.split(',').map(spec => (
                        <Badge key={spec} variant="outline" className="text-[10px] bg-muted/50">{spec.trim()}</Badge>
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
