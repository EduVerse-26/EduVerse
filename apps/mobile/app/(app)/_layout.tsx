import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="student" />
      <Stack.Screen name="faculty" />
      <Stack.Screen name="hod" />
      <Stack.Screen name="admin" />
    </Stack>
  );
}
