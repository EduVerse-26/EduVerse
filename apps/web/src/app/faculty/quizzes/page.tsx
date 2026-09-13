'use client';

import { useQuery } from '@tanstack/react-query';
import { getQuizzes } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Plus, Clock, Users, Award, Settings2 } from 'lucide-react';

export default function QuizzesPage() {
  const { data: quizzes } = useQuery({ 
    queryKey: ['facultyQuizzes'], 
    queryFn: () => getQuizzes() 
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Continuous Quizzes</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Manage objective assessments, question pools, and student evaluations</p>
        </div>
        <Button size="sm" className="h-9 gap-1.5">
          <Plus className="w-4 h-4" />
          Create New Quiz
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {quizzes?.map((quiz) => (
          <Card key={quiz.id} className="border border-border/70 hover:border-border transition-all shadow-xs flex flex-col justify-between">
            <CardHeader className="p-5 pb-4 border-b border-border/70 bg-muted/20">
              <div className="flex justify-between items-start mb-2">
                <Badge variant={quiz.isPublished ? 'success' : 'secondary'} className="text-[10px]">
                  {quiz.isPublished ? 'Published' : 'Draft Mode'}
                </Badge>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground">
                  <Settings2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <CardTitle className="text-base font-semibold text-foreground line-clamp-1">{quiz.title}</CardTitle>
              <CardDescription className="text-xs">{quiz.courseCode} • {quiz.courseName}</CardDescription>
            </CardHeader>

            <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-5">
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <HelpCircle className="w-3.5 h-3.5 text-primary" />
                  <span>{quiz.questions?.length || 0} Questions</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>{quiz.duration} Mins</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="w-3.5 h-3.5 text-primary" />
                  <span>{quiz.totalPoints} Points</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span>{quiz.attemptsCount || 0} Submissions</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                  Review Scores
                </Button>
                <Button size="sm" className="flex-1 h-8 text-xs">
                  Edit Questions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!quizzes || quizzes.length === 0) && (
          <div className="col-span-full py-16 text-center text-muted-foreground flex flex-col items-center border border-border/70 rounded-2xl bg-card">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
              <HelpCircle className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-sm text-foreground">No quizzes created yet</p>
            <p className="text-xs text-muted-foreground mt-1">Click &quot;Create New Quiz&quot; above to add your first assessment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
