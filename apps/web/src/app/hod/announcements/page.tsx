'use client';

import { useQuery } from '@tanstack/react-query';
import { getAnnouncements } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Plus, Calendar } from 'lucide-react';

export default function AnnouncementsPage() {
  const { data: announcements } = useQuery({ 
    queryKey: ['hodAnnouncements'], 
    queryFn: () => getAnnouncements('department') 
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground mt-2">Manage department-wide notices and alerts.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Announcement
        </Button>
      </div>

      <div className="grid gap-6">
        {announcements?.map((announcement) => (
          <Card key={announcement.id} className="overflow-hidden">
            <div className={`h-1.5 ${announcement.priority === 'high' ? 'bg-red-500' : 'bg-primary'}`} />
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{announcement.title}</CardTitle>
                {announcement.priority === 'high' && (
                  <Badge variant="destructive">Urgent</Badge>
                )}
              </div>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(announcement.createdAt).toLocaleDateString()} 
                <span>•</span>
                By {announcement.authorName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{announcement.content}</p>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!announcements || announcements.length === 0) && (
          <div className="py-16 text-center text-muted-foreground flex flex-col items-center border-2 border-dashed border-border/50 rounded-xl">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <Megaphone className="w-8 h-8 opacity-50" />
            </div>
            <p className="font-medium text-lg text-foreground">No announcements active</p>
            <p className="text-sm mt-1 max-w-sm">Keep students and faculty informed by posting a department announcement.</p>
          </div>
        )}
      </div>
    </div>
  );
}
