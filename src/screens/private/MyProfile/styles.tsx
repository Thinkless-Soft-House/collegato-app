import { Platform, StyleSheet } from 'react-native';
import { globalColors } from '../../../global/styleGlobal';
import { gerarWidthPorcentagem } from '../../../helpers/styleHelpers';

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        alignItems: 'center',
    },

    containProgressBar: {
        width: '83%',
        alignSelf: 'center',
    },

    usuarioFotoContainer: {
        padding: 20,
    },

    inputs: {
        width: '100%',
        backgroundColor: '#FFF',
    },

    usuarioDadosContainer: {
        width: '98%',
        paddingVertical: 20,
        backgroundColor: '#fff',
        padding: 10,
    },

    formContainer: {
        width: '98%',
        backgroundColor: '#fff',
    },

    containerActions: {
        alignItems: 'flex-end',
        paddingHorizontal: 10,
    },

    btnsActions: {
        width: '98%',
        paddingVertical: 10,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 200,
    },

    btnSend: {
        width: gerarWidthPorcentagem('98%'),
        height: 50,
        marginVertical: 4,
        justifyContent: 'center',
    },

    btnSendContainer: {
        height: '100%',
    },

    montserrat: {
        fontFamily: 'Montserrat',
    },

    mb4: {
        marginBottom: 4,
    },

    containAvatar: {
        position: 'relative',
        top: 52,
    },

    containRow: {
        flexDirection: 'row',
    },

    textColor: {
        color: '#4f7c8ae1',
    },

    photoInput: {
        flex: 1,
        alignItems: 'center',
    },

    photoInputLabelContainer: {
        width: "40%",
    },

    photoTitle: {
        fontSize: 18,
        fontWeight: '400',
        color: globalColors.primaryColor
    },

    photoDescription: {
        fontWeight: '600',
    },

    containAllLogout: {
        marginVertical: Platform.OS === 'ios' ? 12 : 0,
    },

    containLogout: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginRight: 50,
        marginBottom: 20,
    },

    textName: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#4f7c8ae1',
        marginBottom: 5,
    },

    containTextAvatar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },

    containJustifyCenter: {
        justifyContent: 'center',
    },

    containIconCameraAvatar: {
        position: 'relative',
        bottom: 40,
        left: 38,
    },

    textTypeUser: {
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1.1,
    },

    textEmail: {
        textDecorationLine: 'underline',
    },

    iconPen: {
        marginLeft: 10,
        paddingBottom: 10,
    },

    photoInputAvatarButton: {

    },

    dialogActions: {
        justifyContent: 'space-between'
    },
});

export default styles;
