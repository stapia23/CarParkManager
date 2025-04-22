import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function ValetLayout() {
    const { profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (profile?.role !== 'valet') {
                router.replace('/login');
            }
        }
    }, [profile?.role, loading, router]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (profile?.role !== 'valet') {
        return null;
    }

    return (
        <Stack screenOptions={{ headerShown: true }}>
            <Stack.Screen name="home" options={{ title: 'Valet Dashboard' }} />
            <Stack.Screen name="checkin" options={{ title: 'Check-In Vehicle' }} />
            <Stack.Screen name="customersearch" options={{ title: 'Search Customer' }} />
            <Stack.Screen name="newcustomer" options={{ title: 'New Customer' }} />
            <Stack.Screen name="vehicleadded" options={{ title: 'Vehicle Added' }} />
            <Stack.Screen name="checkout" options={{ title: 'Check-out Vehicle' }}/>
            <Stack.Screen name="activevehicles" options={{ title: 'Active Vehicles' }} />
        </Stack>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});