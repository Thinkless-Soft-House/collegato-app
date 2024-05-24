import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { CategoriaEmpresa } from "../../../models/categoriaEmpresa";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function postAdicionarCategoriaEmpresa(categoriaEmpresa: CategoriaEmpresa): Promise<RequestResult<CategoriaEmpresa>> {
    const apiBase = await configurarApiBase();

    return apiBase.post(`categoriaEmpresa`, categoriaEmpresa)
        .then((resp) => {
            let result: RequestResult<CategoriaEmpresa> = {
                success: true,
                result: resp.data.data,
                message: "Categoria criada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao registrar a categoria.");

            let result: RequestResult<CategoriaEmpresa> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
