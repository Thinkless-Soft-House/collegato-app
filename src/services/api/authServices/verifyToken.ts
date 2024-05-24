import { RequestResult } from "../../../models/DTOs/requestResult";
import { configurarApiBase } from '../';
import { GetRequestError } from "../../helpers/apiHelpers";

export async function verifyToken(token: string): Promise<RequestResult<boolean>> {
    const apiBase = await configurarApiBase();

    return apiBase.post(`verifyToken`, { token })
        .then((resp) => {
            let result: RequestResult<boolean> = {
                success: true,
                result: resp.data.data,
                message: "Token válido",
            };

            if(resp.data.data == false) {
                result.success = false;
                result.message = "Token inválido"
            }

            return result;
        })
        .catch((error) => {
            let errorMessage = GetRequestError(error, "Ops! Ocorreu um erro ao validar o token.");

            let result: RequestResult<boolean> = {
                success: false,
                result: null,
                message: errorMessage
            };

            return result;
        });
}
