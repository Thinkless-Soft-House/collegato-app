export interface PaginacaoModel {
    take?: number;
    skip?: number;
    orderColumn?: string;
    order: 'ASC' | 'DESC';
  }
