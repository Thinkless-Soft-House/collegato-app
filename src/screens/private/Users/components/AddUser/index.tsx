import React, { useState, useContext, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { View, ScrollView, Alert, Modal } from "react-native";
import { TextInput, Button } from "react-native-paper";
import SemiHeader from "../../../../../components/SemiHeader";
import { globalColors } from "../../../../../global/styleGlobal";
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MotiView } from "moti";
import { LinearProgress } from "@rneui/themed";

import InputControl from "../../../../../components/InputControl";
import DropDownControl from "../../../../../components/DropDownControl";

import { postAdicionarUsuario } from "../../../../../services/api/usuarioServices/postAdicionarUsuario";
import { getTodasEmpresas } from "../../../../../services/api/empresaServices/getTodasEmpresas";
import { getUsuarioPorId } from "../../../../../services/api/usuarioServices/getUsuarioPorId";
import { putEditarPessoa } from "../../../../../services/api/pessoaServices/putEditarPessoa";
import { putEditarUsuario } from "../../../../../services/api/usuarioServices/putEditarUsuario";

import SearchDropDown from "../../../../../components/SearchDropDown";
import { Pessoa } from "../../../../../models/pessoa";
import { getBuscarEnderecoViaCEP } from "../../../../../services/api/helperServices/getBuscarEnderecoViaCEP";
import {
  NotificacaoContext,
  NotificacaoContextData,
} from "../../../../../contexts/NotificacaoProvider";
import { ROUTES } from "../../../../../routes/config/routesNames";
import {
  adicionarMascara,
  removerPontuacaoDocumento,
  validarCNPJ,
  validarCPF,
  validarData,
} from "../../../../../helpers/formHelpers";
import {
  PermissaoEnum,
  getEnumArrayPermissaoEnum,
} from "../../../../../models/enums/permissaoEnum";
import { Usuario } from "../../../../../models/usuario";
import { EnderecoDTO } from "../../../../../models/DTOs/EnderecoDTO";
import { SearchDropdownItem } from "../../../../../models/DTOs/searchDropdownItem";

import styles from "./styles";
import { AuthContext, ILoginData } from "../../../../../services/auth";
import { DropDownItem } from "../../../../../models/DTOs/dropdownItem";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";

interface FormularioObjeto extends Usuario, Pessoa {
  senhaConfirma: string;
}

export interface IMessageError {
  error?: string;
  message?: string;
}

let clienteSchema = yup.object({
  nome: yup.string().required("Campo obrigatório"),
  telefone: yup.string().required("Campo obrigatório"),
  cpfCnpj: yup.string().required("Campo obrigatório"),
  cep: yup.string(),
  municipio: yup.string(),
  estado: yup.string(),
  pais: yup.string(),
  endereco: yup.string(),
  numero: yup.number(),
  dataNascimento: yup.string(),
});

let funcionarioSchema = yup.object({
  nome: yup.string().required("Campo obrigatório"),
  telefone: yup.string().required("Campo obrigatório"),
  cpfCnpj: yup.string().required("Campo obrigatório"),
  cep: yup.string(),
  municipio: yup.string(),
  estado: yup.string(),
  pais: yup.string(),
  endereco: yup.string(),
  numero: yup.number(),
  dataNascimento: yup.string(),
});

let usuarioSchema = yup.object({
  login: yup.string().email("Email inválido").required("Campo obrigatório"),
  senha: yup
    .string()
    .required("Campo obrigatório")
    .min(4, "Precisa ter mais que 4 digitos"),
  senhaConfirma: yup
    .string()
    .oneOf([yup.ref("senha"), null], "As senhas devem ser iguais"),
  permissaoId: yup.number().required("Campo obrigatório"),
});

const _permissoes = getEnumArrayPermissaoEnum().map((item) => {
  return { label: item.descricao, value: item.id };
});

interface AddUserParams {
  usuarioId: number;
}

