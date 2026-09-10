'use client';

import { useQuery } from '@tanstack/react-query';
import { getResources, getCourses } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FolderOpen, FileText, Video, Image, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize, formatDate, getFileIcon } from '@eduverse/utils';
import { useState } from 'react';

export default function StudentResourcesPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const { data: resources } = useQuery({ queryKey: ['resources'], queryFn: () => getResources() });
  const { data: courses } = useQuery({ queryKey: ['courses'], queryFn: () => getCourses() });

  const filtered = selectedCourse === 'all' ? resources : resources?.filter(r => r.courseId === selectedCourse);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Learning Resources</h2>
        <p className="text-muted-foreground">Access study materials uploaded by your faculty</p>
      </div>

      <Tabs value={selectedCourse} onValueChange={setSelectedCourse}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          {courses?.map(c => (
            <TabsTrigger key={c.id} value={c.id}>{c.code}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium">No resources available</h3>
            <p className="text-sm text-muted-foreground">Resources for this course will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered?.map(resource => (
            <Card key={resource.id} className="group hover:shadow-lg hover:border-primary/20 transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{getFileIcon(resource.fileName || '')}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">{resource.title}</h3>
                    {resource.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{resource.description}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px]">{resource.courseName}</Badge>
                      <Badge variant="outline" className="text-[10px]">{resource.type}</Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground">
                      <span>{resource.uploadedByName}</span>
                      <span>{resource.fileSize ? formatFileSize(resource.fileSize) : ''}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{formatDate(resource.createdAt)}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
