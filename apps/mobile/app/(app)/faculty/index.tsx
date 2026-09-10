import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function FacultyDashboard() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-background p-4">
      <Text className="text-foreground text-2xl font-bold mb-2">Faculty Dashboard</Text>
      <Text className="text-muted-foreground mb-6 text-center">Manage your classes, assignments, and students from your mobile device.</Text>
      
      <View className="w-full flex-row flex-wrap gap-4 justify-center">
        <View className="w-[45%] bg-card border border-border p-4 rounded-xl items-center">
          <Text className="text-foreground font-semibold">Today's Classes</Text>
          <Text className="text-primary text-2xl font-bold mt-2">3</Text>
        </View>
        <View className="w-[45%] bg-card border border-border p-4 rounded-xl items-center">
          <Text className="text-foreground font-semibold">Pending Grading</Text>
          <Text className="text-warning text-2xl font-bold mt-2">12</Text>
        </View>
      </View>
    </View>
  );
}
