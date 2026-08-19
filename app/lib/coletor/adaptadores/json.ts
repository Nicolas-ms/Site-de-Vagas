import type { FonteColetor, VagaColetada } from "../tipos";

type OpcoesJson = {
  nome: string;
  url: string;
  obterLista: (dados: unknown) => unknown[];
  mapear: (item: unknown) => {
    titulo: string;
    urlExterna: string;
    descricao?: string;
  } | null;
  headers?: Record<string, string>;
};

export function criarFonteJson(opcoes: OpcoesJson): FonteColetor {
  return {
    nome: opcoes.nome,
    coletar: async () => {
      const resposta = await fetch(opcoes.url, {
        headers: {
          "User-Agent": "Site-de-Vagas",
          ...opcoes.headers,
        },
      });

      if (!resposta.ok) {
        throw new Error(
          `Falha ao buscar ${opcoes.nome}: status ${resposta.status}`
        );
      }

      const dados = await resposta.json();
      const lista = opcoes.obterLista(dados);
      const vagas: VagaColetada[] = [];

      for (const item of lista) {
        const mapeado = opcoes.mapear(item);
        if (!mapeado || !mapeado.titulo || !mapeado.urlExterna) continue;
        vagas.push({
          titulo: mapeado.titulo.trim(),
          urlExterna: mapeado.urlExterna.trim(),
          origem: opcoes.nome,
          descricao: mapeado.descricao?.trim() || undefined,
        });
      }

      return vagas;
    },
  };
}