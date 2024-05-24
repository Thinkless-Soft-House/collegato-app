import { View, Text, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CommonActions, useFocusEffect, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MotiView } from 'moti';
import { LinearProgress } from '@rneui/themed';
import { Avatar, Button, MD2Colors, IconButton, List, Subheading, Title } from 'react-native-paper';
import { ref, update, get } from "firebase/database";
import uuid from 'react-native-uuid';

import SemiHeader from '../../../components/SemiHeader';
import { DiasSemanaAbreviado, getNomeMesPorNumero } from '../../../helpers/scheduleHelpers';
import Card from '../../../components/Card';

import Loading from '../../public/components/Loading';
import Input from '../../../components/Input';

import { getEmpresaPorId } from '../../../services/api/empresaServices/getEmpresaPorId';
import { postAdicionarReserva } from '../../../services/api/ReservaServices/postAdicionarReserva';
import { getReservasPorDataESalaPaginado } from '../../../services/api/ReservaServices/getReservasPorDataESalaPaginado';
import { getSalaPorId } from '../../../services/api/SalaServices/getSalaPorId';

import { chatDatabase, chatListRecadosEndPoint, collegatoChatId } from '../../../services/firebaseConfigs/firebaseConfig';
import { PrivateStackParams } from '../../../routes/private';
import { DiaAgendamento } from '../../../models/DTOs/diaAgendamento';
import { globalColors } from '../../../global/styleGlobal';
import { HoraAgendamento } from '../../../models/DTOs/horaAgendamento';
import { Agendamento } from '../../../models/DTOs/agendamento';
import { HoraSalaAberta } from '../../../models/DTOs/horaSalaAberta';
import { Sala } from '../../../models/sala';
import { Chat } from '../../../models/DTOs/chat';
import { Reserva, reservaEmpty } from '../../../models/reserva';
import { StatusEnum } from '../../../models/enums/statusEnum';
import { AuthContext, ILoginData } from '../../../services/auth';
import { NotificacaoContext, NotificacaoContextData } from '../../../contexts/NotificacaoProvider';
import { Empresa } from '../../../models/empresa';
import { PermissaoEnum } from '../../../models/enums/permissaoEnum';

import styles from './styles';
import { getDataAtualFormatada, getDataLocalZone, getHoraLocalZone, removerHoraDaData } from '../../../helpers/dataHelpers';
import { fotoCollegato } from '../../../global/fotoCollegato';
import Alerta from '../../../components/Alerta';
import { ROUTES } from '../../../routes/config/routesNames';
import { tratarIdEmpresaChat } from '../../../helpers/chatHelpers';
import { Disponibilidade } from '../../../models/disponibilidade';
import { StatusReservaEnum } from '../../../models/enums/statusReservaEnum';


interface ScheduleParams {
    empresaId: number;
    salaId: number;
}

const mockSalaAberta: Sala = {
    id: 1,
    empresaId: 1,
    nome: "Sala A",
    status: StatusEnum.Ativo,
    multiplasMarcacoes: true,
    disponibilidades: [
        {
            id: 1,
            ativo: true,
            hrAbertura: "10:30",
            hrFim: "17:30",
            intervaloMinutos: 30,
            minDiasCan: 4,
            salaId: 1,
            diaSemana: 'dom',
            diaSemanaIndex: 0,
        },
        {
            id: 2,
            ativo: true,
            hrAbertura: "08:00",
            hrFim: "18:00",
            intervaloMinutos: 30,
            minDiasCan: 4,
            salaId: 1,
            diaSemana: 'seg',
            diaSemanaIndex: 1,
        },
        {
            id: 3,
            ativo: true,
            hrAbertura: "08:00",
            hrFim: "18:00",
            intervaloMinutos: 30,
            minDiasCan: 4,
            salaId: 1,
            diaSemana: 'ter',
            diaSemanaIndex: 2,
        },
        {
            id: 4,
            ativo: true,
            hrAbertura: "08:00",
            hrFim: "18:00",
            intervaloMinutos: 30,
            minDiasCan: 4,
            salaId: 1,
            diaSemana: 'qua',
            diaSemanaIndex: 3,
        },
        {
            id: 5,
            ativo: true,
            hrAbertura: "08:00",
            hrFim: "18:00",
            intervaloMinutos: 30,
            minDiasCan: 4,
            salaId: 1,
            diaSemana: 'qui',
            diaSemanaIndex: 4,
        },
        {
            id: 6,
            ativo: true,
            hrAbertura: "08:00",
            hrFim: "18:00",
            intervaloMinutos: 30,
            minDiasCan: 4,
            salaId: 1,
            diaSemana: 'sex',
            diaSemanaIndex: 5,
        },
        {
            id: 7,
            ativo: false,
            hrAbertura: "08:00",
            hrFim: "18:00",
            intervaloMinutos: 30,
            minDiasCan: 4,
            salaId: 1,
            diaSemana: 'sab',
            diaSemanaIndex: 6,
        }
    ]
}

