import { Tabs } from 'expo-router';
import { Home, Users, Settings } from 'lucide-react-native';

export default function AdminLayout() {
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
        name="departments"
        options={{
          title: 'Departments',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
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
