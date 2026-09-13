'use client';

import { useQuery } from '@tanstack/react-query';
import { getResources, getCourses } from '@eduverse/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FolderOpen, Download, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize, formatDate, getFileIcon } from '@eduverse/utils';
import { useState } from 'react';

export default function StudentResourcesPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const { data: resources } = useQuery({ queryKey: ['resources'], queryFn: () => getResources() });
  const { data: courses } = useQuery({ queryKey: ['courses'], queryFn: () => getCourses() });

  const filtered = selectedCourse === 'all' ? resources : resources?.filter((r) => r.courseId === selectedCourse);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Learning Resources & Library</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Course handouts, lecture presentations, datasets, and reference notes</p>
        </div>
        <Badge variant="outline" className="text-xs self-start sm:self-auto">
          {filtered?.length || 0} Files
        </Badge>
      </div>

      <Tabs value={selectedCourse} onValueChange={setSelectedCourse}>
        <TabsList className="flex-wrap h-auto p-1 bg-muted/60">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          {courses?.map((c) => (
            <TabsTrigger key={c.id} value={c.id}>{c.code}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered?.length === 0 ? (
        <Card className="border border-border/70 shadow-xs">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
              <FolderOpen className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground">No resources uploaded</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">Files shared by professors for this course will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered?.map((resource) => (
            <Card key={resource.id} className="border border-border/70 hover:border-border transition-all shadow-xs group">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted/80 flex items-center justify-center text-xl shrink-0 border border-border/60">
                      {getFileIcon(resource.fileName || '')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">{resource.courseName}</p>
                    </div>
                  </div>

                  {resource.description && (
                    <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
                      {resource.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-[10px]">{resource.type}</Badge>
                    {resource.fileSize && (
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {formatFileSize(resource.fileSize)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{resource.uploadedByName}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(resource.createdAt)}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-xs h-8">
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Download File
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
