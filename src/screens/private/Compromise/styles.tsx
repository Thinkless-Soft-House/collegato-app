import { StyleSheet, Dimensions, Platform } from 'react-native';
import { MD2Colors } from 'react-native-paper';
import { gerarHeightPorcentagem, gerarWidthPorcentagem, plataformaIOS } from '../../../helpers/styleHelpers';

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 15,
    },

    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: "100%",
        marginVertical: 20,
    },

    buttonActionsContainer: {
        width: 50,
        marginRight: 5,
        flexDirection: 'row'
    },

    menuBox: {
        left: 200,
    },

    menuItemDelete: {
        color: MD2Colors.red300
    },

    buttonMenu: {
        width: 40,
        height: 40,
        marginLeft: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },

    itemsContainer: {
        paddingHorizontal: 10,
        width: "100%",
    },

    dialogActions: {
        justifyContent: 'space-between'
    },

    dialogExcluirAction: {
        justifyContent: 'flex-end',
    },

    containProgressBar: {
        width: "83%",
        alignSelf: 'center',
    },

    inputs: {
        width: "100%"
    },

    containContent: {
        marginTop: 20,
    },

    containOptions: {
        backgroundColor: '#f8f8f8',
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 80,
        paddingHorizontal: 8,
    },

    filterContainer: {
        width: gerarWidthPorcentagem("100%"),
        height: 50,
        justifyContent: 'flex-end',
        backgroundColor: '#FFF',
        flexDirection: 'row',
        marginBottom: 20,
    },

    filterButtonWithText: {
        left: '76%',
    },

    filterButtonEmpty: {
        opacity: 0.5
    },

    filterButton: {
        position: 'absolute',
        left: '86%',
    },

    filterActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 20,
    },

    sendFilterButton: {
        marginRight: 20,
    },

    searchBar: {
        width: gerarWidthPorcentagem("100%"),
    },

    cardStyle: {
        marginVertical: 10,
    },

    cardContentStyle: {

    },

    cardLeftStyle: {

    },

    cardRightStyle: {
        position: 'relative',
        right: 15,
    },

    modalStyle: {
        backgroundColor: 'white',
        width: gerarWidthPorcentagem("80%"),
        height: plataformaIOS() ? gerarHeightPorcentagem("45%") : 'auto',
        alignSelf: 'center',
        borderRadius: 3,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },

    containerModalFilter: {
    },

    modalFilterHeader: {
        marginBottom: 15,
    },

    modalFilterBody: {
    },

    modalFilterActions: {
        marginTop: 10,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: MD2Colors.grey700,
    },

    inputFilter: {
        marginHorizontal: 10,
        marginBottom: 15,
    },

    dropdownFilter: {
        marginBottom: 15,
    },

    cardActionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },

    cardActionCancelarButton: {
    },

    cardActionStatusButton: {
        marginBottom: 10,
    },

    statusContainer: {
        minHeight: 200,
    },

    statusTitle: {
        fontSize: 18,
    },

    statusDescription: {
        fontSize: 16,
    },

    dialogAcoesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 5,
    },

    modalStatusStyle: {
        position:'absolute',
        bottom: 0,
        backgroundColor: 'white',
        height: 600,
        width: "100%",
        borderTopLeftRadius: 50,
        paddingHorizontal: 20,
        paddingBottom: 10,
    },

    modalStatusContainer: {
        flex: 1,
        justifyContent: "flex-start"
    },

    modalStatusHeaderContainer: {
        flexDirection: 'row',
    },

    modalStatusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: MD2Colors.grey300
    },


    modalStatusBody: {
    },

    modalStatusButton: {
        alignSelf: 'center'
    },

    modalStatusPhoto: {
        marginRight: 10,
    },

    modalStatusTitleContainer: {
        marginTop: 10,
    },

    notificacaoAlerta: {
        justifyContent: 'center',
        paddingLeft: 10,
        height: 40,
        borderLeftWidth: 4,
        marginVertical: 10,
    },
    
    notificacaoAlertaText: {
        fontWeight: '600'
    },

    alertaWarning: {
        borderLeftColor: MD2Colors.orange400,
        backgroundColor: MD2Colors.yellow200,
    },
});

export default styles;
