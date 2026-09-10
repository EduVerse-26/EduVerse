'use client';

import { useQuery } from '@tanstack/react-query';
import { getQuizzes } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Plus, Clock, Users, PlayCircle, Settings2 } from 'lucide-react';

export default function QuizzesPage() {
  const { data: quizzes } = useQuery({ 
    queryKey: ['facultyQuizzes'], 
    queryFn: () => getQuizzes() 
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
          <p className="text-muted-foreground mt-2">Manage multiple-choice quizzes and assessments.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Quiz
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {quizzes?.map((quiz) => (
          <Card key={quiz.id} className="flex flex-col">
            <CardHeader className="pb-4 border-b bg-muted/20">
              <div className="flex justify-between items-start">
                <Badge variant={quiz.isPublished ? 'default' : 'secondary'} className="mb-3">
                  {quiz.isPublished ? 'Published' : 'Draft'}
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2">
                  <Settings2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
              <CardTitle className="text-xl line-clamp-1">{quiz.title}</CardTitle>
              <CardDescription>{quiz.courseCode} • {quiz.courseName}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex-1 flex flex-col justify-between space-y-6">
              
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <HelpCircle className="w-4 h-4" />
                  <span>{quiz.questions?.length || 0} Questions</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{quiz.duration} Mins</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <PlayCircle className="w-4 h-4" />
                  <span>{quiz.totalPoints} Points</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{quiz.attemptsCount || 0} Attempts</span>
                </div>
              </div>

              <div className="pt-4 border-t flex gap-3">
                <Button variant="outline" className="flex-1">View Results</Button>
                <Button className="flex-1">Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!quizzes || quizzes.length === 0) && (
          <div className="col-span-full py-12 text-center text-muted-foreground flex flex-col items-center">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <HelpCircle className="w-8 h-8 opacity-50" />
            </div>
            <p className="font-medium text-lg">No quizzes found</p>
            <p className="text-sm mt-1">Create your first quiz to evaluate students.</p>
          </div>
        )}
      </div>
    </div>
  );
}
