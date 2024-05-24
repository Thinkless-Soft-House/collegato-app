export class PessoaCreateDTO {
  nome: string;
  cpfCnpj: number;
  municipio: string;
  estado: string;
  pais: string;
  endereco: string;
  numero: number;
  cep: number;
  telefone: number;
  dataNascimento: string;
  foto: string;
}

export class PessoaUpdateDTO {
  id: number;
  nome: string;
  cpfCnpj: number;
  municipio: string;
  estado: string;
  pais: string;
  endereco: string;
  numero: number;
  telefone: number;
  cep: number;
  dataNascimento: string;
  foto: string;
}
