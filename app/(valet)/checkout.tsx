import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getVehicleByLicensePlate, checkOutVehicle, parkingSpotsCollection } from '../../lib/firebase';
import { getDocs, query } from 'firebase/firestore';
import globalStyles from '../styles/global';

export default function CheckoutScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [vehicle, setVehicle] = useState<any>(null); 
    const [error, setError] = useState('');

    const handleSearchVehicle = async () => {
        setError('');
        setVehicle(null);

        if (!searchQuery) {
            setError('Please enter a license plate to search.');
            return;
        }

        try {
            const q = getVehicleByLicensePlate(searchQuery);
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                setError('No active vehicle found with that license plate.');
                return;
            }

            const vehicleData = snapshot.docs[0].data();
            setVehicle({ id: snapshot.docs[0].id, ...vehicleData });
        } catch (err: any) {
            console.error('Error searching vehicle:', err);
            setError('Failed to search for vehicle.');
        }
    };

    const handleCheckout = async () => {
        if (!vehicle) {
            setError('Please search for a vehicle first.');
            return;
        }

        try {
            await checkOutVehicle(vehicle.id, vehicle.parkingSpotId);
            Alert.alert('Success', 'Vehicle checked out successfully!');
            router.push('/(valet)/home'); // Navigate back to home
        } catch (err: any) {
            console.error('Error checking out vehicle:', err);
            setError('Failed to check out vehicle.');
        }
    };

    return (
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
            <View style={globalStyles.container}>
                <Text style={globalStyles.title}>Vehicle Checkout</Text>

                <View style={globalStyles.searchContainer}>
                    <TextInput
                        style={globalStyles.searchInput}
                        placeholder="Enter License Plate"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Button title="Search" onPress={handleSearchVehicle} />
                </View>

                {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

                {vehicle && (
                    <View style={styles.vehicleInfoContainer}>
                        <Text style={styles.infoText}>Make: {vehicle.make}</Text>
                        <Text style={styles.infoText}>Model: {vehicle.model}</Text>
                        <Text style={styles.infoText}>License Plate: {vehicle.licensePlate}</Text>
                        <Text style={styles.infoText}>Parking Spot: {vehicle.parkingSpotId}</Text>
                        <Button title="Checkout Vehicle" onPress={handleCheckout} />
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    vehicleInfoContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#000000',
        borderRadius: 5,
    },
    infoText: {
        color: '#fff',
        marginBottom: 8,
    },
});