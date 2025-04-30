import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, FlatList, Button, ActivityIndicator } from 'react-native';
import { db, customersCollection } from '../../lib/firebase';
import { query, where, or, getDocs, collection } from 'firebase/firestore';

interface Customer {
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
}

export default function CustomerSearchScreen() {
    const router = useRouter();
    const { query: routeQuery } = useLocalSearchParams(); 
    const [searchResults, setSearchResults] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const searchQuery = Array.isArray(routeQuery) ? routeQuery.join('') : routeQuery;

    useEffect(() => {
        const searchCustomers = async (search: string) => {
            if (!search) {
                setSearchResults([]); 
                return;
            }

            setLoading(true);
            setError('');

            try {
                const q = query(
                    customersCollection,
                    or(
                        where('name', '>=', search.toLowerCase()),
                        where('name', '<=', search.toLowerCase() + '\uf8ff'),
                        where('phoneNumber', '>=', search),
                        where('phoneNumber', '<=', search + '\uf8ff'),
                        where('email', '>=', search.toLowerCase()),
                        where('email', '<=', search.toLowerCase() + '\uf8ff')
                    )
                );

                const querySnapshot = await getDocs(q);
                const results: Customer[] = [];
                querySnapshot.forEach((doc) => {
                    results.push({ id: doc.id, ...doc.data() } as Customer);
                });
                setSearchResults(results);
            } catch (err: any) {
                console.error('Error searching customers:', err);
                setError('Failed to search customers.');
            } finally {
                setLoading(false);
            }
        };

        searchCustomers(searchQuery);
    }, [searchQuery]);

    const handleSelectCustomer = (customerId: string) => {
        router.push(`/(valet)/checkin?customerId=${customerId}`);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Searching...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <Button title="Go Back to Check-in" onPress={() => router.back()} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Customer Search Results</Text>
            {searchQuery ? (
                <Text style={styles.subtitle}>Searching for: {searchQuery}</Text>
            ) : (
                <Text style={styles.subtitle}>Enter a search term on the previous screen.</Text>
            )}

            {searchResults.length > 0 ? (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.resultItem}>
                            <Text style={styles.resultName}>Name: {item.name}</Text>
                            <Text style={styles.resultInfo}>Phone: {item.phoneNumber}</Text>
                            <Text style={styles.resultInfo}>Email: {item.email}</Text>
                            <Button title="Select" onPress={() => handleSelectCustomer(item.id)} />
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noResults}>No customers found matching your search.</Text>
            )}

            <Button title="Go Back to Check-in" onPress={() => router.back()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#2f6380',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2f6380',
    },
    loadingText: {
        color: 'black',
        fontSize: 18,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#5a8dcc',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: 'black',
        marginBottom: 20,
    },
    resultItem: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#333333',
        borderRadius: 5,
        borderColor: '#444444',
        borderWidth: 1,
    },
    resultName: {
        color: 'black',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    resultInfo: {
        color: 'black',
        marginBottom: 3,
    },
    noResults: {
        color: 'black',
        fontStyle: 'italic',
        marginTop: 10,
    },
});