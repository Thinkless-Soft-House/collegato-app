import { StyleSheet } from 'react-native';
import { MD2Colors } from 'react-native-paper';
import { globalColors } from '../../../global/styleGlobal';
import { gerarWidthPorcentagem } from '../../../helpers/styleHelpers';

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 15,
    },

    montserrat: {
        fontFamily: 'Montserrat',
    },

    containContent: {
        flexDirection: 'column',
        // justifyContent: 'space-between',
        // marginTop: 20,
        marginBottom: 20,
    },

    companieContainer: {
        marginBottom: 30,
    },

    roomContainer: {
        marginBottom: 30,
    },

    calendarContainer: {
        minHeight: 80,
        backgroundColor: 'white',
        marginBottom: 30,
        borderRadius: 5,
        paddingBottom: 15,
    },

    months: {
        flexDirection: 'row',
        justifyContent: 'center',
        height: 50,
        marginTop: 5
    },

    monthsLabel: {
        alignSelf: 'center',
    },

    days: {
        flexDirection: 'row',
        alignSelf: 'center',
        // width: 280,
    },

    dayItemSelected: {
        backgroundColor: globalColors.primaryColor,
    },

    dayItemUnselected: {
        backgroundColor: '#FFF',
    },

    dayItemTextUnselected: {
        color: MD2Colors.black
    },

    dayBlocked: {
        backgroundColor: MD2Colors.red400,
    },

    dayItem: {
        width: 60,
        marginHorizontal: 2,
        height: 70,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: MD2Colors.grey400,
        alignItems: 'center',
        justifyContent: 'center',
    },

    dayItemContainer: {
        marginTop: 4,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },

    dayWeekItemText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },

    dayItemText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },

    hourItemTextSelected: {
        color: '#FFF',
    },

    hourItemSelected: {
        backgroundColor: globalColors.primaryColor,
    },

    hourItemBlocked: {
        backgroundColor: MD2Colors.red200
    },

    hourItem: {
        width: 80,
        height: 50,
        borderRadius: 5,
        borderBottomWidth: 5,
        borderTopWidth: 0.5,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderColor: MD2Colors.grey400,
        borderBottomColor: globalColors.primaryColor,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },

    hourItemText: {
        fontSize: 18,
        fontWeight: 'bold',
        alignItems: 'center',
        color: 'black'
    },

    btnDay: {
        width: 10,
        height: 100,
    },

    hourContainer: {
        minHeight: 80,
        marginBottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
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

    colorDefault: {
        color: '#4F7C8A',
    },

    btnSend: {
        alignSelf: 'center',
        height: 50,
        justifyContent: 'center',
    },

    btnSendAlone: {
        width: '100%'
    },

    btnsActions: {
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    btnSendContainer: {
        // height: '100%',
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

    notificacaoAlerta: {
        justifyContent: 'center',
        paddingLeft: 10,
        height: 40,
        borderLeftWidth: 4,
        marginVertical: 10,
    },

    containProgressBar: {
        width: '83%',
        alignSelf: 'center',
    },

    inputs: {
        width: '100%',
    },

    notificacaoAlertaText: {
        fontWeight: '600'
    },

    AlertaWarning: {
        borderLeftColor: MD2Colors.orange400,
        backgroundColor: MD2Colors.yellow200,
    },

    AlertaSucess: {
        borderLeftColor: MD2Colors.greenA700,
        backgroundColor: MD2Colors.green100,
    },

    modalAgendamentoStyle: {
        position:'absolute',
        bottom: 0,
        backgroundColor: 'white',
        height: 600,
        width: '100%',
        borderTopLeftRadius: 50,
        paddingHorizontal: 20,
        paddingBottom: 10,
    },

    modalAgendamentoContainer: {
        flex: 1,
        justifyContent: "space-between"
    },

    modalAgendamentoHeader: {
        flexDirection: 'row',
        marginTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: MD2Colors.grey300
    },

    modalAgendamentoBody: {
    },

    modalAgendamentoActions: {
        marginTop: 10,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: MD2Colors.grey700,
    },

    modalAgendamentoPhoto: {
        marginRight: 10,
    },

    modalAgendamentoTitleContainer: {
        marginTop: 10,
    }
});

export default styles;
