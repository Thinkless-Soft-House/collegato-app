import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Sala } from "../../../models/sala";
import { PaginacaoModel } from "../../../models/DTOs/paginacaoModel";
import { Reserva } from "../../../models/reserva";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function getReservasPorDataESalaPaginado(mes: number, ano: number, salaId: number, paginacao: PaginacaoModel): Promise<RequestResult<Reserva[]>> {
    const apiBase = await configurarApiBase();

    return apiBase.get(`reserva/sala/mes/${salaId}/${mes}/${ano}`, {
        params: paginacao
    })
        .then((resp) => {
            let result: RequestResult<Reserva[]> = {
                result: resp.data.data,
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
