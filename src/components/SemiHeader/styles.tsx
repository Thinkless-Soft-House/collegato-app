import { StyleSheet } from 'react-native';
import { globalColors } from '../../global/styleGlobal';

const styles = StyleSheet.create({
    containSemiHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 20,
        alignItems: 'center',
        borderBottomColor: globalColors.primaryColor,
        borderBottomWidth: 2,
    },

    titulo: {
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1.1,
        color: globalColors.primaryColor,
    },
});

export default styles;
