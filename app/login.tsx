import { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { role, user } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true); 
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (role === 'admin') {
        router.replace('/(admin)/dashboard');
      } else if (role === 'valet') {
        router.replace('/(valet)/checkin');
      } else if (role === null) {
        if (user) {
          console.log("User logged in, fetching role...");
        } else {
        }
      }
    }
  }, [user, role, router]);

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" style={{ borderBottomWidth: 1 }} />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderBottomWidth: 1 }} />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
}