const AddUser: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const { usuarioLogado, pessoaLogada } = useContext<ILoginData>(AuthContext);
  const { showNotificacao } =
    useContext<NotificacaoContextData>(NotificacaoContext);
  const [params, setParams] = useState<AddUserParams>();
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [editando, setEditando] = useState<boolean>(false);
  const [pessoaEditando, setPessoaEditando] = useState<Pessoa>();
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario>();
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
  const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
  const [showProgressBarCep, setShowProgressBarCep] = useState<boolean>(false);

  // FORMULÁRIO
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
    resolver: yupResolver(getSchema(permissaoId)),
  });

  useFocusEffect(
    useCallback(() => {
      buscarDadosIniciais();
    }, [])
  );

  function getSchema(permissaoId: number) {
    switch (permissaoId) {
      case PermissaoEnum.Cliente:
        return usuarioSchema.concat(clienteSchema);
      case PermissaoEnum.Funcionario:
        return usuarioSchema.concat(funcionarioSchema);
      default:
        return usuarioSchema;
    }
  }

  async function buscarDadosIniciais() {
    try {
      setModalLoading(true);
      await buscarEmpresas();

      const params = route.params as AddUserParams;
      if (params) {
        setParams(params);
        if (params.usuarioId) {
          await buscarUsuario(params.usuarioId);
          setEditando(true);
        } else {
          setEditando(false);
        }
      } else {
        setParams(null);
        setEditando(false);
      }

      if (usuarioLogado.permissaoId != PermissaoEnum.Administrador) {
        setPermissoes(
          permissoes.filter((e) => e.value == PermissaoEnum.Funcionario)
        );
      }

      preencherDadosIniciaisEmpresario();

      setModalLoading(false);
    } catch (error) {
    } finally {
      setTimeout(() => {
        setModalLoading(false);
      }, 50);
    }
  }

  function preencherDadosIniciaisEmpresario() {
    if (usuarioLogado.permissaoId == PermissaoEnum.Empresario) {
      if (usuarioLogado.empresaId) {
        setEmpresaId(usuarioLogado.empresaId.toString());
        setValue("permissaoId", PermissaoEnum.Funcionario);
        setPermissaoId(PermissaoEnum.Funcionario);
      }
    }
  }

  async function buscarEmpresas() {
    let resultadoEmpresas = await getTodasEmpresas();
    if (!resultadoEmpresas.success) {
      showNotificacao(resultadoEmpresas.message, "danger");
      setEmpresas([]);
      setModalLoading(false);
      return;
    }

    let novaListaEmpresa: SearchDropdownItem[] = resultadoEmpresas.result.map(
      (item) => {
        return {
          label: item.nome,
          value: item.id.toString(),
        };
      }
    );

    setEmpresas(novaListaEmpresa);
  }

  async function buscarUsuario(usuarioId: number) {
    let resultadoUsuario = await getUsuarioPorId(usuarioId);
    if (!resultadoUsuario.success) {
      setModalLoading(false);
      showNotificacao(resultadoUsuario.message, "danger");
      setPessoaEditando(null);
      setEditando(false);
      return;
    }

    setDefaultValues(resultadoUsuario.result.pessoa, resultadoUsuario.result);
    setUsuarioEditando(resultadoUsuario.result);
    setPessoaEditando(resultadoUsuario.result.pessoa);
    setModalLoading(false);
  }

  function setDefaultValues(pessoa: Pessoa, usuario: Usuario): void {
    if (pessoa.telefone)
      setValue("telefone", adicionarMascara(pessoa.telefone, "cel-phone"));

    if (pessoa.cpfCnpj.length <= 11)
      setValue("cpfCnpj", adicionarMascara(pessoa.cpfCnpj, "cpf"));
    else setValue("cpfCnpj", adicionarMascara(pessoa.cpfCnpj, "cnpj"));

    if (pessoa.cep) setValue("cep", adicionarMascara(pessoa.cep, "zip-code"));

    if (pessoa.numero) setValue("numero", pessoa.numero.toString());

    setValue("nome", pessoa.nome);
    setValue("municipio", pessoa.municipio);
    setValue("estado", pessoa.estado);
    setValue("endereco", pessoa.endereco);
    setValue("pais", pessoa.pais);
    setValue("dataNascimento", pessoa.dataNascimento);
    setValue("login", usuario.login);
    setValue("senha", usuario.senha);
    setValue("senhaConfirma", usuario.senha);

    if (usuario.permissaoId) {
      setPermissaoId(usuario.permissaoId);
      setValue("permissaoId", usuario.permissaoId);
    }

    if (usuario.empresaId) setEmpresaId(usuario.empresaId.toString());
  }

  async function autoCompleteLocation(cep: string) {
    if (cep.length == 9) {
      cep = removerPontuacaoDocumento(cep); // Remover pontuação do CEP
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

  function verifyLocationData(locationData: EnderecoDTO): void {
    if (
      locationData.logradouro !== undefined &&
      locationData.bairro !== undefined
    ) {
      setValue(
        "endereco",
        `${locationData.logradouro} - ${locationData.bairro}`
      );
    } else if (locationData.logradouro !== undefined) {
      setValue("endereco", locationData.logradouro);
    } else if (locationData.bairro !== undefined) {
      setValue("endereco", locationData.bairro);
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
  }

  const feedBackError = (data: any) => {
    Alert.alert("Formulário inválido", "Verifique os dados preenchdios");

    if (!getValues("permissaoId")) {
      setError("permissaoId", { message: "Campo obrigatório" });
    }
  };

  function usuarioPrecisaPossuirEmpresa(permissaoId: number): boolean {
    return (
      permissaoId == PermissaoEnum.Empresario ||
      permissaoId == PermissaoEnum.Funcionario
    );
  }

  const submitForm = async (form: FormularioObjeto): Promise<void> => {
    if (!validarFormulario(form)) {
      Alert.alert("Formulário inválido", "Verifique os dados preenchdios");
      return;
    }

    let _empresaId = empresaId ? Number(empresaId) : 0;
    if (
      form.permissaoId != PermissaoEnum.Funcionario &&
      form.permissaoId != PermissaoEnum.Empresario
    ) {
      _empresaId = 0;
    }

    let usuario: Usuario = {
      id: editando ? usuarioEditando.id : 0,
      senha: form.senha,
      login: form.login,
      status: form.status,
      permissaoId: form.permissaoId,
      empresaId: _empresaId,
      pessoaId: 0,
      pushToken: "",
    };

    let pessoa: Pessoa = {
      id: editando ? pessoaEditando.id : 0,
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
      foto: editando ? pessoaEditando.foto : "",
    };

    usuario.pessoa = pessoa;
    setShowProgressBar(true);

    if (editando) {
      let resultadoPessoa = await putEditarPessoa(pessoa);

      if (!resultadoPessoa.success) {
        setShowProgressBar(false);
        showNotificacao(resultadoPessoa.message, "danger");
        return;
      }

      let resultadoUsuario = await putEditarUsuario(usuario);
      if (!resultadoUsuario.success) {
        setShowProgressBar(false);
        showNotificacao(resultadoUsuario.message, "danger");
        return;
      }

      setShowProgressBar(false);
      showNotificacao(resultadoPessoa.message, "success");
    } else {
      let resultadoUsuario = await postAdicionarUsuario(usuario);
      setShowProgressBar(false);

      if (!resultadoUsuario.success) {
        showNotificacao(resultadoUsuario.message, "danger");
        return;
      }

      showNotificacao(resultadoUsuario.message, "success");
    }

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ROUTES.usuarios }],
      })
    );
  };

  function validarFormulario(form: FormularioObjeto): boolean {
    let formValido = true;

    if (usuarioPrecisaPossuirEmpresa(permissaoId) && !empresaId) {
      formValido = false;
      setError("empresaId", { message: "Campo obrigatório" });
    }

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

  return (
    <View style={[styles.contain]}>
      <SemiHeader titulo={`${editando ? "Editar" : "Adicionar"} Usuário`} />

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
            {/* <Button
                    icon="map-marker"
                    mode="text"
                    onPress={() => autoCompleteLocation(getValues('cep'))}
                >
                    Buscar Endereço por CEP
                </Button> */}
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
            {editando ? "EDITAR" : "REGISTRAR"}
          </Button>
        </View>
      </ScrollView>

      {/* <Modal
                animationType="slide"
                visible={modalLoading}
                onRequestClose={() => setModalLoading(false)}
            >
                <Loading />
            </Modal> */}
    </View>
  );
};

export default AddUser;
