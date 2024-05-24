import { StyleSheet } from 'react-native';
import { MD2Colors } from 'react-native-paper';
import { gerarHeightPorcentagem, gerarWidthPorcentagem } from '../../helpers/styleHelpers';

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        paddingHorizontal: 15,
    },

    modalContainer: {
        alignSelf: 'center',
        paddingBottom: 0,
        width: gerarWidthPorcentagem('80%'),
        minHeight: gerarHeightPorcentagem('20%'),
        height: gerarHeightPorcentagem('40%'),
    },

    scrollArea: {
    },

    searchBarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 60,
    },

    searchBarActionContainer: {
        borderTopWidth: 1,
        borderTopColor: MD2Colors.grey300,
        paddingHorizontal: 10,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 50,
    },

    searchBar: {
        width: gerarWidthPorcentagem('70%'),
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
