import { CategoriaEmpresa } from "./categoriaEmpresa";
import { ModeloBase } from "./modelBase";

export interface Empresa  extends ModeloBase {
    categoriaId: number;
    logo: string;
    nome: string;
    telefone: string;
    cpfCnpj: string;
    cep: string;
    municipio: string;
    estado: string;
    pais: string;
    endereco: string;
    numeroEndereco: string;

    categoria?: CategoriaEmpresa;

    // Extras
    categoriaNome?: string;
}
