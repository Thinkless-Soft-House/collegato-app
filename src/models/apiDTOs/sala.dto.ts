import { DisponibilidadeCreateDTO, DisponibilidadeUpdateDTO } from "./disponibilidade.dto";

export class SalaCreateDTO {
  status: number;
  nome: string;
  empresaId: number;
  foto: string;
  multiplasMarcacoes: boolean;

  disponibilidades?: DisponibilidadeCreateDTO[];
}

export class SalaUpdateDTO {
  id: number;
  status: number;
  nome: string;
  empresaId: number;
  foto: string;
  multiplasMarcacoes: boolean;

  disponibilidades?: DisponibilidadeUpdateDTO[];
}
