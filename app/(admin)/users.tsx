import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Redirect, useRouter } from 'expo-router';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import CreateUserForm from './CreateUserForm';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'; 
import { doc, setDoc, serverTimestamp, getFirestore } from 'firebase/firestore';
import globalStyles from '../styles/global';

export default function UsersScreen() {
    const { role } = useAuth();
    const router = useRouter();
    const [creatingValet, setCreatingValet] = useState(false);
    const [loading, setLoading] = useState(false); 

    if (role !== 'admin') {
        return <Redirect href="/login" />;
    }

    const handleCreateUser = async (userData: any) => {
        setLoading(true); 
        try {
            const auth = getAuth();
            const db = getFirestore();

            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const { user } = userCredential;

            const userRef = doc(db, 'users', user.uid); 
            await setDoc(userRef, {
                uid: user.uid,
                email: userData.email,
                role: userData.role,
                name: userData.name,
                phoneNumber: userData.phoneNumber,
                createdAt: serverTimestamp(),
            });

            Alert.alert('Success', 'Valet profile created successfully!');
            setCreatingValet(false);
            router.push('/(admin)/users');
        } catch (error: any) {
            console.error('Error creating user:', error);
            Alert.alert('Error', error.message || 'Could not create user.');
        } finally {
            setLoading(false); 
        }
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Manage Users</Text>

            {loading && <Text>Creating Valet...</Text>}
            {!creatingValet ? (
                <Button title="Create Valet" onPress={() => setCreatingValet(true)} />
            ) : (
                <CreateUserForm onCreateUser={handleCreateUser} loading={loading} />
            )}

            <Button title="Back to Dashboard" onPress={() => router.push('/(admin)/dashboard')} />
        </View>
    );
}