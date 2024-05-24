import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Responsavel } from "../../../models/responsavel";
import { ResponsavelCreateDTO } from "../../../models/apiDTOs/responsavel.dto";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function postAdicionarVariosResponsaveis(responsaveis: Responsavel[]): Promise<RequestResult<Responsavel>> {
    const apiBase = await configurarApiBase();

    let responsaveisList = responsaveis.map(resp => {
        let dataResponsavel: ResponsavelCreateDTO = {
            salaId: resp.salaId,
            usuarioId: resp.usuarioId
        }

        return dataResponsavel;
    });

    let data = {
        responsaveis: responsaveisList
    }

    return apiBase.post(`responsavel/many`, data)
        .then((resp) => {
            let result: RequestResult<Responsavel> = {
                success: true,
                result: resp.data.data,
                message: "Responsáveis atribuidos com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao registrar os responsáveis.");

            let result: RequestResult<Responsavel> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
