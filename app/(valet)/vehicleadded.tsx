import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import globalStyles from '../styles/global';

export default function VehicleAddedScreen() {
    const router = useRouter();
    const { licensePlate, make, model } = useLocalSearchParams();

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Vehicle Added Successfully!</Text>
            {licensePlate && (
                <Text style={styles.detailText}>License Plate: {licensePlate}</Text>
            )}
            {make && <Text style={styles.detailText}>Make: {make}</Text>} 
            {model && <Text style={styles.detailText}>Model: {model}</Text>}
            <Button title="Check In Another Vehicle" onPress={() => router.push('/(valet)/checkin')} />
            <Button title="Home" onPress={() => router.push('/(valet)/home')} />
         </View>
    );
}

const styles = StyleSheet.create({
    detailText: {
        fontSize: 16,
        color: '#ddd',
        marginBottom: 10,
    },
});