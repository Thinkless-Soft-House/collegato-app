export function GetRequestError(error: any, defaultMessage = "Ops! Ocorreu um erro desconhecido."): string {
    let errorMessage = defaultMessage;

    if(error.response && error.response.data) {
        errorMessage = error.response.data.message;
    }

    console.error(errorMessage);

    return errorMessage;
}