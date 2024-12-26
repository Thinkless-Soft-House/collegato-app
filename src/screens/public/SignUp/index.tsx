import { ScrollView, View, TouchableOpacity, Alert } from "react-native";
import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  CommonActions,
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LinearProgress } from "@rneui/themed";
import * as yup from "yup";
import {
  TextInput,
  Button,
  Avatar,
  List,
  Checkbox,
  Text,
  Title,
  IconButton,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MotiView } from "moti";

import SemiHeader from "../../../components/SemiHeader";
import InputControl from "../../../components/InputControl";
import Header from "../components/Header";

import { signUp } from "../../../services/api/authServices/signUp";
import { getBuscarEnderecoViaCEP } from "../../../services/api/helperServices/getBuscarEnderecoViaCEP";

import {
  removerPontuacaoDocumento,
  validarCNPJ,
  validarCPF,
  validarData,
} from "../../../helpers/formHelpers";
import { AuthContext, ILoginData } from "../../../services/auth";
import { globalColors } from "../../../global/styleGlobal";
import { Usuario } from "../../../models/usuario";
import { Pessoa } from "../../../models/pessoa";
import {
  PermissaoEnum,
  getEnumArrayPermissaoEnum,
} from "../../../models/enums/permissaoEnum";
import {
  NotificacaoContext,
  NotificacaoContextData,
} from "../../../contexts/NotificacaoProvider";
import { ModalComponent } from "../../../components/ModalComponent";
import { EnderecoDTO } from "../../../models/DTOs/EnderecoDTO";
import { PUBLIC_ROUTES } from "../../../routes/config/publicRoutesNames";
import { StatusEnum } from "../../../models/enums/statusEnum";
import { politicaPrivacidade } from "./politicaPrivacidade";
import SearchDropDown from "../../../../src/components/SearchDropDown";
import DropDownControl from "../../../../src/components/DropDownControl";
import { SearchDropdownItem } from "../../../../src/models/DTOs/searchDropdownItem";
import { DropDownItem } from "../../../../src/models/DTOs/dropdownItem";

import styles from "./styles";

interface FormularioObjeto extends Usuario, Pessoa {
  termoAceito: boolean;
  senhaConfirma: string;
}

export interface IRegisterData {
  name: string;
  login: string;
  email: string;
  password: string;
  document: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  username: string;
  phone: string;
  accept_all_terms: boolean;
}

const InitialDataUser: IRegisterData = {
  name: "",
  login: "",
  email: "",
  password: "",
  document: "",
  cep: "",
  state: "",
  city: "",
  neighborhood: "",
  street: "",
  number: "",
  complement: "",
  username: "",
  phone: "",
  accept_all_terms: false,
};

let clienteSchema = yup.object({
  login: yup.string().email("E-mail inválido").required("Campo obrigatório"),
  senha: yup
    .string()
    .required("Campo obrigatório")
    .min(4, "Precisa ter mais que 4 digitos"),
  senhaConfirma: yup
    .string()
    .required("Campo obrigatório")
    .oneOf([yup.ref("senha"), null], "As senhas devem ser iguais"),
  nome: yup.string().required("Campo obrigatório"),
  telefone: yup.string(),
  cpfCnpj: yup.string().required("Campo obrigatório"),
  cep: yup.string(),
  municipio: yup.string(),
  estado: yup.string(),
  pais: yup.string(),
  endereco: yup.string(),
  numero: yup.number(),
  dataNascimento: yup.string(),
});

