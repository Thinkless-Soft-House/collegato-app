import { View, Alert, TouchableOpacity, Modal } from 'react-native';
import React, { useCallback, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { CommonActions, useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Avatar, Button, Divider, IconButton, List, Subheading } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { MotiView } from 'moti';
import { LinearProgress } from '@rneui/themed';

import SemiHeader from '../../../components/SemiHeader';
import InputControl from '../../../components/InputControl';

import { getBuscarEnderecoViaCEP } from '../../../services/api/helperServices/getBuscarEnderecoViaCEP';
import { getEmpresaPorId } from '../../../services/api/empresaServices/getEmpresaPorId';
import { getTodasCategoriasEmpresa } from '../../../services/api/categoriaEmpresaServices/getTodasCategoriasEmpresa';
import { putEditarEmpresa } from '../../../services/api/empresaServices/putEditarEmpresa';

import { AuthContext, ILoginData } from '../../../services/auth';
import { EnderecoDTO } from '../../../models/DTOs/EnderecoDTO';
import { NotificacaoContext, NotificacaoContextData } from '../../../contexts/NotificacaoProvider';
import { globalColors } from '../../../global/styleGlobal';

import styles from './styles';
import Loading from '../../public/components/Loading';
import { adicionarMascara, removerPontuacaoDocumento, validarCNPJ, validarCPF } from '../../../helpers/formHelpers';
import { ROUTES } from '../../../routes/config/routesNames';
import { Empresa } from '../../../models/empresa';
import SearchDropDown from '../../../components/SearchDropDown';
import { SearchDropdownItem } from '../../../models/DTOs/searchDropdownItem';

export interface FormularioObjeto extends Empresa {
}

let schema = yup.object({
    nome: yup.string().required('Campo obrigatório'),
    telefone: yup.string().required('Campo obrigatório'),
    cpfCnpj: yup.string().required('Campo obrigatório'),
    cep: yup.string().required('Campo obrigatório'),
    municipio: yup.string().required('Campo obrigatório'),
    estado: yup.string().required('Campo obrigatório'),
    pais: yup.string().required('Campo obrigatório'),
    endereco: yup.string().required('Campo obrigatório'),
    numeroEndereco: yup.string().required('Campo obrigatório'),
});

const MyCompany: React.FC = () => {
    const { dataLoginUser, usuarioLogado, pessoaLogada, setPessoaLogada } = useContext<ILoginData>(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const screenIsFocused = useIsFocused();
    const { showNotificacao } = useContext<NotificacaoContextData>(NotificacaoContext);

    const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
    const [showProgressBarCep, setShowProgressBarCep] = useState<boolean>(false);
    const [modalLoading, setModalLoading] = useState<boolean>(false);
    const [editando, setEditando] = useState<boolean>(false);
    const [empresaEditando, setEmpresaEditando] = useState<Empresa>();
    const [userAvatar, setUserAvatar] = useState<ImagePicker.ImageInfo>();
    const [permisionPhoto, setPermisionPhoto] = useState<boolean>(false);
    const [empresaSendoVisualizada, setEmpresaSendoVisualizada] = useState<Empresa>();

    // Formulário
    const [categorias, setCategorias] = useState<SearchDropdownItem[]>([]);
    const [categoriaId, setCategoriaId] = useState<string>();
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
            setModalLoading(true);
            let resultado = await getEmpresaPorId(usuarioLogado.empresaId);
            if (!resultado.success) {
                setModalLoading(false);
                showNotificacao(resultado.message, 'danger');
                setEmpresaEditando(null);
                return;
            }

            await buscarCategorias();

            if (!resultado.result) {
                showNotificacao("Empresa não encontrada!", 'danger');
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            { name: ROUTES.homeMenu },
                        ],
                    })
                );
                return;
            }

            setModalLoading(false);
            setEmpresaEditando(resultado.result);
        } catch (error) {
        } finally {
            setTimeout(() => {
                setModalLoading(false);
            }, 50);
        }
    }

    async function buscarCategorias() {
        let resultado = await getTodasCategoriasEmpresa();
        if (!resultado.success) {
            setModalLoading(false);
            showNotificacao(resultado.message, 'danger');
            setEmpresaEditando(null);
            return;
        }

        let novaLista: SearchDropdownItem[] = resultado.result.map(item => {
            return {
                label: item.descricao,
                value: item.id.toString(),
            }
        });

        setCategorias(novaLista);
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

    function onPressEdit() {
        setDefaultValuesUser(empresaEditando);
        setEditando(true);
    }

    const setDefaultValuesUser: Function = (empresa: Empresa): void => {
        if (empresa.telefone)
            setValue('telefone', adicionarMascara(empresa.telefone, 'cel-phone'));

        if (empresa.cpfCnpj.length <= 11)
            setValue('cpfCnpj', adicionarMascara(empresa.cpfCnpj, 'cpf'));
        else
            setValue('cpfCnpj', adicionarMascara(empresa.cpfCnpj, 'cnpj'));

        if (empresa.cep)
            setValue('cep', adicionarMascara(empresa.cep, 'zip-code'));

        if (empresa.numeroEndereco)
            setValue('numeroEndereco', empresa.numeroEndereco.toString());

        setValue('nome', empresa.nome);
        setValue('municipio', empresa.municipio);
        setValue('estado', empresa.estado);
        setValue('endereco', empresa.endereco);
        setValue('pais', empresa.pais);
        setCategoriaId(empresa.categoriaId.toString());
        setFotoBase64(empresa.logo);
    };

    const feedBackError = (data: any) => {
        Alert.alert(
            'Formulário inválido',
            'Verifique os dados preenchdios'
        );
    };

    async function submitForm(form: FormularioObjeto) {
        if (!validarFormulario(form)) {
            Alert.alert(
                'Formulário inválido',
                'Verifique os dados preenchdios'
            );
            return;
        }

        let empresa: Empresa = {
            id: usuarioLogado.empresaId,
            nome: form.nome,
            categoriaId: Number(categoriaId),
            telefone: removerPontuacaoDocumento(form.telefone),
            cpfCnpj: removerPontuacaoDocumento(form.cpfCnpj),
            municipio: form.municipio,
            estado: form.estado,
            pais: form.pais,
            endereco: form.endereco,
            numeroEndereco: form.numeroEndereco,
            cep: removerPontuacaoDocumento(form.cep),
            logo: fotoBase64,
        }

        setShowProgressBar(true);
        let resultado = await putEditarEmpresa(empresa);
        setShowProgressBar(false);

        if (!resultado.success) {
            showNotificacao(resultado.message, 'danger');
            return;
        }

        setEmpresaEditando(resultado.result);
        setEditando(false);
    }

    const checkAndWritePermission: Function = (): string => {
        switch (dataLoginUser.permission) {
            case 0:
                return 'Sou usuário (a)';
            case 1:
                return 'Sou administrador (a)';
            case 2:
                return 'Sou empresa';
            case 3:
                return 'Sou funcionário (a)';
            default:
                return 'Não indentificado';
        }
    };

    const handleAvatar: Function = async (): Promise<void> => {
        if (permisionPhoto) {
            const permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert(
                    'Antes de continuar',
                    'Permita que o arquivo busque a foto em sua galeria!'
                );
                return;
            }
            AsyncStorage.setItem('permisionPhoto', 'true');
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
    };

    const verifyLocationData: Function = (locationData: EnderecoDTO): void => {
        if (locationData.logradouro !== undefined && locationData.bairro !== undefined) {
            setValue('endereco', `${locationData.logradouro} - ${locationData.bairro}`);
        }

        if (
            locationData.localidade !== undefined &&
            locationData.localidade.length > 0
        ) {
            setValue('municipio', locationData.localidade);
        }

        if (locationData.uf !== undefined && locationData.uf.length > 0) {
            setValue('estado', locationData.uf);
        }
    };

    function validarFormulario(form: FormularioObjeto): boolean {
        let formValido = true;

        if (!categoriaId) {
            setError('categoriaId', { message: "Campo obrigatório" })
        }

        if (form.cpfCnpj.length == 14) {
            if (!validarCPF(form.cpfCnpj)) {
                formValido = false;
                setError('cpfCnpj', { message: "CPF Inválido" });
            }
        }

        if (form.cpfCnpj.length > 14) {
            if (!validarCNPJ(form.cpfCnpj)) {
                formValido = false;
                setError('cpfCnpj', { message: "CNPJ Inválido" });
            }
        }

        return formValido;
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
                                    title="Logo da empresa"
                                    description="Sua logo é sua vitrine : )"
                                />

                                <TouchableOpacity style={styles.photoInputAvatarButton} onPress={() => handleAvatar()}>
                                    {fotoBase64 ? (
                                        <Avatar.Image size={100} source={{ uri: `data:image/jpeg;base64,${fotoBase64}` }} />
                                    )
                                        :
                                        (
                                            <Avatar.Icon size={100} icon="camera" />
                                        )}
                                </TouchableOpacity>
                            </View>

                            <SearchDropDown
                                label="Categoria da empresa?"
                                style={styles.inputs}
                                value={categoriaId}
                                items={categorias}
                                onChange={setCategoriaId}
                                error={errors.categoriaId ? true : false}
                                errorText={errors.categoriaId?.message}
                            />

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
                                typeMask='document'
                                keyboardType='number-pad'
                                name="cpfCnpj"
                                control={control}
                                error={errors.cpfCnpj ? true : false}
                                errorText={errors.cpfCnpj?.message}
                            />

                            <InputControl
                                style={styles.inputs}
                                label="Telefone"
                                name="telefone"
                                typeMask='cel-phone'
                                keyboardType='number-pad'
                                control={control}
                                error={errors.telefone ? true : false}
                                errorText={errors.telefone?.message}
                            />

                            <InputControl
                                style={styles.inputs}
                                label="CEP"
                                typeMask='zip-code'
                                keyboardType='numeric'
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
                                name="numeroEndereco"
                                control={control}
                                error={errors.numeroEndereco ? true : false}
                                errorText={errors.numeroEndereco?.message}
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
                                    Editar
                                </Button>
                                <Button
                                    mode="outlined"
                                    contentStyle={styles.btnSendContainer}
                                    style={styles.btnSend}
                                    textColor={globalColors.secondaryColor}
                                    onPress={() => setEditando(false)}
                                >
                                    Cancelar
                                </Button>
                            </View>
                        </ScrollView>
                    </>
                ) : (
                    <>
                        <View style={styles.usuarioFotoContainer}>
                            <View style={styles.photoInputAvatarButton}>
                                <Avatar.Image size={100} source={{ uri: `data:image/jpeg;base64,${empresaEditando && empresaEditando.logo}` }} />
                            </View>

                            {!editando && (
                                <IconButton
                                    style={{ position: 'absolute', top: 95, left: 200 }}
                                    icon="pencil"
                                    iconColor={globalColors.primaryColor}
                                    size={25}
                                    onPress={onPressEdit}
                                />
                            )}
                        </View>
                        {empresaEditando && (
                            <ScrollView style={styles.usuarioDadosContainer}>
                                <List.Item
                                    title="Nome"
                                    right={props => <Subheading>{empresaEditando.nome}</Subheading>}
                                />
                                <Divider />

                                <List.Item
                                    title="Categoria"
                                    right={props => <Subheading>{empresaEditando.categoria.descricao}</Subheading>}
                                />
                                <Divider />

                                <List.Item
                                    title="Documento"
                                    right={props => <Subheading>{showDocument(empresaEditando.cpfCnpj)}</Subheading>}
                                />
                                <Divider />

                                <List.Item
                                    title="Telefone"
                                    right={props => <Subheading>{adicionarMascara(empresaEditando.telefone, 'cel-phone')}</Subheading>}
                                />
                                <Divider />

                                <List.Item
                                    title="Município"
                                    right={props => <Subheading>{empresaEditando.municipio}</Subheading>}
                                />
                                <Divider />

                                <List.Item
                                    title="Estado"
                                    right={props => <Subheading>{empresaEditando.estado}</Subheading>}
                                />

                                <List.Item
                                    title="Endereço"
                                    right={props => <Subheading>{empresaEditando.endereco}</Subheading>}
                                />

                                <List.Item
                                    title="Número"
                                    right={props => <Subheading>{empresaEditando.numeroEndereco}</Subheading>}
                                />

                                <List.Item
                                    title="País"
                                    right={props => <Subheading>{empresaEditando.pais}</Subheading>}
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

            </View>
        </>
    );
};

export default MyCompany;
