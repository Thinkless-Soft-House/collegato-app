import { StyleSheet, Platform } from 'react-native';
import { globalColors } from '../../../../global/styleGlobal';

const styles = StyleSheet.create({
    bntHeader: {
        width: 60,
        height: 60,
        paddingLeft: 10,
        paddingTop: 5,
    },

    headerName: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: globalColors.primaryColor,
    },

    contain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        maxHeight: 60,
    },

    imgLogo: {
        width: 150,
        maxHeight: 30,
        marginRight: 5,
        marginBottom: '4%',
        alignSelf: 'flex-end',
    },
});

export default styles;
