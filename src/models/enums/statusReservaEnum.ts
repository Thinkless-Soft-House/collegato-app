export enum StatusReservaEnum {
    AguardandoConfirmacao = 1,
    Confirmado = 2,
    Cancelado = 3,
    Finalizado = 4,
    Reprovado = 5
}

export function getLabelStatusReservaEnum(valor: number | string): string {
    switch (valor) {
        case StatusReservaEnum.AguardandoConfirmacao:
            return "Aguardando Confirmação";
        case StatusReservaEnum.Confirmado:
            return "Confirmado";
        case StatusReservaEnum.Cancelado:
            return "Cancelado";
        case StatusReservaEnum.Finalizado:
            return "Finalizado";
        case StatusReservaEnum.Reprovado:
            return "Reprovado";
    }
}

interface enumArrayObject {
    label: string;
    value: any;
}

export function getEnumArrayStatusReservaEnum(): Array<enumArrayObject> {
    let enumArray = [];
    for (var key of Object.keys(StatusReservaEnum).filter(e => typeof StatusReservaEnum[e as any] === "number")) {
        enumArray.push({
            value: StatusReservaEnum[key as any],
            label: getLabelStatusReservaEnum(StatusReservaEnum[key as any])
        })
    }

    return enumArray;
}
