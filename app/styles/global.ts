import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'grey',
        },
    scrollContainer: {
        flexGrow: 1,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    titleLarge: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    titleSmall: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#d17771',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 15,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
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
        color: 'white',
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
        color: '#ccc',
        marginBottom: 20,
    },
});

export default globalStyles;