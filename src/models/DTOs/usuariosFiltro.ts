import { PaginacaoModel } from "./paginacaoModel";

export interface UsuariosFiltro extends PaginacaoModel {
    nome?: string;
    empresaId?: number;
    permissaoId?: number;
    login?: string;
}
