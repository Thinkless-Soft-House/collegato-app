import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Usuario } from "../../../models/usuario";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function getTodosUsuarios(): Promise<RequestResult<Usuario[]>> {
    const apiBase = await configurarApiBase();

    return apiBase.get(`usuario`)
        .then((resp) => {
            let result: RequestResult<Usuario[]> = {
                result: resp.data.data,
                success: true,
                message: "Requisição realizada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao listar os usuários.");

            let result: RequestResult<Usuario[]> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}