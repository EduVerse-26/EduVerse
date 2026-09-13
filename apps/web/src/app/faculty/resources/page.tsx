'use client';

import { useQuery } from '@tanstack/react-query';
import { getResources } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Download, FileArchive, FileImage, Video } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';

export default function ResourcesPage() {
  const { data: resources } = useQuery({ 
    queryKey: ['resources'], 
    queryFn: () => getResources() 
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-rose-500" />;
      case 'image': return <FileImage className="w-5 h-5 text-amber-500" />;
      case 'archive': return <FileArchive className="w-5 h-5 text-slate-500" />;
      default: return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Course Materials & Handouts</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Upload and distribute syllabus materials, lab manuals, and presentation slides</p>
        </div>
        <Button size="sm" className="h-9 gap-1.5">
          <Plus className="w-4 h-4" />
          Upload Material
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources?.map((resource) => (
          <Card key={resource.id} className="border border-border/70 hover:border-border transition-all shadow-xs flex flex-col justify-between">
            <CardHeader className="flex flex-row items-start justify-between gap-4 p-5 pb-3">
              <div className="w-10 h-10 bg-muted/70 rounded-xl flex items-center justify-center border border-border/60 shrink-0">
                {getIcon(resource.type || 'document')}
              </div>
              <Badge variant="outline" className="text-[10px]">{resource.courseCode}</Badge>
            </CardHeader>
            <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-foreground line-clamp-1">{resource.title}</h3>
                <CardDescription className="line-clamp-2 mt-1 text-xs">
                  {resource.description || 'No additional notes provided for this file.'}
                </CardDescription>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <span className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded-md bg-muted">
                  {resource.fileSize ? (resource.fileSize / 1024 / 1024).toFixed(1) + ' MB' : 'Attachment'}
                </span>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!resources || resources.length === 0) && (
          <div className="col-span-full">
            <EmptyState 
              title="No resources uploaded" 
              description="Upload materials to share with your students." 
              actionLabel="Upload Material" 
            />
          </div>
        )}
      </div>
    </div>
  );
}
