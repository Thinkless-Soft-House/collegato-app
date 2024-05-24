import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { Empresa } from "../../../models/empresa";
import { EmpresasFiltro } from "../../../models/DTOs/empresasFiltro";
import { GetRequestError } from "../../helpers/apiHelpers";

export async function getEmpresasPorFiltro(filtro: EmpresasFiltro): Promise<RequestResult<Empresa[]>> {
    const apiBase = await configurarApiBase();

    let data1: any = {
        take: filtro.take,
        skip: filtro.skip,
        orderColumn: filtro.orderColumn,
        order: filtro.order,
        nomeEmpresa: filtro.nomeEmpresa,
        categoriaId: filtro.categoriaId,
        possuiSala: filtro.possuiSala,
    }

    let data2: any = {
        take: filtro.take,
        skip: filtro.skip,
        orderColumn: filtro.orderColumn,
        order: filtro.order,
        nomeEmpresa: filtro.nomeEmpresa,
        categoriaId: filtro.categoriaId,
    }

    console.log('meu log de filtro', filtro.possuiSala !== undefined ? data1 : data2);
    return apiBase.get('/empresa/filter', {
        params: filtro.possuiSala !== undefined ? data1 : data2
    })
        .then((resp) => {
            let result: RequestResult<Empresa[]> = {
                result: resp.data.data.data,
                success: true,
                message: "Requisição realizada com sucesso!",
            };

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao buscar as empresas.");
            console.log('meu log de erro', JSON.stringify(error));
            let result: RequestResult<Empresa[]> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
