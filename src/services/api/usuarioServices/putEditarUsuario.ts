import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Usuario } from "../../../models/usuario";
import { UsuarioUpdateDTO } from "../../../models/apiDTOs/usuario.dto";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function putEditarUsuario(usuario: Usuario): Promise<RequestResult<Usuario>> {
    const apiBase = await configurarApiBase();

    let data: UsuarioUpdateDTO = {
        id: usuario.id,
        login: usuario.login,
        permissaoId: usuario.permissaoId,
        empresaId: usuario.empresaId == 0 ? null : usuario.empresaId,
    }

    return apiBase.put(`usuario/${usuario.id}`, data)
        .then((resp) => {
            let result: RequestResult<Usuario> = {
                success: true,
                result: resp.data.data,
                message: "Usuário editada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao editar o usuário.");

            let result: RequestResult<Usuario> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
