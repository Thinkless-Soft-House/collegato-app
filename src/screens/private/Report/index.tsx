import { useCallback, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Chip, Text } from "react-native-paper";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MotiView } from "moti";
import { LinearProgress } from "@rneui/themed";

import SemiHeader from "../../../components/SemiHeader";
import Alerta from "../../../components/Alerta";

import styles from "./styles";
import { ROUTES } from "../../../routes/config/routesNames";
import { globalColors } from "../../../global/styleGlobal";
import { AuthContext, ILoginData } from "../../../services/auth";
import { postReservaReport } from "../../../services/api/ReservaServices/postReservaReport";
import {
  NotificacaoContext,
  NotificacaoContextData,
} from "../../../contexts/NotificacaoProvider";
import { DatePickerModal } from "react-native-paper-dates";
import Input from "../../../components/Input";
import { getDataLocalZone } from "../../../helpers/dataHelpers";
import { addDays, setDate } from "date-fns";
import { UsuarioLoginDTO } from "../../../models/apiDTOs/usuario.dto";
import { getTodosUsuarios } from "../../../services/api/usuarioServices/getTodosUsuarios";

const Report: React.FC = () => {
  const { usuarioLogado, pessoaLogada } = useContext<ILoginData>(AuthContext);
  const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { showNotificacao } =
    useContext<NotificacaoContextData>(NotificacaoContext);
  const [range, setRange] = useState({
    startDate: undefined,
    endDate: undefined,
  });
  const [open, setOpen] = useState(false);
  const [chipSelected, setChipSelected] = useState<number>();

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(
    ({ startDate, endDate }) => {
      setOpen(false);
      setRange({ startDate, endDate });
    },
    [setOpen, setRange]
  );

  useEffect(() => {
    onPressChip(7);
  }, []);

  function onPressBack() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ROUTES.homeMenu }],
      })
    );
  }

  function onPressChip(daysRange: number) {
    setChipSelected(daysRange);
    const dataInicio = new Date();
    const dataFinal = addDays(new Date(), -daysRange);
    setRange({ startDate: dataInicio, endDate: dataFinal });
  }

  async function onPressReceberRelatorio() {
    setShowProgressBar(true);
    let resultado = await postReservaReport(
      usuarioLogado.id,
      range.startDate,
      range.endDate
    );
    setShowProgressBar(false);
    showNotificacao(
      resultado.message,
      resultado.success ? "success" : "danger"
    );
  }

  return (
    <>
      <SemiHeader goBack={onPressBack} titulo="Relátórios" />
      <View style={styles.contain}>
        <Text style={{ paddingHorizontal: 20 }} variant="titleMedium">
          Selecione o intervalo para filtrar o relatório:
        </Text>

        <View style={styles.containChip}>
          <Chip
            compact
            style={styles.chip}
            selected={chipSelected == 7}
            onPress={() => onPressChip(7)}
          >
            Últimos 7 Dias
          </Chip>

          <Chip
            compact
            style={styles.chip}
            selected={chipSelected == 15}
            onPress={() => onPressChip(15)}
          >
            Últimos 15 Dias
          </Chip>

          <Chip
            compact
            style={styles.chip}
            selected={chipSelected == 30}
            onPress={() => onPressChip(30)}
          >
            Últimos 30 Dias
          </Chip>
        </View>

        <View style={styles.containFilter}>
          <DatePickerModal
            locale="pt"
            label="Selecione o intervalo do relatório"
            startLabel="Início"
            endLabel="Fim"
            saveLabel="Confirmar"
            mode="range"
            visible={open}
            onDismiss={onDismiss}
            startDate={range.startDate}
            endDate={range.endDate}
            onConfirm={onConfirm}
          />

          <Input
            style={styles.inputs}
            label="Data de Início"
            onPress={() => setOpen(true)}
            editable={false}
            typeMask="datetime"
            keyboardType="number-pad"
            value={getDataLocalZone(range.endDate)}
          />

          <Input
            style={styles.inputs}
            label="Data Final"
            typeMask="datetime"
            onPress={() => setOpen(true)}
            keyboardType="number-pad"
            value={getDataLocalZone(range.startDate)}
          />
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
            icon="file-chart-outline"
            style={styles.btn}
            buttonColor={globalColors.secondaryColor}
            onPress={onPressReceberRelatorio}
          >
            RECEBER RELATÓRIO DE AGENDAMENTOS
          </Button>

          <Alerta
            textStyle={{ fontSize: 16 }}
            style={styles.alerta}
            tipo="warning"
          >
            Todos os relatórios desta tela, serão encaminhados para o e-mail
            logado. (Favor conferir a caixa de SPAM)
          </Alerta>
        </View>
      </View>
    </>
  );
};

export default Report;
