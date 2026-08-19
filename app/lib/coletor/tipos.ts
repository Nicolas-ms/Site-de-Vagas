export type VagaColetada = {
  titulo: string;
  origem: string;
  urlExterna: string;
  descricao?: string;
};

export type FonteColetor = {
  nome: string;
  coletar: () => Promise<VagaColetada[]>;
};