import {
  View,
  FlatList,
  Modal as ModalNative,
  RefreshControl,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import {
  Button,
  MD2Colors,
  Dialog,
  IconButton,
  Modal,
  Paragraph,
  Searchbar,
  Title,
} from "react-native-paper";
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { globalColors } from "../../../global/styleGlobal";
import { ROUTES } from "../../../routes/config/routesNames";
import { ItemUser } from "./components/ItemUser";

import { getUsuariosPorFiltro } from "../../../services/api/usuarioServices/getUsuariosPorFiltro";
import { getTodasEmpresas } from "../../../services/api/empresaServices/getTodasEmpresas";
import { getTodasPermissoes } from "../../../services/api/permissaoServices/getTodasPermissoes";
import { deleteExcluirUsuario } from "../../../services/api/usuarioServices/deleteExcluirUsuario";

import styles from "./styles";
import SemiHeader from "../../../components/SemiHeader";
import SearchDropDown from "../../../components/SearchDropDown";
import { PaginacaoModel } from "../../../models/DTOs/paginacaoModel";
import { Usuario } from "../../../models/usuario";
import { SearchDropdownItem } from "../../../models/DTOs/searchDropdownItem";
import {
  NotificacaoContext,
  NotificacaoContextData,
} from "../../../contexts/NotificacaoProvider";
import { AuthContext, ILoginData } from "../../../services/auth";
import {
  PermissaoEnum,
  getLabelPermissaoEnum,
} from "../../../models/enums/permissaoEnum";
import { MotiView } from "moti";
import { LinearProgress } from "@rneui/themed";
import { UsuariosFiltro } from "../../../models/DTOs/usuariosFiltro";
import { textoNaoEhVazio } from "../../../helpers/formHelpers";

const _empresas = [
  { label: "Empresa A", value: "1" },
  { label: "Empresa B", value: "2" },
  { label: "Empresa C", value: "3" },
  { label: "Empresa D", value: "4" },
  { label: "Empresa E", value: "5" },
  { label: "Empresa F", value: "6" },
  { label: "Empresa G", value: "7" },
  { label: "Empresa H", value: "8" },
  { label: "Empresa I", value: "9" },
];

const paginacaoInicial: PaginacaoModel = {
  orderColumn: "id",
  order: "DESC",
  take: 10,
  skip: 0,
};

const filtroInicial: UsuariosFiltro = {
  order: "DESC",
};

interface UsersParams {
  empresaId: number;
}

const Users: React.FC = () => {
  const { usuarioLogado, pessoaLogada } = useContext<ILoginData>(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { showNotificacao } =
    useContext<NotificacaoContextData>(NotificacaoContext);
  const flatListRef = useRef<any>();
  const route = useRoute();
  const [pagina, setPagina] = useState<number>(0);
  const [skip, setSkip] = useState<number>(paginacaoInicial.skip);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [empresas, setEmpresas] = useState<SearchDropdownItem[]>([]);
  const [permissoes, setPermissoes] = useState<SearchDropdownItem[]>([]);
  const [paginacao, setPaginacao] = useState<PaginacaoModel>(paginacaoInicial);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshingRequest, setRefreshingRequest] = useState(false);
  const [refreshingRequestScroll, setRefreshingRequestScroll] = useState(false);
  const [usuarioDelete, setUsuarioDelete] = useState<Usuario>();

  // Filtro Form
  const [texto, setTexto] = useState<string>("");
  const [empresaId, setEmpresaId] = useState<string>("");
  const [permissaoId, setPermissaoId] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      if (usuarioLogado.permissaoId != PermissaoEnum.Administrador) {
        setEmpresaId(usuarioLogado.empresaId.toString());
      }
      buscarDadosIniciais();
    }, [])
  );

  useEffect(() => {
    if (!textoNaoEhVazio(texto)) {
      onClearTexto();
    }
  }, [texto]);

  async function buscarDadosIniciais() {
    await buscarEmpresas();
    await buscarPermissoes();
  }

  async function buscarEmpresas() {
    let resultado = await getTodasEmpresas();
    if (!resultado.success) {
      showNotificacao(resultado.message, "danger");
      setEmpresas([]);
      return;
    }

    let novaLista: SearchDropdownItem[] = resultado.result.map((item) => {
      return {
        label: item.nome,
        value: item.id.toString(),
      };
    });

    setEmpresas(novaLista);
  }

  async function buscarPermissoes() {
    let resultado = await getTodasPermissoes();
    if (!resultado.success) {
      showNotificacao(resultado.message, "danger");
      setPermissoes([]);
      return;
    }

    let novaLista: SearchDropdownItem[] = resultado.result.map((item) => {
      return {
        label: item.descricao,
        value: item.id.toString(),
      };
    });

    if (usuarioLogado.permissaoId != PermissaoEnum.Administrador)
      novaLista = novaLista.filter(
        (e) => e.value != PermissaoEnum.Administrador.toString()
      );

    setPermissoes(novaLista);
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
    setPermissaoId(null);
    setPagina(0);

    let filtro: UsuariosFiltro = {
      ...filtroInicial,
      ...paginacaoInicial,
      login: texto,
      nome: texto,
    };

    setRefreshingRequest(true);
    await buscarPorFiltro(filtro);
    setRefreshingRequest(false);
  }

  async function aplicarFiltroPadrao() {
    let _empresaId =
      usuarioLogado.permissaoId != PermissaoEnum.Administrador
        ? usuarioLogado.empresaId
        : empresaId;

    let filtro: UsuariosFiltro = {
      ...paginacaoInicial,
      empresaId: Number(_empresaId),
      permissaoId: Number(permissaoId),
      login: texto,
      nome: texto,
    };

    setPagina(0);
    await buscarPorFiltro(filtro);
  }

  async function buscarPorFiltro(filtro: UsuariosFiltro) {
    let lista: Usuario[] = [];

    let resultado = await getUsuariosPorFiltro(filtro);
    if (!resultado.success) {
      resetarPaginacao();
      showNotificacao(resultado.message, "danger");
      return;
    }

    lista = resultado.result.filter((e) => e.id != usuarioLogado.id);
    let novaLista = lista;
    setUsuarios(novaLista);
  }

  async function alterarPaginacao() {
    if (usuarios.length >= paginacaoInicial.take) {
      let _pagina = pagina + 1;

      let novaPaginacao: PaginacaoModel = {
        ...paginacao,
        skip: _pagina * paginacao.take,
      };

      let filtro: UsuariosFiltro = {
        ...novaPaginacao,
        empresaId: Number(empresaId),
        permissaoId: Number(permissaoId),
        login: texto,
        nome: texto,
      };

      let lista: Usuario[] = [];

      setRefreshingRequestScroll(true);
      let resultado = await getUsuariosPorFiltro(filtro);
      if (!resultado.success) {
        resetarPaginacao();
        showNotificacao(resultado.message, "danger");
        setRefreshingRequestScroll(false);
        return;
      }

      lista = resultado.result.filter((e) => e.id != usuarioLogado.id);
      let novaLista: Usuario[] = [];

      if (lista && lista.length > 0) {
        novaLista = [...usuarios, ...lista];
        setPagina(_pagina);
        setUsuarios(novaLista);
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
        routes: [{ name: ROUTES.homeMenu }],
      })
    );
  }

  function onPresEdit(usuarioId: number) {
    navigation.navigate(ROUTES.adicionarUsuario, { usuarioId: usuarioId });
  }

  function onPressDelete(usuario: Usuario) {
    setUsuarioDelete(usuario);
    setDialogVisible(true);
  }

  async function onPressConfirmDelete() {
    setShowProgressBar(true);
    let resultado = await deleteExcluirUsuario(usuarioDelete.id);
    setShowProgressBar(false);

    if (!resultado.success) {
      showNotificacao(resultado.message, "danger");
      return;
    }

    let novaLista = usuarios.filter((e) => e.id != usuarioDelete.id);
    setUsuarios(novaLista);
    showNotificacao(resultado.message, "success");
    setDialogVisible(false);
  }

  return (
    <View style={[styles.contain]}>
      <SemiHeader goBack={onPressBack}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate(ROUTES.adicionarUsuario)}
        >
          Adicionar
        </Button>
      </SemiHeader>

      <View style={styles.filterContainer}>
        <Searchbar
          onTouchCancel={() => onClearTexto()}
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
            !empresaId && styles.filterButtonEmpty,
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
        ref={flatListRef}
        style={styles.itemsContainer}
        data={usuarios}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item) => item.id.toString()}
        onEndReached={alterarPaginacao}
        onEndReachedThreshold={0.1}
        renderItem={({ item }) => (
          <ItemUser
            userName={item.pessoa.nome}
            userEmail={item.login}
            userEmpresa={item.empresa ? item.empresa.nome : null}
            userPermission={getLabelPermissaoEnum(item.permissaoId)}
            userImage={item.pessoa.foto}
            onPressDelete={() => onPressDelete(item)}
            onPressEdit={() => onPresEdit(item.id)}
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

      <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
        <Dialog.Title>
          Excluindo o usuário - {usuarioDelete && usuarioDelete.pessoa.nome}
        </Dialog.Title>
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
          <Paragraph>Deseja realmente excluir este usuário?</Paragraph>
        </Dialog.Content>
        <Dialog.Actions style={styles.dialogActions}>
          <Button onPress={() => setDialogVisible(false)}>Não</Button>
          <Button textColor={MD2Colors.red500} onPress={onPressConfirmDelete}>
            Sim
          </Button>
        </Dialog.Actions>
      </Dialog>

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
            {usuarioLogado.permissaoId == PermissaoEnum.Administrador && (
              <SearchDropDown
                style={styles.dropdownFilter}
                value={empresaId}
                items={empresas}
                onChange={setEmpresaId}
                label="Por Empresa"
              />
            )}

            <SearchDropDown
              style={styles.dropdownFilter}
              value={permissaoId}
              items={permissoes}
              onChange={setPermissaoId}
              label="Por Tipo"
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
            <Button mode="text" onPress={aplicarFiltro}>
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

export default Users;
