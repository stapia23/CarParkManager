import { useAuth } from '@/context/AuthContext';
import { Redirect, useRouter } from 'expo-router';
import { View, Text, Button, StyleSheet } from 'react-native';
import SignOutButton from '../components/SignOutButton';
import globalStyles from '../styles/global';

export default function Dashboard() {
  const { role, profile } = useAuth();
  const router = useRouter();

  if (role !== 'admin') return <Redirect href="/login" />;

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Admin Dashboard</Text>
      {profile?.email && (
        <Text style={styles.userInfo}>Logged in as: {profile.displayName}</Text>
      )}
      <Button
        title="Manage Users"
        onPress={() => router.push('/(admin)/users')} 
      />
      <SignOutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfo: {
    marginBottom: 10,
  },
});