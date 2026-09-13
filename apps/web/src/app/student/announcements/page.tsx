'use client';

import { useQuery } from '@tanstack/react-query';
import { getAnnouncements } from '@eduverse/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Calendar, User } from 'lucide-react';
import { formatDate, getRelativeTime } from '@eduverse/utils';

export default function StudentAnnouncementsPage() {
  const { data: announcements } = useQuery({ queryKey: ['announcements'], queryFn: () => getAnnouncements() });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Announcements & Notices</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Campus-wide alerts, department notifications, and academic circulars</p>
        </div>
        <Badge variant="outline" className="text-xs">
          {announcements?.length || 0} Total Notices
        </Badge>
      </div>

      <div className="space-y-3">
        {announcements?.map((ann) => {
          const isUrgent = ann.priority === 'urgent';
          const isHigh = ann.priority === 'high';

          return (
            <Card
              key={ann.id}
              className={`border transition-all shadow-xs ${
                isUrgent
                  ? 'border-rose-500/30 bg-rose-500/[0.02]'
                  : isHigh
                  ? 'border-amber-500/30 bg-amber-500/[0.02]'
                  : 'border-border/70 hover:border-border'
              }`}
            >
              <CardContent className="p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isUrgent
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : isHigh
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    <Megaphone className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm text-foreground">{ann.title}</h3>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {ann.scope}
                        </Badge>
                        {isUrgent && <Badge variant="destructive" className="text-[10px]">URGENT</Badge>}
                        {isHigh && <Badge variant="warning" className="text-[10px]">HIGH PRIORITY</Badge>}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{getRelativeTime(ann.createdAt)}</span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">{ann.content}</p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground/80">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {ann.authorName} ({ann.authorRole})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(ann.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
