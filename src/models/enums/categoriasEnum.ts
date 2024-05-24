export enum CategoriasEnum {
    Advogado = 1,
    Dentista = 2,
    Coworking = 3,
    Saude = 4,
    PrestacoesServico = 5,
}

export function getLabelCategoriasEnum(valor: number | string): string {
    switch (valor) {
        case CategoriasEnum.Advogado:
            return "Advogados";
        case CategoriasEnum.Dentista:
            return "Dentista";
        case CategoriasEnum.Coworking:
            return "Coworking";
        case CategoriasEnum.Saude:
            return "Saúde";
        case CategoriasEnum.PrestacoesServico:
            return "Prestação de Serviços";
        default:
            return "";
    }
}

interface enumArrayObject {
    id: any;
    descricao: string;
}

export function getEnumArrayCategoriasEnum(): Array<enumArrayObject> {
    let enumArray = [];
    for (var key of Object.keys(CategoriasEnum).filter(e => typeof CategoriasEnum[e as any] === "number")) {
        enumArray.push({
            id: CategoriasEnum[key as any],
            descricao: getLabelCategoriasEnum(CategoriasEnum[key as any])
        })
    }

    return enumArray;
}
