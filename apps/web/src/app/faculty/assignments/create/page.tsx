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
import { FileText, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: courses } = useQuery({
    queryKey: ['courses', 'dept-1'], // Mock dept id
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
    // Find course details
    const course = courses?.find(c => c.id === data.courseId);
    mutation.mutate({
      ...data,
      courseName: course?.name,
      courseCode: course?.code,
      maxMarks: parseInt(data.maxMarks, 10),
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/faculty">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold">Create Assignment</h2>
          <p className="text-muted-foreground">Publish a new assignment for your students</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Assignment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Assignment Title</Label>
              <Input id="title" placeholder="e.g. Implement Dijkstra's Algorithm" {...register('title', { required: 'Title is required' })} />
              {errors.title && <span className="text-xs text-destructive">{errors.title.message as string}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description & Instructions</Label>
              <textarea 
                id="description" 
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[120px]"
                placeholder="Provide detailed instructions for the assignment..."
                {...register('description')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseId">Course</Label>
                <select 
                  id="courseId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  {...register('courseId', { required: 'Course is required' })}
                >
                  <option value="">Select a course...</option>
                  {courses?.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
                {errors.courseId && <span className="text-xs text-destructive">{errors.courseId.message as string}</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" type="datetime-local" {...register('deadline', { required: 'Deadline is required' })} />
                {errors.deadline && <span className="text-xs text-destructive">{errors.deadline.message as string}</span>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxMarks">Maximum Marks</Label>
                <Input id="maxMarks" type="number" defaultValue="100" min="1" {...register('maxMarks')} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="batch">Batch / Section (Optional)</Label>
                <div className="flex gap-2">
                  <Input placeholder="Batch (e.g. 2024)" className="w-1/2" {...register('batch')} />
                  <Input placeholder="Section (e.g. A)" className="w-1/2" {...register('section')} />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button type="button" variant="ghost" onClick={() => router.back()} className="mr-2">Cancel</Button>
              <Button type="submit" variant="glow" disabled={isSubmitting}>
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
