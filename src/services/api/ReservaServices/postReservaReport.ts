import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Reserva } from "../../../models/reserva";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function postReservaReport(usuarioId: number, start: string, end: string): Promise<RequestResult<boolean>> {
    const apiBase = await configurarApiBase();

    return apiBase.post(`reserva/report`, { usuarioId, start, end })
        .then((resp) => {
            let result: RequestResult<boolean> = {
                success: true,
                result: resp.data.ok,
                message: "Relátorio enviado com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro no envio do relátorio.");

            let result: RequestResult<boolean> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
