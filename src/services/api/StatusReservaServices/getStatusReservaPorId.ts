import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { StatusReserva } from "../../../models/statusReserva";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function getStatusReservaPorId(statusId: number): Promise<RequestResult<StatusReserva>> {
    const apiBase = await configurarApiBase();

    return apiBase.get(`statusReserva/${statusId}`)
        .then((resp) => {
            let result: RequestResult<StatusReserva> = {
                result: resp.data.data,
                success: true,
                message: "Requisição realizada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao buscar o status da reserva.");

            let result: RequestResult<StatusReserva> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
