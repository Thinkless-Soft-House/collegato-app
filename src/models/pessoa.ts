import { ModeloBase } from "./modelBase";

export interface Pessoa extends ModeloBase {
  nome: string;
  cpfCnpj: string;
  municipio: string;
  estado: string;
  pais: string;
  endereco: string;
  numero: string;
  telefone: string;
  cep: string;
  dataNascimento: string;
  foto: string;
}
