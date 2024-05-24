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

    checkboxContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },

    checkboxLabel: {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 15,
        color: globalColors.primaryColor
    },

    containProgressBar: {
        width: '83%',
        alignSelf: 'center',
    },

    responsaveisLabel: {
        marginTop: 5,
        marginLeft: '8%',
        marginBottom: 5,
        color: globalColors.primaryColor
    },

    responsaveisContainer: {
        width: '90%',
        flexWrap: 'wrap',
        minHeight: 20,
        justifyContent: 'flex-start',
        marginBottom: 20,
        borderRadius: 5,
        flexDirection: 'row',
        alignSelf: 'center',
        borderColor: globalColors.primaryColor,
        borderWidth: 1,
        padding: 10,
    },

    chipContainer: {
        flexDirection: 'row',
        backgroundColor: globalColors.primaryColor,
        paddingHorizontal: 10,
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 30,
    },

    chipText: {
        color: '#FFF',
        flexDirection: 'row'
    },

    chipButton: {
        marginRight: 0,
        marginLeft: 15
    },

    btnSend: {
        width: gerarWidthPorcentagem('98%'),
        height: 50,
        justifyContent: 'center',
    },

    btnSendContainer: {
        height: '100%',
    },

    marginTop10: {
        marginTop: 10,
    },

    btnsActions: {
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
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

    dispScroll: {
        padding: 15,
    },

    dispContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        // width: gerarWidthPorcentagem('90%')
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
