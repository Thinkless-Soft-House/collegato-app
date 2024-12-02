import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Pessoa } from "../../../models/pessoa";
import { PessoaUpdateDTO } from "../../../models/apiDTOs/pessoa.dto";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function putEditarPessoa(pessoa: Pessoa): Promise<RequestResult<Pessoa>> {
    const apiBase = await configurarApiBase();

    let data: PessoaUpdateDTO = {
        id: pessoa.id,
        nome: pessoa.nome,
        cpfCnpj: pessoa.cpfCnpj,
        municipio: pessoa.municipio,
        estado: pessoa.estado,
        pais: pessoa.pais,
        endereco: pessoa.endereco,
        numero: Number(pessoa.numero),
        cep: Number(pessoa.cep),
        telefone: Number(pessoa.telefone),
        dataNascimento: pessoa.dataNascimento,
        foto: pessoa.foto,
    }

    return apiBase.put(`pessoa/${pessoa.id}`, data)
        .then((resp) => {
            let result: RequestResult<Pessoa> = {
                success: true,
                result: resp.data.data,
                message: "Perfil editado com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao editar o perfil.");

            let result: RequestResult<Pessoa> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
