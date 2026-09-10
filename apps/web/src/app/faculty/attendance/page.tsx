'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudents, getAttendanceSessions, markAttendance } from '@eduverse/api';
import type { AttendanceStatus } from '@eduverse/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Check, X, Clock, Save, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function FacultyAttendancePage() {
  const queryClient = useQueryClient();
  const [records, setRecords] = useState<Record<string, AttendanceStatus>>({});
  const [selectedSession] = useState('att-sess-1');

  const { data: students } = useQuery({
    queryKey: ['students', 'dept-1', '2024', 'A'],
    queryFn: () => getStudents('dept-1', '2024', 'A'),
  });

  const { data: sessions } = useQuery({
    queryKey: ['attendanceSessions'],
    queryFn: () => getAttendanceSessions(),
  });

  const saveMutation = useMutation({
    mutationFn: () => markAttendance(selectedSession, Object.entries(records).map(([studentId, status]) => ({ studentId, status }))),
    onSuccess: () => {
      toast.success('Attendance saved successfully');
      queryClient.invalidateQueries({ queryKey: ['attendanceSessions'] });
    },
  });

  const toggleStatus = (studentId: string) => {
    setRecords(prev => {
      const current = prev[studentId] || 'present';
      const next: AttendanceStatus = current === 'present' ? 'absent' : current === 'absent' ? 'late' : 'present';
      return { ...prev, [studentId]: next };
    });
  };

  const markAllPresent = () => {
    const all: Record<string, AttendanceStatus> = {};
    students?.forEach(s => { all[s.id] = 'present'; });
    setRecords(all);
  };

  const presentCount = Object.values(records).filter(s => s === 'present').length;
  const absentCount = Object.values(records).filter(s => s === 'absent').length;
  const lateCount = Object.values(records).filter(s => s === 'late').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Mark Attendance</h2>
          <p className="text-muted-foreground">Data Structures (CS301) • Section A • Period 1</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllPresent}>
            <Check className="w-4 h-4 mr-2" />
            Mark All Present
          </Button>
          <Button variant="glow" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Attendance
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{students?.length || 0}</p><p className="text-xs text-muted-foreground">Total</p></CardContent></Card>
        <Card className="border-emerald-500/30"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-emerald-500">{presentCount}</p><p className="text-xs text-muted-foreground">Present</p></CardContent></Card>
        <Card className="border-red-500/30"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-500">{absentCount}</p><p className="text-xs text-muted-foreground">Absent</p></CardContent></Card>
        <Card className="border-amber-500/30"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-500">{lateCount}</p><p className="text-xs text-muted-foreground">Late</p></CardContent></Card>
      </div>

      {/* Student Roster */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Student Roster
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {students?.map((student) => {
              const status = records[student.id] || 'present';
              return (
                <div key={student.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xs font-bold">
                      {student.rollNumber.slice(-3)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRecords(prev => ({ ...prev, [student.id]: 'present' }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        status === 'present' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-muted hover:bg-emerald-500/10'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 inline mr-1" />Present
                    </button>
                    <button
                      onClick={() => setRecords(prev => ({ ...prev, [student.id]: 'absent' }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        status === 'absent' ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' : 'bg-muted hover:bg-red-500/10'
                      }`}
                    >
                      <X className="w-3.5 h-3.5 inline mr-1" />Absent
                    </button>
                    <button
                      onClick={() => setRecords(prev => ({ ...prev, [student.id]: 'late' }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        status === 'late' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25' : 'bg-muted hover:bg-amber-500/10'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 inline mr-1" />Late
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
