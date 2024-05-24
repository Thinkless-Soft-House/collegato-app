import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { StatusReserva } from "../../../models/statusReserva";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function deleteExcluirStatusReserva(statusId: number): Promise<RequestResult<StatusReserva>> {
    const apiBase = await configurarApiBase();

    return apiBase.delete(`statusReserva/${statusId}`)
        .then((resp) => {
            let result: RequestResult<StatusReserva> = {
                success: true,
                result: resp.data.data,
                message: "Status Reserva excluído com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao excluir o status da reserva.");

            let result: RequestResult<StatusReserva> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
