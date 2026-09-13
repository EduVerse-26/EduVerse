'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { createAssignment, getCourses } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Save, ArrowLeft, Calendar, BookOpen, Clock, Award } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: courses } = useQuery({
    queryKey: ['courses', 'dept-1'],
    queryFn: () => getCourses('dept-1'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: (data: any) => createAssignment(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Assignment created successfully!');
        router.push('/faculty');
      } else {
        toast.error(result.error || 'Failed to create assignment');
      }
    },
    onSettled: () => setIsSubmitting(false),
  });

  const onSubmit = (data: any) => {
    setIsSubmitting(true);
    const course = courses?.find(c => c.id === data.courseId);
    mutation.mutate({
      ...data,
      courseName: course?.name,
      courseCode: course?.code,
      maxMarks: parseInt(data.maxMarks, 10),
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/faculty">
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Create Assignment</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Publish a new coursework task and submission deadline for students</p>
        </div>
      </div>

      {/* Task Addition Style Form Card */}
      <Card className="border border-border/70 bg-card rounded-2xl shadow-xs">
        <CardHeader className="pb-4 border-b border-border/70">
          <CardTitle className="text-base flex items-center gap-2 text-foreground">
            <FileText className="w-4 h-4 text-primary" />
            Assignment Specifications
          </CardTitle>
          <p className="text-xs text-muted-foreground">Configure problem details, grading points, and target batch</p>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Assignment Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g. Implement Dijkstra's Shortest Path Algorithm"
                className="h-10"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && <span className="text-xs text-destructive">{errors.title.message as string}</span>}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Instructions & Rubric
              </Label>
              <textarea
                id="description"
                rows={4}
                className="flex w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-sm shadow-xs transition-colors duration-150 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Provide detailed submission requirements, accepted formats, and evaluation criteria..."
                {...register('description')}
              />
            </div>

            {/* Course & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="courseId" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Course *
                </Label>
                <select
                  id="courseId"
                  className="flex h-10 w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
                  {...register('courseId', { required: 'Course is required' })}
                >
                  <option value="">Select a course...</option>
                  {courses?.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
                {errors.courseId && <span className="text-xs text-destructive">{errors.courseId.message as string}</span>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="deadline" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Submission Deadline *
                </Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  className="h-10"
                  {...register('deadline', { required: 'Deadline is required' })}
                />
                {errors.deadline && <span className="text-xs text-destructive">{errors.deadline.message as string}</span>}
              </div>
            </div>

            {/* Marks & Batch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="maxMarks" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Maximum Marks
                </Label>
                <Input
                  id="maxMarks"
                  type="number"
                  defaultValue="100"
                  min="1"
                  className="h-10"
                  {...register('maxMarks')}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="batch" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Target Batch & Section
                </Label>
                <div className="flex gap-2">
                  <Input placeholder="Batch (e.g. 2024)" className="h-10 w-1/2" {...register('batch')} />
                  <Input placeholder="Sec (e.g. A)" className="h-10 w-1/2" {...register('section')} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/70">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Publish Assignment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
