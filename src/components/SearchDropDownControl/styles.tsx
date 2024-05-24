import { StyleSheet } from 'react-native';
import { MD2Colors } from 'react-native-paper';

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        paddingHorizontal: 15,
    },

    modalContainer: {
        alignSelf: 'center',
        paddingBottom: 15,
        width: '80%',
        minHeight: '20%',
        height: '40%',
    },

    scrollArea: {
    },

    searchBarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 60,
    },

    searchBar: {
        width: '90%',
    },

    modalTitle: {
        backgroundColor: 'red',
    },

    item: {
        borderBottomWidth: 0.5,
        borderBottomColor: MD2Colors.grey400,
    },
});

export default styles;
