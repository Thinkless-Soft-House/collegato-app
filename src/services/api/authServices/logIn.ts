import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Usuario } from "../../../models/usuario";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function logIn(login: string, senha: string): Promise<RequestResult<Usuario>> {
    const apiBase = await configurarApiBase();

    return apiBase.post(`login`, { login, senha })
        .then((resp) => {
            let result: RequestResult<Usuario> = {
                success: true,
                result: resp.data.data,
                message: "Usuário autenticado com sucesso!",
            };

            result.result.token = resp.headers["set-cookie"][0];
            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao tentar realizar o login.");

            let result: RequestResult<Usuario> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
