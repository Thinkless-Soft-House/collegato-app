import { PessoaCreateDTO } from './pessoa.dto';

export class UsuarioCreateDTO {
  login: string;
  senha: string;
  status: number;
  userCreated?: number;
  permissaoId: number;
  empresaId?: number;
  pessoa: PessoaCreateDTO;
}

export class UsuarioUpdateDTO {
  id: number;
  login?: string;
  senha?: string;
  status?: number;
  permissaoId: number;
  empresaId: number;
  userUpdated?: number;
}

export class UsuarioLoginDTO {
  login?: string;
  senha?: string;
}
