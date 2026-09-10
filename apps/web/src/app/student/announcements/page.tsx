'use client';

import { useQuery } from '@tanstack/react-query';
import { getAnnouncements } from '@eduverse/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Bell } from 'lucide-react';
import { formatDate, getRelativeTime } from '@eduverse/utils';

export default function StudentAnnouncementsPage() {
  const { data: announcements } = useQuery({ queryKey: ['announcements'], queryFn: () => getAnnouncements() });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Announcements</h2>
        <p className="text-muted-foreground">Stay updated with the latest announcements</p>
      </div>

      <div className="space-y-4">
        {announcements?.map(ann => (
          <Card key={ann.id} className={`hover:shadow-md transition-all ${ann.priority === 'urgent' ? 'border-destructive/30 bg-destructive/5' : ann.priority === 'high' ? 'border-warning/30 bg-warning/5' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl shrink-0 ${
                  ann.priority === 'urgent' ? 'bg-gradient-to-br from-red-500 to-rose-600' :
                  ann.priority === 'high' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                  'bg-gradient-to-br from-blue-500 to-indigo-600'
                } shadow-lg`}>
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{ann.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px]">{ann.scope}</Badge>
                        {ann.priority !== 'normal' && ann.priority !== 'low' && (
                          <Badge variant={ann.priority === 'urgent' ? 'destructive' : 'warning'} className="text-[10px]">
                            {ann.priority.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{getRelativeTime(ann.createdAt)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">{ann.content}</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">By {ann.authorName} ({ann.authorRole}) • {formatDate(ann.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
