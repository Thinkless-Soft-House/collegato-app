export class ReservaCreateDTO {
  date: string;
  horaInicio: string;
  horaFim: string;
  observacao: string;
  diaSemanaIndex: number;
  salaId: number;
  usuarioId: number;
}

export class ReservaUpdateDTO {
  id: number;
  date: string;
  horaInicio: string;
  horaFim: string;
  observacao: string;
  diaSemanaIndex: number;
}
