import { StyleSheet, Dimensions } from 'react-native';
import { gerarWidthPorcentagem } from '../../../../../helpers/styleHelpers';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 3,
    },

    montserrat: {
        fontFamily: 'Montserrat',
    },

    title: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 20,
        fontWeight: '600',
    },

    containContentInput: {
        position: 'relative',
        bottom: 30,
    },

    textLabelInput: {
        marginLeft: 12,
        position: 'relative',
        top: 15,
    },

    textFeedbackerror: {
        letterSpacing: 1.1,
        color: '#ff3e3e',
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 11,
        marginLeft: 10,
    },

    inputs: {
        borderWidth: 1,
        borderColor: '#808080',
        width: gerarWidthPorcentagem('99%'),
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'center',
        paddingLeft: 12,
    },

    iconInputs: {
        position: 'relative',
        bottom: 35,
        left: 10,
        width: 40,
    },

    iconInputsPassword: {
        position: 'relative',
        top: 25,
        left: width - 35,
        width: 40,
        zIndex: 9,
    },

    containBtn: {
        width: gerarWidthPorcentagem('97%'),
        backgroundColor: '#4F7C8A',
        alignSelf: 'center',
        borderRadius: 6,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
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

    btnsActions: {
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    btnSendContainer: {
        height: '100%',
    },

    btnSend: {
        width: gerarWidthPorcentagem('98%'),
        height: 50,
        justifyContent: 'center',
    },
});

export default styles;
