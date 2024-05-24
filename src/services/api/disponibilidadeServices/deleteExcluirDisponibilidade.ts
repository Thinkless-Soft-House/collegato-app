import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Disponibilidade } from "../../../models/disponibilidade";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function deleteExcluirDisponibilidade(disponibilidadeId: number): Promise<RequestResult<Disponibilidade>> {
    const apiBase = await configurarApiBase();

    return apiBase.delete(`disponibilidade/${disponibilidadeId}`)
        .then((resp) => {
            let result: RequestResult<Disponibilidade> = {
                success: true,
                result: resp.data.data,
                message: "Disponibilidade excluída com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao excluir a disponibilidade.");

            let result: RequestResult<Disponibilidade> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
