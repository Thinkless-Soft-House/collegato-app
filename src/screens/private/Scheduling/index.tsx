import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Modal as ModalNative,
  Linking,
} from "react-native";
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import openMap from "react-native-open-maps";

import SemiHeader from "../../../components/SemiHeader";
import { ModalComponent } from "../../../components/ModalComponent";
import Card from "../../../components/Card";
import {
  Button,
  MD2Colors,
  IconButton,
  Searchbar,
  Title,
  Avatar,
  Modal,
  Divider,
  List,
} from "react-native-paper";

import { getTodasCategoriasEmpresa } from "../../../services/api/categoriaEmpresaServices/getTodasCategoriasEmpresa";
import { getSalasPorEmpresaPaginado } from "../../../services/api/SalaServices/getSalasPorEmpresaPaginado";
import { getEmpresasPorFiltro } from "../../../services/api/empresaServices/getEmpresasPorFiltro";

import { ROUTES } from "../../../routes/config/routesNames";
import { PaginacaoModel } from "../../../models/DTOs/paginacaoModel";
import { AuthContext, ILoginData } from "../../../services/auth";
import {
  NotificacaoContext,
  NotificacaoContextData,
} from "../../../contexts/NotificacaoProvider";
import { SearchDropdownItem } from "../../../models/DTOs/searchDropdownItem";
import { Empresa } from "../../../models/empresa";
import {
  adicionarMascara,
  textoNaoEhVazio,
} from "../../../helpers/formHelpers";
import { Sala } from "../../../models/sala";
import { globalColors } from "../../../global/styleGlobal";

import styles from "./styles";
import { EmpresasFiltro } from "../../../models/DTOs/empresasFiltro";
import { MotiView } from "moti";
import { LinearProgress } from "@rneui/themed";
import SearchDropDown from "../../../components/SearchDropDown";

const categoriasEmpresa = [
  { label: "Categoria A", value: 1 },
  { label: "Categoria B", value: 2 },
  { label: "Categoria C", value: 3 },
];

const paginacaoInicial: PaginacaoModel = {
  orderColumn: "id",
  order: "DESC",
  take: 10,
  skip: 0,
};

const filtroInicial: EmpresasFiltro = {
  order: "DESC",
  possuiSala: true,
};

interface SchedulingParams {
  categoriaId: number;
}

