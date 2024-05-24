import React, { useState, useCallback, useEffect, useContext } from 'react';
import { FlatList, RefreshControl, View, Modal as ModalNative } from 'react-native';
import { useFocusEffect, useNavigation, useIsFocused, useRoute, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
    Button,
    MD2Colors,
    Dialog,
    IconButton,
    Paragraph,
    Searchbar,
    Modal,
    Title,
    List,
    Divider,
} from 'react-native-paper';
import Card from '../../../components/Card';
import SemiHeader from '../../../components/SemiHeader';
import MenuRoom from './components/MenuRoom';
import { ROUTES } from '../../../routes/config/routesNames';

import styles from './styles';
import { globalColors } from '../../../global/styleGlobal';
import SearchDropDown from '../../../components/SearchDropDown';

import { getSalasPorFiltro } from '../../../services/api/SalaServices/getSalasPorFiltro';
import { getTodasEmpresas } from '../../../services/api/empresaServices/getTodasEmpresas';
import { deleteExcluirSala } from '../../../services/api/SalaServices/deleteExcluirSala';

import { AuthContext, ILoginData } from '../../../services/auth';
import { NotificacaoContext, NotificacaoContextData } from '../../../contexts/NotificacaoProvider';
import { PermissaoEnum } from '../../../models/enums/permissaoEnum';
import { SearchDropdownItem } from '../../../models/DTOs/searchDropdownItem';
import { PaginacaoModel } from '../../../models/DTOs/paginacaoModel';
import { Sala } from '../../../models/sala';
import { RequestResult } from '../../../models/DTOs/requestResult';
import { EmpresasFiltro } from '../../../models/DTOs/empresasFiltro';
import { SalasFiltro } from '../../../models/DTOs/salasFiltro';
import { textoNaoEhVazio } from '../../../helpers/formHelpers';
import { MotiView } from 'moti';
import { LinearProgress } from '@rneui/themed';
import { StatusEnum, getLabelStatusEnum } from '../../../models/enums/statusEnum';

const paginacaoInicial: PaginacaoModel = {
    orderColumn: 'id',
    order: 'DESC',
    take: 10,
    skip: 0,
}

const filtroInicial: EmpresasFiltro = {
    order: 'DESC',
}

interface RoomsParams {
    empresaId: number;
}

