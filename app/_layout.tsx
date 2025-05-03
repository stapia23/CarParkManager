import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@shopify/react-native-skia/lib/module/web').catch((err) => {
        console.error('Failed to initialize Skia for Web:', err);
      });
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
      <Stack.Screen name='(tabs)' />
      <Stack.Screen name='(admin)' />
      <Stack.Screen name='(valet)' />
      <Stack.Screen name='+not-found' />
    </Stack>
  );
}