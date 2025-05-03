import { Stack, useRouter } from 'expo-router'; 
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import globalStyles from '../styles/global';

export default function AdminLayout() {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (profile?.role !== 'admin') {
        router.replace('/login'); 
      }
    }
  }, [profile?.role, loading, router]);

  if (loading) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (profile?.role !== 'admin') {
    return null; 
  }

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="dashboard" options={{ title: 'Admin Dashboard' }} />
      <Stack.Screen name="createuserform" options={{ title: 'Create User' }} />
      <Stack.Screen name="users" options={{ title: 'User Management' }} />
      <Stack.Screen name="parking-lot-designer" options={{ title: 'Design Parking Lot' }} />
    </Stack>
  );
}
