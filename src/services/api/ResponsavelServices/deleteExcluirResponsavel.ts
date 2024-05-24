import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Responsavel } from "../../../models/responsavel";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function deleteExcluirResponsavel(responsavelId: number): Promise<RequestResult<Responsavel>> {
    const apiBase = await configurarApiBase();

    return apiBase.delete(`responsavel/${responsavelId}`)
        .then((resp) => {
            let result: RequestResult<Responsavel> = {
                success: true,
                result: resp.data.data,
                message: "Responsável excluído com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao excluir o responsável.");

            let result: RequestResult<Responsavel> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
