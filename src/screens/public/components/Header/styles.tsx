import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
    contain: {
        maxHeight: 50,
    },

    imgLogo: {
        width: '50%',
        resizeMode: 'contain',
        maxHeight: 40,
        marginTop: Platform.OS === 'ios' ? 31 : 18,
        alignSelf: 'center',
    },
});

export default styles;
