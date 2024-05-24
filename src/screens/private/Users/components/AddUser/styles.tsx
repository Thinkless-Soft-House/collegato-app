import { StyleSheet } from 'react-native';
import { globalColors } from '../../../../../global/styleGlobal';
import { MD2Colors } from 'react-native-paper';
import { gerarWidthPorcentagem } from '../../../../../helpers/styleHelpers';

const styles = StyleSheet.create({
    contain: {
        flex: 1,
    },

    inputs: {
        width: '100%',
    },

    containProgressBar: {
        width: '83%',
        alignSelf: 'center',
    },

    btnSend: {
        width: gerarWidthPorcentagem('98%'),
        height: 50,
        justifyContent: 'center',
    },

    marginTop10: {
        marginTop: 10,
    },

    btnsActions: {
        marginTop: 20,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    btnSendContainer: {
        height: '100%',
    },

    mtContent: {
        backgroundColor: MD2Colors.grey100,
    },

    subTitleFormContainer: {
        backgroundColor: globalColors.primaryColor,
        height: 50,
        marginVertical: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },

    subTitle: {
        color: MD2Colors.grey50
    },
});

export default styles;
