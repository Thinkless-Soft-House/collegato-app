import { PaginacaoModel } from "./paginacaoModel";

export interface EmpresasFiltro extends PaginacaoModel {
    nomeEmpresa?: string;
    categoriaId?: number;
    possuiSala?: boolean;
}
