import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Responsavel } from "../../../models/responsavel";
import { ResponsavelUpdateDTO } from "../../../models/apiDTOs/responsavel.dto";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function putEditarVariosResponsaveis(responsaveis: Responsavel[]): Promise<RequestResult<Responsavel>> {
    const apiBase = await configurarApiBase();

    let responsaveisList = responsaveis.map(resp => {
        let dataResponsavel: ResponsavelUpdateDTO = {
            id: resp.id,
            salaId: resp.salaId,
            usuarioId: resp.usuarioId
        }

        return dataResponsavel;
    });

    return apiBase.put(`responsavel/many`, responsaveisList)
        .then((resp) => {
            let result: RequestResult<Responsavel> = {
                success: true,
                result: resp.data.data,
                message: "Responsáveis editados com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao editar os responsáveis.");

            let result: RequestResult<Responsavel> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
