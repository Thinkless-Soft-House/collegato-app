import { StyleSheet } from 'react-native';
import { globalColors } from '../../../global/styleGlobal';
import { gerarWidthPorcentagem } from '../../../helpers/styleHelpers';

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
        bottom: 60,
    },

    containProgressBar: {
        width: '83%',
        alignSelf: 'center',
    },

    textLabelInput: {
        marginLeft: 25,
        marginBottom: 8,
    },

    textFeedbackerror: {
        letterSpacing: 1.1,
        color: '#ff3e3e',
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 11,
        marginLeft: 30,
    },

    inputs: {
        width: '85%',
        alignSelf: 'center',
    },

    iconInputs: {
        position: 'relative',
        bottom: 41,
        left: 10,
        width: 40,
    },

    containBtn: {
        width: '97%',
        backgroundColor: globalColors.primaryColor,
        alignSelf: 'center',
        borderRadius: 6,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },

    textBtn: {
        fontWeight: 'bold',
        fontSize: 20,
    },

    colorDefault: {
        color: globalColors.primaryColor,
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
        width: '98%',
        height: 50,
        justifyContent: 'center',
    },
});

export default styles;
