import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

const SignOutButton = () => {
    const { signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace('/login');
        } catch (error: any) {
            console.error('Error signing out:', error);
            Alert.alert('Sign Out Error', error.message || 'Failed to sign out.');
        }
    };

    return (
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center', 
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default SignOutButton;