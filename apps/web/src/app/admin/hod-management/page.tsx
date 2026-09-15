'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminDepartments, getAdminUsers, updateAdminDepartment } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCog, Plus, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function HodManagementPage() {
  const queryClient = useQueryClient();
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('');

  const { data: departments, isLoading: depsLoading } = useQuery({
    queryKey: ['adminDepartments'],
    queryFn: () => getAdminDepartments() 
  });

  const { data: hods, isLoading: hodsLoading } = useQuery({
    queryKey: ['adminAllUsers'],
    queryFn: () => getAdminUsers(),
    select: (users) => users.filter(user => user.role === 'hod' && user.isActive)
  });

  const assignHodMutation = useMutation({
    mutationFn: async ({ deptId, hodId, hodName }: { deptId: string, hodId: string, hodName: string }) => {
      return updateAdminDepartment(deptId, { hodId, hodName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDepartments'] });
      setSelectedDeptId(null);
      setSelectedFacultyId('');
    }
  });

  const handleAssign = () => {
    if (!selectedDeptId || !selectedFacultyId) return;
    const hodUser = hods?.find(u => u.id === selectedFacultyId);
    if (!hodUser) return;
    assignHodMutation.mutate({ deptId: selectedDeptId, hodId: hodUser.id, hodName: hodUser.name });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">HOD Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Assign and manage department leadership across faculties.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {departments?.map((dept) => {
          const currentHod = hods?.find(u => u.id === dept.hodId);
          
          return (
            <Card key={dept.id} className="flex flex-col rounded-2xl border-border/70 bg-card shadow-xs hover:border-border transition-all duration-200">
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-muted/60 text-muted-foreground border border-border/60">
                    {dept.code}
                  </span>
                  {currentHod ? (
                    <Badge variant="success" className="gap-1 text-[11px] font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Assigned
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="gap-1 text-[11px] font-medium">
                      <AlertCircle className="w-3 h-3" />
                      Unassigned
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg font-bold text-foreground">{dept.name}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Department Leadership</CardDescription>
              </CardHeader>
              <CardContent className="pt-2 px-5 pb-5 flex-1 flex flex-col justify-between">
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 mb-5 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Current HOD</p>
                    {currentHod ? (
                      <div>
                        <p className="font-semibold text-sm text-foreground truncate">{currentHod.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{currentHod.email}</p>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Position Vacant</p>
                    )}
                  </div>
                </div>

                <Button 
                  variant={currentHod ? 'outline' : 'default'} 
                  className="w-full gap-2 rounded-xl text-sm font-medium shadow-xs"
                  onClick={() => {
                    setSelectedDeptId(dept.id);
                    setSelectedFacultyId(currentHod?.id || '');
                  }}
                >
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

      <Dialog open={!!selectedDeptId} onOpenChange={(open) => !open && setSelectedDeptId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Head of Department</DialogTitle>
            <DialogDescription>
              Select a faculty member to lead the department.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedFacultyId} onValueChange={setSelectedFacultyId}>
              <SelectTrigger>
                <SelectValue placeholder="Select HOD profile" />
              </SelectTrigger>
              <SelectContent>
                {hods?.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} - {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedDeptId(null)}>Cancel</Button>
            <Button 
              onClick={handleAssign} 
              disabled={!selectedFacultyId || assignHodMutation.isPending}
            >
              {assignHodMutation.isPending ? 'Assigning...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
