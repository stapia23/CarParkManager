import { useState } from 'react';
import { View, TextInput, Text, ActivityIndicator, Pressable, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import globalStyles from './styles/global';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      }
    }
  }, [user, role, router]);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>CarParkManager</Text>

      <View style={globalStyles.form}>
        <Text style={globalStyles.label}>Email</Text>
        <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="Enter email" keyboardType="email-address" style={globalStyles.input} />

        <Text style={globalStyles.label}>Password</Text>
        <View style={globalStyles.passwordContiner}>
          <TextInput value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry={!showPassword} style={[globalStyles.input, { flex: 1}]} />
          <Pressable onPress={ () => setShowPassword(!showPassword)} >
            <Text style={globalStyles.toggle}> {showPassword ? 'Hide' : 'Show'}</Text>
          </Pressable>
        </View>

        {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

        {loading ? ( <ActivityIndicator size="large" color="#000" /> ) : ( <TouchableOpacity style={globalStyles.button} onPress={handleLogin}> <Text style={globalStyles.buttonText}>Login</Text></TouchableOpacity> )}

        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text>New Admin Account?</Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={{ color: 'blue', marginTop: 5 }}>Register here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}