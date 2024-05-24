import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '..';
import { Disponibilidade } from "../../../models/disponibilidade";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function getTodasDisponibilidades(): Promise<RequestResult<Disponibilidade[]>> {
    const apiBase = await configurarApiBase();

    return apiBase.get(`disponibilidade`)
        .then((resp) => {
            let result: RequestResult<Disponibilidade[]> = {
                result: resp.data.data,
                success: true,
                message: "Requisição realizada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao listar as disponibilidades.");

            let result: RequestResult<Disponibilidade[]> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
