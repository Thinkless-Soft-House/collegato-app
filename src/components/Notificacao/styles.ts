import { StyleSheet } from 'react-native';
import { MD2Colors } from 'react-native-paper';
import { globalColors } from '../../global/styleGlobal';

const styles = StyleSheet.create({
    notificacao: {
        position: 'absolute',
        top: 80,
        width: '90%',
        alignSelf: 'flex-end',
        marginBottom: 10,
        opacity: 0.9,
    },

    notificacaoBtn: {
        color: '#FFF',
        padding: 5,
    },

    defaultNotificacao: {
        backgroundColor: globalColors.primaryColor,
    },

    dangerNotificacao: {
        backgroundColor: MD2Colors.red700,
    },

    successNotificacao: {
        backgroundColor: MD2Colors.green700,
    },

    warningNotificacao: {
        backgroundColor: MD2Colors.orange700,
    }
});

export default styles;
