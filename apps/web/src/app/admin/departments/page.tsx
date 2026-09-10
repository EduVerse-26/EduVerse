'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDepartments, createDepartment, deleteDepartment } from '@eduverse/api';
import { createDepartmentSchema, type CreateDepartmentFormData } from '@eduverse/validation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    queryKey: ['departments'],
    queryFn: getDepartments,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateDepartmentFormData) => createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department created successfully');
      setIsDialogOpen(false);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDepartment(id),
    onSuccess: () => {
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
          <h2 className="text-2xl font-bold">Departments</h2>
          <p className="text-muted-foreground">Manage all departments in the institution</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} variant="glow">
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search departments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Department Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-1">No departments found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery ? 'Try a different search term' : 'Create your first department to get started'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Department
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((dept) => (
            <Card key={dept.id} className="group hover:shadow-lg hover:border-primary/20 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{dept.name}</h3>
                      <Badge variant="outline" className="text-[10px] mt-0.5">{dept.code}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(dept.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  HOD: {dept.hodName || <span className="text-warning italic">Not assigned</span>}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{dept.facultyCount} Faculty</span>
                  <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" />{dept.studentCount} Students</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{dept.courseCount} Courses</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Department</DialogTitle>
            <DialogDescription>Add a new department to the institution</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name</Label>
              <Input id="name" placeholder="e.g. Computer Science" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Department Code</Label>
              <Input id="code" placeholder="e.g. CSE" {...register('code')} />
              {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Department'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
