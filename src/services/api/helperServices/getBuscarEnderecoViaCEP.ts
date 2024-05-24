import axios from 'axios';
import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { EnderecoDTO } from "../../../models/DTOs/EnderecoDTO";

export async function getBuscarEnderecoViaCEP(cep: string): Promise<RequestResult<EnderecoDTO>> {
    cep = cep.replace("-", "");

    return axios.get(`https://viacep.com.br/ws/${cep}/json/`)
        .then((resp) => {
            let result: RequestResult<EnderecoDTO> = {
                result: resp.data,
                success: true,
                message: "Requisição realizada com sucesso!",
            };

            if(resp.data.erro != undefined) {
                result.success = false;
                result.message = "Não foi possível encontrar o CEP digitado."
            }

            return result;
        })
        .catch((error) => {
            let errorMessage = error.message;
            let result: RequestResult<EnderecoDTO> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
