export interface Disponibilidade {
    id: number;
    salaId: number;
    ativo: boolean;
    hrAbertura: string;
    hrFim: string;
    diaSemana: string;
    minDiasCan: number;
    diaSemanaIndex: number;
    intervaloMinutos: number;
}

export const disponibilidadeEmpty: Disponibilidade = {
    id: 0,
    salaId: 0,
    hrAbertura: "",
    hrFim: "",
    diaSemana: "",
    minDiasCan: 0,
    ativo: true,
    diaSemanaIndex: 0,
    intervaloMinutos: 0,
}
