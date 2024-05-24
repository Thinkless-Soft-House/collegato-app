import { Disponibilidade } from "./disponibilidade";
import { Empresa } from "./empresa";
import { ModeloBase } from "./modelBase";
import { Reserva } from "./reserva";
import { Responsavel } from "./responsavel";

export interface Sala extends ModeloBase {
    nome: string;
    foto?: string;
    status: number;
    multiplasMarcacoes: boolean;
    empresaId: number;

    empresa?: Empresa;
    disponibilidades: Disponibilidade[];
    responsavel?: Responsavel[];
}
