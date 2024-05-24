import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Reserva } from "../../../models/reserva";
import { ReservaCreateDTO } from "../../../models/apiDTOs/reserva.dto";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function postAdicionarReserva(reserva: Reserva): Promise<RequestResult<Reserva>> {
    const apiBase = await configurarApiBase();

    let data: ReservaCreateDTO = {
        date: reserva.date,
        horaInicio: reserva.horaInicio,
        horaFim: reserva.horaFim,
        observacao: reserva.observacao,
        diaSemanaIndex: reserva.diaSemanaIndex,
        salaId: reserva.salaId,
        usuarioId: reserva.usuarioId,
    }

    return apiBase.post(`reserva`, data)
        .then((resp) => {
            let result: RequestResult<Reserva> = {
                success: true,
                result: resp.data.data,
                message: "Reserva criada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao registrar a reserva.");

            let result: RequestResult<Reserva> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
