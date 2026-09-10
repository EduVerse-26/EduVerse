import { Redirect } from 'expo-router';

export default function Index() {
  // Normally we would check auth state here.
  // For the demo, we redirect to the login screen.
  return <Redirect href="/(auth)/login" />;
}
