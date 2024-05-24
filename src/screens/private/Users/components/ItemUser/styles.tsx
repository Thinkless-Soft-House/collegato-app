import { StyleSheet } from 'react-native';
import { MD2Colors } from 'react-native-paper';

const styles = StyleSheet.create({
    container: {
        marginBottom: 5,
    },

    buttonActionsContainer: {
        width: 50,
        marginRight: 5,
        flexDirection: 'row'
    },

    buttonItemAction: {
        backgroundColor: MD2Colors.grey50,
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
});

export default styles;
