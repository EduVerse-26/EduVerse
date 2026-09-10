'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getChatMessages, sendMessage, getCounselingSessions } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Phone, Video, Calendar } from 'lucide-react';
import { getInitials, getRelativeTime, formatDate } from '@eduverse/utils';

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
        <h2 className="text-2xl font-bold">Counseling</h2>
        <p className="text-muted-foreground">Chat with your assigned counselor</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat */}
        <Card className="lg:col-span-2 flex flex-col h-[600px]">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>SV</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">Prof. Sunita Verma</CardTitle>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages?.map(msg => (
              <div key={msg.id} className={`flex ${msg.senderRole === 'student' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  msg.senderRole === 'student'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted rounded-bl-md'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${msg.senderRole === 'student' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                    {getRelativeTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-4 border-t border-border">
            <form onSubmit={(e) => { e.preventDefault(); if (message.trim()) sendMutation.mutate(message); }} className="flex gap-2">
              <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." className="flex-1" />
              <Button type="submit" size="icon" disabled={!message.trim() || sendMutation.isPending}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>

        {/* Session History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4 text-primary" />
              Session History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sessions?.map(session => (
              <div key={session.id} className="p-3 rounded-lg border border-border/50 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{session.topic}</p>
                  <Badge variant={session.status === 'completed' ? 'success' : 'info'} className="text-[10px]">{session.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(session.date)}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{session.observation}</p>
                {session.followUp && <p className="text-xs text-primary">Follow-up: {session.followUp}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
