import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import globalStyles from './styles/global';

export default function Index() {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace('/login');
            } else if (role === 'admin') {
                router.replace('/(admin)/dashboard');
            } else if (role === 'valet') {
                router.replace('/(valet)/home');
            } else {
                console.log("no role assigned")
                router.replace('/login');
            }
        }
    }, [user, role, loading, router]);

    if (loading) {
        return (
            <View style={globalStyles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={globalStyles.container}>
            <Text style={styles.text}>Welcome!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
    },
});