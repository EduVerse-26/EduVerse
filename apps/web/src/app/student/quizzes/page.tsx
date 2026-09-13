'use client';

import { useQuery } from '@tanstack/react-query';
import { getQuizzes } from '@eduverse/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HelpCircle, Clock, Calendar, ChevronRight, Trophy } from 'lucide-react';
import { formatDate, formatDuration } from '@eduverse/utils';
import Link from 'next/link';

export default function StudentQuizzesPage() {
  const { data: quizzes } = useQuery({ queryKey: ['quizzes'], queryFn: () => getQuizzes() });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Interactive Quizzes</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Continuous assessment quizzes, concept checks, and chapter reviews</p>
        </div>
        <Badge variant="outline" className="text-xs">
          {quizzes?.length || 0} Total Quizzes
        </Badge>
      </div>

      {quizzes?.length === 0 ? (
        <Card className="border border-border/70">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
              <HelpCircle className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground">No quizzes scheduled</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">Upcoming subject quizzes will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {quizzes?.map((quiz) => {
            const isActive = new Date() >= new Date(quiz.startTime) && new Date() <= new Date(quiz.endTime);
            return (
              <Card key={quiz.id} className="border border-border/70 hover:border-border transition-all shadow-xs group">
                <CardContent className="p-5 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                            {quiz.title}
                          </h3>
                          <Badge variant="outline" className="text-[10px]">
                            {quiz.courseCode}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{quiz.courseName}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                            {formatDate(quiz.startTime)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
                            {formatDuration(quiz.duration)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/70" />
                            {quiz.questions.length} questions
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5 text-muted-foreground/70" />
                            {quiz.totalPoints} points
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-row lg:flex-col items-end justify-between lg:justify-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-border/50 shrink-0">
                      {isActive ? (
                        <>
                          <Badge variant="success" className="text-xs">Active Now</Badge>
                          <Link href={`/student/quizzes`}>
                            <Button size="sm" className="h-8 text-xs font-medium">
                              Take Quiz
                              <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Badge variant="secondary" className="text-xs">Completed</Badge>
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            View Results
                          </Button>
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
