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
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Course Allocation & Curriculum</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Manage departmental curriculum, credit weights, and faculty teaching assignments</p>
        </div>
        <Button size="sm" className="h-9 gap-1.5">
          <Plus className="w-4 h-4" />
          Assign Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses?.map((course) => {
          const courseAllocations = allocations?.filter(a => a.courseId === course.id) || [];
          
          return (
            <Card key={course.id} className="border border-border/70 hover:border-border transition-all shadow-xs flex flex-col justify-between">
              <CardHeader className="bg-muted/20 pb-4 border-b border-border/70 p-5">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="font-mono text-[10px] bg-background">
                    {course.code}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {course.credits} Credits
                  </Badge>
                </div>
                <CardTitle className="text-base font-semibold text-foreground leading-snug">{course.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1 text-xs">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <UserCircle className="w-3.5 h-3.5 text-primary" />
                    Faculty Allocation
                  </h4>
                  
                  {courseAllocations.length > 0 ? (
                    <div className="space-y-2">
                      {courseAllocations.map(alloc => (
                        <div key={alloc.id} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-muted/40 border border-border/50">
                          <span className="font-medium text-foreground">{alloc.facultyName}</span>
                          <span className="text-muted-foreground font-mono text-[11px]">{alloc.batch} • Sec {alloc.section}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-xs text-muted-foreground italic bg-muted/20 rounded-xl border border-dashed border-border/60">
                      No faculty assigned yet
                    </div>
                  )}
                </div>
                
                <Button variant="outline" size="sm" className="w-full h-8 text-xs mt-auto">
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
