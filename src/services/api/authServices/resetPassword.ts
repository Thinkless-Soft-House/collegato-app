import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Usuario } from "../../../models/usuario";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function resetPassword(login: string, codigo: string, novaSenha: string): Promise<RequestResult<Usuario>> {
    const apiBase = await configurarApiBase();

    return apiBase.post(`resetPassword`, { login, codigo, novaSenha })
        .then((resp) => {
            let result: RequestResult<Usuario> = {
                success: true,
                result: resp.data.data,
                message: "Senha alterada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao alterar a senha.");

            let result: RequestResult<Usuario> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
