import { StyleSheet } from 'react-native';
import { MD2Colors } from 'react-native-paper';
import { globalColors } from '../../global/styleGlobal';

const styles = StyleSheet.create({
    notificacaoAlerta: {
        justifyContent: 'center',
        paddingHorizontal: 10,
        height: 40,
        borderLeftWidth: 4,
        marginVertical: 10,
    },

    notificacaoAlertaText: {
        fontWeight: '600'
    },

    defaultNotificacao: {
        borderLeftColor: globalColors.primaryColor,
        backgroundColor: globalColors.tertiaryColor,
    },

    dangerNotificacao: {
        borderLeftColor: MD2Colors.red700,
        backgroundColor: MD2Colors.red100,
    },

    successNotificacao: {
        borderLeftColor: MD2Colors.greenA700,
        backgroundColor: MD2Colors.green100,
    },

    warningNotificacao: {
        borderLeftColor: MD2Colors.orange400,
        backgroundColor: MD2Colors.yellow200,
    }
});

export default styles;
