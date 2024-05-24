import { StyleSheet, Dimensions } from 'react-native';
import { globalColors } from '../../../global/styleGlobal';
import { gerarWidthPorcentagem } from '../../../helpers/styleHelpers';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        paddingTop: 40,
        justifyContent: 'space-evenly',
        backgroundColor: '#fafafa',
        color: '#a0a0a0',
    },

    montserrat: {
        fontFamily: 'Montserrat',
    },

    containImg: {
        maxHeight: 120,
    },

    containImgBitter: {
        maxHeight: 100,
    },

    imgLogo: {
        width: "100%",
        resizeMode: 'contain',
        maxHeight: 100,
    },

    containProgressBar: {
        width: "83%",
        alignSelf: 'center',
    },

    containContentPage: {
        height: (height / 100) * 75,
        justifyContent: 'space-between',
        marginTop: 30,
    },

    containInput: {
        paddingHorizontal: 30,
        marginBottom: 20,
    },

    containPass: {
        width: "100%",
        flexDirection: 'row',
        padding: 0,
        margin: 0,
    },

    inputPass: {
        width: "85%",
    },

    containIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: "15%",
    },

    icon: {
        color: '#407e8b',
        marginLeft: 5,
    },

    containForget: {
        alignSelf: 'center',
        marginTop: 5,
    },

    containFirstAccess: {
        alignSelf: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: '#407e8b',
    },

    containFlex: {
        flex: 1,
    },

    textForget: {
        color: '#407e8b',
    },

    containBtn: {
        marginTop: 50,
        width: "90%",
        alignSelf: 'center',
    },

    btnText: {
        fontSize: 14,
    },

    btnEntrar: {
        marginBottom: 15,
        height: 50,
        justifyContent: 'center',
        padding: 0,
    },

    btnRegistrar: {
        marginBottom: 15,
        borderWidth: 2,
        borderColor: globalColors.tertiaryColor,
        height: 50,
        justifyContent: 'center',
        padding: 0,
    },

    textBtn: {
        textAlign: 'center',
    },

    textWhite: {
        color: '#fff',
        letterSpacing: 2,
        fontWeight: '500',
    },

    textBlue: {
        color: '#407e8b',
        letterSpacing: 2,
        fontWeight: '500',
    },

    btnSendContainer: {
        height: "100%",
    },

    checkboxContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    checkboxLabel: {
        fontSize: 15,
        fontWeight: '400',
        color: globalColors.primaryColor
    },
});

export default styles;
