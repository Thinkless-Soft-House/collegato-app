import { StyleSheet, Dimensions, Platform } from 'react-native';
import { gerarWidthPorcentagem } from '../../../helpers/styleHelpers';

const { height } = Dimensions.get('screen');

const styles = StyleSheet.create({
    montserrat: {
        fontFamily: 'Montserrat',
    },

    containFlex: {
        flex: 1,
    },

    containPhoto: {
        height: '40%',
    },

    imgSlider: {
        width: '60%',
        alignSelf: 'center',
    },

    containText: {
        width: '70%',
        alignSelf: 'center',
    },

    textCenter: {
        textAlign: 'center',
    },

    textTitle: {
        fontWeight: '800',
        fontSize: 25,
        color: '#57adbc',
    },

    textInfo: {
        fontSize: 15,
        color: '#8c8c8c',
        marginTop: 18,
    },

    textNextSlider: {
        color: '#57adbc',
        marginTop: 35,
        marginRight: 5,
    },

    containSkip: {
        position: 'absolute',
        bottom:
            Platform.OS === 'android'
                ? 9
                : height < 700
                ? 9
                : height < 800
                ? 18
                : height < 900
                ? 25
                : 30,
        left: 15,
        padding: 15,
        paddingBottom: 0,
    },

    colorText: {
        color: '#57adbc',
    },
});

export default styles;
