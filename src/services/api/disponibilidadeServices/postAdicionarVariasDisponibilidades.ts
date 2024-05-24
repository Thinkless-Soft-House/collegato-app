import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Disponibilidade } from "../../../models/disponibilidade";
import { DisponibilidadeCreateDTO } from "../../../models/apiDTOs/disponibilidade.dto";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function postAdicionarVariasDisponibilidades(disponibilidades: Disponibilidade[]): Promise<RequestResult<Disponibilidade[]>> {
    const apiBase = await configurarApiBase();

    let disponibiliadeDataList = disponibilidades.map(disp => {
        let disponibiliadeData: DisponibilidadeCreateDTO = {
            salaId: disp.salaId,
            ativo: disp.ativo,
            hrAbertura: disp.hrAbertura,
            hrFim: disp.hrFim,
            diaSemana: disp.diaSemana,
            minDiasCan: disp.minDiasCan,
            diaSemanaIndex: disp.diaSemanaIndex,
            intervaloMinutos: disp.intervaloMinutos,
        }

        return disponibiliadeData;
    });

    return apiBase.post(`disponibilidade/many`, { disponibilidades: disponibiliadeDataList })
        .then((resp) => {
            let result: RequestResult<Disponibilidade[]> = {
                success: true,
                result: resp.data.data,
                message: "Disponibilidades atribuidas com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao registrar as disponibilidades.");

            let result: RequestResult<Disponibilidade[]> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
