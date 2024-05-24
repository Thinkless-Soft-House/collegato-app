import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Empresa } from "../../../models/empresa";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function deleteExcluirEmpresa(empresaId: number): Promise<RequestResult<Empresa>> {
    const apiBase = await configurarApiBase();

    return apiBase.delete(`empresa/${empresaId}`)
        .then((resp) => {
            let result: RequestResult<Empresa> = {
                success: true,
                result: resp.data.data,
                message: "Empresa excluída com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao excluir a empresa.");

            let result: RequestResult<Empresa> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
