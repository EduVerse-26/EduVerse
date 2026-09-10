'use client';

import { useQuery } from '@tanstack/react-query';
import { getQuizzes } from '@eduverse/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HelpCircle, Clock, Calendar, ChevronRight, Trophy } from 'lucide-react';
import { formatDate, formatDuration, getTimeRemaining } from '@eduverse/utils';
import Link from 'next/link';

export default function StudentQuizzesPage() {
  const { data: quizzes } = useQuery({ queryKey: ['quizzes'], queryFn: () => getQuizzes() });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Quizzes</h2>
        <p className="text-muted-foreground">Take quizzes and test your knowledge</p>
      </div>

      {quizzes?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <HelpCircle className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium">No quizzes available</h3>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {quizzes?.map(quiz => {
            const isActive = new Date() >= new Date(quiz.startTime) && new Date() <= new Date(quiz.endTime);
            return (
              <Card key={quiz.id} className="group hover:shadow-lg hover:border-primary/20 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${isActive ? 'bg-gradient-to-br from-purple-500 to-pink-600' : 'bg-muted'} shadow-lg`}>
                        <HelpCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{quiz.title}</h3>
                        <p className="text-sm text-muted-foreground">{quiz.courseName} ({quiz.courseCode})</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(quiz.startTime)}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDuration(quiz.duration)}</span>
                          <span>{quiz.questions.length} questions</span>
                          <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5" />{quiz.totalPoints} points</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {isActive ? (
                        <>
                          <Badge variant="success" className="animate-pulse">LIVE</Badge>
                          <Link href={`/student/quizzes/${quiz.id}`}>
                            <Button variant="glow" size="sm">Start Quiz <ChevronRight className="w-4 h-4 ml-1" /></Button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Badge variant="secondary">Completed</Badge>
                          <Button variant="outline" size="sm">View Results</Button>
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
