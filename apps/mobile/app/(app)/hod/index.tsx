import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HodDashboard() {
  return (
    <View className="flex-1 items-center justify-center bg-background p-4">
      <Text className="text-foreground text-2xl font-bold mb-2">HOD Dashboard</Text>
      <Text className="text-muted-foreground text-center">Overview of department performance and faculty metrics.</Text>
    </View>
  );
}
