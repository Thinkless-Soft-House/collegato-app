export class DisponibilidadeCreateDTO {
  ativo: boolean;
  hrAbertura: string;
  hrFim: string;
  diaSemana: string;
  minDiasCan: number;
  diaSemanaIndex: number;
  intervaloMinutos: number;
  salaId: number;
}
export class DisponibilidadeUpdateDTO {
  id: number;
  salaId: number;
  ativo: boolean;
  hrAbertura: string;
  hrFim: string;
  diaSemana: string;
  minDiasCan: number;
  diaSemanaIndex: number;
  intervaloMinutos: number;
}
