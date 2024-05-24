import { StyleSheet, Dimensions } from 'react-native';
import { MD2Colors } from 'react-native-paper';
import { globalColors } from '../../../global/styleGlobal';
import { gerarWidthPorcentagem } from '../../../helpers/styleHelpers';

const { height } = Dimensions.get('screen');

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 3,
    },

    containContentInput: {
        position: 'relative',
    },

    containProgressBar: {
        width: "83%",
        alignSelf: 'center',
    },

    textLabelInput: {
        marginLeft: 25,
    },

    colorDefault: {
        color: globalColors.primaryColor,
    },

    containContent: {
        flex: 1,
        height: height - 140,
        justifyContent: 'space-between',
    },

    montserrat: {
        fontFamily: 'Montserrat',
    },

    containImg: {
        maxHeight: 150,
    },

    imgLogo: {
        width: "100%",
        resizeMode: 'contain',
        maxHeight: 100,
    },

    containInput: {
        paddingHorizontal: 30,
        marginBottom: 20,
    },

    labelInput: {
        color: '#407e8b',
        marginBottom: 5,
    },

    titleInput: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#407e8b',
        marginTop: 15,
        letterSpacing: 1.2,
        marginLeft: 4,
    },

    inputs: {
        marginTop: 20,
    },

    containBtn: {
        paddingVertical: 10,
        borderRadius: 4,
        width: "90%",
        alignSelf: 'center',
        backgroundColor: '#407e8b',
    },

    containBtnTwo: {
        paddingVertical: 10,
        borderRadius: 4,
        width: "90%",
        alignSelf: 'center',
        backgroundColor: '#407e8b',
    },

    textBtn: {
        color: '#fff',
        letterSpacing: 2,
        fontWeight: '500',
        textAlign: 'center',
        fontSize: 20,
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
        width: "98%",
        height: 50,
        justifyContent: 'center',
    },

    notificao: {
        width: "95%",
        backgroundColor: "#fff",
        borderRadius: 5,
        borderLeftWidth: 5,
        borderLeftColor: MD2Colors.orange400,
        padding: 10,
        minHeight: 80,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        marginTop: 20,
    },

    notificaoText: {
        fontSize: 16,
        color: globalColors.primaryColor,
        fontWeight: '500',
    },
});

export default styles;
