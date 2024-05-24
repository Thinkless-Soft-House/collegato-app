import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Disponibilidade } from "../../../models/disponibilidade";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function postAdicionarDisponibilidade(disponibilidade: Disponibilidade): Promise<RequestResult<Disponibilidade>> {
    const apiBase = await configurarApiBase();

    return apiBase.post(`disponibilidade`, disponibilidade)
        .then((resp) => {
            let result: RequestResult<Disponibilidade> = {
                success: true,
                result: resp.data.data,
                message: "Usuário criado com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao registrar a disponibilidade.");

            let result: RequestResult<Disponibilidade> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
