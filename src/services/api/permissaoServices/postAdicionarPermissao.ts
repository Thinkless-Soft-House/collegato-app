import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Permissao } from "../../../models/permissao";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function postAdicionarPermissao(permissao: Permissao): Promise<RequestResult<Permissao>> {
    const apiBase = await configurarApiBase();

    return apiBase.post(`permissao`, permissao)
        .then((resp) => {
            let result: RequestResult<Permissao> = {
                success: true,
                result: resp.data.data,
                message: "Permissão criada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao registrar a permissão.");

            let result: RequestResult<Permissao> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
