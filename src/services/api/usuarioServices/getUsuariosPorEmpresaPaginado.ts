import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Usuario } from "../../../models/usuario";
import { PaginacaoModel } from "../../../models/DTOs/paginacaoModel";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function getUsuariosPorEmpresaPaginado(empresaId: number, paginacao: PaginacaoModel): Promise<RequestResult<Usuario[]>> {
    const apiBase = await configurarApiBase();

    return apiBase.get(`usuario/empresa/${empresaId}`, {
        params: paginacao
    })
        .then((resp) => {
            let result: RequestResult<Usuario[]> = {
                result: resp.data.data.data,
                success: true,
                message: "Requisição realizada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao buscar os usuários.");

            let result: RequestResult<Usuario[]> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
