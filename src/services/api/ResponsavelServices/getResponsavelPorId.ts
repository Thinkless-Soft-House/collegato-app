import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Responsavel } from "../../../models/responsavel";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function getResponsavelPorId(responsavelId: number): Promise<RequestResult<Responsavel>> {
    const apiBase = await configurarApiBase();

    return apiBase.get(`responsavel/${responsavelId}`)
        .then((resp) => {
            let result: RequestResult<Responsavel> = {
                result: resp.data.data,
                success: true,
                message: "Requisição realizada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao buscar o responsável.");

            let result: RequestResult<Responsavel> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
