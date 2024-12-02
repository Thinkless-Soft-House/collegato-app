import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Empresa } from "../../../models/empresa";
import { EmpresaUpdateDTO } from "../../../models/apiDTOs/empresa.dto";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function putEditarEmpresa(empresa: Empresa): Promise<RequestResult<Empresa>> {
    const apiBase = await configurarApiBase();

    let data: EmpresaUpdateDTO = {
        id: empresa.id,
        logo: empresa.logo,
        nome: empresa.nome,
        telefone: empresa.telefone,
        cpfCnpj: empresa.cpfCnpj,
        cep: Number(empresa.cep),
        municipio: empresa.municipio,
        estado: empresa.estado,
        pais: empresa.pais,
        endereco: empresa.endereco,
        numeroEndereco: empresa.numeroEndereco,
        categoriaId: empresa.categoriaId,
    }

    return apiBase.put(`empresa/${empresa.id}`, data)
        .then((resp) => {
            let result: RequestResult<Empresa> = {
                success: true,
                result: resp.data.data,
                message: "Empresa editada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao editar a empresa.");

            let result: RequestResult<Empresa> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
