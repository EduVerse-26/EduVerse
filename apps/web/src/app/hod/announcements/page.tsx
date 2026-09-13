'use client';

import { useQuery } from '@tanstack/react-query';
import { getAnnouncements } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Plus, Calendar, User } from 'lucide-react';

export default function AnnouncementsPage() {
  const { data: announcements } = useQuery({ 
    queryKey: ['hodAnnouncements'], 
    queryFn: () => getAnnouncements('department') 
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Department Announcements</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Broadcast circulars, schedule changes, and departmental notices</p>
        </div>
        <Button size="sm" className="h-9 gap-1.5">
          <Plus className="w-4 h-4" />
          New Announcement
        </Button>
      </div>

      <div className="space-y-4">
        {announcements?.map((announcement) => {
          const isUrgent = announcement.priority === 'high' || announcement.priority === 'urgent';

          return (
            <Card key={announcement.id} className={`border shadow-xs ${isUrgent ? 'border-rose-500/30 bg-rose-500/[0.02]' : 'border-border/70 hover:border-border'}`}>
              <CardHeader className="p-5 pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-base font-semibold text-foreground">{announcement.title}</CardTitle>
                    {isUrgent && (
                      <Badge variant="destructive" className="text-[10px]">
                        URGENT
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription className="flex items-center gap-2 mt-1 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                  {new Date(announcement.createdAt).toLocaleDateString()} 
                  <span>•</span>
                  <span>By {announcement.authorName}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{announcement.content}</p>
                
                <div className="flex justify-end gap-2 pt-3 border-t border-border/50">
                  <Button variant="outline" size="sm" className="h-8 text-xs">Edit Notice</Button>
                  <Button variant="destructive" size="sm" className="h-8 text-xs">Delete</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {(!announcements || announcements.length === 0) && (
          <div className="py-16 text-center text-muted-foreground flex flex-col items-center border border-border/70 rounded-2xl bg-card">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
              <Megaphone className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-sm text-foreground">No announcements active</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">Keep students and faculty informed by posting a department announcement.</p>
          </div>
        )}
      </div>
    </div>
  );
}
