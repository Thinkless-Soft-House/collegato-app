import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Sala } from "../../../models/sala";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function getSalaPorId(salaId: number): Promise<RequestResult<Sala>> {
    const apiBase = await configurarApiBase();

    return apiBase.get(`sala/${salaId}`)
        .then((resp) => {
            let result: RequestResult<Sala> = {
                result: resp.data.data,
                success: true,
                message: "Requisição realizada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao buscar a sala.");

            let result: RequestResult<Sala> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
