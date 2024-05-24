export interface ReservaDTO {
    id: number;
    date: string;
    horaInicio: string;
    horaFim: string;
    observacao: string;
    status: string;
    diaSemanaIndex: number;
    salaId: number;
    usuarioId: number;
    empresaId: number;
    statusId: number;
}
