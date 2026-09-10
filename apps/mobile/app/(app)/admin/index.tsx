import { View, Text } from 'react-native';

export default function AdminDashboard() {
  return (
    <View className="flex-1 items-center justify-center bg-background p-4">
      <Text className="text-foreground text-2xl font-bold mb-2">Admin Dashboard</Text>
      <Text className="text-muted-foreground text-center">Institution-wide settings and metrics.</Text>
    </View>
  );
}
