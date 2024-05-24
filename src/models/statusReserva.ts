import { ModeloBase } from "./modelBase";
import { Reserva } from "./reserva";
import { Status } from "./status";

export interface StatusReserva {
    id: number;
    reservaId: number;
    statusId: number;

    reserva?: Reserva;
    status?: Status;
}
