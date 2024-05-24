import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { View } from 'react-native';
import { Title, Surface, IconButton, MD2Colors } from 'react-native-paper';
import Input from '../../../../../components/Input';
import DropDown from '../../../../../components/DropDown';
import CheckBox from '../../../../../components/CheckBox';
import { converterHoraEmNumero, gerarIntervaloDeHoras } from '../../../../../helpers/scheduleHelpers';
import { Disponibilidade } from '../../../../../models/disponibilidade';

import styles from './styles';
import { NotificacaoContext, NotificacaoContextData } from '../../../../../contexts/NotificacaoProvider';

interface DisponibilidadeFormItemProps {
    item: Disponibilidade;
    onSend: (item: Disponibilidade) => void;
}

interface FormularioDisponibilidadeObjeto {
    ativo: boolean;
    intervaloMinutos: number;
    minDiasCan: number;
    hrAbertura: string;
    hrFim: string;
}

let schemaDisponibilidade = yup.object({
    ativo: yup.boolean(),
    intervaloMinutos: yup.number().required('Campo obrigatório'),
    minDiasCan: yup.number().required('Campo obrigatório'),
    hrAbertura: yup.string().required('Campo obrigatório'),
    hrFim: yup.string().required('Campo obrigatório'),
});

const intervalos = [
    { label: '15 em 15 (minutos)', value: 15 },
    { label: '30 em 30 (minutos)', value: 30 },
    { label: '1 em 1 (hora)', value: 60 },
]

