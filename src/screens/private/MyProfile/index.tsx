import { View, Alert, TouchableOpacity, Modal } from "react-native";
import React, { useCallback, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  CommonActions,
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  List,
  Subheading,
  Dialog,
  Paragraph,
} from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { MotiView } from "moti";
import { LinearProgress } from "@rneui/themed";
import { MD2Colors } from "react-native-paper";

import SemiHeader from "../../../components/SemiHeader";
import InputControl from "../../../components/InputControl";

import { getBuscarEnderecoViaCEP } from "../../../services/api/helperServices/getBuscarEnderecoViaCEP";
import { getUsuarioPorId } from "../../../services/api/usuarioServices/getUsuarioPorId";
import { putEditarPessoa } from "../../../services/api/pessoaServices/putEditarPessoa";
import { putEditarUsuario } from "../../../services/api/usuarioServices/putEditarUsuario";
import { deleteExcluirUsuario } from "../../../services/api/usuarioServices/deleteExcluirUsuario";

import { AuthContext, ILoginData } from "../../../services/auth";
import { Usuario } from "../../../models/usuario";
import { Pessoa } from "../../../models/pessoa";
import { EnderecoDTO } from "../../../models/DTOs/EnderecoDTO";
import {
  NotificacaoContext,
  NotificacaoContextData,
} from "../../../contexts/NotificacaoProvider";
import { globalColors } from "../../../global/styleGlobal";

import styles from "./styles";
import Loading from "../../public/components/Loading";
import {
  adicionarMascara,
  removerPontuacaoDocumento,
  validarCNPJ,
  validarCPF,
  validarData,
} from "../../../helpers/formHelpers";
import { ROUTES } from "../../../routes/config/routesNames";

export interface FormularioObjeto extends Usuario, Pessoa {}

let schema = yup.object({
  nome: yup.string().required("Campo obrigatório"),
  telefone: yup.string().required("Campo obrigatório"),
  cpfCnpj: yup.string().required("Campo obrigatório"),
  cep: yup.string(),
  municipio: yup.string(),
  estado: yup.string(),
  pais: yup.string(),
  endereco: yup.string(),
  numero: yup.string(),
  dataNascimento: yup.string(),
});

