export enum StatusEnum {
    Ativo = 1,
    Inativo = 2,
}

export function getLabelStatusEnum(valor: number | string): string {
    switch (valor) {
        case StatusEnum.Ativo:
            return "Ativo";
        case StatusEnum.Inativo:
            return "Inativo";
    }
}

interface enumArrayObject {
    label: string;
    value: any;
}

export function getEnumArrayStatusEnum(): Array<enumArrayObject> {
    let enumArray = [];
    for (var key of Object.keys(StatusEnum).filter(e => typeof StatusEnum[e as any] === "number")) {
        enumArray.push({
            value: StatusEnum[key as any],
            label: getLabelStatusEnum(StatusEnum[key as any])
        })
    }

    return enumArray;
}
