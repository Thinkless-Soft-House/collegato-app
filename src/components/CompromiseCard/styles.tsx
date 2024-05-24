import { StyleSheet } from 'react-native';
import { MD2Colors } from 'react-native-paper';
import { globalColors } from '../../global/styleGlobal';
import { gerarWidthPorcentagem } from '../../helpers/styleHelpers';

const styles = StyleSheet.create({
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
        paddingBottom: 10,
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

    cardContentContainer: {
        width: '100%',
        paddingVertical: 10,
    },

    cardContentItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: 30,
        marginVertical: 5,
        paddingTop: 5,
        paddingLeft: 5,
        borderRadius: 5,
        borderLeftWidth: 2,
        borderLeftColor: globalColors.secondaryColor,
        borderRightWidth: 2,
        borderRightColor: globalColors.secondaryColor,
    },

    cardTextHead: {
        width: 60,
        fontWeight: 'bold',
        marginRight: 20,
    },

    cardTextValue: {

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
        justifyContent: 'space-between',
        marginVertical: 10,
        right: 20,
        paddingHorizontal: 0,
        marginHorizontal: 0,
        // width: gerarWidthPorcentagem('80%')
    },
    
    cardActionCancelarButton: {
        width: '50%',
        paddingHorizontal: 0,
        marginHorizontal: 0,
        // width: gerarWidthPorcentagem('40%')
    },
    
    cardActionStatusButton: {
        // width: 100,
        paddingHorizontal: 0,
        marginHorizontal: 0,
    //     marginBottom: 10,
    //     width: gerarWidthPorcentagem('40%')
    },
});

export default styles;
