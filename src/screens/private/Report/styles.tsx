import { StyleSheet } from "react-native";
import { gerarWidthPorcentagem } from "../../../helpers/styleHelpers";
import { globalColors } from "../../../global/styleGlobal";

const styles = StyleSheet.create({
  contain: {
    flex: 1,
    paddingTop: 20,
  },

  containFilter: {
    flexDirection: "row",
    justifyContent: "center",
  },

  containChip: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 20,
  },

  chip: {
    marginHorizontal: 5,
    backgroundColor: globalColors.tertiaryColor,
  },

  inputs: {
    width: 150,
  },

  btnsActions: {
    marginTop: 20,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  btn: {
    width: gerarWidthPorcentagem("98%"),
    height: 50,
    justifyContent: "center",
  },

  containProgressBar: {
    width: "83%",
    alignSelf: "center",
  },

  alerta: {
    width: gerarWidthPorcentagem("98%"),
    height: 60,
  },
});

export default styles;
