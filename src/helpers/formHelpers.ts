import { MaskService } from "react-native-masked-text";
import { getDataAtualFormatada } from "./dataHelpers";

export function textoNaoEhVazio(texto: string): boolean {
    return !(!texto || /^ *$/.test(texto))
}

export function removerPontuacaoDocumento(documento: string | number): string {
    if (!documento)
        return "";

    documento = documento.toString().replace(/[^a-zA-Z0-9 ]/g, '').replace(' ', '');
    return documento;
}

export function adicionarMascara(text: string, typeMask: 'document' | 'cpf' | 'cnpj' | 'zip-code' | 'cel-phone' | 'datetime'): any {
    if (!text)
        return "";

    if (!typeMask)
        return text;

    let _typeMask = typeMask;
    if (_typeMask == 'document') {
        _typeMask = "cpf";

        if (text.length > 14)
            _typeMask = "cnpj";
    }

    let options = {};

    if (_typeMask == 'datetime') {
        options = {
            format: 'DD/MM/YYYY'
        }
    }

    let textMasked = MaskService.toMask(_typeMask, text.toString(), options);
    return textMasked;
}

export function validarCPF(strCPF: string) {
    var Soma;
    var Resto;
    Soma = 0;
    strCPF = removerPontuacaoDocumento(strCPF);

    if (strCPF.length != 11 ||
		strCPF == "00000000000" ||
		strCPF == "11111111111" ||
		strCPF == "22222222222" ||
		strCPF == "33333333333" ||
		strCPF == "44444444444" ||
		strCPF == "55555555555" ||
		strCPF == "66666666666" ||
		strCPF == "77777777777" ||
		strCPF == "88888888888" ||
		strCPF == "99999999999")
			return false;

    for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return false;
    return true;
}

export function validarCNPJ(cnpj: string) {
    cnpj = removerPontuacaoDocumento(cnpj);

    if (cnpj == '') return false;

    if (cnpj.length != 14)
        return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;

    // Valida DVs
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += Number(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2)
            pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != Number(digitos.charAt(0)))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += Number(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != Number(digitos.charAt(1)))
        return false;

    return true;
}

export function validarData(data: string, dataNascimento: boolean = true): boolean {
    const dataObjeto = data.split("/");
    const ano = Number(dataObjeto[2]);
    const mes = Number(dataObjeto[1]);
    const dia = Number(dataObjeto[0]);

    const dataAtual = getDataAtualFormatada('dd/MM/yyyy');
    const dataAtualArray = dataAtual.split("/");
    const anoAtual = Number(dataAtualArray[2]);

    if(dataNascimento && ano > anoAtual)
        return false;

    if (mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12) {
        if (dia <= 31)
            return true;
        else
            return false;
    }
    else if (mes == 4 || mes == 6 || mes == 9 || mes == 11) {
        if (dia <= 30)
            return true;
        else
            return false;
    } else if (mes == 2) {
        if ((ano % 400 == 0) || (ano % 4 == 0 && ano % 100 != 0))
            if (dia <= 29)
                return true;
            else
                return false;
        else
            if (dia <= 28)
                return true;
            else
                return false;
    }
    else {
        return false;
    }
}
