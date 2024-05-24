import React, { useState, useContext, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { View, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
import { Button, List, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SemiHeader from '../../../../../components/SemiHeader';
import Loading from '../../../components/Loading';
import { globalColors } from '../../../../../global/styleGlobal';
import InputControl from '../../../../../components/InputControl';

import { postAdicionarEmpresa } from '../../../../../services/api/empresaServices/postAdicionarEmpresa';
import { getTodasCategoriasEmpresa } from '../../../../../services/api/categoriaEmpresaServices/getTodasCategoriasEmpresa';
import { getEmpresaPorId } from '../../../../../services/api/empresaServices/getEmpresaPorId';
import { putEditarEmpresa } from '../../../../../services/api/empresaServices/putEditarEmpresa';
import { getBuscarEnderecoViaCEP } from '../../../../../services/api/helperServices/getBuscarEnderecoViaCEP';

import { Empresa } from '../../../../../models/empresa';
import { EnderecoDTO } from '../../../../../models/DTOs/EnderecoDTO';

import {
    adicionarMascara,
    removerPontuacaoDocumento,
    validarCNPJ,
    validarCPF,
} from '../../../../../helpers/formHelpers';
import {
    NotificacaoContext,
    NotificacaoContextData,
} from '../../../../../contexts/NotificacaoProvider';
import {
    CommonActions,
    useFocusEffect,
    useNavigation,
    useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SearchDropDown from '../../../../../components/SearchDropDown';
import { SearchDropdownItem } from '../../../../../models/DTOs/searchDropdownItem';
import { MotiView } from 'moti';
import { LinearProgress } from '@rneui/themed';
import { ROUTES } from '../../../../../routes/config/routesNames';
import { RequestResult } from '../../../../../models/DTOs/requestResult';

import styles from './styles';

interface FormularioObjeto extends Empresa {}

export interface IMessageError {
    error?: string;
    message?: string;
}

let empresaSchema = yup.object({
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

interface AddCompanyParams {
    empresaId: number;
}

const AddCompany: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const { showNotificacao } =
        useContext<NotificacaoContextData>(NotificacaoContext);
    const [modalLoading, setModalLoading] = useState<boolean>(false);
    const [params, setParams] = useState<AddCompanyParams>();
    const [editando, setEditando] = useState<boolean>(false);
    const [empresaEditando, setEmpresaEditando] = useState<Empresa>();
    const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
    const [showProgressBarCep, setShowProgressBarCep] =
        useState<boolean>(false);
    const [permisionPhoto, setPermisionPhoto] = useState<boolean>(false);

    // FORMULÁRIO
    const [fotoBase64, setFotoBase64] = useState<string>('');
    const [categorias, setCategorias] = useState<SearchDropdownItem[]>([]);
    const [categoriaId, setCategoriaId] = useState<string>();

    const {
        control,
        handleSubmit,
        clearErrors,
        formState: { errors },
        register,
        setError,
        getValues,
        setValue,
    } = useForm<FormularioObjeto>({
        resolver: yupResolver(empresaSchema),
    });

    useFocusEffect(
        useCallback(() => {
            AsyncStorage.getItem('permisionPhoto').then((data) =>
                setPermisionPhoto(data !== null || data !== '')
            );
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            buscarDadosIniciais();
        }, [])
    );

    async function buscarDadosIniciais() {
        try {
            setModalLoading(true);
            await buscarCategorias();
            const params = route.params as AddCompanyParams;
            if (params) {
                setParams(params);
                if (params.empresaId) {
                    await buscarEmpresa(params.empresaId);
                    setEditando(true);
                } else {
                    setEditando(false);
                }
            } else {
                setParams(null);
                setEditando(false);
            }
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
            showNotificacao(resultado.message, 'danger');
            setCategorias([]);
            setModalLoading(false);
            return;
        }

        let _categorias: SearchDropdownItem[] = resultado.result.map((item) => {
            return {
                label: item.descricao,
                value: item.id.toString(),
            };
        });

        setCategorias(_categorias);
    }

    async function buscarEmpresa(empresaId: number) {
        let resultado = await getEmpresaPorId(empresaId);
        if (!resultado.success) {
            setModalLoading(false);
            showNotificacao(resultado.message, 'danger');
            setEmpresaEditando(null);
            setEditando(false);
            return;
        }

        setDefaultValues(resultado.result);
        setEmpresaEditando(resultado.result);
    }

    function setDefaultValues(empresa: Empresa): void {
        setFotoBase64(empresa.logo);

        if (empresa.telefone) setValue('telefone', empresa.telefone);

        if (empresa.cpfCnpj.length <= 11)
            setValue('cpfCnpj', adicionarMascara(empresa.cpfCnpj, 'cpf'));
        else setValue('cpfCnpj', adicionarMascara(empresa.cpfCnpj, 'cnpj'));

        if (empresa.cep)
            setValue('cep', adicionarMascara(empresa.cep, 'zip-code'));

        if (empresa.numeroEndereco)
            setValue('numeroEndereco', empresa.numeroEndereco.toString());

        setValue('nome', empresa.nome);
        setValue('municipio', empresa.municipio);
        setValue('estado', empresa.estado);
        setValue('endereco', empresa.endereco);
        setValue('pais', empresa.pais);

        if (empresa.categoriaId) setCategoriaId(empresa.categoriaId.toString());
    }

    async function autoCompleteLocation(cep: string) {
        if (cep.length == 9) {
            cep = removerPontuacaoDocumento(cep);
            setShowProgressBarCep(true);
            let resultado = await getBuscarEnderecoViaCEP(cep);
            setShowProgressBarCep(false);

            if (!resultado.success || resultado.result === undefined) {
                showNotificacao(
                    'O CEP informado não foi encontrado!',
                    'warning'
                );
                return;
            }

            verifyLocationData(resultado.result);
        }
    }

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

    function verifyLocationData(locationData: EnderecoDTO): void {
        if (
            locationData.logradouro !== undefined &&
            locationData.bairro !== undefined
        ) {
            setValue(
                'endereco',
                `${locationData.logradouro} - ${locationData.bairro}`
            );
        } else if (locationData.logradouro !== undefined) {
            setValue('endereco', locationData.logradouro);
        } else if (locationData.bairro !== undefined) {
            setValue('endereco', locationData.bairro);
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
    }

    const feedBackError = (data: any) => {
        Alert.alert('Formulário inválido', 'Verifique os dados preenchdios');

        if (!categoriaId) {
            setError('categoriaId', { message: 'Campo obrigatório' });
        }
    };

    const submitForm = async (form: FormularioObjeto): Promise<void> => {
        if (!validarFormulario(form)) {
            Alert.alert(
                'Formulário inválido',
                'Verifique os dados preenchdios'
            );
            return;
        }

        const data: Empresa = {
            id: editando ? empresaEditando.id : 0,
            categoriaId: Number(categoriaId),
            nome: form.nome,
            cpfCnpj: removerPontuacaoDocumento(form.cpfCnpj),
            cep: removerPontuacaoDocumento(form.cep),
            telefone: form.telefone,
            municipio: form.municipio,
            estado: form.estado,
            pais: form.pais,
            endereco: form.endereco,
            numeroEndereco: form.numeroEndereco,
            logo: fotoBase64,
        };

        setShowProgressBar(true);
        let resultado: RequestResult<Empresa> = null;

        if (editando) {
            resultado = await putEditarEmpresa(data);
            setShowProgressBar(false);

            if (!resultado.success) {
                showNotificacao(resultado.message, 'danger');
                return;
            }

            showNotificacao(resultado.message, 'success');
        } else {
            resultado = await postAdicionarEmpresa(data);
            setShowProgressBar(false);

            if (!resultado.success) {
                showNotificacao(resultado.message, 'danger');
                return;
            }

            showNotificacao(resultado.message, 'success');
        }

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: ROUTES.empresas }],
            })
        );
    };

    function validarFormulario(form: FormularioObjeto): boolean {
        let formValido = true;

        if (form.cpfCnpj.length == 14) {
            if (!validarCPF(form.cpfCnpj)) {
                formValido = false;
                setError('cpfCnpj', { message: 'CPF Inválido' });
            }
        }

        if (form.cpfCnpj.length > 14) {
            if (!validarCNPJ(form.cpfCnpj)) {
                formValido = false;
                setError('cpfCnpj', { message: 'CNPJ Inválido' });
            }
        }

        return formValido;
    }

    return (
        <View style={[styles.contain]}>
            <SemiHeader
                titulo={`${editando ? 'Editar' : 'Adicionar'} Empresa`}
            />

            <ScrollView style={[styles.mtContent]}>
                <SearchDropDown
                    label='Categoria da empresa?'
                    style={styles.inputs}
                    value={categoriaId}
                    items={categorias}
                    onChange={setCategoriaId}
                    error={errors.categoriaId ? true : false}
                    errorText={errors.categoriaId?.message}
                />

                <InputControl
                    style={styles.inputs}
                    label='Nome'
                    name='nome'
                    control={control}
                    error={errors.nome ? true : false}
                    errorText={errors.nome?.message}
                />

                <InputControl
                    style={styles.inputs}
                    label='CPF ou CNPJ'
                    name='cpfCnpj'
                    typeMask='document'
                    keyboardType='number-pad'
                    control={control}
                    error={errors.cpfCnpj ? true : false}
                    errorText={errors.cpfCnpj?.message}
                />

                <InputControl
                    style={styles.inputs}
                    label='Telefone'
                    name='telefone'
                    typeMask='cel-phone'
                    keyboardType='number-pad'
                    control={control}
                    error={errors.telefone ? true : false}
                    errorText={errors.telefone?.message}
                />

                <InputControl
                    style={styles.inputs}
                    label='CEP'
                    typeMask='zip-code'
                    keyboardType='numeric'
                    name='cep'
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
                        <LinearProgress color='#52c7e2' />
                    </MotiView>
                )}

                <InputControl
                    style={styles.inputs}
                    label='Município'
                    name='municipio'
                    control={control}
                    error={errors.municipio ? true : false}
                    errorText={errors.municipio?.message}
                />

                <InputControl
                    style={styles.inputs}
                    label='Estado'
                    name='estado'
                    control={control}
                    error={errors.estado ? true : false}
                    errorText={errors.estado?.message}
                />

                <InputControl
                    style={styles.inputs}
                    label='Endereço'
                    name='endereco'
                    control={control}
                    error={errors.endereco ? true : false}
                    errorText={errors.endereco?.message}
                />

                <InputControl
                    style={styles.inputs}
                    label='Número'
                    name='numeroEndereco'
                    keyboardType='number-pad'
                    control={control}
                    error={errors.numeroEndereco ? true : false}
                    errorText={errors.numeroEndereco?.message}
                />

                <InputControl
                    style={styles.inputs}
                    label='País'
                    name='pais'
                    control={control}
                    error={errors.pais ? true : false}
                    errorText={errors.pais?.message}
                />

                <View style={styles.photoInput}>
                    <List.Item
                        style={styles.photoInputLabelContainer}
                        titleStyle={styles.photoTitle}
                        descriptionStyle={styles.photoDescription}
                        title='Foto da empresa'
                        description='Selecione uma foto para a empresa'
                    />

                    <TouchableOpacity
                        style={styles.photoInputAvatarButton}
                        onPress={() => handleAvatar()}
                    >
                        {fotoBase64 ? (
                            <Avatar.Image
                                size={100}
                                source={{
                                    uri: `data:image/jpeg;base64,${fotoBase64}`,
                                }}
                            />
                        ) : (
                            <Avatar.Icon size={100} icon='camera' />
                        )}
                    </TouchableOpacity>
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
                            <LinearProgress color='#52c7e2' />
                        </MotiView>
                    )}
                    <Button
                        mode='contained'
                        contentStyle={styles.btnSendContainer}
                        style={styles.btnSend}
                        buttonColor={globalColors.primaryColor}
                        onPress={handleSubmit(submitForm, feedBackError)}
                    >
                        {editando ? 'EDITAR' : 'REGISTRAR'}
                    </Button>
                </View>
            </ScrollView>

            <Modal animationType='slide' visible={modalLoading}>
                <Loading />
            </Modal>
        </View>
    );
};

export default AddCompany;
