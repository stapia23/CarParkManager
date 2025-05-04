import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import { Canvas } from '@shopify/react-native-skia';

export default function RootLayout() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        console.log('Skia initialized for Web');
      } catch (err) {
        console.error('Failed to initialize Skia for Web:', err);
      }
    }
  }, []);

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='login' />
      <Stack.Screen name='register' />
      <Stack.Screen name='index' />
      <Stack.Screen name='(admin)' />
      <Stack.Screen name='(valet)' />
      <Stack.Screen name='+not-found' />
    </Stack>
  );
}