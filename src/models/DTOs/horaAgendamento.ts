export interface HoraAgendamento {
    hora: string;
    disponivel: boolean;
    index: number;
}

export const HoraAgendamentoVazio: HoraAgendamento = {
    disponivel: false,
    hora: "",
    index: 0,
}
