import { StyleSheet } from 'react-native';
import { MD2Colors } from 'react-native-paper';

const styles = StyleSheet.create({
    modalStyle: {
        backgroundColor: 'white',
        height: 200,
        width: '80%',
        alignSelf: 'center',
        borderRadius: 3,
        paddingHorizontal: 20,
    },

    modalContainer: {
    },

    modalHeader: {
        marginBottom: 15,
    },

    modalBody: {
    },

    modalActions: {
        marginTop: 10,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: MD2Colors.grey300,
    },
});

export default styles;
