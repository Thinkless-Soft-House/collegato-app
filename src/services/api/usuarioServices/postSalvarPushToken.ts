import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Usuario } from "../../../models/usuario";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function postSalvarPushToken(usuarioId: number, token: string): Promise<RequestResult<Usuario>> {
    const apiBase = await configurarApiBase();

    return apiBase.post(`usuario/${usuarioId}`, { token })
        .then((resp) => {
            let result: RequestResult<Usuario> = {
                success: true,
                result: resp.data.data,
                message: "Usuário criado com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao salvar o token.");

            let result: RequestResult<Usuario> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
