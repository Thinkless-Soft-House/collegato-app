import { View, RefreshControl, Text, FlatList } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { MotiView } from 'moti';
import { LinearProgress } from '@rneui/themed';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ref, get, remove } from "firebase/database";
import add from 'date-fns/add';
import isBefore from 'date-fns/isBefore';

import DropDown from '../../../components/DropDown';
import {
    Button,
    MD2Colors,
    Dialog,
    IconButton,
    Paragraph,
    Searchbar,
    Modal,
    Title,
    Avatar,
    List,
} from 'react-native-paper';
import SemiHeader from '../../../components/SemiHeader';
import { CommonActions, useFocusEffect, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { ModalComponent } from '../../../components/ModalComponent';
import Input from '../../../components/Input';
import { DatePickerModalInput } from '../../../components/DatePickerModalInput';
import { CompromiseCard } from '../../../components/CompromiseCard';

import { getReservasPorFiltro } from '../../../services/api/ReservaServices/getReservasPorFiltro';
import { getTodosStatusReservas } from '../../../services/api/StatusReservaServices/getTodosStatusReservas';
import { getTodosUsuarios } from '../../../services/api/usuarioServices/getTodosUsuarios';
import { getTodosSalas } from '../../../services/api/SalaServices/getTodosSalas';
import { getSalaPorId } from '../../../services/api/SalaServices/getSalaPorId';
import { getTodasEmpresas } from '../../../services/api/empresaServices/getTodasEmpresas';
import { postAdicionarStatusReserva } from '../../../services/api/StatusReservaServices/postAdicionarStatusReserva';
import { getReservaPorId } from '../../../services/api/ReservaServices/getReservaPorId';
import { putEditarReserva } from '../../../services/api/ReservaServices/putEditarReserva';
import { deleteExcluirReserva } from '../../../services/api/ReservaServices/deleteExcluirReserva';
import { getDisponibilidadesPorSalaId } from '../../../services/api/disponibilidadeServices/getDisponibilidadesPorSalaId';
import { getStatusDaReserva } from '../../../services/api/StatusReservaServices/getStatusDaReserva';

import styles from './styles';
import { globalColors } from '../../../global/styleGlobal';
import { ROUTES } from '../../../routes/config/routesNames';
import { ScrollView } from 'react-native-gesture-handler';
import { StatusReserva } from '../../../models/statusReserva';
import { Reserva } from '../../../models/reserva';
import { AuthContext, ILoginData } from '../../../services/auth';
import { NotificacaoContext, NotificacaoContextData } from '../../../contexts/NotificacaoProvider';
import { PermissaoEnum } from '../../../models/enums/permissaoEnum';
import { RequestResult } from '../../../models/DTOs/requestResult';
import { getDataAtual, getDataFormatadaFiltro, getDataLocalZone } from '../../../helpers/dataHelpers';
import { adicionarMascara, textoNaoEhVazio } from '../../../helpers/formHelpers';
import { StatusReservaEnum, getLabelStatusReservaEnum, getEnumArrayStatusReservaEnum } from '../../../models/enums/statusReservaEnum';
import { chatDatabase, chatListRecadosEndPoint, collegatoChatId, messagesRecadosEndPoint, usuariosRecadosEndPoint } from '../../../services/firebaseConfigs/firebaseConfig';
import { Chat } from '../../../models/DTOs/chat';
import { SearchDropdownItem } from '../../../models/DTOs/searchDropdownItem';
import { ReservasFiltro } from '../../../models/DTOs/reservasFiltro';
import { PaginacaoModel } from '../../../models/DTOs/paginacaoModel';
import { tratarIdEmpresaChat } from '../../../helpers/chatHelpers';
import { StatusEnum } from '../../../models/enums/statusEnum';

const _empresas = [
    { label: 'Empresa A', value: 1 },
    { label: 'Empresa B', value: 2 },
    { label: 'Empresa C', value: 3 },
];

const wait = (timeout: number) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

interface CompromissoItem {
    nomeCliente: string;
    enderecoCliente: string;
    telefoneCliente: string;
    emailCliente: string;
    nomeEmpresa: string;
    enderecoEmpresa: string;
    telefoneEmpresa: string;
    emailsResponsaveis: string;
    horaCompromisso: string;
}

interface CompromiseParams {
    salaId: number;
}

const _statusReserva = getEnumArrayStatusReservaEnum().map((item) => {
    return { label: item.label, value: item.value };
});

const paginacaoInicial: PaginacaoModel = {
    orderColumn: 'id',
    order: 'DESC',
    take: 10,
    skip: 0,
}

const filtroInicial: ReservasFiltro = {
    order: 'DESC',
    empresaId: null,
    salaId: null,
    usuarioId: null,
    status: null,
}


const Compromise: React.FC = (props: any) => {
    const { usuarioLogado, pessoaLogada } = useContext<ILoginData>(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { showNotificacao } = useContext<NotificacaoContextData>(NotificacaoContext);
    const route = useRoute();
    const [refreshing, setRefreshing] = useState(false);
    const [refreshingRequest, setRefreshingRequest] = useState(false);
    const [refreshingRequestScroll, setRefreshingRequestScroll] = useState(false);
    const [paginacao, setPaginacao] = useState<PaginacaoModel>(paginacaoInicial);
    const [pagina, setPagina] = useState<number>(0);
    const [refreshingStatus, setRefreshingStatus] = useState(false);
    const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
    const [showAcompanharProgressBar, setAcompanharShowProgressBar] = useState<boolean>(false);
    const screenIsFocused = useIsFocused();
    const [empresas, setEmpresas] = useState<SearchDropdownItem[]>([]);
    const [usuarios, setUsuarios] = useState<SearchDropdownItem[]>([]);
    const [salas, setSalas] = useState<SearchDropdownItem[]>([]);
    const [filtro, setFiltro] = useState<string>("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const [modalLoading, setModalLoading] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [salaId, setSalaId] = useState<number>(0);
    const [usuarioId, setUsuarioId] = useState<number>(0);
    const [empresaId, setEmpresaId] = useState<number>(0);
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [reservaIdDelete, setReservaIdDelete] = useState<number>(0);
    const [reservaSelecionada, setReservaSelecionada] = useState<Reserva>();
    const [statusReservaSelecionada, setStatusReservaSelecionada] = useState<StatusReserva[]>([]);
    const [statusReservaList, setStatusReservaList] = useState<StatusReserva[]>([]);
    const [modalStatusVisible, setModalStatusVisible] = useState<boolean>(false);
    const [motivoCancelamento, setMotivoCancelamento] = useState<string>("");
    const [carregado, setCarregado] = useState<boolean>(false);
    const [statusReservaForm, setStatusReservaForm] = useState<number>();

    // Filtro Form
    const [texto, setTexto] = useState<string>("");
    const [salaFiltroId, setSalaFiltroId] = useState<string>(null);
    const [empresaFiltroId, setEmpresaFiltroId] = useState<string>(null);
    const [usuarioFiltroId, setUsuarioFiltroId] = useState<string>(null);
    const [dataFiltro, setDataFiltro] = useState<Date>(null);
    const [dataStringFiltro, setDataStringFiltro] = useState<string>(getDataLocalZone(getDataAtual()));
    const [statusId, setStatusId] = useState<number>(null);

    const openModalStatus = () => setModalStatusVisible(true);

    useFocusEffect(
        useCallback(() => {
            buscarStatusReservas();
            buscarDadosIniciais();
        }, [props.route.params])
    );

    useEffect(() => {
        if (!textoNaoEhVazio(texto)) {
            onClearTexto();
        }
    }, [texto]);

    async function buscarDadosIniciais() {
        setRefreshingRequest(true);
        // await buscarEmpresas();
        // await buscarUsuarios();
        // await buscarSalas();
        await aplicarFiltroPadrao();
        setRefreshingRequest(false);
    }

    async function buscarEmpresas() {
        let resultado = await getTodasEmpresas();
        if (!resultado.success) {
            showNotificacao(resultado.message, 'danger');
            setEmpresas([]);
            return;
        }

        let novaLista: SearchDropdownItem[] = resultado.result.map(item => {
            return {
                label: item.nome,
                value: item.id.toString(),
            }
        });

        setEmpresas(novaLista);
    }

    async function buscarUsuarios() {
        let resultado = await getTodosUsuarios();
        if (!resultado.success) {
            showNotificacao(resultado.message, 'danger');
            setEmpresas([]);
            return;
        }

        let novaLista: SearchDropdownItem[] = resultado.result.map(item => {
            return {
                label: item.pessoa.nome,
                value: item.id.toString(),
            }
        });

        setUsuarios(novaLista);
    }

    async function buscarSalas() {
        let resultado = await getTodosSalas();
        if (!resultado.success) {
            showNotificacao(resultado.message, 'danger');
            setEmpresas([]);
            return;
        }

        let novaLista: SearchDropdownItem[] = resultado.result.map(item => {
            return {
                label: item.nome,
                value: item.id.toString(),
            }
        });

        setSalas(novaLista);
    }

    async function buscarStatusReservas() {
        setModalLoading(true);
        let resultado = await getTodosStatusReservas();
        if (!resultado.success) {
            setModalLoading(false);
            showNotificacao(resultado.message, 'danger');
            return;
        }

        setStatusReservaList(resultado.result);
        setModalLoading(false);
    }

    async function onRefresh() {
        setRefreshing(true);
        await aplicarFiltroPadrao();
        setRefreshing(false);
    }

    async function onClearTexto() {
        setRefreshingRequest(true);
        await aplicarFiltroPadrao();
        setRefreshingRequest(false);
    }

    async function aplicarFiltro() {
        setModalVisible(false);
        setRefreshingRequest(true);
        await aplicarFiltroPadrao();
        setRefreshingRequest(false);
    }

    async function limparFiltro() {
        setModalVisible(false);
        setSalaFiltroId(null);
        setEmpresaFiltroId(null);
        setUsuarioFiltroId(null);
        setStatusId(null);
        setPagina(0);
        setDataFiltro(null);

        let dataAtual = getDataLocalZone(getDataAtual(), 'YYYY-MM-DD');
        setDataStringFiltro(dataAtual);

        let filtro: ReservasFiltro = {
            ...filtroInicial,
            ...paginacaoInicial,
            data: dataAtual,
            status: '1,2'
        }

        setRefreshingRequest(true);
        const res = await buscarPorFiltro(filtro);
        setRefreshingRequest(false);
    }

    async function buscarPorFiltro(filtro: ReservasFiltro) {
        if (usuarioLogado.permissaoId == PermissaoEnum.Funcionario || usuarioLogado.permissaoId == PermissaoEnum.Empresario) {
            filtro.empresaId = usuarioLogado.empresaId;
        }
        else if (usuarioLogado.permissaoId == PermissaoEnum.Cliente) {
            filtro.usuarioId = usuarioLogado.id;
        }
        else {
            const params = route.params as CompromiseParams;
            if (params) {
                if (params.salaId) {
                    filtro.salaId = params.salaId;
                }
            }
        }

        let resultado = await getReservasPorFiltro(filtro);
        if (!resultado.success) {
            resetarPaginacao();
            showNotificacao(resultado.message, 'danger');
            return;
        }

        let lista: Reserva[] = resultado.result;
        console.log('listando....');
        lista.forEach(el => {
            console.log('reserva', el);
            console.log('reserva.id', el.id);
            console.log('reserva.horaInicio', el.horaInicio);
        })
        setReservas(lista);
    }

    async function alterarPaginacao() {
        console.log('alterarPaginacao');
        if (reservas.length >= paginacaoInicial.take) {
            let _pagina = pagina + 1;

            let novaPaginacao: PaginacaoModel = {
                ...paginacao,
                skip: _pagina * paginacao.take,
            }

            let filtro: ReservasFiltro = {
                ...novaPaginacao,
                empresaId: empresaFiltroId && Number(empresaFiltroId),
                salaId: salaFiltroId && Number(salaFiltroId),
                usuarioId: usuarioFiltroId && Number(usuarioFiltroId),
                status: statusId ? statusId.toString() : '1,2',
                data: getDataFormatadaFiltro(dataStringFiltro),
                texto: texto,
            }

            setRefreshingRequestScroll(true);
            let resultado = await getReservasPorFiltro(filtro);
            if (!resultado.success) {
                resetarPaginacao();
                showNotificacao(resultado.message, 'danger');
                setRefreshingRequestScroll(false);
                return;
            }

            let lista: Reserva[] = resultado.result;

            if (lista && lista.length > 0) {
                lista = [...reservas, ...lista];
                setPagina(_pagina);
                setReservas(lista);
                console.log('listando....');
                lista.forEach(el => {
                    console.log('reserva.id', el.id);
                })
                setPaginacao(novaPaginacao);
            }

            setRefreshingRequestScroll(false);
        }
    }

    async function aplicarFiltroPadrao() {
        let filtro: ReservasFiltro = {
            ...paginacaoInicial,
            empresaId: empresaFiltroId && Number(empresaFiltroId),
            salaId: salaFiltroId && Number(salaFiltroId),
            usuarioId: usuarioFiltroId && Number(usuarioFiltroId),
            status: statusId ? statusId.toString() : '1,2',
            data: getDataFormatadaFiltro(dataStringFiltro),
            texto: texto,
        }

        setPagina(0);
        await buscarPorFiltro(filtro);
    }

    function resetarPaginacao() {
        setPagina(0);
        setPaginacao(paginacaoInicial);
    }

    async function onRefreshStatus() {
        await buscarStatusReservaDaReserva();
    }

    async function buscarStatusReservaDaReserva() {
        setRefreshingStatus(true);
        let resultado: RequestResult<StatusReserva[]> = null;

        resultado = await getTodosStatusReservas();
        if (!resultado.success) {
            setRefreshingStatus(false);
            showNotificacao(resultado.message, 'danger');
            return;
        }

        setStatusReservaSelecionada(resultado.result.filter(e => e.reservaId == reservaSelecionada.id));
        setRefreshingStatus(false);
    }

    async function onPressAcompanhar(reserva: Reserva) {
        setAcompanharShowProgressBar(true);
        let resultadoReserva = await getReservaPorId(reserva.id);
        if (!resultadoReserva.success) {
            setAcompanharShowProgressBar(false);
            showNotificacao(resultadoReserva.message, 'danger');
            return;
        }

        let resultadoStatusReserva = await getStatusDaReserva(reserva.id);
        if (!resultadoStatusReserva.success) {
            setAcompanharShowProgressBar(false);
            showNotificacao(resultadoStatusReserva.message, 'danger');
            return;
        }

        setReservaSelecionada(resultadoReserva.result);
        setStatusReservaSelecionada(resultadoStatusReserva.result);
        setAcompanharShowProgressBar(false);
        openModalStatus();
    }

    async function onPressCancelarOuAtualizar(reservaId: number) {
        let resultadoStatusReserva = await getStatusDaReserva(reservaId);
        if (!resultadoStatusReserva.success) {
            setAcompanharShowProgressBar(false);
            showNotificacao(resultadoStatusReserva.message, 'danger');
            return;
        }

        setStatusReservaSelecionada(resultadoStatusReserva.result);
        setReservaIdDelete(reservaId);
        setDialogVisible(true);
    }

    function podeExcluirCompromisso(): boolean {
        return statusReservaSelecionada.find(e => e.statusId == StatusReservaEnum.Cancelado
            || e.statusId == StatusReservaEnum.Finalizado || e.statusId == StatusReservaEnum.Reprovado) ? true : false;
    }

    async function onPressExcluirCompromisso() {
        setShowProgressBar(true);
        let resultado = await deleteExcluirReserva(reservaIdDelete);
        setShowProgressBar(false);

        if (!resultado.success) {
            setModalLoading(false);
            setShowProgressBar(false);
            showNotificacao(resultado.message, 'danger');
            return;
        }

        showNotificacao(resultado.message, 'danger');
    }

    async function onPressConfirmCancelar(reagendar: boolean) {
        let _statusReserva = statusReservaForm ? statusReservaForm : StatusReservaEnum.Cancelado;
        let labelResult = "Atualizada";

        let novoStatusReserva: StatusReserva = {
            id: 0,
            reservaId: reservaIdDelete,
            statusId: _statusReserva,
        }

        setShowProgressBar(true);
        let resultadoReserva = await getReservaPorId(reservaIdDelete);
        if (!resultadoReserva.success) {
            setModalLoading(false);
            setShowProgressBar(false);
            showNotificacao(resultadoReserva.message, 'danger');
            return;
        }

        if (!resultadoReserva.result) {
            setModalLoading(false);
            setShowProgressBar(false);
            showNotificacao("Reserva não encontrada.", 'danger');
            return;
        }

        if (_statusReserva == StatusReservaEnum.Cancelado) {
            labelResult = "Cancelada";

            let resultadoDisponibilidades = await getDisponibilidadesPorSalaId(resultadoReserva.result.salaId);
            if (!resultadoDisponibilidades.success) {
                setModalLoading(false);
                setShowProgressBar(false);
                showNotificacao(resultadoDisponibilidades.message, 'danger');
                return;
            }

            if (!resultadoDisponibilidades.result || resultadoDisponibilidades.result.length == 0) {
                setModalLoading(false);
                setShowProgressBar(false);
                showNotificacao("Disponibilidade da sala não encontrada.", 'danger');
                return;
            }

            let _reserva = resultadoReserva.result;
            let _disponibilidades = resultadoDisponibilidades.result;
            let _disponibildiadeAgendada = _disponibilidades
                .find(e => e.diaSemanaIndex == _reserva.diaSemanaIndex);

            let dataAtual = getDataAtual();
            let dataLimitePodeCancelar = add(new Date(_reserva.date), { days: -_disponibildiadeAgendada.minDiasCan });

            if (!isBefore(dataAtual, dataLimitePodeCancelar) && _disponibildiadeAgendada.minDiasCan > 0) {
                setModalLoading(false);
                setShowProgressBar(false);
                showNotificacao("Está reserva já não pode mais ser cancelada", 'warning');
                return;
            }
        }
        let resultado = await postAdicionarStatusReserva(novoStatusReserva);
        if (!resultado.success) {
            setModalLoading(false);
            setShowProgressBar(false);
            showNotificacao(resultado.message, 'danger');
            return;
        }

        let reservaEditada = resultadoReserva.result;
        reservaEditada.observacao = motivoCancelamento;
        resultadoReserva = await putEditarReserva(reservaEditada);
        
        if (!resultadoReserva.success) {
            setModalLoading(false);
            setShowProgressBar(false);
            showNotificacao(resultadoReserva.message, 'danger');
            return;
        }
        
        if (_statusReserva != StatusReservaEnum.Confirmado) {
            let filtro: ReservasFiltro = {
                ...paginacaoInicial,
                ...filtroInicial,
                empresaId: resultadoReserva.result.sala.empresaId,
                status: "1,2",
                texto: texto
            }
            let resultadoReservasFiltro = await getReservasPorFiltro(filtro);
            if (!resultadoReservasFiltro.success) {
                resetarPaginacao();
                showNotificacao(resultadoReservasFiltro.message, 'danger');
                return;
            }

            let lista: Reserva[] = resultadoReservasFiltro.result;
            lista = lista.filter(e => e.id != reservaEditada.id);

            if (!lista || lista.length == 0) {
                removeChatMessage(resultadoReserva.result);
            }
        }

        showNotificacao(`Reserva ${labelResult} com sucesso!`, 'success');
        setMotivoCancelamento("");
        setStatusReservaForm(0);
        setShowProgressBar(false);
        setDialogVisible(false);
        limparFiltro();

        if (reagendar) {
            let resultadoSala = await getSalaPorId(resultadoReserva.result.salaId);
            if (!resultadoSala.success) {
                resetarPaginacao();
                showNotificacao(resultadoSala.message, 'danger');
                return;
            }

            if (resultadoSala.result.status == StatusEnum.Ativo) {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            {
                                name: ROUTES.agendamentoMenu,
                                state: {
                                    routes: [
                                        {
                                            name: ROUTES.agendar,
                                            params: {
                                                empresaId: resultadoSala.result.empresaId,
                                                salaId: resultadoSala.result.id
                                            }
                                        }
                                    ]
                                }
                            }
                        ],
                    })
                );
            }
            else {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            { name: ROUTES.agendamentoMenu },
                        ],
                    })
                );
            }
        }
    }

    function closeModalStatus() {
        setModalStatusVisible(false);
        setStatusReservaSelecionada([]);
        setReservaSelecionada(null);
    }

    function filtroVazio(): boolean {
        return (!empresaFiltroId && !statusId && !usuarioFiltroId && !salaFiltroId)
    }

    function getFoto(reserva: Reserva, quemAgendou: boolean) {
        if (usuarioLogado.permissaoId == PermissaoEnum.Administrador || usuarioLogado.permissaoId == PermissaoEnum.Cliente)
            return reserva.empresa.logo;

        return reserva.pessoa.foto;
    }

    function showHeaderContainerStatus() {
        if (!reservaSelecionada)
            return;

        let empresaFoto = reservaSelecionada.empresa.logo;
        let empresaNome = reservaSelecionada.empresa.nome;

        let clienteFoto = reservaSelecionada.pessoa.foto;
        let clienteNome = reservaSelecionada.pessoa.nome;
        let nomeSala = reservaSelecionada.salaNome;

        switch (usuarioLogado.permissaoId) {
            case PermissaoEnum.Administrador:
                return (
                    <View style={styles.modalStatusHeaderContainer}>
                        <View style={styles.modalStatusPhoto}>
                            <Avatar.Image size={60} source={{ uri: `data:image/jpeg;base64,${empresaFoto}` }} />
                        </View>

                        <View style={styles.modalStatusTitleContainer}>
                            <Title>Empresa - {empresaNome}</Title>
                            <Text>Sala - {nomeSala}</Text>
                        </View>
                    </View>
                );
            case PermissaoEnum.Cliente:
                return (
                    <View style={styles.modalStatusHeaderContainer}>
                        <View style={styles.modalStatusPhoto}>
                            <Avatar.Image size={60} source={{ uri: `data:image/jpeg;base64,${empresaFoto}` }} />
                        </View>

                        <View style={styles.modalStatusTitleContainer}>
                            <Title>Empresa - {empresaNome}</Title>
                            <Text>Sala - {nomeSala}</Text>
                        </View>
                    </View>
                );
            default:
                return (
                    <View style={styles.modalStatusHeaderContainer}>
                        <View style={styles.modalStatusPhoto}>
                            <Avatar.Image size={60} source={{ uri: `data:image/jpeg;base64,${clienteFoto}` }} />
                        </View>

                        <View style={styles.modalStatusTitleContainer}>
                            <Title>Cliente - {clienteNome}</Title>
                            <Text>Sala - {nomeSala}</Text>
                        </View>
                    </View>
                );
        }
    }

    function onPressBack() {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: ROUTES.homeMenu },
                ],
            })
        );
    }

    function onPressCloseModalAtualizaStatus() {
        setStatusReservaForm(null);
        setMotivoCancelamento("");
        setDialogVisible(false);
    }

    async function removeChatMessage(item: Reserva) {
        let quemFezAReservaId = 0;

        switch (usuarioLogado.permissaoId) {
            case PermissaoEnum.Cliente:
                quemFezAReservaId = usuarioLogado.id;
                break;
            case PermissaoEnum.Administrador:
                quemFezAReservaId = collegatoChatId;
                break;
            default:
                quemFezAReservaId = tratarIdEmpresaChat(usuarioLogado.empresa.id);
                break;
        }

        let _empresaId = tratarIdEmpresaChat(item.sala.empresaId);

        const referenceChatListOne = ref(chatDatabase, `${chatListRecadosEndPoint}/${quemFezAReservaId}/${_empresaId}`);
        await get(referenceChatListOne).then((snapshot) => {
            let _chatItem: Chat = null;
            if (snapshot != null && snapshot.val() != null) {
                _chatItem = snapshot.val();
                const referenceMessagesOne = ref(chatDatabase, `${messagesRecadosEndPoint}/${_chatItem.salaId}`);
                remove(referenceMessagesOne).then(() =>
                    console.log("referenceMessagesOne Excluido")
                ).catch((error) => console.error(error));
            }
        }).catch((error) => console.error(error));

        remove(referenceChatListOne).then(() =>
            console.log("referenceChatListOne Excluido")
        ).catch((error) => console.error(error));

        const referenceChatListTwo = ref(chatDatabase, `${chatListRecadosEndPoint}/${_empresaId}/${quemFezAReservaId}`);
        remove(referenceChatListTwo).then(() =>
            console.log("referenceChatListTwo Excluido")
        ).catch((error) => console.error(error));

        const referenceUsuariosOne = ref(chatDatabase, `${usuariosRecadosEndPoint}/${_empresaId}`);
        remove(referenceUsuariosOne).then(() =>
            console.log("referenceUsuariosOne Excluido")
        ).catch((error) => console.error(error));

        const referenceUsuariosTwo = ref(chatDatabase, `${usuariosRecadosEndPoint}/${quemFezAReservaId}`);
        remove(referenceUsuariosTwo).then(() =>
            console.log("referenceUsuariosTwo Excluido")
        ).catch((error) => console.error(error));
    }

    function showItem(reserva: Reserva) {
        let _empresa = reserva.empresa;
        let empresaEndereco = `${_empresa.endereco} - ${_empresa.numeroEndereco} - ${_empresa.municipio} - ${_empresa.estado} - ${_empresa.cep} - ${_empresa.pais}`;

        let _pessoa = reserva.pessoa;
        let pessoaEndereco = `${_pessoa.endereco} - ${_pessoa.numero} - ${_pessoa.municipio} - ${_pessoa.estado} - ${_pessoa.cep} - ${_pessoa.pais}`;

        let reservaItem: CompromissoItem = {} as CompromissoItem;
        reservaItem.nomeCliente = _pessoa.nome;
        reservaItem.emailCliente = reserva.usuario.login;
        reservaItem.enderecoCliente = pessoaEndereco;
        reservaItem.telefoneCliente = adicionarMascara(_pessoa.telefone, 'cel-phone');

        reservaItem.nomeEmpresa = _empresa.nome;
        // let emailsResponsaveis = "";
        // reserva.sala.responsavel.forEach((resp, index) => {
        //     if (index == 0) {
        //         emailsResponsaveis += resp.usuario.login;
        //     }
        //     else {
        //         emailsResponsaveis += ` - ${resp.usuario.login}`;
        //     }
        // });
        // reservaItem.emailsResponsaveis = emailsResponsaveis;
        reservaItem.telefoneEmpresa = _empresa.telefone;
        reservaItem.enderecoEmpresa = empresaEndereco;

        switch (usuarioLogado.permissaoId) {
            case PermissaoEnum.Administrador:
                return (
                    <>
                        <List.Item
                            title={reservaItem.nomeCliente}
                            titleNumberOfLines={4}
                            descriptionNumberOfLines={4}
                            description="Cliente"
                            left={props => <List.Icon {...props} style={{ width: 25 }} icon="account-tie" />}
                        />
                        <List.Item
                            title={reservaItem.emailCliente}
                            titleNumberOfLines={4}
                            descriptionNumberOfLines={4}
                            description="E-mail do cliente"
                            left={props => <List.Icon {...props} style={{ width: 25 }} icon="email-check" />}
                        />
                        <List.Item
                            title={reservaItem.telefoneCliente}
                            titleNumberOfLines={4}
                            descriptionNumberOfLines={4}
                            description="Telefone do cliente"
                            left={props => <List.Icon {...props} style={{ width: 25 }} icon="cellphone-check" />}
                        />
                        <List.Item
                            title={reservaItem.enderecoCliente}
                            titleNumberOfLines={4}
                            descriptionNumberOfLines={4}
                            description="Endereço do cliente"
                            left={props => <List.Icon {...props} style={{ width: 25 }} icon="map-marker-multiple" />}
                        />
                        <List.Item
                            title={reservaItem.nomeEmpresa}
                            titleNumberOfLines={4}
                            descriptionNumberOfLines={4}
                            description="Empresa"
                            left={props => <List.Icon {...props} style={{ width: 25 }} icon="account-tie" />}
                        />
                        <List.Item
                            title={reservaItem.telefoneEmpresa}
                            titleNumberOfLines={4}
                            descriptionNumberOfLines={4}
                            description="Telefone da empresa"
                            left={props => <List.Icon {...props} style={{ width: 25 }} icon="cellphone-check" />}
                        />
                        <List.Item
                            title={reservaItem.enderecoEmpresa}
                            titleNumberOfLines={4}
                            descriptionNumberOfLines={4}
                            description="Endereço da empresa"
                            left={props => <List.Icon {...props} style={{ width: 25 }} icon="map-marker-multiple" />}
                        />
                    </>
                )
            case PermissaoEnum.Cliente:
                return (
                    <>
                        <List.Item
                            title={reservaItem.nomeEmpresa}
                            titleNumberOfLines={4}
                            descriptionNumberOfLines={4}
                            description="Empresa"
                            left={props => <List.Icon {...props} style={{ width: 25 }} icon="account-tie" />}
                        />
                        <List.Item
                            title={reservaItem.enderecoEmpresa}
                            titleNumberOfLines={4}
                            descriptionNumberOfLines={4}
                            description="Endereço da empresa"
                            left={props => <List.Icon {...props} style={{ width: 25 }} icon="map-marker-multiple" />}
                        />
                        <List.Item
                            title={reservaItem.telefoneEmpresa}
                            titleNumberOfLines={4}
                            descriptionNumberOfLines={4}
                            description="Telefone da empresa"
                            left={props => <List.Icon {...props} style={{ width: 25 }} icon="cellphone-check" />}
                        />
                    </>
                );
            default:
                return (
                    <>
                        <List.Item
                            title={reservaItem.nomeCliente}
                            titleNumberOfLines={4}
                            descriptionNumberOfLines={4}
                            description="Cliente"
                            left={props => <List.Icon {...props} style={{ width: 25 }} icon="account-tie" />}
                        />
                        <List.Item
                            title={reservaItem.emailCliente}
                            titleNumberOfLines={4}
                            descriptionNumberOfLines={4}
                            description="E-mail do cliente"
                            left={props => <List.Icon {...props} style={{ width: 25 }} icon="email-check" />}
                        />
                        <List.Item
                            title={reservaItem.telefoneCliente}
                            titleNumberOfLines={4}
                            descriptionNumberOfLines={4}
                            description="Telefone do cliente"
                            left={props => <List.Icon {...props} style={{ width: 25 }} icon="cellphone-check" />}
                        />
                        <List.Item
                            title={reservaItem.enderecoCliente}
                            titleNumberOfLines={4}
                            descriptionNumberOfLines={4}
                            description="Endereço do cliente"
                            left={props => <List.Icon {...props} style={{ width: 25 }} icon="map-marker-multiple" />}
                        />
                    </>
                );
        }
    }

    return (
        <View style={[styles.contain]}>
            <SemiHeader goBack={onPressBack} />

            <View style={styles.filterContainer}>
                <Searchbar
                    clearButtonMode='always'
                    iconColor={globalColors.primaryColor}
                    style={styles.searchBar}
                    numberOfLines={3}
                    placeholder="Buscar por nome ou e-mail"
                    onChangeText={setTexto}
                    value={texto}
                />

                <IconButton
                    style={[styles.filterButton, textoNaoEhVazio(texto) && styles.filterButtonWithText, filtroVazio() && styles.filterButtonEmpty]}
                    icon="filter"
                    iconColor={globalColors.primaryColor}
                    size={25}
                    onPress={() => setModalVisible(true)}
                />
            </View>

            {textoNaoEhVazio(texto) && (
                <View style={styles.filterActionsContainer}>
                    <Button
                        mode='contained'
                        style={styles.sendFilterButton}
                        buttonColor={globalColors.primaryColor}
                        onPress={() => aplicarFiltro()}>
                        Pesquisar
                    </Button>
                </View>
            )}

            {showAcompanharProgressBar && (
                <MotiView
                    style={[styles.containProgressBar]}
                    from={{
                        opacity: 0,
                        marginVertical: 0,
                    }}
                    animate={{
                        opacity: 1,
                        marginVertical: 20,
                    }}
                >
                    <LinearProgress color="#52c7e2" />
                </MotiView>
            )}

            {refreshingRequest && (
                <MotiView
                    style={[styles.containProgressBar]}
                    from={{
                        opacity: 0,
                        marginVertical: 0,
                    }}
                    animate={{
                        opacity: 1,
                        marginVertical: 20,
                    }}
                >
                    <LinearProgress color="#52c7e2" />
                </MotiView>
            )}
            
            { reservas.length === 0 && !refreshingRequest ? 
              <View style={[styles.notificacaoAlerta, styles.alertaWarning]}>
                <Text style={styles.notificacaoAlertaText}>Não existem reservas para esse dia/status</Text>
              </View> 
              : null 
            }
            
            <FlatList
                style={styles.itemsContainer}
                data={reservas}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={alterarPaginacao}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}
                    
                renderItem={({ item }) => (
                    <CompromiseCard
                        item={item}
                        permissaoId={usuarioLogado.permissaoId}
                        onPressAcompanhar={onPressAcompanhar}
                        onPressCancelarOuAtualizar={onPressCancelarOuAtualizar}
                    />
                )}
            />
            {refreshingRequestScroll && (
                <MotiView
                    style={[styles.containProgressBar]}
                    from={{
                        opacity: 0,
                        marginVertical: 0,
                    }}
                    animate={{
                        opacity: 1,
                        marginVertical: 20,
                    }}
                >
                    <LinearProgress color="#52c7e2" />
                </MotiView>
            )}

            <Modal
                visible={modalVisible}
                onDismiss={() => setModalVisible(false)}
                contentContainerStyle={styles.modalStyle}>
                <View style={styles.containerModalFilter}>
                    <View style={styles.modalFilterHeader}>
                        <Title>Filtro de pesquisa</Title>
                    </View>

                    <ScrollView style={styles.modalFilterBody}>
                        <DatePickerModalInput
                            label='Escolha uma data'
                            onChange={(date) => {
                                setDataFiltro(date);
                                setDataStringFiltro(getDataLocalZone(date));
                            }}
                        />

                        <Input
                            style={styles.inputs}
                            label="Por Data"
                            typeMask='datetime'
                            keyboardType='number-pad'
                            onChange={setDataStringFiltro}
                            value={dataStringFiltro}
                        />

                        <DropDown
                            style={styles.dropdownFilter}
                            label='Por Status'
                            list={_statusReserva}
                            onChange={setStatusId}
                            value={statusId}
                        />
                    </ScrollView>

                    <View style={styles.modalFilterActions}>
                        <Button
                            mode="text"
                            textColor={MD2Colors.red400}
                            onPress={limparFiltro}
                        >
                            Limpar
                        </Button>
                        <Button
                            mode="text"
                            onPress={aplicarFiltro}
                        >
                            Aplicar
                        </Button>
                    </View>
                </View>
            </Modal>

            <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                <View style={styles.dialogAcoesHeader}>
                    <Dialog.Title>Ações do compromisso</Dialog.Title>
                    <IconButton
                        style={styles.modalStatusButton}
                        icon="close"
                        iconColor={MD2Colors.black}
                        size={25}
                        onPress={() => setDialogVisible(false)}
                    />
                </View>
                {podeExcluirCompromisso() ? (
                    <>
                        <Dialog.Content>
                            <Paragraph>Este compromisso foi cancelado, repovado ou finalizado...</Paragraph>
                        </Dialog.Content>
                        {showProgressBar && (
                            <MotiView
                                style={[styles.containProgressBar]}
                                from={{
                                    opacity: 0,
                                    marginVertical: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                    marginVertical: 20,
                                }}
                            >
                                <LinearProgress color="#52c7e2" />
                            </MotiView>
                        )}
                        <Dialog.Actions style={styles.dialogExcluirAction}>
                            <Button textColor={MD2Colors.red400} onPress={onPressCloseModalAtualizaStatus}>
                                Fechar
                            </Button>
                        </Dialog.Actions>
                    </>
                ) : (
                    <>
                        <Dialog.Content>
                            <Paragraph>Deseja realizar outro agendamento?</Paragraph>

                            {usuarioLogado.permissaoId != PermissaoEnum.Cliente && (
                                <DropDown
                                    style={styles.inputs}
                                    label="Status da reserva"
                                    value={statusReservaForm}
                                    onChange={setStatusReservaForm}
                                    list={getEnumArrayStatusReservaEnum().filter(e => e.value != StatusReservaEnum.AguardandoConfirmacao)}
                                />
                            )}

                            <Input
                                style={styles.inputs}
                                multiline
                                maxLenght={100}
                                onChange={setMotivoCancelamento}
                                value={motivoCancelamento}
                                label="Digite o motivo"
                            />
                        </Dialog.Content>
                        {showProgressBar && (
                            <MotiView
                                style={[styles.containProgressBar]}
                                from={{
                                    opacity: 0,
                                    marginVertical: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                    marginVertical: 20,
                                }}
                            >
                                <LinearProgress color="#52c7e2" />
                            </MotiView>
                        )}
                        <Dialog.Actions style={styles.dialogActions}>
                            {
                                usuarioLogado.permissaoId == PermissaoEnum.Cliente ? (
                                    <>
                                        <Button onPress={() => onPressConfirmCancelar(false)}>
                                            Somente Cancelar
                                        </Button>
                                        <Button
                                            textColor={MD2Colors.green400}
                                            onPress={() => onPressConfirmCancelar(true)}>
                                            Reagendar
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            textColor={MD2Colors.black}
                                            onPress={onPressCloseModalAtualizaStatus}>
                                            Fechar
                                        </Button>

                                        <Button
                                            textColor={MD2Colors.green400}
                                            onPress={() => onPressConfirmCancelar(false)}>
                                            Confirmar
                                        </Button>
                                    </>
                                )
                            }
                        </Dialog.Actions>
                    </>
                )}
            </Dialog>

            {/* Modal de Status */}
            <ModalComponent
                modalOpen={modalStatusVisible}
                styleModal={styles.modalStatusStyle}
                styleContainer={styles.modalStatusContainer}
                onDismiss={closeModalStatus}
                customHeader
                headerContent={(
                    <View style={styles.modalStatusHeader}>
                        {showHeaderContainerStatus()}

                        <IconButton
                            style={styles.modalStatusButton}
                            icon="close"
                            iconColor={MD2Colors.black}
                            size={25}
                            onPress={closeModalStatus}
                        />
                    </View>
                )}
            >
                <>
                    <List.Item
                        titleStyle={styles.statusTitle}
                        descriptionStyle={styles.statusDescription}
                        titleNumberOfLines={10}
                        title={reservaSelecionada && reservaSelecionada.observacao}
                        description="Ultima Observação"
                    />
                    <FlatList
                        contentContainerStyle={{ justifyContent: 'flex-start' }}
                        style={styles.statusContainer}
                        data={statusReservaSelecionada}
                        keyExtractor={item => item.id.toString()}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshingStatus}
                                onRefresh={onRefreshStatus}
                            />}
                        renderItem={({ item }) => (
                            <List.Item
                                titleStyle={styles.statusTitle}
                                descriptionStyle={styles.statusDescription}
                                descriptionNumberOfLines={200}
                                title={getLabelStatusReservaEnum(item.statusId)}
                                left={props => <List.Icon {...props} color={MD2Colors.black} style={{ width: 25 }} icon="checkbox-blank-circle" />}
                            />
                        )}
                    />
                </>

            </ModalComponent>
        </View>
    );
}

export default Compromise;
