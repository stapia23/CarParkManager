import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { db, parkingSpotsCollection } from '../../lib/firebase';
import { onSnapshot, collection, query } from 'firebase/firestore';

interface ParkingSpot {
    id: string;
    label: string;
    status: 'available' | 'occupied';
}

interface ParkingLotMapProps {
    onSpotSelected: (spotId: string) => void;
}

const ParkingLotMap: React.FC<ParkingLotMapProps> = ({ onSpotSelected }) => {
    const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(query(parkingSpotsCollection), (snapshot) => {
            const spots: ParkingSpot[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    label: data.label, 
                    status: data.status,
                };
            });
            setParkingSpots(spots);
        });
        return () => unsubscribe();
    }, []);

    //always select the first available spot
    useEffect(() => {
        if (parkingSpots.length > 0) {
            const firstAvailableSpot = parkingSpots.find(spot => spot.status === 'available');
            if (firstAvailableSpot) {
                onSpotSelected(firstAvailableSpot.id);
            }
        }
    }, [parkingSpots]);

    if (parkingSpots.length === 0) {
        return <Text>Loading parking spots...</Text>;
    }

    const firstAvailableSpot = parkingSpots.find(spot => spot.status === 'available');

    return (
        <View style={styles.container}>
            {firstAvailableSpot ? (
                <TouchableOpacity style={styles.spotButton} onPress={() => onSpotSelected(firstAvailableSpot.id)}>
                    <Text style={styles.spotLabel}>
                        {firstAvailableSpot.label} ({firstAvailableSpot.status})
                    </Text>
                </TouchableOpacity>
            ) : (
                <Text>No available parking spots.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    spotButton: {
        backgroundColor: '#d17771',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    spotLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#25292e',
    },
});

export default ParkingLotMap;