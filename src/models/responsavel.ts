import { ModeloBase } from "./modelBase";
import { Sala } from "./sala";
import { Usuario } from "./usuario";

export interface Responsavel extends ModeloBase {
    usuarioId: number;
    salaId: number;

    usuario?: Usuario;
}