const horaSalaAberta: HoraSalaAberta = {
    horaInicio: "08:00",
    horaFim: "18:00",
    intervaloSessao: 60,
}

const agendamentoMock: Reserva[] = [
    {
        ...reservaEmpty,
        id: 1,
        date: "2022-10-28",
        horaInicio: "08:00",
        horaFim: "10:00"
    },
    {
        ...reservaEmpty,
        id: 2,
        date: "2022-10-28",
        horaInicio: "11:00",
        horaFim: "12:00"
    },
    {
        ...reservaEmpty,
        id: 3,
        date: "2022-10-28",
        horaInicio: "13:00",
        horaFim: "16:00"
    }
]

const _agendamentos: Agendamento[] = [
    {
        data: "2022-10-28",
        horas: [
            "08:00",
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00",
        ]
    },
    {
        data: "2022-10-06",
        horas: [
            "08:00",
            "10:00",
            "13:00",
            "15:00",
        ]
    },
    {
        data: "2022-10-23",
        horas: [
            "10:00",
            "11:30",
            "13:00",
            "15:00",
        ]
    },
    {
        data: "2022-10-12",
        horas: [
            "08:00",
            "10:00",
            "13:00",
            "15:00",
        ]
    },
    {
        data: "2022-10-20",
        horas: [
            "08:30",
            "10:00",
            "13:30",
            "15:00",
        ]
    }
]

interface ControleHoras {
    horaMenor: HoraAgendamento;
    horaMaior: HoraAgendamento;
}

