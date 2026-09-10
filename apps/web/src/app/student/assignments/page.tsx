'use client';

import { useQuery } from '@tanstack/react-query';
import { getAssignments } from '@eduverse/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Clock, ChevronRight, Upload } from 'lucide-react';
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
      <div>
        <h2 className="text-2xl font-bold">Assignments</h2>
        <p className="text-muted-foreground">View and submit your course assignments</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}</div>
      ) : assignments?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium">No assignments yet</h3>
            <p className="text-sm text-muted-foreground">Your assignments will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignments?.map((assignment) => {
            const deadline = getTimeRemaining(assignment.deadline);
            return (
              <Card key={assignment.id} className="group hover:shadow-lg hover:border-primary/20 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{assignment.courseName} ({assignment.courseCode})</p>
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{assignment.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Due: {formatDate(assignment.deadline)}</span>
                          <span>Max Marks: {assignment.maxMarks}</span>
                          <span>By: {assignment.facultyName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={deadline.urgency === 'high' ? 'destructive' : deadline.urgency === 'medium' ? 'warning' : deadline.isOverdue ? 'destructive' : 'outline'}>
                        {deadline.text}
                      </Badge>
                      <Link href={`/student/assignments/${assignment.id}`}>
                        <Button variant="outline" size="sm">
                          <Upload className="w-3.5 h-3.5 mr-1.5" />
                          View / Submit
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
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
