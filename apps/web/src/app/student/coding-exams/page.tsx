'use client';

import { useQuery } from '@tanstack/react-query';
import { getCodingExams } from '@eduverse/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Code2, Clock, Calendar, ChevronRight, Award } from 'lucide-react';
import { formatDate, formatDuration, getTimeRemaining } from '@eduverse/utils';
import Link from 'next/link';

export default function CodingExamsListPage() {
  const { data: exams, isLoading } = useQuery({
    queryKey: ['codingExams'],
    queryFn: () => getCodingExams(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Coding Assessments</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Timed algorithmic problem-solving tests and competitive programming labs</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {exams?.length || 0} Total Exams
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
        </div>
      ) : exams?.length === 0 ? (
        <Card className="border border-border/70">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
              <Code2 className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground">No coding exams scheduled</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">Upcoming programming lab tests will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {exams?.map((exam) => {
            const deadline = getTimeRemaining(exam.endTime);
            const isActive = new Date() >= new Date(exam.startTime) && new Date() <= new Date(exam.endTime);
            const isUpcoming = new Date() < new Date(exam.startTime);
            const isExpired = new Date() > new Date(exam.endTime);

            return (
              <Card key={exam.id} className="border border-border/70 hover:border-border transition-all shadow-xs group">
                <CardContent className="p-5 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Code2 className="w-6 h-6" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                            {exam.title}
                          </h3>
                          <Badge variant="outline" className="text-[10px]">
                            {exam.courseCode}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{exam.courseName}</p>

                        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                            {formatDate(exam.startTime)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
                            {formatDuration(exam.duration)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Code2 className="w-3.5 h-3.5 text-muted-foreground/70" />
                            {exam.problems.length} problems
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-muted-foreground/70" />
                            {exam.totalPoints} pts
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 pt-2 flex-wrap">
                          <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider mr-1">Languages:</span>
                          {exam.allowedLanguages.map((lang) => (
                            <span key={lang} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-row lg:flex-col items-end justify-between lg:justify-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-border/50 shrink-0">
                      {isActive && (
                        <>
                          <Badge variant="success" className="text-xs">
                            Active Session
                          </Badge>
                          <Link href={`/student/coding-exams/${exam.id}`}>
                            <Button size="sm" className="h-8 text-xs font-medium">
                              Enter Test Environment
                              <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </Link>
                        </>
                      )}
                      {isUpcoming && (
                        <>
                          <Badge variant="info" className="text-xs">{deadline.text}</Badge>
                          <Button variant="outline" size="sm" className="h-8 text-xs" disabled>
                            Scheduled
                          </Button>
                        </>
                      )}
                      {isExpired && (
                        <>
                          <Badge variant="secondary" className="text-xs">Completed</Badge>
                          <Link href={`/student/coding-exams/${exam.id}`}>
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                              Review Code
                            </Button>
                          </Link>
                        </>
                      )}
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
