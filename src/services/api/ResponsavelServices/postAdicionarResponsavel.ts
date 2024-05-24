import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Responsavel } from "../../../models/responsavel";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function postAdicionarResponsavel(responsavel: Responsavel): Promise<RequestResult<Responsavel>> {
    const apiBase = await configurarApiBase();

    return apiBase.post(`responsavel`, responsavel)
        .then((resp) => {
            let result: RequestResult<Responsavel> = {
                success: true,
                result: resp.data.data,
                message: "Usuário criado com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao registrar o responsável.");

            let result: RequestResult<Responsavel> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
