import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { CategoriaEmpresa } from "../../../models/categoriaEmpresa";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function getCategoriaEmpresaPorId(categoriaEmpresaId: number): Promise<RequestResult<CategoriaEmpresa>> {
    const apiBase = await configurarApiBase();

    return apiBase.get(`categoriaEmpresa/${categoriaEmpresaId}`)
        .then((resp) => {
            let result: RequestResult<CategoriaEmpresa> = {
                result: resp.data.data,
                success: true,
                message: "Requisição realizada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao buscar a categoria.");

            let result: RequestResult<CategoriaEmpresa> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}