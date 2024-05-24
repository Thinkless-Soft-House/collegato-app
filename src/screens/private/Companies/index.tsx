import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, View, Modal as ModalNative, RefreshControl } from 'react-native';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
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
} from 'react-native-paper';

import { CompanieCard } from '../../../components/CompanieCard';
import SemiHeader from '../../../components/SemiHeader';

import { getTodasCategoriasEmpresa } from '../../../services/api/categoriaEmpresaServices/getTodasCategoriasEmpresa';
import { deleteExcluirEmpresa } from '../../../services/api/empresaServices/deleteExcluirEmpresa';
import { getEmpresasPorFiltro } from '../../../services/api/empresaServices/getEmpresasPorFiltro';

import styles from './styles';
import { globalColors } from '../../../global/styleGlobal';
import { ROUTES } from '../../../routes/config/routesNames';
import { AuthContext, ILoginData } from '../../../services/auth';
import { PaginacaoModel } from '../../../models/DTOs/paginacaoModel';
import { SearchDropdownItem } from '../../../models/DTOs/searchDropdownItem';
import { Empresa } from '../../../models/empresa';
import { NotificacaoContext, NotificacaoContextData } from '../../../contexts/NotificacaoProvider';
import { adicionarMascara, textoNaoEhVazio } from '../../../helpers/formHelpers';
import { MotiView } from 'moti';
import { LinearProgress } from '@rneui/themed';
import { EmpresasFiltro } from '../../../models/DTOs/empresasFiltro';
import CheckBox from '../../../components/CheckBox';
import SearchDropDown from '../../../components/SearchDropDown';

const paginacaoInicial: PaginacaoModel = {
    orderColumn: 'id',
    order: 'DESC',
    take: 10,
    skip: 0,
}

const filtroInicial: EmpresasFiltro = {
    order: 'DESC',
}

