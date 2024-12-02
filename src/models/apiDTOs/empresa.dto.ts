export class EmpresaCreateDTO {
    logo: string;
    nome: string;
    telefone: string;
    cpfCnpj: string;
    cep: number;
    municipio: string;
    estado: string;
    pais: string;
    endereco: string;
    numeroEndereco: string;
    categoriaId: number;
    userCreated: number;
}

export class EmpresaUpdateDTO {
    id: number;
    logo: string;
    nome: string;
    telefone: string;
    cpfCnpj: string;
    cep: number;
    municipio: string;
    estado: string;
    pais: string;
    endereco: string;
    numeroEndereco: string;
    categoriaId: number;
}
