'use client';

import { useQuery } from '@tanstack/react-query';
import { getDepartments, getFacultyList } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCog, Plus, Shield } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';

export default function HodManagementPage() {
  const { data: departments } = useQuery({ 
    queryKey: ['adminDepartments'], 
    queryFn: () => getDepartments() 
  });

  const { data: facultyList } = useQuery({ 
    queryKey: ['adminFaculty'], 
    queryFn: () => getFacultyList() 
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HOD Management</h1>
          <p className="text-muted-foreground mt-2">Assign and manage Heads of Department.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {departments?.map((dept) => {
          const currentHod = facultyList?.find(f => f.userId === dept.hodId);
          
          return (
            <Card key={dept.id} className="flex flex-col border-border/60">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2 font-mono">{dept.code}</Badge>
                </div>
                <CardTitle className="text-xl">{dept.name}</CardTitle>
                <CardDescription>Department Overview</CardDescription>
              </CardHeader>
              <CardContent className="pt-2 flex-1 flex flex-col">
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50 mb-6 flex items-start gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-full">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Current HOD</p>
                    {currentHod ? (
                      <div>
                        <p className="font-bold">{currentHod.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{currentHod.email}</p>
                      </div>
                    ) : (
                      <p className="font-medium text-amber-500">Not Assigned</p>
                    )}
                  </div>
                </div>

                <Button variant={currentHod ? 'outline' : 'default'} className="w-full mt-auto gap-2">
                  <UserCog className="w-4 h-4" />
                  {currentHod ? 'Change HOD' : 'Assign HOD'}
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {(!departments || departments.length === 0) && (
          <div className="col-span-full">
            <EmptyState 
              title="No departments found" 
              description="Create departments first to assign HODs." 
              icon={UserCog}
              actionLabel="Create Department"
            />
          </div>
        )}
      </div>
    </div>
  );
}