const Companies: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { usuarioLogado, pessoaLogada } = useContext<ILoginData>(AuthContext);
    const { showNotificacao } = useContext<NotificacaoContextData>(NotificacaoContext);

    // Dados Filtro
    const [pagina, setPagina] = useState<number>(0);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [modalLoading, setModalLoading] = useState<boolean>(false);
    const [categorias, setCategorias] = useState<SearchDropdownItem[]>([]);
    const [paginacao, setPaginacao] = useState<PaginacaoModel>(paginacaoInicial);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshingRequest, setRefreshingRequest] = useState(false);
    const [refreshingRequestScroll, setRefreshingRequestScroll] = useState(false);
    const [empresaDelete, setEmpresaDelete] = useState<Empresa>();

    // Filtro Form
    const [texto, setTexto] = useState<string>("");
    const [categoriaId, setCategoriaId] = useState<number>(0);
    const [naoPossuiSala, setNaoPossuiSala] = useState<boolean>(false);

    useFocusEffect(
        useCallback(() => {
            buscarDadosIniciais();
        }, [])
    );

    useEffect(() => {
        if (!textoNaoEhVazio(texto)) {
            onClearTexto();
        }
    }, [texto]);

    async function buscarDadosIniciais() {
        await buscarCategorias();
    }

    async function buscarCategorias() {
        let resultado = await getTodasCategoriasEmpresa();
        if (!resultado.success) {
            showNotificacao(resultado.message, 'danger');
            setCategorias([]);
            return;
        }

        let _categorias: SearchDropdownItem[] = resultado.result.map(item => {
            return {
                label: item.descricao,
                value: item.id.toString(),
            }
        });

        setCategorias(_categorias);
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
        setCategoriaId(null);
        setNaoPossuiSala(false);
        setPagina(0);

        let filtro: EmpresasFiltro = {
            ...filtroInicial,
            ...paginacaoInicial,
            nomeEmpresa: texto,
        }

        setRefreshingRequest(true);
        await buscarPorFiltro(filtro);
        setRefreshingRequest(false);
    }

    async function buscarPorFiltro(filtro: EmpresasFiltro) {
        let resultado = await getEmpresasPorFiltro(filtro);
        if (!resultado.success) {
            resetarPaginacao();
            showNotificacao(resultado.message, 'danger');
            return;
        }

        let lista: Empresa[] = resultado.result;
        setEmpresas(lista);
    }

    async function alterarPaginacao() {
        if (empresas.length >= paginacaoInicial.take) {
            let _pagina = pagina + 1;

            let novaPaginacao: PaginacaoModel = {
                ...paginacao,
                skip: _pagina * paginacao.take,
            }

            let filtro: EmpresasFiltro = {
                ...novaPaginacao,
                categoriaId: Number(categoriaId),
                possuiSala: naoPossuiSala ? false : undefined,
                nomeEmpresa: texto,
            }

            setRefreshingRequestScroll(true);
            let resultado = await getEmpresasPorFiltro(filtro);
            if (!resultado.success) {
                resetarPaginacao();
                showNotificacao(resultado.message, 'danger');
                setRefreshingRequestScroll(false);
                return;
            }

            let lista: Empresa[] = resultado.result;

            if (lista && lista.length > 0) {
                lista = [...empresas, ...lista];
                setPagina(_pagina);
                setEmpresas(lista);
                setPaginacao(novaPaginacao);
            }

            setRefreshingRequestScroll(false);
        }
    }

    async function aplicarFiltroPadrao() {
        let filtro: EmpresasFiltro = {
            ...paginacaoInicial,
            categoriaId: Number(categoriaId),
            possuiSala: naoPossuiSala ? false : undefined,
            nomeEmpresa: texto,
        }

        setPagina(0);
        await buscarPorFiltro(filtro);
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

    function onPresEdit(empresaId: number) {
        navigation.navigate(ROUTES.adicionarEmpresa, { empresaId: empresaId });
    }

    function onPressDelete(empresa: Empresa) {
        setEmpresaDelete(empresa);
        setDialogVisible(true);
    }

    async function onPressConfirmDelete() {
        setShowProgressBar(true);
        let resultado = await deleteExcluirEmpresa(empresaDelete.id);
        setShowProgressBar(false);

        if (!resultado.success) {
            showNotificacao(resultado.message, 'danger');
            return;
        }

        let novaLista = empresas.filter(e => e.id != empresaDelete.id);
        setEmpresas(novaLista);
        showNotificacao(resultado.message, 'success');
        setDialogVisible(false);
    }

    function onPressRoom(empresaId: number) {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: ROUTES.salasMenu,
                        state: {
                            routes: [
                                {
                                    name: ROUTES.salas,
                                    params: {
                                        empresaId: empresaId
                                    }
                                }
                            ]
                        }
                    }
                ],
            })
        );
    }

    function filtroVazio(): boolean {
        return (!categoriaId)
    }

    function showDocument(documento: string) {
        if (!documento) {
            return '-';
        }

        if (documento.length == 11) {
            return adicionarMascara(documento, 'cpf');
        }

        return adicionarMascara(documento, 'cnpj');
    }

    return (
        <View style={[styles.contain]}>
            <SemiHeader goBack={onPressBack}>
                <Button mode="contained" onPress={() => navigation.navigate(ROUTES.adicionarEmpresa)}>
                    Adicionar
                </Button>
            </SemiHeader>

            <View style={styles.filterContainer}>
                <Searchbar
                    clearButtonMode='always'
                    iconColor={globalColors.primaryColor}
                    style={styles.searchBar}
                    placeholder="Buscar"
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
                data={empresas}
                keyExtractor={item => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}
                onEndReached={alterarPaginacao}
                onEndReachedThreshold={0.1}
                renderItem={({ item }) => (
                    <>
                        <CompanieCard
                            item={item}
                            onPressRooms={() => onPressRoom(item.id)}
                            onPressEdit={() => onPresEdit(item.id)}
                            onPressDelete={() => onPressDelete(item)}
                        />
                    </>
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
                <Dialog.Title>Excluindo Empresa - {empresaDelete && empresaDelete.nome}</Dialog.Title>
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
                <Dialog.Content>
                    <Paragraph>Deseja realmente excluir esta empresa?</Paragraph>
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
                            label="Por Categoria"
                            style={styles.dropdownFilter}
                            value={categoriaId}
                            items={categorias}
                            onChange={setCategoriaId}
                        />
                        <CheckBox
                            // style={styles.inputs}
                            changeOnPressLabel
                            containerStyle={styles.checkboxFilterContainer}
                            // labelStyle={styles.checkboxLabel}
                            label='Empresas que não possuem sala?'
                            value={naoPossuiSala}
                            onChange={setNaoPossuiSala}
                        />
                    </View>

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
        </View>
    );
};

export default Companies;
