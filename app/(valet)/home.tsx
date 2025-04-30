import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import SignOutButton from '../components/SignOutButton';
import globalStyles from '../styles/global';

export default function ValetHomePage() {
    const router = useRouter();
    const navigateToCheckIn = () => {
        router.push('/(valet)/checkin');
    };
    const navigateToRetrieve = () => {
        router.push('/(valet)/checkout');
    };
    const navigateToNewCustomer = () => {
        router.push('/(valet)/newcustomer');
    };
    const navigateToActiveVehicles = () => {
        router.push('/(tabs)/vehicle/ActiveVehicleScreen'); 
    };

    return (
        <View style={[globalStyles.container, globalStyles.pageContainer]}>
            <View>
                <Text style={globalStyles.title}>Valet Dashboard</Text>

                <TouchableOpacity style={globalStyles.button} onPress={navigateToCheckIn}>
                    <Text style={globalStyles.buttonText}>Check-in Vehicle</Text>
                </TouchableOpacity>

                <TouchableOpacity style={globalStyles.button} onPress={navigateToRetrieve}>
                    <Text style={globalStyles.buttonText}>Check-out Vehicle</Text>
                </TouchableOpacity>

                <TouchableOpacity style={globalStyles.button} onPress={navigateToActiveVehicles}>
                    <Text style={globalStyles.buttonText}>Active Vehicles</Text>
                </TouchableOpacity>
            </View>

            <View style={globalStyles.signOutContainer}>
                <SignOutButton />
            </View>
        </View>
    );
}