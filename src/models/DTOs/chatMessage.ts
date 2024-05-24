export interface ChatMessage {
    id: string | number[];
    salaId: string | number[];
    mensagem: string;
    from: number;
    to: number;
    data: string;
    tipoMensagem: string;
}
