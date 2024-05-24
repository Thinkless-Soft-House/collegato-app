import { StyleSheet } from 'react-native';
import { globalColors } from '../../../../../global/styleGlobal';
import { gerarWidthPorcentagem } from '../../../../../helpers/styleHelpers';

const styles = StyleSheet.create({
    contain: {
        flex: 1,
    },

    semiheaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    itemsContainer: {
        backgroundColor: '#FFF',
        marginBottom: 100,
    },

    inputContainer: {
        flexDirection: 'row',
        position: 'absolute',
        backgroundColor: '#e7e7e7',
        width: gerarWidthPorcentagem('100%'),
        bottom: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 20
    },

    montserrat: {
        fontFamily: 'Montserrat',
    },

    messageContainer: {
        minWidth: 100,
        minHeight: 40,
        padding: 10,
        marginVertical: 10,
        paddingHorizontal: 20,
    },

    messageReceived: {
        borderRadius: 50,
        borderBottomLeftRadius: 0,
        marginRight: 100,
        marginLeft: 10,
        backgroundColor: globalColors.secondaryColor,
        alignSelf: 'flex-start',
    },

    messageReceivedContainer: {
        alignItems: 'flex-start',
    },

    messageSent: {
        borderRadius: 50,
        marginLeft: 100,
        marginRight: 10,
        borderBottomRightRadius: 0,
        backgroundColor: globalColors.primaryColor,
        alignSelf: 'flex-end',
    },

    messageSentContainer: {
        alignItems: 'flex-end',
    },

    messageTextReceived: {
        color: '#FFF',
        fontWeight: '600',
    },

    messageTextSent: {
        color: '#FFF',
        fontWeight: '600'
    },

    textLabel: {
        paddingHorizontal: 15,
    },

    containHeaderTalk: {
        flexDirection: 'row',
        height: 60,
        width: gerarWidthPorcentagem('100%'),
        alignItems: 'center',
        paddingLeft: 20,
        backgroundColor: '#4F7C8A',
    },

    textName: {
        marginLeft: 8,
    },

    containMessage: {
        flex: 8,
    },

    containContentMessageLeft: {
        paddingVertical: 10,
        justifyContent: 'center',
        backgroundColor: '#f7f7f7',
        marginTop: 15,
        maxWidth: gerarWidthPorcentagem('70%'),
        paddingHorizontal: 15,
        borderRadius: 10,
        marginLeft: 10,
        borderTopLeftRadius: 0,
    },

    containContentMessageRight: {
        alignSelf: 'flex-end',
        paddingVertical: 10,
        justifyContent: 'center',
        backgroundColor: '#f7f7f7',
        marginTop: 15,
        maxWidth: gerarWidthPorcentagem('70%'),
        paddingHorizontal: 15,
        borderRadius: 10,
        marginRight: 10,
        borderTopRightRadius: 0,
        alignItems: 'flex-end',
    },

    textMessageName: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    textMessage: {
        fontSize: 14,
        marginTop: 4,
    },

    textMessageTime: {
        fontSize: 10,
        marginTop: 4,
    },

    containInput: {
        height: 50,
        marginTop: 10,
        width: gerarWidthPorcentagem('100%'),
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: 5,
    },

    input: {
        width: gerarWidthPorcentagem('90%'),
    },

    inputButton: {
    },

    containIconInput: {
        justifyContent: 'center',
        position: 'relative',
        bottom: 10,
        left: 10,
    },

    containAvatar: {
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    },

    iconSend: {
        position: 'relative',
        right: 2,
        bottom: 5,
    },

    colorDefault: {
        color: '#4F7C8A',
    },

    colorWhite: {
        color: '#fff',
    },
});

export default styles;
