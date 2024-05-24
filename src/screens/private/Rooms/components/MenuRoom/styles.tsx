import { StyleSheet } from 'react-native';
import { MD2Colors } from 'react-native-paper';

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
    },

    itemsContainer: {
        width: '100%',
    },
});

export default styles;
