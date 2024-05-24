import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Reserva } from "../../../models/reserva";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function deleteExcluirReserva(reservaId: number): Promise<RequestResult<Reserva>> {
    const apiBase = await configurarApiBase();

    return apiBase.delete(`reserva/${reservaId}`)
        .then((resp) => {
            let result: RequestResult<Reserva> = {
                success: true,
                result: resp.data.data,
                message: "Usuário excluído com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao excluir a reserva.");

            let result: RequestResult<Reserva> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
