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
      case 'video': return <Video className="w-8 h-8 text-rose-500" />;
      case 'image': return <FileImage className="w-8 h-8 text-amber-500" />;
      case 'archive': return <FileArchive className="w-8 h-8 text-slate-500" />;
      default: return <FileText className="w-8 h-8 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learning Resources</h1>
          <p className="text-muted-foreground mt-2">Manage and upload study materials for your courses.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Upload Material
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources?.map((resource) => (
          <Card key={resource.id} className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
              <div className="p-3 bg-muted/50 rounded-xl">
                {getIcon(resource.type || 'document')}
              </div>
              <Badge variant="outline" className="text-xs">{resource.courseCode}</Badge>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-lg line-clamp-1">{resource.title}</h3>
              <CardDescription className="line-clamp-2 mt-1 mb-4 h-10">
                {resource.description || 'No description provided.'}
              </CardDescription>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                  {resource.fileSize ? (resource.fileSize / 1024 / 1024).toFixed(1) + ' MB' : 'Link'}
                </span>
                <Button variant="ghost" size="sm" className="gap-2 text-primary">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!resources || resources.length === 0) && (
          <div className="col-span-full">
            <EmptyState 
              title="No resources found" 
              description="Upload materials to share with your students." 
              actionLabel="Upload Material" 
            />
          </div>
        )}
      </div>
    </div>
  );
}
