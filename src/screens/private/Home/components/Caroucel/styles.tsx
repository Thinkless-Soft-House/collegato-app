import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        maxHeight: 300,
        marginTop: 15,
    },

    containImg: {
        width: '100%',
        height: 250,
        resizeMode: 'contain',
    },
    
    montserrat: {
        fontFamily: 'Montserrat',
    },

    title: {
        color: '#4F7C8A',
        fontSize: 20,
        marginLeft: 12,
        marginBottom: 17,
    },

    dot: {
        backgroundColor: '#8c8c8c5c',
        marginTop: 60,
        borderRadius: 5,
        width: 35,
        height: 4,
    },

    activeDot: {
        backgroundColor: '#8c8c8c',
        marginTop: 60,
        borderRadius: 5,
        width: 35,
        height: 4,
    },
});

export default styles;
