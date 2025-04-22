import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, TextInput, Button, Alert, ScrollView } from 'react-native';
import ParkingLotMap from '../components/ParkingLotMap';
import globalStyles from '../styles/global';

export default function CheckIn() {
    const router = useRouter();
    const { customerId: routeCustomerIdParam } = useLocalSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpotId, setSelectedSpotId] = useState('');
    const [customerId, setCustomerId] = useState('');

    useEffect(() => {
        const routeCustomerId = Array.isArray(routeCustomerIdParam) ? routeCustomerIdParam[0] : routeCustomerIdParam;
        if (routeCustomerId) {
            setCustomerId(routeCustomerId);
        }
    }, [routeCustomerIdParam]);

    const handleSearchCustomer = () => {
        router.push(`/(valet)/customersearch?query=${searchQuery}`);
    };

    const navigateToNewCustomerForm = () => {
        router.push('/(valet)/newcustomer');
    };

    const handleSpotSelected = (spotId: string) => {
        setSelectedSpotId(spotId);
        console.log('Selected spot in CheckIn:', spotId);
        if (customerId) {
            router.push(`/(tabs)/vehicle/VehicleForm?parkingSpotId=<span class="math-inline">\{spotId\}&customerId\=</span>{customerId}`);
        } else {
            Alert.alert('Select Customer', 'Please search for or add a customer before selecting a parking spot.');
        }
    };

    return (
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
            <View style={globalStyles.container}>
                <Text style={globalStyles.title}>Valet Check-in</Text>
                <Text style={globalStyles.subtitle}>Start vehicle check-in</Text>

                <View style={globalStyles.searchContainer}>
                    <TextInput
                        style={globalStyles.searchInput}
                        placeholder="Search Customer (Name, Phone, License)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Button title="Search" onPress={handleSearchCustomer} />
                </View>

                <Button title="New Customer" onPress={navigateToNewCustomerForm} />

                <Text style={styles.mapTitle}>Select Parking Spot</Text>
                <ParkingLotMap onSpotSelected={handleSpotSelected} />

                {selectedSpotId && (
                    <Text style={styles.selectedSpotText}>
                        Selected Spot: {selectedSpotId}
                    </Text>
                )}
                {customerId && (
                    <Text style={styles.selectedCustomerText}>
                        Selected Customer ID: {customerId}
                    </Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mapTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20,
        marginBottom: 10,
    },
    selectedSpotText: {
        color: '#fff',
        marginTop: 10,
    },
    selectedCustomerText: {
        color: '#fff',
        marginTop: 5,
    },
});