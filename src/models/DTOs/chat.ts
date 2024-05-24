export interface Chat {
    usuarioId: number;
    salaId: string | number[];
    nome: string;
    foto?: string;
    email?: string;
    ultimaMensagem: string;
    viuUltimaMensagem: boolean;
}
