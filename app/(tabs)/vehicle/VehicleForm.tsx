import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, addVehicle, getAvailableParkingSpots, getUserProfile } from '@/lib/firebase';
import { getDocs, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useLocalSearchParams, useRouter } from 'expo-router';
import globalStyles from '@/app/styles/global';

interface Props {
    lotId: string;
}

interface ParkingSpot {
    id: string;
    label: string;
}

export default function VehicleForm({ lotId }: Props) {
    const { customerId: routeCustomerIdParam, parkingSpotId: routeParkingSpotIdParam } = useLocalSearchParams();
    const router = useRouter();
    const [customerId, setCustomerId] = useState('');
    const [parkingSpotId, setParkingSpotId] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [color, setColor] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [expectedHours, setExpectedHours] = useState('');

    const [valetId, setValetId] = useState('');
    const [valetName, setValetName] = useState('');
    const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
    const [selectedSpot, setSelectedSpot] = useState('');
    useEffect(() => {
        const routeCustomerId = Array.isArray(routeCustomerIdParam) ? routeCustomerIdParam[0] : routeCustomerIdParam;
        if (routeCustomerId) {
            setCustomerId(routeCustomerId);
        }
        const routeParkingSpotId = Array.isArray(routeParkingSpotIdParam) ? routeParkingSpotIdParam[0] : routeParkingSpotIdParam;
        if (routeParkingSpotId) {
            setParkingSpotId(routeParkingSpotId);
            setSelectedSpot(routeParkingSpotId);
        }

        const fetchValetInfo = async () => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const profile = await getUserProfile(user.uid);
                    setValetId(user.uid);
                    setValetName(profile?.name || 'null');
                }
            });
        };

        const fetchAvailableSpots = async () => {
            const q = getAvailableParkingSpots(lotId);
            const snapshot = await getDocs(q);
            const spots = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ParkingSpot[];
            setParkingSpots(spots);
        };

        fetchValetInfo();
        fetchAvailableSpots();
    }, [lotId, routeCustomerIdParam, routeParkingSpotIdParam]);

    const handleSubmit = async () => {
        try {
            if (!customerId || !make || !model || !licensePlate || !expectedHours || !parkingSpotId) {
                Alert.alert('Error', 'Please fill all required fields.');
                return;
            }

            const expectedCheckout = Timestamp.fromDate(
                new Date(Date.now() + parseInt(expectedHours) * 3600000)
            );

            await addVehicle({
                customerId,
                make,
                model,
                color,
                licensePlate,
                expectedCheckOutTime: expectedCheckout,
                parkingSpotId: parkingSpotId,
                valetId,
                photos: [],
            });

            Alert.alert('Success', 'Vehicle added.');

            router.push({
                pathname: '/(valet)/vehicleadded',
                params: { licensePlate: licensePlate, make: make, model: model},
            })

            setMake('');
            setModel('');
            setColor('');
            setLicensePlate('');
            setExpectedHours('');
            setSelectedSpot('');
            setParkingSpotId('');
        } catch (err: any) {
            console.error(err);
            Alert.alert('Error', err.message || 'Failed to add vehicle.');
        }
    };

    return (
        <View style={globalStyles.container}>
            <Text style={styles.label}>Valet: {valetName}</Text>

            {customerId && <Text style={styles.label}>Customer ID: {customerId}</Text>}

            <Text style={styles.label}>Make</Text>
            <TextInput style={styles.input} value={make} onChangeText={setMake} />

            <Text style={styles.label}>Model</Text>
            <TextInput style={styles.input} value={model} onChangeText={setModel} />

            <Text style={styles.label}>Color</Text>
            <TextInput style={styles.input} value={color} onChangeText={setColor} />

            <Text style={styles.label}>License Plate</Text>
            <TextInput style={styles.input} value={licensePlate} onChangeText={setLicensePlate} />

            <Text style={styles.label}>Expected Hours</Text>
            <TextInput
                style={styles.input}
                value={expectedHours}
                onChangeText={setExpectedHours}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Parking Spot</Text>
            {parkingSpotId ? (
                <Text style={styles.input}>{parkingSpotId}</Text>
            ) : (
                <Picker
                    selectedValue={selectedSpot}
                    onValueChange={(itemValue) => setSelectedSpot(itemValue)}
                    style={styles.input}
                >
                    <Picker.Item label="Select a spot" value="" />
                    {parkingSpots.map((spot) => (
                        <Picker.Item key={spot.id} label={spot.label} value={spot.id} />
                    ))}
                </Picker>
            )}

            <Button title="Add Vehicle" onPress={handleSubmit} />
        </View>
    );
}

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