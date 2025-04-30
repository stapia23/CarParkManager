import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { UserRole } from '../../context/AuthContext';
interface CreateUserFormProps {
  onCreateUser: (userData: UserCreationData) => Promise<void>;
  loading: boolean;
}

interface UserCreationData {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  phoneNumber: string;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onCreateUser, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = async () => {
    if (!email || !password || !name || !phoneNumber) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    const userData: UserCreationData = {
      email,
      password,
      role: 'valet',
      name,
      phoneNumber,
    };

    try {
      await onCreateUser(userData);
      setEmail('');
      setPassword('');
      setName('');
      setPhoneNumber('');
    } catch (error: any) {
      console.error('Error in CreateUserForm:', error);
      Alert.alert('Error', error.message || 'Could not create user.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80} >
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="Enter email" />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContiner}>
          <TextInput value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry={!showPassword} style={[styles.input, { flex: 1}]} />
          <Pressable onPress={ () => setShowPassword(!showPassword)} >
            <Text style={styles.toggle}> {showPassword ? 'Hide' : 'Show'}</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter name" />

        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" placeholder="Enter phone number" />

        <View style={styles.buttonWrapper}>
          <Button title={loading ? 'Creating...' : 'Create Valet'} onPress={handleSubmit} disabled={loading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#f4f5f6',
    borderRadius: 10,
  },
  buttonWrapper: {
    marginTop: 20,
  },
  passwordContiner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggle: {
    color: '#007bff',
    fontWeight: '500',
    paddingHorizontal: 8,
  },
});

export default CreateUserForm;