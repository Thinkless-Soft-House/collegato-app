export interface ModeloBase {
    id: number;
    userCreated?: number;
    dateCreated?: string;
    userUpdated?: number;
    dateUpdated?: string;
}

export const modeloBaseVazio: ModeloBase = {
    id: 0,
    userCreated: 0,
    dateCreated: '',
    userUpdated: 0,
    dateUpdated: '',
}
