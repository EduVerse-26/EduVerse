import { Tabs } from 'expo-router';
import { Home, BookOpen, Clock, Settings, Code } from 'lucide-react-native';

export default function StudentLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1e1e1e' },
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#1e1e1e', borderTopColor: '#27272a' },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#a1a1aa',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="assignments"
        options={{
          title: 'Assignments',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="coding-exams"
        options={{
          title: 'Coding Exams',
          tabBarIcon: ({ color, size }) => <Code color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          tabBarIcon: ({ color, size }) => <Clock color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
