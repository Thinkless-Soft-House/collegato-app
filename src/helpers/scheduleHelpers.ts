import { MesAgendamento } from "../models/DTOs/mesAgendamento";

export const Meses : MesAgendamento[] = [
    {
        numero: 1,
        nome: "Janeiro"
    },
    {
        numero: 2,
        nome: "Fevereiro"
    },
    {
        numero: 3,
        nome: "Março"
    },
    {
        numero: 4,
        nome: "Abril"
    },
    {
        numero: 5,
        nome: "Maio"
    },
    {
        numero: 6,
        nome: "Junho"
    },
    {
        numero: 7,
        nome: "Julho"
    },
    {
        numero: 8,
        nome: "Agosto"
    },
    {
        numero: 9,
        nome: "Setembro"
    },
    {
        numero: 10,
        nome: "Outubro"
    },
    {
        numero: 11,
        nome: "Novembro"
    },
    {
        numero: 12,
        nome: "Dezembro"
    },
];

export const DiasSemana: string[] =
["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

export const DiasSemanaAbreviado: string[] =
["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

export function getNomeMesPorNumero(numero: number): string {
    let nomeMes = Meses.find(e => e.numero == numero)?.nome;
    if(!nomeMes)
        return "";

    return nomeMes;
}

export function gerarIntervaloDeHoras(horaInicio: string, horaFim: string, intervalo: number): string[] {
    let horaStringList: string[] = [];
    let horaString: string = "";

    let _horaInicio = Number(horaInicio.split(":")[0]);
    let horaInicioNumero = converterHoraEmNumero(horaInicio);

    let horaFimNumero = converterHoraEmNumero(horaFim);
    let dataManipulada = new Date(2022, 10, 18, _horaInicio - 3, 0);

    while (horaInicioNumero < horaFimNumero) {
        horaString = getHoraDaData(dataManipulada);
        horaInicioNumero = converterHoraEmNumero(horaString);
        dataManipulada = addMinutes(new Date(dataManipulada), intervalo);
        horaStringList.push(horaString);
    }

    return horaStringList;
}

export function getHoraDaData(data: Date): string {
    let horaInteira = data.toISOString().split("T")[1];
    let hora = horaInteira.split(":")[0];
    let minuto = horaInteira.split(":")[1];
    return `${hora}:${minuto}`;
}

export function converterHoraEmNumero(hora: string): number {
    let horaNumero = Number(hora.split(":")[0]);
    let minutoNumero = Number(hora.split(":")[1]);
    let numeroFinal = parseFloat(`${horaNumero}.${minutoNumero}`);

    return numeroFinal;
}

export function addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
}