const Rooms: React.FC = (props: any) => {
    const { usuarioLogado, pessoaLogada } = useContext<ILoginData>(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { showNotificacao } = useContext<NotificacaoContextData>(NotificacaoContext);
    const route = useRoute();
    const screenIsFocused = useIsFocused();

    // Dados Filtro
    const [pagina, setPagina] = useState<number>(0);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [modalLoading, setModalLoading] = useState<boolean>(false);
    const [empresas, setEmpresas] = useState<SearchDropdownItem[]>([]);
    const [paginacao, setPaginacao] = useState<PaginacaoModel>(paginacaoInicial);
    const [salas, setSalas] = useState<Sala[]>([]);
    const [filtro, setFiltro] = useState<string>("");
    const [modalVisible, setModalVisible] = useState(false);
    const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshingRequest, setRefreshingRequest] = useState(false);
    const [refreshingRequestScroll, setRefreshingRequestScroll] = useState(false);
    const [salaDelete, setSalaDelete] = useState<Sala>();

    // Filtro Form
    const [texto, setTexto] = useState<string>("");
    const [empresaId, setEmpresaId] = useState<string>("");

    useFocusEffect(
        useCallback(() => {
            if (usuarioLogado.permissaoId != PermissaoEnum.Administrador) {
                setEmpresaId(usuarioLogado.empresaId.toString());
            }
            else {
                const params = route.params as RoomsParams;
                if (params) {
                    if (params.empresaId) {
                        setEmpresaId(params.empresaId.toString());
                    }
                }
            }

            buscarDadosIniciais();
        }, [props.route.params])
    );

    useEffect(() => {
        if (!textoNaoEhVazio(texto)) {
            onClearTexto();
        }
    }, [texto]);

    async function buscarDadosIniciais() {
        await buscarEmpresas();
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
        setRefreshingRequest(true);
        await aplicarFiltroPadrao();
        setRefreshingRequest(false);
    }

    async function limparFiltro() {
        setModalVisible(false);
        setEmpresaId(null);
        setPagina(0);

        let filtro: SalasFiltro = {
            ...filtroInicial,
            ...paginacaoInicial,
            nomeSala: texto,
        }

        setRefreshingRequest(true);
        await buscarPorFiltro(filtro);
        setRefreshingRequest(false);
    }

    async function aplicarFiltroPadrao() {
        let _empresaId = usuarioLogado.permissaoId != PermissaoEnum.Administrador ? usuarioLogado.empresaId : empresaId;

        const params = route.params as RoomsParams;
        if (params) {
            if (params.empresaId > 0) {
                _empresaId = params.empresaId;
            }
        }

        let filtro: SalasFiltro = {
            ...paginacaoInicial,
            empresaId: Number(_empresaId),
            nomeSala: texto,
        }

        setPagina(0);
        await buscarPorFiltro(filtro);
    }

    async function buscarPorFiltro(filtro: SalasFiltro) {
        let resultado = await getSalasPorFiltro(filtro);
        if (!resultado.success) {
            resetarPaginacao();
            showNotificacao(resultado.message, 'danger');
            return;
        }

        let lista: Sala[] = resultado.result;
        setSalas(lista);
    }

    async function alterarPaginacao() {
        if (empresas.length >= paginacaoInicial.take) {
            let _pagina = pagina + 1;

            let novaPaginacao: PaginacaoModel = {
                ...paginacao,
                skip: _pagina * paginacao.take,
            }

            let _empresaIdParam: number = 0;
            const params = route.params as RoomsParams;
            if (params) {
                if (params.empresaId) {
                    _empresaIdParam = params.empresaId;
                    setEmpresaId(params.empresaId.toString());
                }
            }

            let filtro: SalasFiltro = {
                ...novaPaginacao,
                empresaId: _empresaIdParam > 0 ? _empresaIdParam : Number(empresaId),
                nomeSala: texto,
            }

            setRefreshingRequestScroll(true);
            let resultado = await getSalasPorFiltro(filtro);
            if (!resultado.success) {
                resetarPaginacao();
                showNotificacao(resultado.message, 'danger');
                setRefreshingRequestScroll(false);
                return;
            }

            let lista: Sala[] = resultado.result;

            if (lista && lista.length > 0) {
                lista = [...salas, ...lista];
                setPagina(_pagina);
                setSalas(lista);
                setPaginacao(novaPaginacao);
            }

            setRefreshingRequestScroll(false);
        }
    }

    function resetarPaginacao() {
        setPagina(0);
        setPaginacao(paginacaoInicial);
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

    function onPresEdit(salaId: number) {
        navigation.navigate(ROUTES.adicionarSala, { salaId: salaId });
    }

    function onPressDelete(sala: Sala) {
        setSalaDelete(sala);
        setDialogVisible(true);
    }

    function onPressCompromise(salaId: number) {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: ROUTES.compromisso, params: { salaId: salaId } },
                ],
            })
        );
    }

    async function onPressConfirmDelete() {
        setShowProgressBar(true);
        let resultado = await deleteExcluirSala(salaDelete.id);
        setShowProgressBar(false);

        if (!resultado.success) {
            showNotificacao(resultado.message, 'danger');
            return;
        }

        let novaLista = salas.filter(e => e.id != salaDelete.id);
        setSalas(novaLista);
        showNotificacao(resultado.message, 'success');
        setDialogVisible(false);
    }

    return (
        <View style={[styles.contain]}>
            <SemiHeader goBack={onPressBack}>
                <Button mode="contained" onPress={() => navigation.navigate(ROUTES.adicionarSala, { teste: "Vim do parametro" })}>
                    Adicionar
                </Button>
            </SemiHeader>

            <View style={styles.filterContainer}>
                <Searchbar
                    clearButtonMode='always'
                    iconColor={globalColors.primaryColor}
                    style={styles.searchBar}
                    placeholder="Buscar"
                    onChangeText={setFiltro}
                    value={filtro}
                />

                {usuarioLogado.permissaoId == PermissaoEnum.Administrador && (
                    <IconButton
                        style={[styles.filterButton, textoNaoEhVazio(texto) && styles.filterButtonWithText, !empresaId && styles.filterButtonEmpty]}
                        icon="filter"
                        iconColor={globalColors.primaryColor}
                        size={25}
                        onPress={() => setModalVisible(true)}
                    />
                )}
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

            <FlatList
                style={styles.itemsContainer}
                data={salas}
                keyExtractor={item => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}
                onEndReached={alterarPaginacao}
                onEndReachedThreshold={0.3}
                renderItem={({ item }) => (
                    <Card
                        mainContentStyle={{ marginBottom: 15 }}
                        onPress={() => onPresEdit(item.id)}
                        title={item.nome}
                        titleStyle={styles.cartTitleStyle}
                        subtitle={getLabelStatusEnum(item.status)}
                        subtitleStyle={styles.cartTitleStyle}
                        contentStyle={styles.cardContentStyle}
                        right={(
                            <MenuRoom
                                onPressCompromissos={() => onPressCompromise(item.id)}
                                onPressEdit={() => onPresEdit(item.id)}
                                onPressDelete={() => onPressDelete(item)}
                            />
                        )}
                    >
                        <>
                            <Divider />
                            <View>
                                <List.Item
                                    title={item.multiplasMarcacoes ? "SIM" : "NÃO"}
                                    titleNumberOfLines={4}
                                    descriptionNumberOfLines={4}
                                    description="Multiplas Marcações?"
                                    left={props => <List.Icon {...props} style={{ width: 25 }} icon="checkbox-multiple-marked-outline" />}
                                />
                            </View>
                        </>
                    </Card>
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

            <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                <Dialog.Title>Excluindo Sala - {salaDelete && salaDelete.nome}</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>Deseja realmente excluir esta sala?</Paragraph>
                </Dialog.Content>
                <Dialog.Actions style={styles.dialogActions}>
                    <Button onPress={() => setDialogVisible(false)}>Não</Button>
                    <Button textColor={MD2Colors.red500} onPress={onPressConfirmDelete}>Sim</Button>
                </Dialog.Actions>
            </Dialog>

            <Modal
                visible={modalVisible}
                onDismiss={() => setModalVisible(false)}
                contentContainerStyle={styles.modalStyle}>
                <View style={styles.containerModalFilter}>
                    <View style={styles.modalFilterHeader}>
                        <Title>Filtro de pesquisa</Title>
                    </View>

                    <View style={styles.modalFilterBody}>
                        <SearchDropDown
                            style={styles.dropdownFilter}
                            label="Por Empresa"
                            value={empresaId}
                            items={empresas}
                            onChange={setEmpresaId}
                        />
                    </View>

                    <View style={styles.modalFilterActions}>
                        <Button
                            mode="text"
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
            {/*
            <ModalNative
                animationType="slide"
                visible={modalLoading}
                onRequestClose={() => setModalLoading(false)}
            >
                <Loading />
            </ModalNative> */}
        </View>
    );
};

export default Rooms;
