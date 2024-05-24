import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Responsavel } from "../../../models/responsavel";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function getTodosResponsaveis(): Promise<RequestResult<Responsavel[]>> {
    const apiBase = await configurarApiBase();

    return apiBase.get(`responsavel`)
        .then((resp) => {
            let result: RequestResult<Responsavel[]> = {
                result: resp.data.data,
                success: true,
                message: "Requisição realizada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao listar os responsáveis.");

            let result: RequestResult<Responsavel[]> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
