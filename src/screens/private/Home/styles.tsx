import { StyleSheet } from 'react-native';
import { gerarWidthPorcentagem } from '../../../helpers/styleHelpers';

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: '#FFF'
    },

    montserrat: {
        fontFamily: 'Montserrat',
    },

    containEditHome: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 18,
        marginHorizontal: 5,
        borderRadius: 8,
        paddingVertical: 1,
        backgroundColor: '#f8f8f8',
        width: 180,
    },

    textEditHome: {
        color: '#52adbc',
        letterSpacing: 1.5,
        marginLeft: 8,
    },

    containCategory: {
        marginTop: 30,
        position: 'relative',
        left: 0,
        right: 0,
        bottom: 0,
    },

    paddingLeft: {
        paddingLeft: 12,
    },

    textCategory: {
        fontSize: 18,
        color: '#4F7C8A',
        fontWeight: '200',
    },

    IconsCategory: {
        marginRight: 10,
    },

    containCategoryIcon: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderColor: '#4F7C8A',
        marginTop: 15,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },

    containOptions: {
        width: "100%",
        alignSelf: 'center',
        borderRadius: 16,
        marginTop: 15,
        paddingVertical: 15,
    },

    avatarContain: {
        backgroundColor: '#fff',
        marginLeft: 10,
    },

    imgAvatar: {
        height: 60,
        width: 60,
        resizeMode: 'cover',
    },
});

export default styles;
