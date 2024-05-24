import { StyleSheet } from 'react-native';
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
        alignItems: 'flex-start',
        width: "100%",
        marginVertical: 20,
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
        marginTop: 0,
        width: "100%",
        paddingBottom: 70,
    },

    containProgressBar: {
        width: "83%",
        alignSelf: 'center',
    },

    dialogActions: {
        justifyContent: 'space-between'
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
        flexDirection: 'row',
        marginBottom: 20,
    },

    filterActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 20,
    },

    filterButton: {
        position: 'absolute',
        left: '85%',
    },

    filterButtonWithText: {
        left: '76%',
    },

    filterButtonEmpty: {
        opacity: 0.5
    },

    sendFilterButton: {
        marginRight: 20,
    },

    searchBar: {
        width: gerarWidthPorcentagem("100%"),
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

    dropdownFilter: {

    },

    checkboxFilterContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
});

export default styles;
