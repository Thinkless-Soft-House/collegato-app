import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Empresa } from "../../../models/empresa";
import { PaginacaoModel } from "../../../models/DTOs/paginacaoModel";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function getEmpresasPorCategoriaPaginado(categoriaId: number, paginacao: PaginacaoModel): Promise<RequestResult<Empresa[]>> {
    const apiBase = await configurarApiBase();

    return apiBase.get(`empresa/categoria/${categoriaId}`, {
        params: paginacao
    })
        .then((resp) => {
            let result: RequestResult<Empresa[]> = {
                result: resp.data.data.data,
                success: true,
                message: "Requisição realizada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao buscar as salas.");

            let result: RequestResult<Empresa[]> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
