import { utcToZonedTime, format, zonedTimeToUtc } from 'date-fns-tz';

export function getDataLocalZone(date: Date, pattern: string = "dd/MM/yyyy HH:mm:ss"): string {
    if(!date)
        return "";

    const timeZone: string = "America/Sao_Paulo";
    const zonedDate = utcToZonedTime(date, timeZone);
    const output = format(zonedDate, pattern, { timeZone: timeZone });
    return output.split(" ")[0];
}

export function getHoraLocalZone(date: Date): string {
    if(!date)
        return "";

    const timeZone: string = "America/Sao_Paulo";
    const zonedDate = utcToZonedTime(date, timeZone);
    const pattern = 'dd/MM/yyyy HH:mm';
    const output = format(zonedDate, pattern, { timeZone: timeZone });
    return output.split(" ")[1];
}

export function getDataFormatadaFiltro(date: string): string {
    if(!date)
        return "";

    const dataObjeto = date.split("/");
    const ano = dataObjeto[2];
    const mes = dataObjeto[1];
    const dia = dataObjeto[0];

    const novaData = `${ano}-${mes}-${dia}`;
    return novaData
}

export function getDataAtualFormatada(_format: string = 'dd/MM/yyyy HH:mm:ss'): string {    
    const date = new Date();
    const timeZone: string = "America/Sao_Paulo";
    const zonedDate = utcToZonedTime(date, timeZone);
    const pattern = _format;
    const output = format(zonedDate, pattern, { timeZone: timeZone });
    return output;
}

export function getDataAtual() {
    const date = new Date();
    const timeZone: string = "America/Sao_Paulo";
    const zonedDate = utcToZonedTime(date, timeZone);
    return zonedDate;
}

export function getDataFromStringData(dataTexto: string): Date {
    const arrayData = dataTexto.split(" ");
    const data = arrayData[0];
    const horas = arrayData[1];

    const dataObjeto = data.split("/");
    const ano = dataObjeto[2];
    const mes = dataObjeto[1];
    const dia = dataObjeto[0];

    const novaData = `${ano}-${mes}-${dia} ${horas}`;
    const timeZone: string = "America/Sao_Paulo";
    const utcDate = zonedTimeToUtc(novaData, timeZone);
    return utcDate;
}

export function getDataFormatadaParaCompromisso(dataTexto: string): string {
    const data = removerHoraDaData(dataTexto);
    const dataObjeto = data.split("-");
    const ano = dataObjeto[2];
    const mes = dataObjeto[1];
    const dia = dataObjeto[0];

    const novaData = `${ano}/${mes}/${dia}`;
    return novaData;
}

export function removerHoraDaData(data: string): string {
    if (data.includes("T")) {
        return data.split("T")[0];
    }
    else {
        return data;
    }
}
