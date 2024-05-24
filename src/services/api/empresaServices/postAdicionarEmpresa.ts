import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Empresa } from "../../../models/empresa";
import { EmpresaCreateDTO } from "../../../models/apiDTOs/empresa.dto";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function postAdicionarEmpresa(empresa: Empresa): Promise<RequestResult<Empresa>> {
    const apiBase = await configurarApiBase();

    let data: EmpresaCreateDTO = {
        logo: empresa.logo,
        nome: empresa.nome,
        telefone: empresa.telefone,
        cpfCnpj: Number(empresa.cpfCnpj),
        cep: Number(empresa.cep),
        municipio: empresa.municipio,
        estado: empresa.estado,
        pais: empresa.pais,
        endereco: empresa.endereco,
        numeroEndereco: empresa.numeroEndereco,
        categoriaId: empresa.categoriaId,
        userCreated: 0,
    }

    return apiBase.post(`empresa`, data)
        .then((resp) => {
            let result: RequestResult<Empresa> = {
                success: true,
                result: resp.data.data,
                message: "Empresa criada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao registrar a empresa.");

            let result: RequestResult<Empresa> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
