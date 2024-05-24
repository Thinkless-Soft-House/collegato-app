import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Permissao } from "../../../models/permissao";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function getPermissaoPorId(permissaoId: number): Promise<RequestResult<Permissao>> {
    const apiBase = await configurarApiBase();

    return apiBase.get(`permissao/${permissaoId}`)
        .then((resp) => {
            let result: RequestResult<Permissao> = {
                result: resp.data.data,
                success: true,
                message: "Requisição realizada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao buscar a permissão.");

            let result: RequestResult<Permissao> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
