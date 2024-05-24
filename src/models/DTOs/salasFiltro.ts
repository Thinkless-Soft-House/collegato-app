import { PaginacaoModel } from "./paginacaoModel";

export interface SalasFiltro extends PaginacaoModel {
    nomeSala?: string;
    empresaId?: number;
}
