import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '..';
import { Empresa } from "../../../models/empresa";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function getTodasEmpresas(): Promise<RequestResult<Empresa[]>> {
    const apiBase = await configurarApiBase();

    return apiBase.get(`empresa`)
        .then((resp) => {
            let result: RequestResult<Empresa[]> = {
                result: resp.data.data,
                success: true,
                message: "Requisição realizada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao listar as empresas.");

            let result: RequestResult<Empresa[]> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
