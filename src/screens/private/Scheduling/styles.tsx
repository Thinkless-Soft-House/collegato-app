import { StyleSheet } from 'react-native';
import { MD2Colors } from 'react-native-paper';
import { gerarWidthPorcentagem, plataformaIOS } from '../../../helpers/styleHelpers';

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 15,
    },

    actionsContainer: {
        alignItems: 'flex-start',
        width: '100%',
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
        minHeight: '70%',
        width: '100%',
    },

    cartTitleStyle: {
        paddingLeft: 10,
        margin: 0,
        marginLeft: 10,
        flexWrap: 'wrap'
    },

    cardContentStyle: {
    },

    cardLeftStyle: {
    },

    cardRightStyle: {
        position: 'relative',
        right: 15,
    },

    cardActionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 10,
    },

    buttonActionsContainer: {
        marginRight: 10,
    },

    dialogActions: {
        justifyContent: 'space-between'
    },

    containContent: {
        marginTop: 20,
    },

    containOptions: {
        backgroundColor: '#f8f8f8',
        width: '100%',
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

    containProgressBar: {
        width: '83%',
        alignSelf: 'center',
    },

    modalStyle: {
        backgroundColor: 'white',
        height: 200,
        width: gerarWidthPorcentagem("80%"),
        alignSelf: 'center',
        borderRadius: 3,
        paddingHorizontal: 20,
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
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: MD2Colors.grey700,
    },

    dropdownFilter: {

    },

    modalRoomStyle: {
        position:'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        height: 600,
        width: plataformaIOS() ? gerarWidthPorcentagem('105%') : gerarWidthPorcentagem('100%'),
        borderTopLeftRadius: 50,
        paddingHorizontal: 20,
        paddingBottom: 10,
    },

    modalRoomContainer: {
        flex: 1,
        justifyContent: "space-between",
        
    },

    modalRoomHeader: {
        flexDirection: 'row',
        marginTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: MD2Colors.grey300
    },

    modalRoomBody: {
    },

    modalRoomActions: {
        marginTop: 10,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: MD2Colors.grey700,
    },

    modalRoomPhoto: {
        marginRight: 10,
    },

    modalRoomTitleContainer: {
        marginTop: 10,
    }
});

export default styles;
