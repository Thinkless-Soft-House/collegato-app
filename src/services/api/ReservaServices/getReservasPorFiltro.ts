import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Reserva } from "../../../models/reserva";
import { ReservasFiltro } from "../../../models/DTOs/reservasFiltro";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function getReservasPorFiltro(filtro: ReservasFiltro): Promise<RequestResult<Reserva[]>> {
    const apiBase = await configurarApiBase();

    return apiBase.get('/reserva/filter', {
        params: filtro
    })
        .then((resp) => {
            let result: RequestResult<Reserva[]> = {
                result: resp.data.data.data,
                success: true,
                message: "Requisição realizada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao buscar as reservas.");

            let result: RequestResult<Reserva[]> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