const MyProfile: React.FC = () => {
  const {
    dataLoginUser,
    usuarioLogado,
    pessoaLogada,
    setPessoaLogada,
    setUsuarioLogado,
    limparLogin,
  } = useContext<ILoginData>(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const screenIsFocused = useIsFocused();
  const { showNotificacao } =
    useContext<NotificacaoContextData>(NotificacaoContext);

  const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
  const [showDeleteProgressBar, setShowDeleteProgressBar] =
    useState<boolean>(false);
  const [showProgressBarCep, setShowProgressBarCep] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editando, setEditando] = useState<boolean>(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario>();
  const [pessoaEditando, setPessoaEditando] = useState<Pessoa>();
  const [userAvatar, setUserAvatar] = useState<ImagePicker.ImageInfo>();
  const [permisionPhoto, setPermisionPhoto] = useState<boolean>(false);

  // Formulário
  const [fotoBase64, setFotoBase64] = useState<string>("");

  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
    register,
    setError,
    setValue,
    getValues,
  } = useForm<FormularioObjeto>({
    resolver: yupResolver(schema),
  });

  useFocusEffect(
    useCallback(() => {
      buscarDadosIniciais();
    }, [])
  );

  async function buscarDadosIniciais() {
    try {
      console.log("usuarioLogado", usuarioLogado.pessoa.cpfCnpj);
      setModalLoading(true);
      let resultadoUsuario = await getUsuarioPorId(usuarioLogado.id);
      if (!resultadoUsuario.success) {
        setModalLoading(false);
        showNotificacao(resultadoUsuario.message, "danger");
        setUsuarioEditando(null);
        setPessoaEditando(null);
        return;
      }

      setModalLoading(false);
      setPessoaEditando(resultadoUsuario.result.pessoa);
      setUsuarioEditando(resultadoUsuario.result);
    } catch (error) {
    } finally {
      setTimeout(() => {
        setModalLoading(false);
      }, 50);
    }
  }

  function onPressBack() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ROUTES.homeMenu }],
      })
    );
  }

  function onPressEdit() {
    setDefaultValuesUser(usuarioEditando.pessoa);
    setEditando(true);
  }

  const setDefaultValuesUser: Function = (pessoa: Pessoa): void => {
    if (pessoa.telefone)
      setValue("telefone", adicionarMascara(pessoa.telefone, "cel-phone"));

    if (pessoa.cpfCnpj != null && pessoa.cpfCnpj.length <= 11)
      setValue("cpfCnpj", adicionarMascara(pessoa.cpfCnpj, "cpf"));
    else if (pessoa.cpfCnpj != null)
      setValue("cpfCnpj", adicionarMascara(pessoa.cpfCnpj, "cnpj"));

    if (pessoa.cep) setValue("cep", adicionarMascara(pessoa.cep, "zip-code"));

    if (pessoa.numero) setValue("numero", pessoa.numero.toString());

    setValue("nome", pessoa.nome);
    setValue("municipio", pessoa.municipio);
    setValue("estado", pessoa.estado);
    setValue("endereco", pessoa.endereco);
    setValue("pais", pessoa.pais);
    setValue("dataNascimento", pessoa.dataNascimento);
    setFotoBase64(pessoa.foto);
  };

  const feedBackError = (data: any) => {
    Alert.alert("Formulário inválido", "Verifique os dados preenchdios");
  };

  async function submitForm(form: FormularioObjeto) {
    if (!validarFormulario(form)) {
      Alert.alert("Formulário inválido", "Verifique os dados preenchdios");
      return;
    }

    let pessoa: Pessoa = {
      id: pessoaLogada.id,
      nome: form.nome,
      telefone: removerPontuacaoDocumento(form.telefone),
      cpfCnpj: removerPontuacaoDocumento(form.cpfCnpj),
      municipio: form.municipio,
      estado: form.estado,
      pais: form.pais,
      endereco: form.endereco,
      numero: form.numero,
      cep: removerPontuacaoDocumento(form.cep),
      dataNascimento: form.dataNascimento,
      foto: fotoBase64,
    };

    let usuario: Usuario = {
      ...usuarioEditando,
      login: form.login,
    };

    setShowProgressBar(true);
    let resultado = await putEditarPessoa(pessoa);

    if (!resultado.success) {
      setShowProgressBar(false);
      showNotificacao(resultado.message, "danger");
      return;
    }

    setPessoaEditando(resultado.result);
    setPessoaLogada(resultado.result);

    let resultadoUsuario = await putEditarUsuario(usuario);
    if (!resultadoUsuario.success) {
      setShowProgressBar(false);
      showNotificacao(resultado.message, "danger");
      return;
    }

    setUsuarioEditando(resultadoUsuario.result);
    setUsuarioLogado(resultadoUsuario.result);
    setShowProgressBar(false);
    setEditando(false);
  }

  function validarFormulario(form: FormularioObjeto): boolean {
    let formValido = true;

    if (!validarData(form.dataNascimento)) {
      formValido = false;
      setError("dataNascimento", { message: "Data inválida" });
    }

    if (form.cpfCnpj.length == 14) {
      if (!validarCPF(form.cpfCnpj)) {
        formValido = false;
        setError("cpfCnpj", { message: "CPF Inválido" });
      }
    }

    if (form.cpfCnpj.length > 14) {
      if (!validarCNPJ(form.cpfCnpj)) {
        formValido = false;
        setError("cpfCnpj", { message: "CNPJ Inválido" });
      }
    }

    return formValido;
  }

  const checkAndWritePermission: Function = (): string => {
    switch (dataLoginUser.permission) {
      case 0:
        return "Sou usuário (a)";
      case 1:
        return "Sou administrador (a)";
      case 2:
        return "Sou empresa";
      case 3:
        return "Sou funcionário (a)";
      default:
        return "Não indentificado";
    }
  };

  const handleAvatar: Function = async (): Promise<void> => {
    if (permisionPhoto) {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Antes de continuar",
          "Permita que o arquivo busque a foto em sua galeria!"
        );
        return;
      }
      AsyncStorage.setItem("permisionPhoto", "true");
    }
    const picture = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: false,
      quality: 0.1,
    });

    if (picture.cancelled === false) {
      setFotoBase64(picture.base64);
    }
  };

  async function autoCompleteLocation(cep: string) {
    if (cep.length == 9) {
      cep = removerPontuacaoDocumento(cep);
      setShowProgressBarCep(true);
      let resultado = await getBuscarEnderecoViaCEP(cep.toString());
      setShowProgressBarCep(false);

      if (!resultado.success || resultado.result === undefined) {
        showNotificacao("O CEP informado não foi encontrado!", "warning");
        return;
      }

      verifyLocationData(resultado.result);
    }
  }

  const verifyLocationData: Function = (locationData: EnderecoDTO): void => {
    if (
      locationData.logradouro !== undefined &&
      locationData.bairro !== undefined
    ) {
      setValue(
        "endereco",
        `${locationData.logradouro} - ${locationData.bairro}`
      );
    }

    if (
      locationData.localidade !== undefined &&
      locationData.localidade.length > 0
    ) {
      setValue("municipio", locationData.localidade);
    }

    if (locationData.uf !== undefined && locationData.uf.length > 0) {
      setValue("estado", locationData.uf);
    }
  };

  async function onPressConfirmDelete() {
    setShowProgressBar(true);
    let resultado = await deleteExcluirUsuario(usuarioEditando.id);
    setShowProgressBar(false);

    if (!resultado.success) {
      showNotificacao(resultado.message, "danger");
      return;
    }

    setDialogVisible(false);
    AsyncStorage.setItem("Token", "");
    limparLogin();
  }

  return (
    <>
      <SemiHeader goBack={onPressBack} />
      <View style={[styles.contain]}>
        {editando ? (
          <>
            <ScrollView style={styles.formContainer}>
              <View style={styles.photoInput}>
                <List.Item
                  style={styles.photoInputLabelContainer}
                  titleStyle={styles.photoTitle}
                  descriptionStyle={styles.photoDescription}
                  title="Foto de perfil"
                  description="Sua foto é sua vitrine : )"
                />

                <TouchableOpacity
                  style={styles.photoInputAvatarButton}
                  onPress={() => handleAvatar()}
                >
                  {fotoBase64 ? (
                    <Avatar.Image
                      size={100}
                      source={{ uri: `data:image/jpeg;base64,${fotoBase64}` }}
                    />
                  ) : (
                    <Avatar.Icon size={100} icon="camera" />
                  )}
                </TouchableOpacity>
              </View>
              <InputControl
                style={styles.inputs}
                label="Nome"
                name="nome"
                control={control}
                error={errors.nome ? true : false}
                errorText={errors.nome?.message}
              />
              <InputControl
                style={styles.inputs}
                label="CPF ou CNPJ"
                typeMask="document"
                keyboardType="number-pad"
                name="cpfCnpj"
                control={control}
                error={errors.cpfCnpj ? true : false}
                errorText={errors.cpfCnpj?.message}
              />
              <InputControl
                style={styles.inputs}
                label="Data de Nascimento"
                name="dataNascimento"
                typeMask="datetime"
                keyboardType="number-pad"
                control={control}
                error={errors.numero ? true : false}
                errorText={errors.numero?.message}
              />
              <InputControl
                style={styles.inputs}
                label="Telefone"
                name="telefone"
                typeMask="cel-phone"
                keyboardType="number-pad"
                control={control}
                error={errors.telefone ? true : false}
                errorText={errors.telefone?.message}
              />
              <InputControl
                style={styles.inputs}
                label="CEP"
                typeMask="zip-code"
                keyboardType="numeric"
                name="cep"
                onChangeValue={autoCompleteLocation}
                control={control}
                error={errors.cep ? true : false}
                errorText={errors.cep?.message}
              />
              {showProgressBarCep && (
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
              {/* <Button
                                icon="map-marker"
                                mode="text"
                                onPress={() => autoCompleteLocation(getValues('cep'))}
                            >
                                Buscar Endereço por CEP
                            </Button> */}
              <InputControl
                style={styles.inputs}
                label="Município"
                name="municipio"
                control={control}
                error={errors.municipio ? true : false}
                errorText={errors.municipio?.message}
              />
              <InputControl
                style={styles.inputs}
                label="Estado"
                name="estado"
                control={control}
                error={errors.estado ? true : false}
                errorText={errors.estado?.message}
              />
              <InputControl
                style={styles.inputs}
                label="Endereço"
                name="endereco"
                control={control}
                error={errors.endereco ? true : false}
                errorText={errors.endereco?.message}
              />
              <InputControl
                style={styles.inputs}
                label="Número"
                name="numero"
                control={control}
                error={errors.numero ? true : false}
                errorText={errors.numero?.message}
              />
              <InputControl
                style={styles.inputs}
                label="País"
                name="pais"
                control={control}
                error={errors.pais ? true : false}
                errorText={errors.pais?.message}
              />
              <View style={styles.btnsActions}>
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

                <Button
                  mode="contained"
                  contentStyle={styles.btnSendContainer}
                  style={styles.btnSend}
                  buttonColor={globalColors.primaryColor}
                  onPress={handleSubmit(submitForm, feedBackError)}
                >
                  EDITAR
                </Button>
                <Button
                  mode="outlined"
                  contentStyle={styles.btnSendContainer}
                  style={styles.btnSend}
                  textColor={globalColors.secondaryColor}
                  onPress={() => setEditando(false)}
                >
                  CANCELAR
                </Button>
                <Button
                  mode="contained"
                  contentStyle={styles.btnSendContainer}
                  style={styles.btnSend}
                  buttonColor={MD2Colors.red400}
                  onPress={() => setDialogVisible(true)}
                >
                  EXCLUIR CONTA
                </Button>
              </View>
            </ScrollView>
          </>
        ) : (
          <>
            <View style={styles.usuarioFotoContainer}>
              <View style={styles.photoInputAvatarButton}>
                <Avatar.Image
                  size={100}
                  source={{
                    uri: `data:image/jpeg;base64,${pessoaLogada.foto}`,
                  }}
                />
              </View>

              {!editando && (
                <IconButton
                  style={{ position: "absolute", top: 95, left: 200 }}
                  icon="pencil"
                  iconColor={globalColors.primaryColor}
                  size={25}
                  onPress={onPressEdit}
                />
              )}
            </View>
            {usuarioEditando && pessoaEditando && (
              <ScrollView style={styles.usuarioDadosContainer}>
                <List.Item
                  title="E-mail de login"
                  right={(props) => (
                    <Subheading>{usuarioEditando.login}</Subheading>
                  )}
                />
                <Divider />

                <List.Item
                  title="Nome"
                  right={(props) => (
                    <Subheading>{pessoaEditando.nome}</Subheading>
                  )}
                />
                <Divider />

                <List.Item
                  title="Documento"
                  right={(props) => (
                    <Subheading>
                      {adicionarMascara(pessoaEditando.cpfCnpj, "document")}
                    </Subheading>
                  )}
                />
                <Divider />

                <List.Item
                  title="Telefone"
                  right={(props) => (
                    <Subheading>
                      {adicionarMascara(pessoaEditando.telefone, "cel-phone")}
                    </Subheading>
                  )}
                />
                <Divider />

                <List.Item
                  title="Município"
                  right={(props) => (
                    <Subheading>{pessoaEditando.municipio}</Subheading>
                  )}
                />
                <Divider />

                <List.Item
                  title="Estado"
                  right={(props) => (
                    <Subheading>{pessoaEditando.estado}</Subheading>
                  )}
                />

                <List.Item
                  title="Endereço"
                  right={(props) => (
                    <Subheading>{pessoaEditando.endereco}</Subheading>
                  )}
                />

                <List.Item
                  title="Número"
                  right={(props) => (
                    <Subheading>{pessoaEditando.numero}</Subheading>
                  )}
                />

                <List.Item
                  title="País"
                  right={(props) => (
                    <Subheading>{pessoaEditando.pais}</Subheading>
                  )}
                />
              </ScrollView>
            )}
          </>
        )}

        <Modal
          animationType="slide"
          visible={modalLoading}
          onRequestClose={() => setModalLoading(false)}
        >
          <Loading />
        </Modal>

        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>
            Excluindo Conta - {usuarioEditando && usuarioEditando.pessoa.nome}
          </Dialog.Title>
          {showDeleteProgressBar && (
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
            <Paragraph>
              Deseja realmente excluir sua conta? Todas os agendamentos e
              informações relacionados a sua conta serão excluidos!
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button onPress={() => setDialogVisible(false)}>Não</Button>
            <Button textColor={MD2Colors.red500} onPress={onPressConfirmDelete}>
              Sim
            </Button>
          </Dialog.Actions>
        </Dialog>
      </View>
    </>
  );
};

export default MyProfile;
