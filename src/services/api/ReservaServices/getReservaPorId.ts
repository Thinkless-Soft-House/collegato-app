import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Reserva } from "../../../models/reserva";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function getReservaPorId(reservaId: number): Promise<RequestResult<Reserva>> {
    const apiBase = await configurarApiBase();

    return apiBase.get(`reserva/${reservaId}`)
        .then((resp) => {
            let result: RequestResult<Reserva> = {
                result: resp.data.data,
                success: true,
                message: "Requisição realizada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao buscar a reserva.");

            let result: RequestResult<Reserva> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
