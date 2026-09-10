import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { login } from '@eduverse/api';
import type { Role } from '@eduverse/types';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginMutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      if (data.success && data.data) {
        const role = data.data.user.role;
        // Redirect to appropriate dashboard based on role
        router.replace(`/(app)/${role}`);
      } else {
        setError(data.error || 'Login failed');
      }
    },
  });

  const demoLogin = (role: Role) => {
    setEmail(`demo@${role}.eduverse.com`);
    setPassword('password123');
    loginMutation.mutate();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="mb-10 items-center">
          <View className="w-20 h-20 bg-primary/20 rounded-2xl items-center justify-center mb-4">
            <Text className="text-primary text-4xl font-bold">E</Text>
          </View>
          <Text className="text-3xl font-bold text-foreground">EduVerse</Text>
          <Text className="text-muted-foreground mt-2 text-center">
            Sign in to access your campus dashboard
          </Text>
        </View>

        {error ? (
          <View className="bg-destructive/10 p-3 rounded-lg mb-4">
            <Text className="text-destructive text-sm text-center">{error}</Text>
          </View>
        ) : null}

        <View className="space-y-4 mb-6">
          <View>
            <Text className="text-sm font-medium text-foreground mb-1">Email</Text>
            <TextInput
              className="w-full h-12 bg-card border border-border rounded-xl px-4 text-foreground"
              placeholder="Enter your email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <View className="mt-4">
            <Text className="text-sm font-medium text-foreground mb-1">Password</Text>
            <TextInput
              className="w-full h-12 bg-card border border-border rounded-xl px-4 text-foreground"
              placeholder="Enter your password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity 
          className="w-full h-12 bg-primary rounded-xl items-center justify-center flex-row"
          onPress={() => loginMutation.mutate()}
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <ActivityIndicator color="#fff" className="mr-2" />
          ) : null}
          <Text className="text-primary-foreground font-semibold text-base">
            Sign In
          </Text>
        </TouchableOpacity>

        <View className="mt-10">
          <Text className="text-center text-sm text-muted-foreground mb-4">Quick Demo Access</Text>
          <View className="flex-row flex-wrap justify-center gap-2">
            <TouchableOpacity onPress={() => demoLogin('student')} className="bg-card border border-border px-4 py-2 rounded-lg">
              <Text className="text-foreground text-xs">Student</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => demoLogin('faculty')} className="bg-card border border-border px-4 py-2 rounded-lg">
              <Text className="text-foreground text-xs">Faculty</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => demoLogin('hod')} className="bg-card border border-border px-4 py-2 rounded-lg">
              <Text className="text-foreground text-xs">HOD</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => demoLogin('admin')} className="bg-card border border-border px-4 py-2 rounded-lg">
              <Text className="text-foreground text-xs">Admin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
