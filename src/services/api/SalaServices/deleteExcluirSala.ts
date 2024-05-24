import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Sala } from "../../../models/sala";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function deleteExcluirSala(salaId: number): Promise<RequestResult<Sala>> {
    const apiBase = await configurarApiBase();

    return apiBase.delete(`sala/${salaId}`)
        .then((resp) => {
            let result: RequestResult<Sala> = {
                success: true,
                result: resp.data.data,
                message: "Sala excluída com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao excluir a sala.");

            let result: RequestResult<Sala> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
