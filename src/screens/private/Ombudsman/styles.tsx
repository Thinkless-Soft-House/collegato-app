import { StyleSheet } from 'react-native';
import { gerarWidthPorcentagem } from '../../../helpers/styleHelpers';

const styles = StyleSheet.create({
    contain: {
        flex: 1,
    },

    containerStyle: {
        marginHorizontal: 5
    },

    itemsContainer: {
    },

    cardStyle: {
        marginVertical: 10,
    },

    cardContentStyle: {
        paddingBottom: 10,
    },

    cardLeftStyle: {

    },

    cardRightStyle: {

    },

    chatPreMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    chatPreMessage: {
        marginLeft: 10,
    },

    montserrat: {
        fontFamily: 'Montserrat',
    },

    containHeaderTalk: {
        flexDirection: 'row',
        height: 60,
        width: '100%',
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
        maxWidth: '70%',
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
        maxWidth: '70%',
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
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: 5,
    },

    input: {
        borderWidth: 1,
        borderColor: '#808080',
        width: '85%',
        height: 35,
        borderRadius: 8,
        marginBottom: 15,
        paddingLeft: 10,
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
