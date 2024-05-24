import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Sala } from "../../../models/sala";
import { SalasFiltro } from "../../../models/DTOs/salasFiltro";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function getSalasPorFiltro(filtro: SalasFiltro): Promise<RequestResult<Sala[]>> {
    const apiBase = await configurarApiBase();

    return apiBase.get('/sala/filter', {
        params: filtro
    })
        .then((resp) => {
            let result: RequestResult<Sala[]> = {
                result: resp.data.data.data,
                success: true,
                message: "Requisição realizada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao buscar as salas.");

            let result: RequestResult<Sala[]> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
