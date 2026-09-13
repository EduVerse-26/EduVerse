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
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Coding Lab Assessments</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Manage automated coding environments, test cases, and lab challenges</p>
        </div>
        <Button size="sm" className="h-9 gap-1.5">
          <Plus className="w-4 h-4" />
          Create Exam
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams?.map((exam) => (
          <Card key={exam.id} className="border border-border/70 hover:border-border transition-all shadow-xs flex flex-col justify-between">
            <CardHeader className="p-5 pb-4 border-b border-border/70 bg-muted/20">
              <div className="flex justify-between items-start mb-2">
                <Badge variant={exam.isPublished ? 'success' : 'secondary'} className="text-[10px]">
                  {exam.isPublished ? 'Live Session' : 'Draft'}
                </Badge>
              </div>
              <CardTitle className="text-base font-semibold text-foreground line-clamp-1">{exam.title}</CardTitle>
              <CardDescription className="text-xs mt-1">
                {exam.courseCode} • {exam.courseName}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-2.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <TerminalSquare className="w-3.5 h-3.5 text-primary" />
                  <span>{exam.problems?.length || 0} Algorithmic Problems</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>{exam.duration} Minutes Duration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>Scheduled: {new Date(exam.startTime || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {exam.allowedLanguages?.map((lang) => (
                  <span key={lang} className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60">
                    {lang}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-border/60 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1.5">
                  <PlaySquare className="w-3.5 h-3.5" />
                  Submissions
                </Button>
                <Button size="sm" className="flex-1 h-8 text-xs">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!exams || exams.length === 0) && (
          <div className="col-span-full py-16 text-center text-muted-foreground flex flex-col items-center border border-border/70 rounded-2xl bg-card">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
              <Code2 className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-sm text-foreground">No coding exams configured</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">Create hands-on programming assessments with automated test case evaluation.</p>
            <Button size="sm" className="mt-4 gap-1.5" variant="outline">
              <Plus className="w-4 h-4" />
              Create your first exam
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
