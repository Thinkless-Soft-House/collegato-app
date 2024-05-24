import { Disponibilidade } from "./disponibilidade";
import { Empresa } from "./empresa";
import { ModeloBase, modeloBaseVazio } from "./modelBase";
import { Pessoa } from "./pessoa";
import { Sala } from "./sala";
import { StatusReserva } from "./statusReserva";
import { Usuario } from "./usuario";

export interface Reserva extends ModeloBase {
    date: string;
    horaInicio: string;
    horaFim: string;
    observacao: string;
    // diaSemana: string;
    diaSemanaIndex: number;
    salaId: number;
    usuarioId: number;

    sala?: Sala;
    usuario?: Usuario;
    statusReserva?: StatusReserva[];

    // Extra
    pessoa?: Pessoa;
    empresa?: Empresa;
    salaNome?: string;
    statusId?: number;
}

export const reservaEmpty: Reserva = {
    ...modeloBaseVazio,
    date: "",
    horaInicio: "",
    horaFim: "",
    observacao: "",
    // diaSemana: "",
    diaSemanaIndex: 0,
    salaId: 0,
    usuarioId: 0,
}
