'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getAdminDepartments, createAdminDepartment, updateAdminDepartment, deleteAdminDepartment, getAdminUsers } from '@eduverse/api';
import { createDepartmentSchema, type CreateDepartmentFormData } from '@eduverse/validation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Building2, Plus, Pencil, Trash2, Users, GraduationCap, BookOpen, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function DepartmentsPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: departments, isLoading } = useQuery({ 
    queryKey: ['adminDepartments'], 
    queryFn: () => getAdminDepartments() 
  });

  const { data: users } = useQuery({
    queryKey: ['adminAllUsers'],
    queryFn: () => getAdminUsers()
  });

  const createDeptMutation = useMutation({
    mutationFn: async (deptData: any) => {
      return createAdminDepartment(deptData);
    },onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department created successfully');
      setIsDialogOpen(false);
      reset();
    },
  });

  const deleteDeptMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteAdminDepartment(id);
    },onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department deleted');
    },
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateDepartmentFormData>({
    resolver: zodResolver(createDepartmentSchema),
  });

  const filtered = departments?.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Academic Departments</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Faculty branches, departmental codes, and student quotas</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} size="sm" className="h-9 gap-1.5">
          <Plus className="w-4 h-4" />
          Add Department
        </Button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by department name or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10 rounded-xl"
        />
      </div>

      {/* Department Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="border border-border/70 p-6 rounded-2xl">
              <Skeleton className="h-6 w-32 mb-4 rounded-lg" />
              <Skeleton className="h-4 w-48 mb-2 rounded-lg" />
              <Skeleton className="h-4 w-24 rounded-lg" />
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border border-border/70 rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
              <Building2 className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground">No departments found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              {searchQuery ? 'Try a different search keyword' : 'Create your first department to get started'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsDialogOpen(true)} size="sm" className="mt-4 gap-1.5">
                <Plus className="w-4 h-4" />
                Add Department
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((dept) => (
            <Card key={dept.id} className="border border-border/70 hover:border-border transition-all shadow-xs group flex flex-col justify-between">
              <CardContent className="p-5 md:p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                        {dept.name}
                      </h3>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {dept.code}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg text-rose-500 hover:bg-rose-500/10"
                      onClick={() => deleteDeptMutation.mutate(dept.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  <p className="text-xs text-muted-foreground">
                    Head of Dept: <span className="font-medium text-foreground">{dept.hodName || 'Not assigned'}</span>
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border/50">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-muted-foreground/70" />{dept.facultyCount} Faculty</span>
                    <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-muted-foreground/70" />{dept.studentCount} Students</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-muted-foreground/70" />{dept.courseCount} Courses</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Task Addition Style Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Create Department</DialogTitle>
            <DialogDescription className="text-xs">Add a new academic discipline to institutional records</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit((data) => createDeptMutation.mutate(data))} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Department Name *
              </Label>
              <Input id="name" placeholder="e.g. Mechanical Engineering" className="h-10" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="code" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Department Code *
              </Label>
              <Input id="code" placeholder="e.g. MECH" className="h-10 font-mono uppercase" {...register('code')} />
              {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)} className="h-9">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="h-9" disabled={createDeptMutation.isPending}>
                {createDeptMutation.isPending ? 'Creating...' : 'Create Department'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
