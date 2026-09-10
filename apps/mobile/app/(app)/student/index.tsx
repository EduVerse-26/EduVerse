import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getStudentAttendance, getAssignments, getAnnouncements } from '@eduverse/api';
import { formatTimeAgo } from '@eduverse/utils';
import { BookOpen, AlertCircle, Clock, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function StudentDashboard() {
  const router = useRouter();
  
  const { data: attendance } = useQuery({
    queryKey: ['studentAttendance', 'stu-1'],
    queryFn: () => getStudentAttendance('stu-1'),
  });

  const { data: assignments } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => getAssignments(),
  });

  const { data: announcements } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => getAnnouncements(),
  });

  const overallAttendance = attendance 
    ? Math.round(attendance.reduce((a, c) => a + c.percentage, 0) / attendance.length) 
    : 0;

  const urgentAnnouncements = announcements?.filter(a => a.priority === 'urgent') || [];
  const pendingAssignments = assignments?.filter(a => new Date(a.deadline) > new Date()) || [];

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16 }}>
      {/* Header Summary */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-2xl font-bold text-foreground">Welcome back,</Text>
          <Text className="text-muted-foreground">Alex</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
          <Bell color="#3b82f6" size={20} />
          {urgentAnnouncements.length > 0 && (
            <View className="absolute top-0 right-0 w-3 h-3 bg-destructive rounded-full border-2 border-background" />
          )}
        </TouchableOpacity>
      </View>

      {/* Urgent Announcements */}
      {urgentAnnouncements.length > 0 && (
        <View className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-6 flex-row gap-3">
          <AlertCircle color="#ef4444" size={24} />
          <View className="flex-1">
            <Text className="text-destructive font-bold mb-1">{urgentAnnouncements[0].title}</Text>
            <Text className="text-destructive/80 text-xs">{urgentAnnouncements[0].content}</Text>
          </View>
        </View>
      )}

      {/* Quick Stats Grid */}
      <View className="flex-row gap-4 mb-6">
        <TouchableOpacity 
          className="flex-1 bg-card border border-border rounded-xl p-4"
          onPress={() => router.push('/(app)/student/attendance')}
        >
          <Clock color="#3b82f6" size={24} />
          <Text className="text-2xl font-bold text-foreground mt-2">{overallAttendance}%</Text>
          <Text className="text-xs text-muted-foreground mt-1">Attendance</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-1 bg-card border border-border rounded-xl p-4"
          onPress={() => router.push('/(app)/student/assignments')}
        >
          <BookOpen color="#10b981" size={24} />
          <Text className="text-2xl font-bold text-foreground mt-2">{pendingAssignments.length}</Text>
          <Text className="text-xs text-muted-foreground mt-1">Pending Assignments</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Assignments */}
      <Text className="text-lg font-bold text-foreground mb-3">Upcoming Assignments</Text>
      <View className="space-y-3 mb-6">
        {pendingAssignments.slice(0, 3).map((assignment) => (
          <TouchableOpacity 
            key={assignment.id} 
            className="bg-card border border-border rounded-xl p-4 flex-row items-center justify-between"
          >
            <View className="flex-1">
              <Text className="text-foreground font-semibold" numberOfLines={1}>{assignment.title}</Text>
              <Text className="text-muted-foreground text-xs mt-1">{assignment.courseName}</Text>
            </View>
            <View className="items-end ml-4">
              <Text className="text-warning text-xs font-medium">Due in 2 days</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
