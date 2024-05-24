import { StyleSheet } from 'react-native';
import { globalColors } from '../../../../../global/styleGlobal';
import { MD2Colors } from 'react-native-paper';
import { gerarWidthPorcentagem } from '../../../../../helpers/styleHelpers';

const styles = StyleSheet.create({
    dispScroll: {
        padding: 15,
    },

    dispContainer: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: gerarWidthPorcentagem('95%'),
    },

    dispHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start'
    },

    dispButton: {
        position: 'absolute',
        right: 1,
        top: -10,
    },

    dispActionContainer: {
        width: '100%',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },

    dispActionButtonsContainerEditing: {
        justifyContent: 'space-between',
    },

    dispCancelButton: {
        backgroundColor: MD2Colors.red50,
    },

    dispButtonEdit: {
        backgroundColor: MD2Colors.grey200,
    },

    dispButtonSend: {
        backgroundColor: MD2Colors.green50,
    },

    dispTitle: {
        marginBottom: 20,
        alignSelf: 'center'
    },

    dispItem: {
        borderLeftWidth: 4,
        borderLeftColor: globalColors.tertiaryColor,
        width: '100%',
        padding: 5,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginVertical: 10,
    },

    dispIntervaloInput: {
        width: '80%'
    },

    dispMinDiaInput: {
        width: '30%'
    },

    surface: {
        padding: 8,
        marginBottom: 20,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        borderLeftWidth: 4,
        borderLeftColor: globalColors.primaryColor,
      },
});

export default styles;
