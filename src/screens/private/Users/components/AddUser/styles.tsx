import { StyleSheet } from "react-native";
import { globalColors } from "../../../../../global/styleGlobal";
import { MD2Colors } from "react-native-paper";
import { gerarWidthPorcentagem } from "../../../../../helpers/styleHelpers";

const styles = StyleSheet.create({
  contain: {
    flex: 1,
  },

  inputs: {
    width: "100%",
  },

  containProgressBar: {
    width: "83%",
    alignSelf: "center",
  },

  btnSend: {
    width: gerarWidthPorcentagem("98%"),
    height: 50,
    justifyContent: "center",
  },

  marginTop10: {
    marginTop: 10,
  },

  btnsActions: {
    marginTop: 20,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  btnSendContainer: {
    height: "100%",
  },

  mtContent: {
    backgroundColor: MD2Colors.grey100,
  },

  subTitleFormContainer: {
    backgroundColor: globalColors.primaryColor,
    height: 50,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  subTitle: {
    color: MD2Colors.grey50,
  },

  // Estilos adicionados
  header: {
    flexDirection: "row", // Exibe o texto e o botão de ícone em linha
    justifyContent: "space-between", // Espaço entre o texto e o botão
    alignItems: "center", // Centraliza verticalmente
    backgroundColor: MD2Colors.grey200, // Cor de fundo para destacar
    padding: 10, // Espaçamento interno
    borderRadius: 8, // Arredondamento nos cantos
    marginBottom: 8, // Espaço abaixo do cabeçalho
  },

  headerText: {
    fontSize: 16, // Tamanho da fonte
    fontWeight: "bold", // Texto em negrito
    color: MD2Colors.grey800, // Cor do texto
  },

  section: {
    padding: 10, // Espaçamento interno
    backgroundColor: "#fff", // Fundo branco
    borderRadius: 8, // Arredondamento nos cantos
    marginBottom: 10, // Espaço abaixo da seção
  },
});

export default styles;
