import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { StatusReserva } from "../../../models/statusReserva";
import { StatusReservaCreateDTO } from "../../../models/apiDTOs/status-reserva.dto";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function postAdicionarStatusReserva(statusReserva: StatusReserva): Promise<RequestResult<StatusReserva>> {
    const apiBase = await configurarApiBase();

    let data: StatusReservaCreateDTO = {
        reservaId: statusReserva.reservaId,
        statusId: statusReserva.statusId
    }

    return apiBase.post(`statusReserva`, data)
        .then((resp) => {
            let result: RequestResult<StatusReserva> = {
                success: true,
                result: resp.data.data,
                message: "Status de Reserva criado com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao registrar o status da reserva.");

            let result: RequestResult<StatusReserva> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