const SingUp: React.FC = () => {
  const { setUser, setLogado } = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { showNotificacao } =
    useContext<NotificacaoContextData>(NotificacaoContext);
  const screenIsFocused = useIsFocused();

  const [userData, setUserData] = useState<IRegisterData>(InitialDataUser);
  const [screen, setScreen] = useState<number>(0);
  const [hasAddAvatar, setHasAddAvatar] = useState<boolean>(false);
  const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
  const [showProgressBarCep, setShowProgressBarCep] = useState<boolean>(false);
  const [showPdf, setShowPdf] = useState<boolean>(false);

  // FORMULÁRIO CONTROLADO
  const [cep, setCep] = useState<string>("");
  const [fotoBase64, setFotoBase64] = useState<string>("");
  const [permisionPhoto, setPermisionPhoto] = useState<boolean>(false);
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [modalPdfVisible, setModalPdfVisible] = useState<boolean>(false);
  const [editando, setEditando] = useState<boolean>(false);
  const { usuarioLogado, pessoaLogada } = useContext<ILoginData>(AuthContext);

  const _permissoes = getEnumArrayPermissaoEnum().map((item) => {
    return { label: item.descricao, value: item.id };
  });

  const [permissoes, setPermissoes] = useState<DropDownItem[]>(_permissoes);
  const [empresas, setEmpresas] = useState<SearchDropdownItem[]>([]);
  const [permissaoId, setPermissaoId] = useState<number>(0);
  const [empresaId, setEmpresaId] = useState<string>();

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
    resolver: yupResolver(clienteSchema),
  });

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("permisionPhoto").then((data) =>
        setPermisionPhoto(data !== null || data !== "")
      );
    }, [])
  );

  useEffect(() => {
    if (hasAddAvatar) setScreen(screen + 1);
  }, [hasAddAvatar]);

  async function handleAvatar(): Promise<void> {
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
  }

  async function autoCompleteLocation(cep: string) {
    if (cep.length == 9) {
      cep = removerPontuacaoDocumento(cep);
      setShowProgressBarCep(true);

      let resultado = await getBuscarEnderecoViaCEP(cep.toString());
      setShowProgressBarCep(false);

      if (!resultado.success || resultado.result === undefined) {
        showNotificacao("O CEP informado não foi encontrado!", "warning");
        setIsCepVerified(false); // Garante que os campos não sejam exibidos
        return;
      }

      // Verifica os dados retornados e marca como verificado
      verifyLocationData(resultado.result);
      setIsCepVerified(true);
    }
  }

  const feedBackError = (data: any) => {
    Alert.alert("Formulário inválido", "Verifique os dados preenchdios");
  };

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

  async function submitForm(form: FormularioObjeto) {
    if (!validarFormulario(form)) {
      Alert.alert("Formulário inválido", "Verifique os dados preenchdios");
      return;
    }

    let usuario: Usuario = {
      id: 0,
      senha: form.senha,
      login: form.login,
      status: StatusEnum.Ativo,
      permissaoId: PermissaoEnum.Cliente,
      empresaId: 0,
      pessoaId: 0,
    };

    let pessoa: Pessoa = {
      id: 0,
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

    usuario.pessoa = pessoa;

    setShowProgressBar(true);
    let resultado = await signUp(usuario);
    setShowProgressBar(false);

    if (!resultado.success) {
      showNotificacao(resultado.message, "danger");
      return;
    }

    AsyncStorage.setItem("AceptAllTerms", "true");
    showNotificacao(resultado.message, "success");

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: PUBLIC_ROUTES.Login }],
      })
    );
  }

  function closeModalPdf() {
    setModalPdfVisible(false);
  }

  function validarFormulario(form: FormularioObjeto): boolean {
    let formValido = true;

    if (form.dataNascimento && !validarData(form.dataNascimento)) {
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

  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});

  // Função para alternar o estado de uma seção específica
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [sectionId]: !prevState[sectionId],
    }));
  };
  const [isCepVerified, setIsCepVerified] = useState(false);

  function usuarioPrecisaPossuirEmpresa(permissaoId: number): boolean {
    return (
      permissaoId == PermissaoEnum.Empresario ||
      permissaoId == PermissaoEnum.Funcionario
    );
  }

  return (
    <View style={styles.contain}>
      <Header />
      <SemiHeader />

      <ScrollView style={[styles.mtContent]}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => toggleSection("section1")}
        >
          <Text style={styles.headerText}>Dados Pessoais</Text>
          <IconButton
            icon={expandedSections["section1"] ? "chevron-up" : "chevron-down"}
            size={24}
          />
        </TouchableOpacity>
        {expandedSections["section1"] && (
          <View style={styles.section}>
            <InputControl
              style={styles.inputs}
              label="E-mail"
              name="login"
              control={control}
              error={errors.login ? true : false}
              errorText={errors.login?.message}
            />

            {!editando && (
              <>
                <InputControl
                  style={styles.inputs}
                  label="Senha"
                  name="senha"
                  control={control}
                  secureTextEntry={!showPass}
                  error={errors.senha ? true : false}
                  errorText={errors.senha?.message}
                  right={
                    <TextInput.Icon
                      onPress={() => setShowPass(!showPass)}
                      icon={showPass ? "eye-off" : "eye"}
                      forceTextInputFocus={false}
                    />
                  }
                />
                <InputControl
                  style={styles.inputs}
                  label="Confirme a senha"
                  name="senhaConfirma"
                  control={control}
                  secureTextEntry={!showConfirmPass}
                  error={errors.senhaConfirma ? true : false}
                  errorText={errors.senhaConfirma?.message}
                  right={
                    <TextInput.Icon
                      onPress={() => setShowConfirmPass(!showConfirmPass)}
                      icon={showConfirmPass ? "eye-off" : "eye"}
                      forceTextInputFocus={false}
                    />
                  }
                />
              </>
            )}

            {usuarioLogado.permissaoId != PermissaoEnum.Empresario && (
              <DropDownControl
                style={styles.inputs}
                control={control}
                label="Tipo de Usuário"
                name="permissaoId"
                error={errors.permissaoId ? true : false}
                errorText={errors.permissaoId?.message}
                list={permissoes}
                onChangeValue={setPermissaoId}
              />
            )}

            {usuarioPrecisaPossuirEmpresa(permissaoId) &&
              usuarioLogado.permissaoId != PermissaoEnum.Empresario && (
                <SearchDropDown
                  label="Empregado de qual empresa?"
                  style={styles.inputs}
                  value={empresaId}
                  items={empresas}
                  onChange={setEmpresaId}
                  error={errors.empresaId ? true : false}
                  errorText={errors.empresaId?.message}
                />
              )}

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
          </View>
        )}
        <TouchableOpacity
          style={styles.header}
          onPress={() => toggleSection("section2")}
        >
          <Text style={styles.headerText}>Endereço</Text>
          <IconButton
            icon={expandedSections["section2"] ? "chevron-up" : "chevron-down"}
            size={24}
          />
        </TouchableOpacity>
        {expandedSections["section2"] && (
          <View style={styles.section}>
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
            {isCepVerified && (
              <>
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
                  keyboardType="number-pad"
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
              </>
            )}
          </View>
        )}

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

        <View style={styles.condicaoUsoContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setChecked(!checked)}
          >
            <Text style={styles.checkboxLabel}>
              Aceito as condições gerais de uso
            </Text>
            <Checkbox.Android
              color={globalColors.primaryColor}
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                setChecked(!checked);
              }}
            />
          </TouchableOpacity>

          <Button
            icon="book"
            mode="text"
            onPress={() => setModalPdfVisible(true)}
          >
            Ler Condições
          </Button>
        </View>

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
            disabled={!checked}
            buttonColor={globalColors.primaryColor}
            onPress={handleSubmit(submitForm, feedBackError)}
          >
            REGISTRAR
          </Button>
        </View>
      </ScrollView>

      <ModalComponent
        modalOpen={modalPdfVisible}
        styleModal={styles.modalPdfStyle}
        styleContainer={styles.modalPdfContainer}
        onDismiss={closeModalPdf}
        customHeader
        headerContent={
          <View style={styles.modalPdfHeader}>
            <View style={styles.modalPdfTitleContainer}>
              <Title>Política de Privacidade</Title>
            </View>
          </View>
        }
        actionsContent={
          <>
            <Button
              mode="text"
              textColor={globalColors.primaryColor}
              onPress={() => {
                closeModalPdf();
                setChecked(true);
              }}
            >
              Fechar e Aceitar
            </Button>
          </>
        }
      >
        <ScrollView>
          <Text>{politicaPrivacidade}</Text>
        </ScrollView>
      </ModalComponent>
    </View>
  );
};

export default SingUp;
