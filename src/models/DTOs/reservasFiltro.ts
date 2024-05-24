import { PaginacaoModel } from "./paginacaoModel";

export interface ReservasFiltro extends PaginacaoModel {
    usuarioId?: number;
    empresaId?: number;
    salaId?: number;
    status?: string;
    dia?: number;
    hinicio?: string;
    hfim?: string;
    data?: string;
    texto?: string;
}
