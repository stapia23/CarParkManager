import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import { addCustomer } from "@/lib/firebase";
import { useRouter } from 'expo-router';
import globalStyles from "../styles/global";

export default function NewCustomerScreen() {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const router = useRouter();
  
    const handleAddCustomer = async () => {
      if (!name || !phoneNumber || !email) {
        Alert.alert('Missing Fields', 'Name, Phone Number, and Email are required.');
        return;
      }
  
      try {
        const customerId = await addCustomer({ name, phoneNumber, email });
        Alert.alert('Success', 'Customer added!');
        setName('');
        setPhoneNumber('');
        setEmail('');
        router.push(`/(valet)/checkin?customerId=${customerId}`);
      } catch (error) {
        console.error('Error adding customer:', error);
        Alert.alert('Error', 'Failed to add customer.');
      }
    };
  
    return (
      <View style={globalStyles.container}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
  
        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
  
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
  
        <Button title={'Add Customer'} onPress={handleAddCustomer}/>
      </View>
    );
  };
    
  const styles = StyleSheet.create({
    label: {
      fontWeight: '600',
      marginBottom: 4
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
      borderRadius: 8,
      backgroundColor: '#fff'
    }
  });
  