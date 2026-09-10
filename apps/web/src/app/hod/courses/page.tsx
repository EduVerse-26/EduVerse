'use client';

import { useQuery } from '@tanstack/react-query';
import { getCourses, getCourseAllocations, getFacultyList } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, UserCircle, Plus } from 'lucide-react';

export default function CoursesPage() {
  const { data: courses } = useQuery({ 
    queryKey: ['hodCourses'], 
    queryFn: () => getCourses('dept-1') 
  });

  const { data: allocations } = useQuery({ 
    queryKey: ['hodAllocations'], 
    queryFn: () => getCourseAllocations('dept-1') 
  });

  const { data: faculty } = useQuery({ 
    queryKey: ['hodFacultyList'], 
    queryFn: () => getFacultyList('dept-1') 
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Allocation</h1>
          <p className="text-muted-foreground mt-2">Manage courses and faculty assignments for your department.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Assign Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => {
          const courseAllocations = allocations?.filter(a => a.courseId === course.id) || [];
          
          return (
            <Card key={course.id} className="flex flex-col">
              <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="font-mono bg-background">
                    {course.code}
                  </Badge>
                  <Badge variant="secondary">
                    {course.credits} Credits
                  </Badge>
                </div>
                <CardTitle className="text-xl leading-tight">{course.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 flex-1 flex flex-col">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-primary" />
                  Assigned Faculty
                </h4>
                
                {courseAllocations.length > 0 ? (
                  <div className="space-y-3 mb-6">
                    {courseAllocations.map(alloc => (
                      <div key={alloc.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                        <span className="font-medium">{alloc.facultyName}</span>
                        <span className="text-muted-foreground text-xs">{alloc.batch} - {alloc.section}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-sm text-muted-foreground mb-6 italic">
                    No faculty assigned yet.
                  </div>
                )}
                
                <Button variant="outline" className="w-full mt-auto">
                  Manage Allocations
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
