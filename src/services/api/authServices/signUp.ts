import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Usuario } from "../../../models/usuario";
import { UsuarioCreateDTO } from "../../../models/apiDTOs/usuario.dto";
import { PessoaCreateDTO } from "../../../models/apiDTOs/pessoa.dto";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function signUp(usuario: Usuario): Promise<RequestResult<Usuario>> {
    const apiBase = await configurarApiBase();

    let pessoa = usuario.pessoa;

    let pessoaData: PessoaCreateDTO = {
        nome: pessoa.nome,
        cpfCnpj: Number(pessoa.cpfCnpj),
        municipio: pessoa.municipio,
        estado: pessoa.estado,
        pais: pessoa.pais,
        endereco: pessoa.endereco,
        numero: Number(pessoa.numero),
        cep: Number(pessoa.cep),
        telefone: Number(pessoa.numero),
        dataNascimento: pessoa.dataNascimento,
        foto: pessoa.foto,
    };

    let data: UsuarioCreateDTO = {
        login: usuario.login,
        senha: usuario.senha,
        status: usuario.status,
        permissaoId: usuario.permissaoId,
        pessoa: pessoaData,
    };

    return apiBase.post(`signup`, data)
        .then((resp) => {
            let result: RequestResult<Usuario> = {
                success: true,
                result: resp.data.data,
                message: "Usuário criado com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao registrar o usuário.");

            let result: RequestResult<Usuario> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