const DisponibilidadeFormItem: React.FC<DisponibilidadeFormItemProps> = ({ item, onSend }) => {
    const { showNotificacao } = useContext<NotificacaoContextData>(NotificacaoContext);
    const [editando, setEditando] = useState<boolean>(false);
    const [intervaloAgendamento, setIntervaloAgendamento] = useState<number>(0);
    const [disponibilidadeEditando, setdisponibilidadeEditando] = useState<Disponibilidade>(item);
    const [listaHoras, setListaHoras] = useState([]);

    // Formulário
    const [ativo, setAtivo] = useState<boolean>(true);
    const [intervaloMinutos, setIntervaloMinutos] = useState<number>(0);
    const [minDiasCan, setMinDiasCan] = useState<string>("");
    const [hrAbertura, setHrAbertura] = useState<string>("");
    const [hrFim, setHrFim] = useState<string>("");

    const formDisp = useForm<FormularioDisponibilidadeObjeto>({
        resolver: yupResolver(schemaDisponibilidade),
    });

    useEffect(() => {
        if (intervaloAgendamento) {
            tratarIntervaloHoras(intervaloAgendamento);
        }
    }, [intervaloAgendamento]);

    function tratarIntervaloHoras(intervalo: number) {
        if(editando) {
            setHrAbertura("08:00");
            setHrFim("17:00");
        }

        const listaHoras = gerarIntervaloDeHoras("00:00", "23:00", intervalo);
        if (!listaHoras) {
            setListaHoras([]);
            return;
        }

        setListaHoras(listaHoras.map(e => {
            let objeto = { label: e, value: e };
            return objeto;
        }));
    }

    function onPressConfirmEditDisponibilidade() {
        let horaInicioNumero = converterHoraEmNumero(hrAbertura);
        let horaFimNumero = converterHoraEmNumero(hrFim);

        if(horaFimNumero < horaInicioNumero) {
            showNotificacao("A [Hora Fim] não pode ser menor que a [Hora Aberture]", 'danger');
            return;
        }

        let novaDisponibilidade: Disponibilidade = {
            ...disponibilidadeEditando,
            ativo,
            intervaloMinutos,
            minDiasCan: Number(minDiasCan),
            hrAbertura,
            hrFim,
        }

        onSend(novaDisponibilidade);
        onPressCancelEditDisponibilidade();
    }

    function onPressEditDisponibilidade(disponibilidade: Disponibilidade) {
            setdisponibilidadeEditando(disponibilidade);
            setDefaultValuesDisponibilidade(disponibilidade);
            setEditando(true);
    }

    function onPressCancelEditDisponibilidade() {
        setEditando(false);
        limparFormulario();
    }

    function setDefaultValuesDisponibilidade(disponibilidade: Disponibilidade): void {
        tratarIntervaloHoras(disponibilidade.intervaloMinutos);
        setAtivo(disponibilidade.ativo);
        setIntervaloMinutos(disponibilidade.intervaloMinutos);
        setMinDiasCan(disponibilidade.minDiasCan.toString());
        setHrAbertura(disponibilidade.hrAbertura);
        setHrFim(disponibilidade.hrFim);
    };

    function limparFormulario(): void {
        setAtivo(false);
        setIntervaloMinutos(0);
        setMinDiasCan("");
        setHrAbertura("");
        setHrFim("");
    };

    return (
        <Surface style={[styles.surface, styles.dispContainer]}>
            <View style={styles.dispHeader}>
                <Title style={styles.dispTitle}>{item.diaSemana}</Title>
            </View>

            {
                editando ?
                    // Mostrar formulário
                    (
                        <>
                            <View style={styles.dispItem}>
                                <Title>Dia Ativo</Title>
                                <CheckBox
                                    value={ativo}
                                    onChange={(valor) => { setAtivo(valor)}}
                                />
                            </View>

                            <View style={styles.dispItem}>
                                <Title>Intervalo (minutos)</Title>
                                <DropDown
                                    style={styles.dispIntervaloInput}
                                    label=""
                                    value={intervaloMinutos}
                                    onChange={value => {
                                        setIntervaloMinutos(value);
                                        setIntervaloAgendamento(value);
                                    }}
                                    list={intervalos}
                                />
                            </View>

                            <View style={styles.dispItem}>
                                <Title>Minimo dias de cancelamento</Title>
                                <Input
                                    style={styles.dispMinDiaInput}
                                    label=""
                                    keyboardType='number-pad'
                                    value={minDiasCan}
                                    onChange={setMinDiasCan}
                                    error={minDiasCan ? false : true}
                                    errorText={"Este campo é obrigatório"}
                                />
                            </View>

                            <View style={styles.dispItem}>
                                <Title>Hora Abertura</Title>
                                <DropDown
                                    style={styles.dispIntervaloInput}
                                    label=""
                                    value={hrAbertura}
                                    onChange={setHrAbertura}
                                    error={hrAbertura ? false : true}
                                    errorText={"Este campo é obrigatório"}
                                    list={listaHoras}
                                />
                            </View>

                            <View style={styles.dispItem}>
                                <Title>Hora Fim</Title>
                                <DropDown
                                    style={styles.dispIntervaloInput}
                                    label=""
                                    value={hrFim}
                                    onChange={setHrFim}
                                    error={hrFim ? false : true}
                                    errorText={"Este campo é obrigatório"}
                                    list={listaHoras}
                                />
                            </View>

                            <View style={[styles.dispActionContainer, styles.dispActionButtonsContainerEditing]}>
                                <IconButton
                                    style={styles.dispCancelButton}
                                    icon="close"
                                    iconColor={MD2Colors.red800}
                                    size={30}
                                    onPress={() => onPressCancelEditDisponibilidade()}
                                />
                                <IconButton
                                    style={[styles.dispButtonSend]}
                                    icon="check"
                                    iconColor={MD2Colors.green800}
                                    size={30}
                                    onPress={() => onPressConfirmEditDisponibilidade()}
                                />
                            </View>
                        </>
                    )

                    :
                    // Mostrar dados
                    (
                        <>
                            <View style={styles.dispItem}>
                                <Title>Dia Ativo?</Title>
                                <Title>{item.ativo ? "SIM" : "NÃO"}</Title>
                            </View>

                            <View style={styles.dispItem}>
                                <Title>Intervalo (minutos)</Title>
                                <Title>{item.intervaloMinutos}</Title>
                            </View>

                            <View style={styles.dispItem}>
                                <Title>Minimo dias de cancelamento</Title>
                                <Title>{item.minDiasCan}</Title>
                            </View>

                            <View style={styles.dispItem}>
                                <Title>Hora Abertura</Title>
                                <Title>{item.hrAbertura}</Title>
                            </View>

                            <View style={styles.dispItem}>
                                <Title>Hora Fim</Title>
                                <Title>{item.hrFim}</Title>
                            </View>

                            <View style={[styles.dispActionContainer]}>
                                <IconButton
                                    style={styles.dispButtonEdit}
                                    icon="pencil"
                                    iconColor={MD2Colors.black}
                                    size={25}
                                    onPress={() => onPressEditDisponibilidade(item)}
                                />
                            </View>
                        </>
                    )

            }
        </Surface>
    );
}

export default DisponibilidadeFormItem;
