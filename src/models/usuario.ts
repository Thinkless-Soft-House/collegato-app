import { Empresa } from "./empresa";
import { ModeloBase } from "./modelBase";
import { Permissao } from "./permissao";
import { Pessoa } from "./pessoa";

export interface Usuario extends ModeloBase {
    id: number;
    senha: string;
    login: string;
    status: number;
    pushToken?: string;
    permissaoId: number;
    empresaId?: number;
    pessoaId?: number;
    token?: string;

    pessoa?: Pessoa;
    empresa?: Empresa;
    permissao?: Permissao;
}
