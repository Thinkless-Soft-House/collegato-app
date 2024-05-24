import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Sala } from "../../../models/sala";
import { SalaUpdateDTO } from "../../../models/apiDTOs/sala.dto";
import { DisponibilidadeUpdateDTO } from "../../../models/apiDTOs/disponibilidade.dto";
import { number } from "yup";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function putEditarSala(sala: Sala): Promise<RequestResult<Sala>> {
    const apiBase = await configurarApiBase();

    // let disponibilidades = sala.disponibilidades;
    // let disponibiliadeDataList = disponibilidades.map(disp => {
    //     let disponibiliadeData: DisponibilidadeUpdateDTO = {
    //         id: disp.id,
    //         salaId: disp.salaId,
    //         ativo: disp.ativo,
    //         hrAbertura: disp.hrAbertura,
    //         hrFim: disp.hrFim,
    //         diaSemana: disp.diaSemana,
    //         minDiasCan: disp.minDiasCan,
    //         diaSemanaIndex: disp.diaSemanaIndex,
    //         intervaloMinutos: disp.intervaloMinutos,
    //     }

    //     return disponibiliadeData;
    // });

    let data: SalaUpdateDTO = {
        id: sala.id,
        status: sala.status,
        nome: sala.nome,
        empresaId: sala.empresaId,
        multiplasMarcacoes: sala.multiplasMarcacoes,
        foto: '',
        // disponibilidades: disponibiliadeDataList,
    }

    return apiBase.put(`sala/${sala.id}`, data)
        .then((resp) => {
            let result: RequestResult<Sala> = {
                success: true,
                result: resp.data.data,
                message: "Sala editada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao editar a sala.");

            let result: RequestResult<Sala> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
