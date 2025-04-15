import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { UserRole } from '../../context/AuthContext';
import globalStyles from '../styles/global';

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
    <View style={globalStyles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Enter email"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Enter password"
      />

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        placeholder="Enter phone number"
      />

      <Button
        title={loading ? 'Creating...' : 'Create Valet'}
        onPress={handleSubmit}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});

export default CreateUserForm;