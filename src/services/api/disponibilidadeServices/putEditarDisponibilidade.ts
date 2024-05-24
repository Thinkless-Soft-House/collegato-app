import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Disponibilidade } from "../../../models/disponibilidade";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function putEditarDisponibilidade(disponibilidade: Disponibilidade): Promise<RequestResult<Disponibilidade>> {
    const apiBase = await configurarApiBase();

    return apiBase.put(`disponibilidade/${disponibilidade.id}`, disponibilidade)
        .then((resp) => {
            let result: RequestResult<Disponibilidade> = {
                success: true,
                result: resp.data.data,
                message: "Disponibilidade editada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao editar a disponibilidade.");

            let result: RequestResult<Disponibilidade> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
