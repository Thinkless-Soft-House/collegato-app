import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Sala } from "../../../models/sala";
import { SalaCreateDTO } from "../../../models/apiDTOs/sala.dto";
import { DisponibilidadeCreateDTO } from "../../../models/apiDTOs/disponibilidade.dto";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function postAdicionarSala(sala: Sala): Promise<RequestResult<Sala>> {
    const apiBase = await configurarApiBase();

    let disponibilidades = sala.disponibilidades;
    let disponibiliadeDataList = disponibilidades.map(disp => {
        let disponibiliadeData: DisponibilidadeCreateDTO = {
            salaId: sala.id,
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

    let data: SalaCreateDTO = {
        status: sala.status,
        nome: sala.nome,
        empresaId: sala.empresaId,
        foto: '',
        multiplasMarcacoes: sala.multiplasMarcacoes,
        disponibilidades: disponibiliadeDataList,
    }

    return apiBase.post(`sala`, data)
        .then((resp) => {
            let result: RequestResult<Sala> = {
                success: true,
                result: resp.data.data,
                message: "Sala criada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao registrar a sala.");

            let result: RequestResult<Sala> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
