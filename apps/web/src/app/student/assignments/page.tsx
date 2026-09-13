'use client';

import { useQuery } from '@tanstack/react-query';
import { getAssignments } from '@eduverse/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Clock, ChevronRight, Upload, User, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate, getTimeRemaining } from '@eduverse/utils';
import Link from 'next/link';

export default function StudentAssignmentsPage() {
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => getAssignments(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Course Assignments</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Manage submissions, deadlines, and grades across all enrolled subjects</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {assignments?.length || 0} Total Active
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}</div>
      ) : assignments?.length === 0 ? (
        <Card className="border border-border/70">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground">No assignments pending</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">All coursework submissions are currently up to date.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {assignments?.map((assignment) => {
            const deadline = getTimeRemaining(assignment.deadline);
            return (
              <Card key={assignment.id} className="border border-border/70 hover:border-border transition-all shadow-xs group">
                <CardContent className="p-5 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                            {assignment.title}
                          </h3>
                          <Badge variant="outline" className="text-[10px]">
                            {assignment.courseCode}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{assignment.courseName}</p>
                        {assignment.description && (
                          <p className="text-xs text-muted-foreground/80 line-clamp-2 pt-0.5 leading-relaxed">
                            {assignment.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
                            Due: {formatDate(assignment.deadline)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-muted-foreground/70" />
                            Max: {assignment.maxMarks} pts
                          </span>
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-muted-foreground/70" />
                            {assignment.facultyName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-row lg:flex-col items-end justify-between lg:justify-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-border/50 shrink-0">
                      <Badge
                        variant={deadline.urgency === 'high' ? 'destructive' : deadline.urgency === 'medium' ? 'warning' : deadline.isOverdue ? 'destructive' : 'outline'}
                        className="text-xs"
                      >
                        {deadline.text}
                      </Badge>
                      <Button variant="outline" size="sm" className="h-8 text-xs font-medium">
                        <Upload className="w-3.5 h-3.5 mr-1.5" />
                        Submit Work
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
