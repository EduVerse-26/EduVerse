'use client';

import { useQuery } from '@tanstack/react-query';
import { getCodingExams } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Code2, Clock, Calendar, ChevronRight, Timer } from 'lucide-react';
import { formatDate, formatDuration, getTimeRemaining } from '@eduverse/utils';
import Link from 'next/link';

export default function CodingExamsListPage() {
  const { data: exams, isLoading } = useQuery({
    queryKey: ['codingExams'],
    queryFn: () => getCodingExams(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Coding Examinations</h2>
        <p className="text-muted-foreground">Test your coding skills with timed challenges</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1,2].map(i => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
        </div>
      ) : exams?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Code2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-1">No coding exams available</h3>
            <p className="text-sm text-muted-foreground">Check back later for new challenges</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {exams?.map((exam) => {
            const deadline = getTimeRemaining(exam.endTime);
            const isActive = new Date() >= new Date(exam.startTime) && new Date() <= new Date(exam.endTime);
            const isUpcoming = new Date() < new Date(exam.startTime);
            const isExpired = new Date() > new Date(exam.endTime);

            return (
              <Card key={exam.id} className="group hover:shadow-lg hover:border-primary/20 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${isActive ? 'bg-gradient-to-br from-emerald-500 to-green-600' : isUpcoming ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-muted'} shadow-lg`}>
                        <Code2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{exam.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{exam.courseName} ({exam.courseCode})</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(exam.startTime)}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDuration(exam.duration)}</span>
                          <span className="flex items-center gap-1"><Code2 className="w-3.5 h-3.5" />{exam.problems.length} problems</span>
                          <span>🏆 {exam.totalPoints} points</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          {exam.allowedLanguages.map(lang => (
                            <Badge key={lang} variant="outline" className="text-[10px]">{lang}</Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {exam.problems.map((p, i) => (
                            <Badge key={p.id} variant={p.difficulty === 'easy' ? 'success' : p.difficulty === 'medium' ? 'warning' : 'destructive'} className="text-[10px]">
                              P{i+1}: {p.difficulty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {isActive && (
                        <>
                          <Badge variant="success" className="animate-pulse">🔴 LIVE</Badge>
                          <Link href={`/student/coding-exams/${exam.id}`}>
                            <Button variant="glow" size="sm">
                              Enter Exam
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                        </>
                      )}
                      {isUpcoming && (
                        <>
                          <Badge variant="info">{deadline.text}</Badge>
                          <Button variant="outline" size="sm" disabled>Starts Soon</Button>
                        </>
                      )}
                      {isExpired && (
                        <>
                          <Badge variant="secondary">Expired</Badge>
                          <Link href={`/student/coding-exams/${exam.id}`}>
                            <Button variant="outline" size="sm">View Results</Button>
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
