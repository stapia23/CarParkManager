import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#f4f5f6',
        justifyContent: 'center',
        },
    scrollContainer: {
        flexGrow: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#black',
        marginBottom: 40,
    },
    titleLarge: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 20,
    },
    titleSmall: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#2e86de',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginBottom: 10,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
        color: 'black',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'orange',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 15,
        marginBottom: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: 'black',
        marginBottom: 20,
    },
    form: {
        gap: 16,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9'
      },
    passwordContiner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
    toggle: {
        color: '#007bff',
        fontWeight: '500',
        paddingHorizontal: 8,
      },
    pageContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    signOutContainer: {
        alignSelf: 'stretch',
    },
});

export default globalStyles;