const Scheduling: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const { usuarioLogado, pessoaLogada } = useContext<ILoginData>(AuthContext);
  const { showNotificacao } =
    useContext<NotificacaoContextData>(NotificacaoContext);
  const [params, setParams] = useState<SchedulingParams>();
  const [categoriaFiltro, setCategoriaFiltro] = useState<number>(0);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa>();

  // Dados Filtro
  const [pagina, setPagina] = useState<number>(1);
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
  const [refreshingSalas, setRefreshingSalas] = useState<boolean>(false);
  const [salasEmpresaSelecionada, setSalasEmpresaSelecionada] = useState<
    Sala[]
  >([]);

  // Filtro Form
  const [texto, setTexto] = useState<string>("");
  const [categoriaId, setCategoriaId] = useState<number>(0);

  // Controle Modal Salas
  const [modalRoomVisible, setModalRoomVisible] = useState(false);
  const openModalRoom = () => setModalRoomVisible(true);
  const closeModalRoom = () => setModalRoomVisible(false);

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
    let _categoriaIdParam: number = 0;
    const params = route.params as SchedulingParams;
    if (params) {
      if (params.categoriaId) {
        _categoriaIdParam = params.categoriaId;
        setCategoriaId(params.categoriaId);
      }
    }
  }

  async function buscarCategorias() {
    let resultado = await getTodasCategoriasEmpresa();
    if (!resultado.success) {
      showNotificacao(resultado.message, "danger");
      setCategorias([]);
      return;
    }

    let _categorias: SearchDropdownItem[] = resultado.result.map((item) => {
      return {
        label: item.descricao,
        value: item.id.toString(),
      };
    });
    console.log("categorias", _categorias);
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
    setPagina(0);

    let filtro: EmpresasFiltro = {
      ...filtroInicial,
      ...paginacaoInicial,
      nomeEmpresa: texto,
    };

    setRefreshingRequest(true);
    await buscarPorFiltro(filtro);
    setRefreshingRequest(false);
  }

  async function buscarPorFiltro(filtro: EmpresasFiltro) {
    console.log("filtro", filtro);
    let resultado = await getEmpresasPorFiltro(filtro);
    console.log("resultado", resultado);
    if (!resultado.success) {
      resetarPaginacao();
      showNotificacao(resultado.message, "danger");
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
      };

      let _categoriaIdParam: number = 0;
      const params = route.params as SchedulingParams;
      if (params) {
        if (params.categoriaId) {
          _categoriaIdParam = params.categoriaId;
          setCategoriaId(params.categoriaId);
        }
      }

      let filtro: EmpresasFiltro = {
        ...novaPaginacao,
        categoriaId:
          _categoriaIdParam > 0 ? _categoriaIdParam : Number(categoriaId),
        possuiSala: filtroInicial.possuiSala,
        nomeEmpresa: texto,
      };

      setRefreshingRequestScroll(true);
      let resultado = await getEmpresasPorFiltro(filtro);
      if (!resultado.success) {
        resetarPaginacao();
        showNotificacao(resultado.message, "danger");
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
    let _categoriaIdParam: number = 0;
    const params = route.params as SchedulingParams;
    if (params) {
      if (params.categoriaId) {
        _categoriaIdParam = params.categoriaId;
        setCategoriaId(params.categoriaId);
      }
    }

    let filtro: EmpresasFiltro = {
      ...paginacaoInicial,
      categoriaId:
        _categoriaIdParam > 0 ? _categoriaIdParam : Number(categoriaId),
      possuiSala: filtroInicial.possuiSala,
      nomeEmpresa: texto,
    };

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
        routes: [{ name: ROUTES.homeMenu }],
      })
    );
  }

  async function onRefreshSalas() {
    await buscarSalasDaEmpresa(empresaSelecionada.id);
  }

  async function onHandleSalas(empresa: Empresa) {
    let resultado = await buscarSalasDaEmpresa(empresa.id);
    if (resultado.length == 0) {
      showNotificacao("Está empresa não possui salas disponíveis.", "warning");
      return;
    }

    setSalasEmpresaSelecionada(resultado);
    setEmpresaSelecionada(empresa);
    openModalRoom();
  }

  async function buscarSalasDaEmpresa(empresaId: number): Promise<Sala[]> {
    setRefreshingSalas(true);
    let resultado = await getSalasPorEmpresaPaginado(empresaId, {
      order: "DESC",
    });
    if (!resultado.success) {
      setRefreshingSalas(false);
      showNotificacao(resultado.message, "danger");
      return [];
    }

    setRefreshingSalas(false);
    return resultado.result;
  }

  function onPressAgendar(salaId: number) {
    closeModalRoom();
    navigation.navigate(ROUTES.agendar, {
      empresaId: empresaSelecionada.id,
      salaId: salaId,
    });
  }

  function filtroVazio(): boolean {
    return !categoriaId;
  }

  function getEnderecoCompleto(empresa: Empresa) {
    let empresaEndereco = `${empresa.endereco} - ${empresa.numeroEndereco} - ${empresa.municipio} - ${empresa.estado} - ${empresa.cep} - ${empresa.pais}`;
    return empresaEndereco;
  }

  function showDocument(documento: string) {
    if (!documento) {
      return "-";
    }

    if (documento.length == 11) {
      return adicionarMascara(documento, "cpf");
    }

    return adicionarMascara(documento, "cnpj");
  }

  function onPressTelefone(telefone: string): void {
    Linking.openURL(`tel:${telefone}`);
  }

  function onPressEndereco(endereco: string): void {
    openMap({ query: endereco });
  }

  return (
    <View style={[styles.contain]}>
      <SemiHeader goBack={onPressBack} titulo="Escolha a empresa" />

      <View style={styles.filterContainer}>
        <Searchbar
          clearButtonMode="always"
          iconColor={globalColors.primaryColor}
          style={styles.searchBar}
          placeholder="Buscar"
          onChangeText={setTexto}
          value={texto}
        />

        <IconButton
          style={[
            styles.filterButton,
            textoNaoEhVazio(texto) && styles.filterButtonWithText,
            filtroVazio() && styles.filterButtonEmpty,
          ]}
          icon="filter"
          iconColor={globalColors.primaryColor}
          size={25}
          onPress={() => setModalVisible(true)}
        />
      </View>

      {textoNaoEhVazio(texto) && (
        <View style={styles.filterActionsContainer}>
          <Button
            mode="contained"
            style={styles.sendFilterButton}
            buttonColor={globalColors.primaryColor}
            onPress={() => aplicarFiltro()}
          >
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
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={alterarPaginacao}
        onEndReachedThreshold={0.1}
        renderItem={({ item }) => (
          <>
            <Card
              mainContentStyle={{ marginBottom: 15 }}
              onPress={() => onHandleSalas(item)}
              title={item.nome}
              titleStyle={styles.cartTitleStyle}
              subtitle={item.categoriaNome}
              subtitleStyle={styles.cartTitleStyle}
              contentStyle={styles.cardContentStyle}
              leftStyle={styles.cardLeftStyle}
              left={
                <Avatar.Image
                  size={60}
                  source={{ uri: `data:image/jpeg;base64, ${item.logo}` }}
                />
              }
            >
              <>
                <Divider />
                <View>
                  <List.Item
                    title={adicionarMascara(item.telefone, "cel-phone")}
                    titleNumberOfLines={4}
                    descriptionNumberOfLines={4}
                    onPress={() => onPressTelefone(item.telefone)}
                    description="Telefone"
                    left={(props) => (
                      <List.Icon
                        {...props}
                        style={{ width: 25 }}
                        icon="cellphone-check"
                      />
                    )}
                  />
                  <List.Item
                    title={getEnderecoCompleto(item)}
                    titleNumberOfLines={4}
                    descriptionNumberOfLines={4}
                    onPress={() => onPressEndereco(getEnderecoCompleto(item))}
                    description="Endereço"
                    left={(props) => (
                      <List.Icon
                        {...props}
                        style={{ width: 25 }}
                        icon="map-marker-multiple"
                      />
                    )}
                  />
                  <List.Item
                    title={item.categoriaNome}
                    titleNumberOfLines={4}
                    descriptionNumberOfLines={4}
                    description="Categoria"
                    left={(props) => (
                      <List.Icon
                        {...props}
                        style={{ width: 25 }}
                        icon="account-tie"
                      />
                    )}
                  />
                  <List.Item
                    title={showDocument(item.cpfCnpj)}
                    titleNumberOfLines={4}
                    descriptionNumberOfLines={4}
                    description="CPF/CNPJ"
                    left={(props) => (
                      <List.Icon
                        {...props}
                        style={{ width: 25 }}
                        icon="card-bulleted-outline"
                      />
                    )}
                  />
                </View>
                <View style={styles.cardActionContainer}>
                  <Button
                    style={styles.buttonActionsContainer}
                    mode="contained"
                    onPress={() => onHandleSalas(item)}
                  >
                    Agendar
                  </Button>
                </View>
              </>
            </Card>
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

      <Modal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        contentContainerStyle={styles.modalStyle}
      >
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
          </View>

          <View style={styles.modalFilterActions}>
            <Button mode="text" onPress={limparFiltro}>
              Limpar
            </Button>
            <Button mode="text" onPress={aplicarFiltro}>
              Aplicar
            </Button>
          </View>
        </View>
      </Modal>

      {/* Modal de Salas */}
      {empresaSelecionada && (
        <ModalComponent
          modalOpen={modalRoomVisible}
          styleModal={styles.modalRoomStyle}
          styleContainer={styles.modalRoomContainer}
          onDismiss={closeModalRoom}
          customHeader
          headerContent={
            <View style={styles.modalRoomHeader}>
              <View style={styles.modalRoomPhoto}>
                <Avatar.Image
                  size={60}
                  source={{
                    uri: `data:image/jpeg;base64,${empresaSelecionada.logo}`,
                  }}
                />
              </View>

              <View style={styles.modalRoomTitleContainer}>
                <Title>{empresaSelecionada.nome}</Title>
                <Text>{empresaSelecionada.categoriaNome}</Text>
              </View>
            </View>
          }
          actionsContent={
            <>
              <Button
                mode="text"
                textColor={MD2Colors.red300}
                onPress={closeModalRoom}
              >
                Fechar
              </Button>
            </>
          }
        >
          <FlatList
            style={styles.itemsContainer}
            data={salasEmpresaSelecionada}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshingSalas}
                onRefresh={onRefreshSalas}
              />
            }
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 10,
                  backgroundColor: "#fff",
                  marginVertical: 5,
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {item.nome}
                  </Text>
                  {item.multiplasMarcacoes && (
                    <Text
                      style={{ fontSize: 14, color: "#666", flexWrap: "wrap" }}
                    >
                      Você pode agendar mais de um horário
                    </Text>
                  )}
                </View>
                <Button
                  mode="contained"
                  onPress={() => onPressAgendar(item.id)}
                >
                  Agendar
                </Button>
              </View>
            )}
          />
        </ModalComponent>
      )}

      {/* <ModalNative
                animationType="slide"
                visible={modalLoading}
                onRequestClose={() => setModalLoading(false)}
            >
                <Loading />
            </ModalNative> */}
    </View>
  );
};

export default Scheduling;
