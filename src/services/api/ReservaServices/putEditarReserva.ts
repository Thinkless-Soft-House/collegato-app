import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Pessoa } from "../../../models/pessoa";
import { ReservaUpdateDTO } from "../../../models/apiDTOs/reserva.dto";
import { Reserva } from "../../../models/reserva";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function putEditarReserva(reserva: Reserva): Promise<RequestResult<Reserva>> {
    const apiBase = await configurarApiBase();

    let data: ReservaUpdateDTO = {
        id: reserva.id,
        date: reserva.date,
        horaInicio: reserva.horaInicio,
        horaFim: reserva.horaFim,
        observacao: reserva.observacao,
        diaSemanaIndex: reserva.diaSemanaIndex,
    }

    return apiBase.put(`reserva/${reserva.id}`, data)
        .then((resp) => {
            let result: RequestResult<Reserva> = {
                success: true,
                result: resp.data.data,
                message: "Reserva editada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao editar a reserva.");

            let result: RequestResult<Reserva> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
