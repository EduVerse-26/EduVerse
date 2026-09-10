import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HodProfile() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/(auth)/login');
  };

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-foreground text-xl font-bold mb-6">HOD Profile</Text>
      <TouchableOpacity 
        className="px-6 py-3 bg-destructive/20 border border-destructive/50 rounded-xl"
        onPress={handleLogout}
      >
        <Text className="text-destructive font-semibold">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
