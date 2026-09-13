'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getChatMessages, sendMessage, getCounselingSessions } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Calendar, CheckCircle, Clock } from 'lucide-react';
import { getRelativeTime, formatDate } from '@eduverse/utils';

export default function StudentCounselingPage() {
  const [message, setMessage] = useState('');

  const { data: messages, refetch } = useQuery({
    queryKey: ['chatMessages', 'usr-stu-1', 'usr-fac-1'],
    queryFn: () => getChatMessages('usr-stu-1', 'usr-fac-1'),
  });

  const { data: sessions } = useQuery({
    queryKey: ['counselingSessions', undefined, 'stu-1'],
    queryFn: () => getCounselingSessions(undefined, 'stu-1'),
  });

  const sendMutation = useMutation({
    mutationFn: (content: string) => sendMessage('usr-fac-1', content),
    onSuccess: () => {
      setMessage('');
      refetch();
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Mentorship & Counseling</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Direct communication channel with your designated academic mentor</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Panel */}
        <Card className="lg:col-span-2 flex flex-col h-[600px] border border-border/70 shadow-xs">
          <CardHeader className="border-b border-border/70 py-3.5 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 rounded-xl border border-border/70">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">SV</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm font-semibold text-foreground">Prof. Sunita Verma</CardTitle>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[11px] text-muted-foreground">Faculty Mentor • Available</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3.5 bg-background/50">
            {messages?.map((msg) => {
              const isStudent = msg.senderRole === 'student';
              return (
                <div key={msg.id} className={`flex ${isStudent ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-xs ${
                      isStudent
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted/70 text-foreground border border-border/60 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-xs leading-relaxed">{msg.content}</p>
                    <p className={`text-[10px] mt-1 text-right ${isStudent ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {getRelativeTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>

          <div className="p-4 border-t border-border/70 bg-card rounded-b-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (message.trim()) sendMutation.mutate(message);
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message to mentor..."
                className="flex-1 h-10"
              />
              <Button type="submit" size="icon" disabled={!message.trim() || sendMutation.isPending} className="h-10 w-10 shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>

        {/* Counseling Sessions History */}
        <Card className="border border-border/70 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              Counseling Log & Notes
            </CardTitle>
            <p className="text-xs text-muted-foreground">Recorded reviews and academic follow-ups</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {sessions?.map((session) => (
              <div key={session.id} className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground truncate">{session.topic}</p>
                  <Badge variant={session.status === 'completed' ? 'success' : 'info'} className="text-[10px] capitalize">
                    {session.status}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(session.date)}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{session.observation}</p>
                {session.followUp && (
                  <div className="pt-1 border-t border-border/40">
                    <p className="text-[11px] font-medium text-primary">Action Item: {session.followUp}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
