import { StyleSheet, Dimensions } from "react-native";
import { globalColors } from "../../../global/styleGlobal";
import { MD2Colors } from "react-native-paper";
import { gerarWidthPorcentagem } from "../../../helpers/styleHelpers";

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  contain: {
    flex: 1,
  },

  montserrat: {
    fontFamily: "Montserrat",
  },

  containContent: {
    flex: 1,
    height: height - 31,
  },

  btnSend: {
    width: gerarWidthPorcentagem("98%"),
    height: 50,
    justifyContent: "center",
  },

  btnsActions: {
    width: "100%",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  btnSendContainer: {
    height: "100%",
  },

  inputs: {
    width: "100%",
  },

  containProgressBar: {
    width: "83%",
    alignSelf: "center",
  },

  condicaoUsoContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },

  checkboxContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
  },

  checkboxLabel: {
    fontSize: 15,
    fontWeight: "400",
    color: globalColors.primaryColor,
  },

  photoInput: {
    flex: 1,
    alignItems: "center",
  },

  photoInputLabelContainer: {
    width: "40%",
  },

  photoTitle: {
    fontSize: 18,
    fontWeight: "400",
    color: globalColors.primaryColor,
  },

  photoDescription: {
    fontWeight: "600",
  },

  photoInputAvatarButton: {},

  mtContent: {
    backgroundColor: MD2Colors.grey100,
  },

  hideBtn: {
    display: "none",
  },

  justifyBetween: {
    justifyContent: "space-between",
  },

  justifyCenter: {
    justifyContent: "center",
  },

  containUpSide: {
    flex: 1,
    marginTop: 10,
  },

  containImg: {
    height: 120,
  },

  imgLogo: {
    width: "100%",
    resizeMode: "contain",
    maxHeight: 100,
  },

  containBtn: {
    marginBottom: 20,
    alignItems: "center",
  },

  btnContinue: {
    width: "90%",
    backgroundColor: "#407f8a",
    paddingVertical: 10,
    borderRadius: 5,
  },

  btnPular: {
    width: "90%",
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#407f8a",
    paddingVertical: 10,
    borderRadius: 5,
  },

  textBtnContinue: {
    textAlign: "center",
    fontWeight: "900",
    letterSpacing: 2,
    fontSize: 15,
  },

  textWhite: {
    color: "#fff",
  },

  textBlue: {
    color: "#407f8a",
  },

  modalPdfStyle: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "white",
    height: 600,
    width: gerarWidthPorcentagem("100%"),
    borderTopLeftRadius: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  modalPdfContainer: {
    flex: 1,
    marginBottom: 130,
  },

  modalPdfHeader: {
    flexDirection: "row",
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: MD2Colors.grey300,
  },

  modalPdfTitleContainer: {
    marginTop: 10,
  },

  containerPdf: {
    flex: 1,
    marginBottom: 20,
    height: 500,
  },

  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
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
