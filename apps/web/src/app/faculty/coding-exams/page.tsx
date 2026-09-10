'use client';

import { useQuery } from '@tanstack/react-query';
import { getCodingExams } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code2, Plus, Clock, TerminalSquare, Calendar, PlaySquare } from 'lucide-react';

export default function CodingExamsPage() {
  const { data: exams } = useQuery({ 
    queryKey: ['facultyCodingExams'], 
    queryFn: () => getCodingExams() 
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coding Exams</h1>
          <p className="text-muted-foreground mt-2">Manage practical programming assessments.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Exam
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams?.map((exam) => (
          <Card key={exam.id} className="flex flex-col overflow-hidden border-border/60">
            <div className="h-2 bg-gradient-to-r from-teal-500 to-emerald-500" />
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <Badge variant={exam.isPublished ? 'default' : 'secondary'} className="mb-2">
                  {exam.isPublished ? 'Live' : 'Draft'}
                </Badge>
              </div>
              <CardTitle className="text-xl line-clamp-1">{exam.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <span>{exam.courseCode}</span>
                <span>•</span>
                <span>{exam.courseName}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 flex-1 flex flex-col justify-between space-y-6">
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <TerminalSquare className="w-4 h-4 text-primary" />
                  <span>{exam.problems?.length || 0} Problems</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{exam.duration} Minutes</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{new Date(exam.startTime || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {exam.allowedLanguages?.map(lang => (
                  <Badge key={lang} variant="outline" className="text-[10px] uppercase bg-muted/30">
                    {lang}
                  </Badge>
                ))}
              </div>

              <div className="pt-4 border-t flex gap-3">
                <Button variant="outline" className="flex-1 gap-2">
                  <PlaySquare className="w-4 h-4" />
                  Submissions
                </Button>
                <Button className="flex-1">Configure</Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!exams || exams.length === 0) && (
          <div className="col-span-full py-16 text-center text-muted-foreground flex flex-col items-center border-2 border-dashed border-border/50 rounded-xl">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <Code2 className="w-8 h-8 opacity-50" />
            </div>
            <p className="font-medium text-lg text-foreground">No coding exams yet</p>
            <p className="text-sm mt-1 max-w-sm">Create hands-on programming assessments with automated test case evaluation.</p>
            <Button className="mt-6 gap-2" variant="outline">
              <Plus className="w-4 h-4" />
              Create your first exam
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
