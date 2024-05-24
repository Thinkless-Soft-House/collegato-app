export enum PermissaoEnum {
    Cliente = 1,
    Administrador = 2,
    Empresario = 3,
    Funcionario = 4,
}

export function getLabelPermissaoEnum(valor: number | string): string {
    switch (valor) {
        case PermissaoEnum.Cliente:
            return "Básico";
        case PermissaoEnum.Administrador:
            return "Administrador";
        case PermissaoEnum.Funcionario:
            return "Funcionário";
        case PermissaoEnum.Empresario:
            return "Empresario";
        default:
            return "Cliente";
    }
}

interface enumArrayObject {
    id: any;
    descricao: string;
}

export function getEnumArrayPermissaoEnum(): Array<enumArrayObject> {
    let enumArray = [];
    for (var key of Object.keys(PermissaoEnum).filter(e => typeof PermissaoEnum[e as any] === "number")) {
        enumArray.push({
            id: PermissaoEnum[key as any],
            descricao: getLabelPermissaoEnum(PermissaoEnum[key as any])
        })
    }

    return enumArray;
}
