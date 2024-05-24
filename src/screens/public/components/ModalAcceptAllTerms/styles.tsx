import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    montserrat: {
        fontFamily: 'Montserrat',
    },

    containText: {
        marginTop: 25,
        backgroundColor: '#f8f8f8',
    },

    title: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 20,
        fontWeight: '600',
    },

    containContent: {
        height: 250,
        width: '90%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#4F7C8A',
        justifyContent: 'space-between',
        borderRadius: 8,
    },

    containBtn: {
        width: '97%',
        backgroundColor: '#4F7C8A',
        alignSelf: 'center',
        borderRadius: 6,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },

    textBtn: {
        fontWeight: 'bold',
        fontSize: 20,
    },

    colorDefault: {
        color: '#4F7C8A',
    },

    colorWhite: {
        color: '#fff',
    },

    text: {
        textAlign: 'center',
    },
});

export default styles;