const Schedule: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<PrivateStackParams>>();
    const { usuarioLogado, pessoaLogada } = useContext<ILoginData>(AuthContext);
    const { showNotificacao } = useContext<NotificacaoContextData>(NotificacaoContext);

    const scrollViewRef = useRef<any>();
    const flatListRef = useRef<FlatList>();
    const screenIsFocused = useIsFocused();
    const route = useRoute();
    const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
    const [showHoraProgressBar, setShowHoraProgressBar] = useState<boolean>(false);
    const [modalLoading, setModalLoading] = useState<boolean>(false);
    const [params, setParams] = useState<ScheduleParams>();
    const [blockButton, setBlockButton] = useState<boolean>(false);
    const [salaAgendando, setSalaAgendando] = useState<Sala>();
    const [empresaAgendando, setEmpresaAgendando] = useState<Empresa>();
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [horaLabel, setHoraLabel] = useState<string>();

    const [anoSelecionado, setAnoSelecionado] = useState<number>(0);
    const [mesSelecionado, setMesSelecionado] = useState<number>(0);
    const [diaAgendamentoSelecionado, setDiaAgendamentoSelecionado] = useState<DiaAgendamento>();
    const [listaHoras, setListaHoras] = useState<string[]>([]);
    const [horasSelecionadas, setHorasSelecionadas] = useState<HoraAgendamento[]>([]);
    const [dias, setDias] = useState<DiaAgendamento[]>([]);
    const [horas, setHoras] = useState<HoraAgendamento[]>([]);
    const [horaInicio, setHoraInicio] = useState<string>("");
    const [horaFim, setHoraFim] = useState<string>("");
    const [observacao, setObservacao] = useState<string>("");

    // Controle Formulário
    const [disableSetaEsquerda, setDisableSetaEsquerda] = useState<boolean>(true);
    const [visualizarAgendamento, setVisualizarAgendamento] = useState<boolean>(false);
    // Controle Modal Dados Agendamento
    const [modalAgendamentoVisible, setModalAgendamentoVisible] = useState(false);
    const openModalAgendamento = () => setModalAgendamentoVisible(true);
    const closeModalAgendamento = () => setModalAgendamentoVisible(false);

    // QUANDO A TELA ESTIVER EM FOCO (INICIADA)
    useFocusEffect(
        useCallback(() => {
            buscarDadosIniciais();
        }, [])
    );

    useEffect(() => {
        let dataAtual = new Date();
        let mesAtual = dataAtual.getMonth() + 1;

        if (dias.length > 0 && mesSelecionado == mesAtual) {
            let diaAtual = getDataAtualFormatada("dd");
            flatListRef.current?.scrollToIndex({ animated: false, index: Number(diaAtual) - 1 });
        }
        else if (dias.length > 0) {
            flatListRef.current?.scrollToIndex({ animated: false, index: 0 });
        }

    }, [dias]);

    useEffect(() => {
        if (mesSelecionado) {
            alterarMes();
        }
    }, [mesSelecionado, anoSelecionado]);

    async function alterarMes() {
        try {
            setBlockButton(true);
            toggleSetasMesAno();
            await atualizarListaAgendamentos();
            gerarListaHoras();
            tratarHorasParaAgendamento();
            setBlockButton(false);
        }
        catch(error) {
            setBlockButton(false);
        }
    }  

    useEffect(() => {
        if (listaHoras.length > 0) {
            tratarListaDeDias();
        }
    }, [listaHoras]);

    useEffect(() => {
        if (diaAgendamentoSelecionado) {
            atualizarListaHoras();
        }
    }, [diaAgendamentoSelecionado]);

    // QUANDO A TELA SAIR DO FOCO (FINALIZADA)
    useEffect(() => {
        if (!screenIsFocused) {
            // clearScreenState();
        }
    }, [screenIsFocused]);

    function atualizarListaHoras() {
        setShowHoraProgressBar(true);
        gerarListaHoras();
        tratarHorasParaAgendamento();
        setShowHoraProgressBar(false);
    }

    function toggleSetasMesAno() {
        setDiaAgendamentoSelecionado(null);
        let dataAtual = new Date();
        let mesAtual = dataAtual.getMonth() + 1;
        let anoAtual = dataAtual.getFullYear();

        if (mesSelecionado > mesAtual && anoAtual >= anoSelecionado)
            setDisableSetaEsquerda(false);
        else if (anoAtual == anoSelecionado)
            setDisableSetaEsquerda(true);

    }

    function tratarListaDeDias() {
        let diasNoMes = new Date(anoSelecionado, mesSelecionado, 0).getDate();

        let novaListaDeDias: DiaAgendamento[] = [];
        for (let i = 0; i < diasNoMes; i++) {
            let diaIndex = i + 1;
            let data = new Date(anoSelecionado, mesSelecionado - 1, diaIndex);
            let ano = data.getFullYear();
            let mes = data.getMonth() + 1;
            let dia = data.getDate();
            let mesString = mes < 10 ? `0${mes}` : mes;
            let diaString = dia < 10 ? `0${dia}` : dia;
            let dataCompleta = `${ano}-${mesString}-${diaString}`;

            let diaAgendamento: DiaAgendamento = {
                dia,
                diaSemana: DiasSemanaAbreviado[data.getDay()],
                diaSemanaIndex: data.getDay(),
                disponivel: validarDiaDisponivel(dataCompleta, data),
                dataCompleta
            };

            novaListaDeDias.push(diaAgendamento);
        }
        setDias(novaListaDeDias);
    }

    function validarDiaDisponivel(dataCompleta: string, data: Date): boolean {
        let diaIndisponivel = false;
        let agendamentoDoDia = agendamentos.find(e => e.data === dataCompleta);

        if (agendamentoDoDia) {
            const intersection = agendamentoDoDia.horas.filter(h => listaHoras.includes(h));
            if (intersection.length === listaHoras.length)
                diaIndisponivel = true;
        }

        const dataAtual = new Date();
        if (data.getDate() < dataAtual.getDate() && data.getMonth() == dataAtual.getMonth())
            diaIndisponivel = true;

        let disponibilidade = salaAgendando.disponibilidades.find(e => e.diaSemanaIndex == data.getDay());
        if (!disponibilidade?.ativo)
            diaIndisponivel = true;

        if (diaIndisponivel)
            return false;

        return true;
    }

    async function buscarDadosIniciais() {
        const _params = route.params as ScheduleParams;
        if (_params) {
            if (_params.empresaId && _params.salaId) {
                await buscarEmpresa(_params.empresaId, _params.salaId);
            }
            setParams(route.params as ScheduleParams);
        }
    }

    async function buscarEmpresa(empresaId: number, salaId: number) {
        setModalLoading(true);

        let resultado = await getEmpresaPorId(empresaId);
        if (!resultado.success) {
            setModalLoading(false);
            showNotificacao(resultado.message, 'danger');
            setEmpresaAgendando(null);
            setSalaAgendando(null);
            return;
        }

        let resultadoSala = await getSalaPorId(salaId);
        if (!resultadoSala.success) {
            setModalLoading(false);
            showNotificacao(resultadoSala.message, 'danger');
            setEmpresaAgendando(null);
            setSalaAgendando(null);
            return;
        }

        setSalaAgendando(resultadoSala.result);
        setEmpresaAgendando(resultado.result);

        const dataAtual = new Date();
        const ano = dataAtual.getFullYear();
        const mes = dataAtual.getMonth() + 1;

        setAnoSelecionado(ano);
        setMesSelecionado(mes);
        setModalLoading(false);
    }

    async function atualizarListaAgendamentos() {
        let resultadoReservas = await getReservasPorDataESalaPaginado(mesSelecionado, anoSelecionado, salaAgendando.id, { order: 'DESC' });
        if (!resultadoReservas.success) {
            showNotificacao(resultadoReservas.message, 'danger');
            return;
        }

        let novaLista = resultadoReservas.result.filter(e => {
            let index = e.statusReserva.findIndex(e => {
                if(e.statusId == StatusReservaEnum.Cancelado || e.statusId == StatusReservaEnum.Finalizado || e.statusId == StatusReservaEnum.Reprovado) {
                    return true;
                }

                return false;
            });

            if(index < 0) {
                return e;
            }
        });

        tratarReservas(novaLista);
    }

    function tratarHorasParaAgendamento() {
        let _listaHoras = gerarListaHoras();

        if(_listaHoras == undefined || !_listaHoras)
            return;

        let dataAtual = getDataLocalZone(new Date(), "yyyy-MM-dd");
        let dataAtualSelecionada = dataAtual == diaAgendamentoSelecionado?.dataCompleta;
        let horaAtual = getHoraLocalZone(new Date());
        let horaAtualNumero = converterHoraEmNumero(horaAtual);

        let listaHorasParaAgendar: HoraAgendamento[] = [];
        _listaHoras.forEach((h, index) => {
            let agendamentoDoDia = agendamentos.find(e => {
                if (e.data === diaAgendamentoSelecionado?.dataCompleta)
                    return e;
            });

            let horaParaAgendar: HoraAgendamento = {
                hora: h,
                disponivel: true,
                index
            };

            if (converterHoraEmNumero(h) < horaAtualNumero && dataAtualSelecionada) {
                horaParaAgendar.disponivel = false;
            }

            if (agendamentoDoDia) {
                if (agendamentoDoDia.horas.includes(h)) {
                    horaParaAgendar.disponivel = false;
                }
            }

            listaHorasParaAgendar.push(horaParaAgendar);
        });
        setListaHoras(_listaHoras);
        setHoras(listaHorasParaAgendar);
    }

    function tratarReservas(reservas: Reserva[]): Agendamento[] {
        if (reservas == undefined || !reservas)
            return;

        let agendamentos: Agendamento[] = [];

        const datasAgendadas = reservas.map(e => {
            if (e.date.includes("T")) {
                return e.date.split("T")[0];
            }
            else {
                return e.date;
            }
        }).filter((value, index, self) => self.indexOf(value) === index);

        datasAgendadas.forEach(dataAgendada => {
            let agendamento: Agendamento = {} as Agendamento;
            agendamento.data = dataAgendada;
            agendamento.horas = [];

            reservas.map(agendamentoItem => {
                if (removerHoraDaData(agendamentoItem.date) == dataAgendada) {
                    let disponibilidade = salaAgendando.disponibilidades.find(e => e.diaSemanaIndex == agendamentoItem.diaSemanaIndex);
                    let arrayHoras = gerarIntervaloDeHoras(agendamentoItem.horaInicio, agendamentoItem.horaFim, disponibilidade.intervaloMinutos);
                    agendamento.horas = [...agendamento.horas, ...arrayHoras];
                }
            });

            agendamentos.push(agendamento);
        });

        setAgendamentos(agendamentos);
    }

    function gerarListaHoras(): string[] {
        if(salaAgendando == undefined || salaAgendando.disponibilidades == undefined || !salaAgendando.disponibilidades)
            return;

        let disponibilidade = salaAgendando.disponibilidades.find(e => e.diaSemanaIndex == 0);

        if (diaAgendamentoSelecionado) {
            disponibilidade = salaAgendando.disponibilidades.find(e => e.diaSemanaIndex == diaAgendamentoSelecionado.diaSemanaIndex);
        }

        let horaStringList: string[] = [];
        let horaString: string = "";

        let hrAbertura = "08:00";
        let hrFechamento = "18:00";
        let intervalo = 60;

        if (disponibilidade) {
            hrAbertura = disponibilidade.hrAbertura;
            hrFechamento = disponibilidade.hrFim;
            intervalo = disponibilidade.intervaloMinutos;
        }

        let horaInicio = Number(hrAbertura.split(":")[0]);
        let horaInicioNumero = converterHoraEmNumero(hrAbertura);

        let horaFimNumero = converterHoraEmNumero(hrFechamento);
        let dataManipulada = new Date(2022, 10, 18, horaInicio - 3, 0);

        while (horaInicioNumero < horaFimNumero) {
            horaString = getHoraDaData(dataManipulada);
            horaInicioNumero = converterHoraEmNumero(horaString);
            dataManipulada = addMinutes(new Date(dataManipulada), intervalo);
            horaStringList.push(horaString);
        }

        horaStringList.pop();
        setListaHoras(horaStringList);
        return horaStringList;
    }

    function gerarIntervaloDeHoras(horaInicio: string, horaFim: string, intervalo: number): string[] {
        let horaStringList: string[] = [];
        let horaString: string = "";

        let _horaInicio = Number(horaInicio.split(":")[0]);
        let _minutoInicio = Number(horaInicio.split(":")[1]);
        let horaInicioNumero = converterHoraEmNumero(horaInicio);
        let horaFimNumero = converterHoraEmNumero(horaFim);
        
        let dataManipulada = new Date(2022, 10, 18, _horaInicio - 3, _minutoInicio);

        while (horaInicioNumero < horaFimNumero) {
                horaString = getHoraDaData(dataManipulada);
                horaInicioNumero = converterHoraEmNumero(horaString);
                dataManipulada = addMinutes(new Date(dataManipulada), intervalo);
                horaStringList.push(horaString);
        }

        horaStringList.pop();
        return horaStringList;
    }

    function getHoraDaData(data: Date): string {
        let horaInteira = data.toISOString().split("T")[1];
        let hora = horaInteira.split(":")[0];
        let minuto = horaInteira.split(":")[1];
        return `${hora}:${minuto}`;
    }

    function addMinutes(date: Date, minutes: number): Date {
        return new Date(date.getTime() + minutes * 60000);
    }

    function removeMinutes(date: Date, minutes: number): Date {
        return new Date(date.getTime() - minutes * 60000);
    }

    function onPressLeft() {
        if(blockButton)
            return;

        let proximoMes = mesSelecionado - 1;
        let dataAtual = new Date();
        let mesAtual = dataAtual.getMonth() + 1;
        let anoAtual = dataAtual.getFullYear();

        if (proximoMes < 1) {
            let proximoAno = anoSelecionado - 1;
            proximoMes = 12;
            setAnoSelecionado(proximoAno);
        }

        if (proximoMes < mesAtual && anoAtual == anoSelecionado) {
            return;
        }

        setMesSelecionado(proximoMes);
    }

    function onPressRight() {
        if(blockButton)
            return;

        let proximoMes = mesSelecionado + 1;
        if (proximoMes > 12) {
            let proximoAno = anoSelecionado + 1;
            proximoMes = 1;
            setAnoSelecionado(proximoAno);
        }

        setMesSelecionado(proximoMes);
    }

    function onSelectDia(dia: DiaAgendamento) {
        if (!dia.disponivel) {
            showNotificacao("Este dia não está disponível", 'danger');
            return;
        }

        setDiaAgendamentoSelecionado(dia);
    }

    function onSelectHora(hora: HoraAgendamento) {
        let dataAtual = getDataLocalZone(new Date(), "yyyy-MM-dd");
        let horaAtual = getHoraLocalZone(new Date());
        let horaAtualNumero = converterHoraEmNumero(horaAtual);
        let horaNaoDisponivel = dataAtual == diaAgendamentoSelecionado?.dataCompleta && converterHoraEmNumero(hora.hora) < horaAtualNumero;

        if (!hora.disponivel || horaNaoDisponivel) {
            showNotificacao("Este horário não está disponível", 'danger');
            return;
        }

        if (salaAgendando && salaAgendando.multiplasMarcacoes) {
            if (horasSelecionadas.length >= 1) {
                let resultado = separarMenorEMaiorHora(horasSelecionadas);

                if ((resultado.horaMenor.index - 1 == hora.index || resultado.horaMenor.index == hora.index - 1) || (resultado.horaMaior.index == hora.index + 1 || resultado.horaMaior.index + 1 == hora.index)) {
                    setHorasSelecionadas(oldHoras => {
                        return [...oldHoras, hora];
                    });
                    return;
                }
            }
        }

        setHorasSelecionadas([hora]);
    }

    function separarMenorEMaiorHora(_horasSelecionadas: HoraAgendamento[]): ControleHoras {
        let resultado: ControleHoras = {
            horaMenor: {} as HoraAgendamento,
            horaMaior: {} as HoraAgendamento,
        }

        if (_horasSelecionadas.length == 1) {
            resultado.horaMenor = _horasSelecionadas[0];
            resultado.horaMaior = _horasSelecionadas[0];
            return resultado;
        }

        let horaMenor = _horasSelecionadas.reduce((prev, current) => {
            return (prev.index < current.index) ? prev : current;
        });

        let horaMaior = _horasSelecionadas.reduce((prev, current) => {
            return (prev.index > current.index) ? prev : current;
        });

        resultado.horaMenor = horaMenor;
        resultado.horaMaior = horaMaior;
        return resultado;
    }

    function onRemoveHora(hora: HoraAgendamento) {
        let horasIndexMenores: HoraAgendamento[] = [];
        let horasIndexMaiores: HoraAgendamento[] = [];

        horasSelecionadas.forEach(item => {
            if (item.index < hora.index) {
                horasIndexMenores.push(item);
            }
            else if (item.index > hora.index) {
                horasIndexMaiores.push(item);
            }
        });

        let novaLista: HoraAgendamento[] = []

        if (horasIndexMenores.length > horasIndexMaiores.length) {
            novaLista = horasSelecionadas.filter(item => {
                if (item.index < hora.index)
                    return item;
            })
        }
        else if (horasIndexMenores.length < horasIndexMaiores.length) {
            novaLista = horasSelecionadas.filter(item => {
                if (item.index > hora.index)
                    return item;
            })
        }

        setHorasSelecionadas(novaLista);
    }

    async function submit() {
        if (!horaInicio && !horaFim) {
            showNotificacao("Selecione uma hora para agendar", 'danger');
            return;
        }

        let novaReserva: Reserva = {
            id: 0,
            date: diaAgendamentoSelecionado.dataCompleta,
            horaInicio: horaInicio,
            horaFim: horaFim,
            observacao: observacao,
            // diaSemana: DiasSemana[diaAgendamentoSelecionado.diaSemanaIndex],
            diaSemanaIndex: diaAgendamentoSelecionado.diaSemanaIndex,
            salaId: salaAgendando.id,
            usuarioId: usuarioLogado.id,
        }

        setShowProgressBar(true);
        let resultado = await postAdicionarReserva(novaReserva);

        if (!resultado.success) {
            setShowProgressBar(false);
            showNotificacao(resultado.message, 'danger');
            return;
        }

        showNotificacao(resultado.message, 'success');
        setShowProgressBar(false);

        // CRIAR O CHAT ENTRE O USUÁRIO E A EMPRESA E A EMPRESA E O USUÁRIO
        createChatList();

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: ROUTES.compromisso },
                ],
            })
        );
    }

    function createChatList() {
        let quemFezAReservaId = 0;
        let quemFezAReservaNome = "";
        let quemEstaLogadoFoto = "";

        switch (usuarioLogado.permissaoId) {
            case PermissaoEnum.Cliente:
                quemFezAReservaId = usuarioLogado.id;
                quemFezAReservaNome = pessoaLogada.nome;
                quemEstaLogadoFoto = pessoaLogada.foto;
                break;
            case PermissaoEnum.Administrador:
                quemFezAReservaId = collegatoChatId;
                quemFezAReservaNome = "Collegato";
                quemEstaLogadoFoto = fotoCollegato;
                break;
            default:
                quemFezAReservaNome = usuarioLogado.empresa.nome;
                quemFezAReservaId = tratarIdEmpresaChat(usuarioLogado.empresa.id);
                quemEstaLogadoFoto = usuarioLogado.empresa.logo;
                break;
        }

        let quemRecebeuAReservaFoto = empresaAgendando.logo;
        let quemRecebeuAReservaNome = empresaAgendando.nome;
        let quemRecebeuAReservaId = tratarIdEmpresaChat(empresaAgendando.id);

        const salaId = uuid.v4();

        let endpointQuemRecebeuAReserva = `${chatListRecadosEndPoint}/${quemRecebeuAReservaId}/${quemFezAReservaId}`;

        let dadosUsuarioLogado: Chat = {
            usuarioId: quemFezAReservaId,
            salaId: salaId,
            nome: quemFezAReservaNome,
            foto: quemEstaLogadoFoto,
            ultimaMensagem: "",
            viuUltimaMensagem: true,
        }

        const referenceChatListOne = ref(chatDatabase, endpointQuemRecebeuAReserva);
        update(referenceChatListOne, dadosUsuarioLogado).then(() => console.log("Data updated"));

        let endpointQuemFezAReserva = `${chatListRecadosEndPoint}/${quemFezAReservaId}/${quemRecebeuAReservaId}`;

        let usuarioData: Chat = {
            usuarioId: quemRecebeuAReservaId,
            salaId: salaId,
            nome: quemRecebeuAReservaNome,
            foto: quemRecebeuAReservaFoto,
            ultimaMensagem: "",
            viuUltimaMensagem: true,
        }
        const referenceChatListTwo = ref(chatDatabase, endpointQuemFezAReserva);
        update(referenceChatListTwo, usuarioData).then(() => console.log("Data updated"));
    }

    function onPressAgendar() {
        setHoraAgendamento();
        setVisualizarAgendamento(true);
    }

    function onPressCancelar() {
        setDiaAgendamentoSelecionado(null);
        setHoraFim("");
        setHoraInicio("");
        setHoraLabel("");
        setHorasSelecionadas([]);
        setObservacao("");
        setVisualizarAgendamento(false);
    }

    function converterHoraEmNumero(hora: string): number {
        let horaNumero = Number(hora.split(":")[0]);
        let minutoNumero = Number(hora.split(":")[1]);
        let numeroFinal = parseFloat(`${horaNumero}.${minutoNumero}`);

        return numeroFinal;
    }

    function horaEstaSelecionada(hora: HoraAgendamento): boolean {
        return horasSelecionadas.includes(hora);
    }

    function setHoraAgendamento() {
        let _horaLabel = "";
        let _horaInicio = "";
        let _horaFim = "";
        let dataManipulada: Date = null;
        let disponibilidade: Disponibilidade = salaAgendando.disponibilidades.find(e => e.diaSemanaIndex == diaAgendamentoSelecionado?.diaSemanaIndex);

        switch (horasSelecionadas.length) {
            case 1:
                let horaInicioNumber = Number(horasSelecionadas[0].hora.split(":")[0]);
                let minutoInicioNumber = Number(horasSelecionadas[0].hora.split(":")[1]);
                let horaInicioCompleta = "";
                let horaFimCompleta = "";

                dataManipulada = new Date(2022, 10, 18, horaInicioNumber - 3, minutoInicioNumber);
                horaInicioCompleta = getHoraDaData(dataManipulada);
                if (disponibilidade) {
                    dataManipulada = addMinutes(dataManipulada, disponibilidade.intervaloMinutos);
                    horaFimCompleta = getHoraDaData(dataManipulada);
                }

                _horaInicio = horaInicioCompleta;
                _horaFim = horaFimCompleta;
                _horaLabel = `De ${horaInicioCompleta} as ${horaFimCompleta}`;
                break;
            case 0:
                _horaLabel = "Selecione uma hora";
                break;
            default:
                let horaSelecionadaIncio = horasSelecionadas.reduce((prev, current) => {
                    return (prev.index < current.index) ? prev : current;
                });

                let horaSelecionadaFim = horasSelecionadas.reduce((prev, current) => {
                    return (prev.index > current.index) ? prev : current;
                });

                let horaFimNumber = Number(horaSelecionadaFim.hora.split(":")[0]);
                let minutoFimNumber = Number(horaSelecionadaFim.hora.split(":")[1]);

                dataManipulada = new Date(2022, 10, 18, horaFimNumber - 3, minutoFimNumber);
                if (disponibilidade) {
                    dataManipulada = addMinutes(dataManipulada, disponibilidade.intervaloMinutos);
                    horaFimCompleta = getHoraDaData(dataManipulada);
                }

                _horaInicio = horaSelecionadaIncio.hora;
                _horaFim = horaFimCompleta;
                _horaLabel = `De ${horaSelecionadaIncio.hora} as ${horaFimCompleta}`;
                break;
        }

        setHoraLabel(_horaLabel);
        setHoraInicio(_horaInicio);
        setHoraFim(_horaFim);
    }

    return (
        <View style={[styles.contain]}>
            {empresaAgendando ?
                (
                    <>
                        <SemiHeader titulo={`Agendando ${empresaAgendando.nome}`} />

                        <ScrollView style={styles.containContent} contentContainerStyle={{ justifyContent: 'space-between' }}>
                            <View style={styles.companieContainer}>
                                <Card
                                    title={salaAgendando.nome}
                                    subtitle={empresaAgendando.categoria.descricao}
                                    left={(
                                        <Avatar.Image size={60} source={{ uri: `data:image/jpeg;base64,${empresaAgendando.logo}` }} />
                                    )}
                                />
                            </View>

                            {visualizarAgendamento && (
                                <View style={styles.roomContainer}>
                                    <Card
                                        title="Detalhes do agendamento - Sala A"
                                        subtitle='Responsável pela sala'
                                    >
                                        <List.Item
                                            title="Ano Agendamento"
                                            right={props => <Subheading>{anoSelecionado}</Subheading>}
                                        />
                                        <List.Item
                                            title="Mês Agendamento"
                                            right={props => <Subheading>{getNomeMesPorNumero(mesSelecionado)}</Subheading>}
                                        />

                                        <List.Item
                                            title="Dia Agendamento"
                                            right={props =>
                                                <Subheading>
                                                    {diaAgendamentoSelecionado ? (
                                                        `${diaAgendamentoSelecionado.dia} - ${diaAgendamentoSelecionado.diaSemana}`
                                                    ) : (
                                                        "Seleciona um dia..."
                                                    )}
                                                </Subheading>}
                                        />

                                        <List.Item
                                            title="Hora Agendamento"
                                            right={props =>
                                                <Subheading>
                                                    {horaLabel}
                                                </Subheading>}
                                        />

                                        <Input
                                            style={styles.inputs}
                                            multiline
                                            maxLenght={100}
                                            onChange={setObservacao}
                                            value={observacao}
                                            label="Observação"
                                        />
                                    </Card>
                                </View>
                            )}

                            <View style={styles.roomContainer}>
                                {salaAgendando.multiplasMarcacoes ? (
                                    <View style={[styles.notificacaoAlerta, styles.AlertaSucess]}>
                                        <Text style={styles.notificacaoAlertaText}>Esta sala aceita mais de um horario para agendar</Text>
                                    </View>
                                ) : (
                                    <View style={[styles.notificacaoAlerta, styles.AlertaWarning]}>
                                        <Text style={styles.notificacaoAlertaText}>Esta sala não aceita mais de um horario para agendar</Text>
                                    </View>
                                )}
                            </View>

                            {!visualizarAgendamento && (
                                <>
                                    <View style={[styles.calendarContainer, styles.shadow]}>
                                        <View style={styles.months}>
                                            <IconButton
                                                disabled={disableSetaEsquerda}
                                                icon="arrow-left"
                                                iconColor={MD2Colors.black}
                                                size={25}
                                                onPress={onPressLeft}
                                            />
                                            <Title style={styles.monthsLabel}><> {getNomeMesPorNumero(mesSelecionado)} - {anoSelecionado}</></Title>
                                            <IconButton
                                                icon="arrow-right"
                                                iconColor={MD2Colors.black}
                                                size={25}
                                                onPress={onPressRight}
                                            />
                                        </View>

                                        <FlatList
                                            style={styles.days}
                                            data={dias}
                                            ref={flatListRef}
                                            onScrollToIndexFailed={info => {
                                                const wait = new Promise(resolve => setTimeout(resolve, 500));
                                                wait.then(() => {
                                                    flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                                                });
                                              }}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item }) => {
                                                let styleItem = {};
                                                let styleDayItem = {};

                                                if (!item.disponivel) {
                                                    styleItem = styles.dayBlocked;
                                                }
                                                else {
                                                    styleItem = item.dia == diaAgendamentoSelecionado?.dia ? styles.dayItemSelected : styles.dayItemUnselected;
                                                    styleDayItem = item.dia != diaAgendamentoSelecionado?.dia && styles.dayItemTextUnselected;
                                                }

                                                return (
                                                    <TouchableOpacity
                                                        onPress={() => onSelectDia(item)}
                                                        style={[styles.dayItem]}>
                                                        <Text style={styles.dayWeekItemText}>{item.diaSemana}</Text>
                                                        <View style={[styles.dayItemContainer, styleItem]}>
                                                            <Text style={[styles.dayItemText, styleDayItem]}>{item.dia}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            }}
                                        />
                                    </View>


                                    {diaAgendamentoSelecionado && horas.length > 0 && (
                                        <FlatList
                                            contentContainerStyle={styles.hourContainer}
                                            data={horas}
                                            ref={scrollViewRef}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item }) => {
                                                let styleItem = {};
                                                let styleItemText = {};
                                                let horaSelecionada = horaEstaSelecionada(item);
                                                if (!item.disponivel) {
                                                    styleItem = styles.hourItemBlocked;
                                                }
                                                else {
                                                    styleItem = horaSelecionada ? styles.hourItemSelected : {};
                                                    styleItemText = horaSelecionada ? styles.hourItemTextSelected : {};
                                                }

                                                return (
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        <TouchableOpacity
                                                            style={[styles.hourItem, styleItem]}
                                                            onPress={() => onSelectHora(item)}
                                                            onLongPress={() => onRemoveHora(item)}
                                                        >
                                                            <Text style={[styles.hourItemText, styleItemText]}>{item.hora}</Text>
                                                        </TouchableOpacity>
                                                        {horaSelecionada && (
                                                            <IconButton
                                                                icon="close"
                                                                iconColor={MD2Colors.red400}
                                                                size={20}
                                                                onPress={() => onRemoveHora(item)}
                                                            />
                                                        )}
                                                    </View>
                                                )
                                            }}
                                        />
                                    )}
                                </>
                            )}


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
                            <View style={styles.btnsActions}>
                                {horasSelecionadas && horasSelecionadas.length > 0 && (
                                    <>
                                        {visualizarAgendamento && (
                                            <Button
                                                mode="text"
                                                textColor={MD2Colors.red400}
                                                contentStyle={styles.btnSendContainer}
                                                style={styles.btnSend}
                                                onPress={onPressCancelar}
                                            >
                                                Cancelar
                                            </Button>
                                        )}

                                        <Button
                                            mode="contained"
                                            contentStyle={styles.btnSendContainer}
                                            style={[styles.btnSend, !visualizarAgendamento && styles.btnSendAlone]}
                                            buttonColor={globalColors.primaryColor}
                                            onPress={() => {
                                                if (visualizarAgendamento) {
                                                    submit();
                                                }
                                                else {
                                                    onPressAgendar()
                                                }
                                            }}
                                        >
                                            {visualizarAgendamento ? "Confirmar Agendamento" : "Agendar"}
                                        </Button>
                                    </>
                                )}
                            </View>
                        </ScrollView>
                    </>
                )
                :
                (
                    <Alerta tipo='default'>
                        Empresa não encontrada, ou inexistente.
                    </Alerta>
                )
            }

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

export default Schedule;
