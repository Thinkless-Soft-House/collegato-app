import { Dimensions, Platform } from 'react-native';

export function gerarWidthPorcentagem(valor: string): any {
    if (plataformaIOS()) {
        let novoValor = Number(valor.replace("%", ""));
        novoValor = Number((novoValor * 0.01).toFixed(2));
        return (Dimensions.get('window').width * novoValor) - 23;
    }
    else {
        return valor;
    }
}

export function gerarHeightPorcentagem(valor: string): any {
    if (plataformaIOS()) {
        let novoValor = Number(valor.replace("%", ""));
        novoValor = Number((novoValor * 0.01).toFixed(2));
        return (Dimensions.get('window').height * novoValor) - 23;
    }
    else {
        return valor;
    }
}

export function plataformaIOS(): boolean {
    return Platform.OS === 'ios';
}