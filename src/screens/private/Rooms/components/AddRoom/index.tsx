import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { View, ScrollView, Modal, Text, Alert } from 'react-native';
import { Button, IconButton, Title } from 'react-native-paper';

import SemiHeader from '../../../../../components/SemiHeader';
import Loading from '../../../components/Loading';
import { globalColors } from '../../../../../global/styleGlobal';
import InputControl from '../../../../../components/InputControl';
import DropDownControl from '../../../../../components/DropDownControl';
import SearchDropDown from '../../../../../components/SearchDropDown';
import MultipleSearchDropDown from '../../../../../components/MultipleSearchDropDown';
import DisponibilidadeFormItem from '../DisponibilidadeFormItem';
import Alerta from '../../../../../components/Alerta';
import CheckBox from '../../../../../components/CheckBox';

import { postAdicionarSala } from '../../../../../services/api/SalaServices/postAdicionarSala';
import { putEditarSala } from '../../../../../services/api/SalaServices/putEditarSala';
import { getTodasEmpresas } from '../../../../../services/api/empresaServices/getTodasEmpresas';
import { getSalaPorId } from '../../../../../services/api/SalaServices/getSalaPorId';
import { getUsuariosPorEmpresaPaginado } from '../../../../../services/api/usuarioServices/getUsuariosPorEmpresaPaginado';
import { getTodosUsuarios } from '../../../../../services/api/usuarioServices/getTodosUsuarios';
import { getTodosResponsaveis } from '../../../../../services/api/ResponsavelServices/getTodosResponsaveis';
import { postAdicionarVariosResponsaveis } from '../../../../../services/api/ResponsavelServices/postAdicionarVariosResponsaveis';
import { deleteExcluirResponsavel } from '../../../../../services/api/ResponsavelServices/deleteExcluirResponsavel';
import { postAdicionarVariasDisponibilidades } from '../../../../../services/api/disponibilidadeServices/postAdicionarVariasDisponibilidades';
import { putEditarVariasDisponibilidades } from '../../../../../services/api/disponibilidadeServices/putEditarVariasDisponibilidades';

import { getEnumArrayStatusEnum } from '../../../../../models/enums/statusEnum';
import { Sala } from '../../../../../models/sala';
import { Disponibilidade } from '../../../../../models/disponibilidade';

import styles from './styles';
import { Responsavel } from '../../../../../models/responsavel';
import { SearchDropdownItem } from '../../../../../models/DTOs/searchDropdownItem';
import { AuthContext, ILoginData } from '../../../../../services/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NotificacaoContext, NotificacaoContextData } from '../../../../../contexts/NotificacaoProvider';
import { MotiView } from 'moti';
import { LinearProgress } from '@rneui/themed';
import { PermissaoEnum } from '../../../../../models/enums/permissaoEnum';
import { Usuario } from '../../../../../models/usuario';
import { RequestResult } from '../../../../../models/DTOs/requestResult';
import { ROUTES } from '../../../../../routes/config/routesNames';

interface FormularioObjeto extends Sala { }

export interface IMessageError {
    error?: string;
    message?: string;
}

let schema = yup.object({
    nome: yup.string().required('Campo obrigatório'),
    status: yup.number().required('Campo obrigatório'),
});

const _empresas = [
    { label: 'Empresa A', value: '1' },
    { label: 'Empresa B', value: '2' },
    { label: 'Empresa C', value: '3' },
    { label: 'Empresa D', value: '4' },
    { label: 'Empresa E', value: '5' },
    { label: 'Empresa F', value: '6' },
    { label: 'Empresa G', value: '7' },
    { label: 'Empresa H', value: '8' },
    { label: 'Empresa I', value: '9' },
];

const responsaveis = [
    { label: 'Usuario A', value: '1' },
    { label: 'Usuario B', value: '2' },
    { label: 'Usuario C', value: '3' },
    { label: 'Usuario D', value: '4' },
    { label: 'Usuario E', value: '5' },
    { label: 'Usuario F', value: '6' },
    { label: 'Usuario G', value: '7' },
    { label: 'Usuario H', value: '8' },
    { label: 'Usuario I', value: '9' },
];

