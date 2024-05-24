import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Permissao } from "../../../models/permissao";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function deleteExcluirPermissao(permissaoId: number): Promise<RequestResult<Permissao>> {
    const apiBase = await configurarApiBase();

    return apiBase.delete(`permissao/${permissaoId}`)
        .then((resp) => {
            let result: RequestResult<Permissao> = {
                success: true,
                result: resp.data.data,
                message: "Permissão excluída com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao excluir a permissão.");

            let result: RequestResult<Permissao> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