const disponibilidadesPadrao: Disponibilidade[] = [
    {
        id: 0,
        ativo: true,
        hrAbertura: "08:00",
        hrFim: "17:00",
        intervaloMinutos: 30,
        minDiasCan: 2,
        salaId: 1,
        diaSemana: 'Domingo',
        diaSemanaIndex: 0,
    },
    {
        id: 0,
        ativo: true,
        hrAbertura: "08:00",
        hrFim: "17:00",
        intervaloMinutos: 30,
        minDiasCan: 2,
        salaId: 1,
        diaSemana: 'Segunda-Feira',
        diaSemanaIndex: 1,
    },
    {
        id: 0,
        ativo: true,
        hrAbertura: "08:00",
        hrFim: "17:00",
        intervaloMinutos: 30,
        minDiasCan: 2,
        salaId: 0,
        diaSemana: 'Terça-Feira',
        diaSemanaIndex: 2,
    },
    {
        id: 0,
        ativo: true,
        hrAbertura: "08:00",
        hrFim: "17:00",
        intervaloMinutos: 30,
        minDiasCan: 2,
        salaId: 0,
        diaSemana: 'Quarta-Feira',
        diaSemanaIndex: 3,
    },
    {
        id: 0,
        ativo: true,
        hrAbertura: "08:00",
        hrFim: "17:00",
        intervaloMinutos: 30,
        minDiasCan: 2,
        salaId: 0,
        diaSemana: 'Quinta-Feira',
        diaSemanaIndex: 4,
    },
    {
        id: 0,
        ativo: true,
        hrAbertura: "08:00",
        hrFim: "17:00",
        intervaloMinutos: 30,
        minDiasCan: 2,
        salaId: 0,
        diaSemana: 'Sexta-Feira',
        diaSemanaIndex: 5,
    },
    {
        id: 0,
        ativo: true,
        hrAbertura: "08:00",
        hrFim: "17:00",
        intervaloMinutos: 30,
        minDiasCan: 2,
        salaId: 0,
        diaSemana: 'Sábado',
        diaSemanaIndex: 6,
    }
]

interface AddRoomParams {
    salaId: number;
}

const AddRoom: React.FC = (props: any) => {
    const { usuarioLogado, pessoaLogada } = useContext<ILoginData>(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const { showNotificacao } = useContext<NotificacaoContextData>(NotificacaoContext);
    const [modalLoading, setModalLoading] = useState<boolean>(false);
    const [params, setParams] = useState<AddRoomParams>();
    const [editando, setEditando] = useState<boolean>(false);
    const [salaEditando, setSalaEditando] = useState<Sala>();
    const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
    const [showProgressRemoveResp, setShowProgressRemoveResp] = useState<boolean>(false);

    // Formulário
    const [multiplasMarcacoes, setMultiplasMarcacoes] = useState<boolean>(true);
    const [disponibilidades, setDisponibilidades] = useState<Disponibilidade[]>(disponibilidadesPadrao);
    const [empresaId, setEmpresaId] = useState<string>();
    const [empresas, setEmpresas] = useState<SearchDropdownItem[]>([]);
    const [responsaveisDaSala, setResponsaveisDaSala] = useState<Responsavel[]>([]);
    const [responsaveisDropDown, setResponsaveisDropDown] = useState<SearchDropdownItem[]>([]);
    const [responsaveisSelecionados, setResponasveisSelecionados] = useState<SearchDropdownItem[]>([]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        register,
        setValue,
        getValues,
        setError
    } = useForm<FormularioObjeto>({
        resolver: yupResolver(schema),
    });

    useFocusEffect(
        useCallback(() => {
            buscarDadosIniciais();
        }, [])
    );

    useEffect(() => {
        if (empresaId) {
            setResponasveisSelecionados([]);
            buscarUsuarios(Number(empresaId));
        }
    }, [empresaId]);

    async function buscarDadosIniciais() {
        try {
            setModalLoading(true);

            if (usuarioLogado.permissaoId == PermissaoEnum.Administrador) {
                await buscarEmpresas();
            }
            else {
                setEmpresaId(usuarioLogado.empresaId.toString());
            }

            let _usuarios = await buscarUsuarios();

            const params = route.params as AddRoomParams;
            if (params) {
                setParams(params);
                if (params.salaId) {
                    await buscarSala(params.salaId, _usuarios);
                    setEditando(true);
                }
                else {
                    setEditando(false);
                }
            }
            else {
                setParams(null);
                setEditando(false);
            }

            setModalLoading(false);
        } catch (error) {
        } finally {
            setTimeout(() => {
                setModalLoading(false);
            }, 50);
        }
    }

    async function buscarSala(salaId: number, usuarios: Usuario[]) {
        let resultado = await getSalaPorId(salaId);
        if (!resultado.success) {
            setModalLoading(false);
            showNotificacao(resultado.message, 'danger');
            setSalaEditando(null);
            setEditando(false);
            return;
        }

        let resultadoResponsaveis = await getTodosResponsaveis();
        if (!resultadoResponsaveis.success) {
            setModalLoading(false);
            setEditando(false);
            showNotificacao(resultadoResponsaveis.message, 'danger');
            return;
        }

        setDefaultValues(resultado.result, resultadoResponsaveis.result, usuarios);
        setSalaEditando(resultado.result);
    }

    async function buscarUsuarios(empresaId: number = 0): Promise<Usuario[]> {
        let resultadoUsuario: RequestResult<Usuario[]> = null;

        if (usuarioLogado.permissaoId == PermissaoEnum.Empresario || usuarioLogado.permissaoId == PermissaoEnum.Funcionario) {
            resultadoUsuario = await getUsuariosPorEmpresaPaginado(usuarioLogado.empresaId, { order: 'DESC' });
        }
        else if (empresaId > 0) {
            resultadoUsuario = await getUsuariosPorEmpresaPaginado(empresaId, { order: 'DESC' });
        }
        else {
            resultadoUsuario = await getTodosUsuarios();
        }

        if (!resultadoUsuario.success) {
            setModalLoading(false);
            setEditando(false);
            showNotificacao(resultadoUsuario.message, 'danger');
            return [] as Usuario[];
        }

        if (!resultadoUsuario.result || resultadoUsuario.result.length == 0) {
            showNotificacao("A empresa selecionada, não possui usuários.", "warning");
        }

        setResponsaveisDropDown(resultadoUsuario.result.map(resp => {
            let novoResp: SearchDropdownItem = {
                label: resp.pessoa.nome,
                value: resp.id.toString(),
            }

            return novoResp;
        }))
        return resultadoUsuario.result;
    }

    async function buscarEmpresas() {
        let resultadoEmpresas = await getTodasEmpresas();
        if (!resultadoEmpresas.success) {
            showNotificacao(resultadoEmpresas.message, 'danger');
            setEmpresas([]);
            setModalLoading(false);
            return;
        }

        let novaListaEmpresa: SearchDropdownItem[] = resultadoEmpresas.result.map(item => {
            return {
                label: item.nome,
                value: item.id.toString(),
            }
        });

        setEmpresas(novaListaEmpresa);
    }

    function setDefaultValues(sala: Sala, responsaveis: Responsavel[], usuarios: Usuario[]): void {
        setValue('nome', sala.nome);
        setValue('status', sala.status);
        setEmpresaId(sala.empresaId.toString());

        let listaDisponibilidade = !sala.disponibilidades || sala.disponibilidades.length < 7 ? disponibilidadesPadrao : sala.disponibilidades;
        setDisponibilidades(listaDisponibilidade);

        let _responsaveisSala = responsaveis.filter(e => e.salaId == sala.id);
        setResponsaveisDaSala(_responsaveisSala);
        let _listaResponsaveisSelecionados: SearchDropdownItem[] = []

        _responsaveisSala.forEach(resp => {
            let usuarioResp = usuarios.find(e => e.id == resp.usuarioId);

            if (usuarioResp) {
                let item: SearchDropdownItem = {
                    label: usuarioResp.pessoa.nome,
                    value: usuarioResp.id.toString()
                }

                _listaResponsaveisSelecionados.push(item);
            }
        });

        setResponasveisSelecionados(_listaResponsaveisSelecionados);
    };

    const feedBackError = (data: any) => {
        Alert.alert(
            'Formulário inválido',
            'Verifique os dados preenchdios'
        );

        if (!getValues('status')) {
            setError('status', { message: "Campo obrigatório" })
        }
    };

    function validarFormulario(form: FormularioObjeto): boolean {
        let formValido = true;

        if (!empresaId) {
            formValido = false;
            setError('empresaId', { message: "Campo obrigatório" })
        }
        
        if (!responsaveisSelecionados || responsaveisSelecionados.length == 0) {
            formValido = false;
            setError('responsavel', { message: "Campo obrigatório" })
        }

        return formValido;
    }

    const submitForm = async (form: FormularioObjeto): Promise<void> => {
        if (!validarFormulario(form)) {
            Alert.alert(
                'Formulário inválido',
                'Verifique os dados preenchdios'
            );
            return;
        }

        let adicionarDisponibilidades: boolean = true;
        let disponibilidadeExistenteEncontrada = disponibilidades.find(e => e.id > 0);
        if (disponibilidadeExistenteEncontrada != undefined) {
            adicionarDisponibilidades = false;
        }

        let novaListaDisponibilidades = disponibilidades.map(e => {
            e.salaId = editando ? salaEditando.id : 0;
            return e;
        });

        const data: Sala = {
            id: editando ? salaEditando.id : 0,
            nome: form.nome,
            status: form.status,
            empresaId: Number(empresaId),
            multiplasMarcacoes: multiplasMarcacoes,
            responsavel: [],
            disponibilidades: novaListaDisponibilidades
        };

        setShowProgressBar(true);

        let resultado: RequestResult<Sala> = null;

        if (editando) {
            resultado = await putEditarSala(data);

            if (!resultado.success) {
                setShowProgressBar(false);
                showNotificacao(resultado.message, "danger");
                return;
            }

            let resultadoDisponibilidade: RequestResult<Disponibilidade[]> = null;
            if (adicionarDisponibilidades) {
                novaListaDisponibilidades = novaListaDisponibilidades.map(e => {
                    e.salaId = resultado.result.id;
                    return e;
                })

                resultadoDisponibilidade = await postAdicionarVariasDisponibilidades(novaListaDisponibilidades);
            }
            else {
                resultadoDisponibilidade = await putEditarVariasDisponibilidades(novaListaDisponibilidades);
            }

            if (!resultadoDisponibilidade.success) {
                setShowProgressBar(false);
                showNotificacao(resultadoDisponibilidade.message, "danger");
                return;
            }

        }
        else {
            resultado = await postAdicionarSala(data);

            if (!resultado.success) {
                setShowProgressBar(false);
                showNotificacao(resultado.message, "danger");
                return;
            }
        }

        let novosResponsaveisList: Responsavel[] = [];

        responsaveisSelecionados.forEach(e => {
            if (e.novo) {
                let novoResponsavel: Responsavel = {
                    id: 0,
                    salaId: editando ? salaEditando.id : resultado.result.id,
                    usuarioId: Number(e.value)
                }

                novosResponsaveisList.push(novoResponsavel);
            }
        });

        if (novosResponsaveisList && novosResponsaveisList.length > 0) {
            let resultadoResponsaveis = await postAdicionarVariosResponsaveis(novosResponsaveisList);
            if (!resultadoResponsaveis.success) {
                setShowProgressBar(false);
                showNotificacao(resultadoResponsaveis.message, "danger");
                return;
            }
        }

        showNotificacao(resultado.message, "success");
        setShowProgressBar(false);

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: ROUTES.salas },
                ],
            })
        );
    };

    function onPressConfirmEditDisponibilidade(novaDisponibilidade: Disponibilidade) {
        let novaLista = disponibilidades.map(e => {
            if (e.diaSemanaIndex == novaDisponibilidade.diaSemanaIndex) {
                e = novaDisponibilidade;
            }

            return e;
        });

        setDisponibilidades(novaLista);
    }

    function adicionarResponsaveis(responsavel: SearchDropdownItem) {
        let novoResponsavel: SearchDropdownItem = {
            label: responsavel.label,
            value: responsavel.value,
            novo: true
        };

        let responsavelJaSelecionado = responsaveisSelecionados.find(e => e.value == novoResponsavel.value);
        if (responsavelJaSelecionado)
            return;

        let novaListaResponsaveis = [novoResponsavel, ...responsaveisSelecionados]
        setResponasveisSelecionados(novaListaResponsaveis);
    }

    function removerResponsavel(responsavel: SearchDropdownItem) {
        let novaListaResponsaveis = responsaveisSelecionados.filter(e => e.value != responsavel.value);
        setResponasveisSelecionados(novaListaResponsaveis);
    }

    async function removerResponsavelEditando(responsavel: SearchDropdownItem) {
        let responsavelSala = responsaveisDaSala.find(e => e.usuarioId.toString() == responsavel.value)

        if (!responsavelSala) {
            removerResponsavel(responsavel);
            return;
        }

        setShowProgressRemoveResp(true);
        let resultado = await deleteExcluirResponsavel(responsavelSala.id);
        setShowProgressRemoveResp(false);

        if (!resultado.success) {
            showNotificacao(resultado.message, 'danger');
            return;
        }

        showNotificacao(resultado.message, 'success');
        let novaListaResponsaveis = responsaveisSelecionados.filter(e => e.value != responsavel.value);
        setResponasveisSelecionados(novaListaResponsaveis);
    }

    return (
        <View style={[styles.contain]}>
            <SemiHeader titulo={`${editando ? "Editar" : "Adicionar"} Sala`} />

            <ScrollView style={[styles.mtContent]}>
                {usuarioLogado.permissaoId == PermissaoEnum.Administrador && (
                    <SearchDropDown
                        style={styles.inputs}
                        value={empresaId}
                        items={empresas}
                        onChange={setEmpresaId}
                        label="Empresa"
                        error={errors.empresaId ? false : true}
                        errorText={errors.empresaId?.message}
                    />
                )}

                <InputControl
                    style={styles.inputs}
                    label="Nome da Sala"
                    name="nome"
                    control={control}
                    error={errors.nome ? true : false}
                    errorText={errors.nome?.message}
                />

                <CheckBox
                    style={styles.inputs}
                    changeOnPressLabel
                    containerStyle={styles.checkboxContainer}
                    labelStyle={styles.checkboxLabel}
                    label='Permitir agendar mais de um horário?'
                    value={multiplasMarcacoes}
                    onChange={setMultiplasMarcacoes}
                />

                <MultipleSearchDropDown
                    label="Adicione um responsável pela sala"
                    style={styles.inputs}
                    items={responsaveisDropDown}
                    onChange={adicionarResponsaveis}
                    values={responsaveisSelecionados}
                    error={errors.responsavel ? false : true}
                    errorText={errors.responsavel?.message}
                />

                {responsaveisSelecionados && responsaveisSelecionados.length > 0 ?
                    (
                        <>
                            <Text style={styles.responsaveisLabel}>Responsáveis</Text>
                            {showProgressRemoveResp && (
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
                            <View style={styles.responsaveisContainer}>
                                {responsaveisSelecionados.map(resp => (
                                    <View style={styles.chipContainer}>
                                        <Text style={styles.chipText}>
                                            {resp.label}
                                        </Text>

                                        <IconButton
                                            style={styles.chipButton}
                                            icon="close"
                                            iconColor="#FFF"
                                            size={15}
                                            onPress={async () => editando ? await removerResponsavelEditando(resp) : removerResponsavel(resp)}
                                        />
                                    </View>
                                ))}
                            </View>
                        </>

                    )
                    : (
                        <Alerta style={{ alignSelf: 'center' }} tipo='default' >
                            Selecione os usuários responsáveis pela sala.
                        </Alerta>
                    )}

                <DropDownControl
                    style={styles.inputs}
                    control={control}
                    label="Status"
                    name="status"
                    error={errors.status ? true : false}
                    errorText={errors.status?.message}
                    list={getEnumArrayStatusEnum()}
                />

                <View style={styles.subTitleFormContainer}>
                    <Title style={styles.subTitle}>Configurações da Sala</Title>
                </View>

                <View style={styles.dispContainer}>
                    {disponibilidades.map((dispItem, index) => (
                        <DisponibilidadeFormItem key={index} item={dispItem} onSend={onPressConfirmEditDisponibilidade} />
                    ))}
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
                        buttonColor={globalColors.primaryColor}
                        onPress={handleSubmit(submitForm, feedBackError)}

                    >
                        {editando ? 'EDITAR' : 'REGISTRAR'}
                    </Button>
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                visible={modalLoading}
                onRequestClose={() => setModalLoading(false)}
            >
                <Loading />
            </Modal>
        </View>
    );
};

export default AddRoom;
