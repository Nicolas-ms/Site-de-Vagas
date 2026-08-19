import { XMLParser } from "fast-xml-parser";
import type { FonteColetor, VagaColetada } from "../tipos";

type ItemRss = {
  title?: string;
  link?: string;
  description?: string;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true,
});

function extrairItens(dados: unknown): ItemRss[] {
  const feed = dados as {
    rss?: { channel?: { item?: ItemRss | ItemRss[] } };
    feed?: { entry?: ItemRss | ItemRss[] };
  };

  const item = feed?.rss?.channel?.item;
  const entry = feed?.feed?.entry;

  if (Array.isArray(item)) return item;
  if (item) return [item];
  if (Array.isArray(entry)) return entry;
  if (entry) return [entry];
  return [];
}

export function criarFonteRss(opcoes: {
  nome: string;
  url: string;
}): FonteColetor {
  return {
    nome: opcoes.nome,
    coletar: async () => {
      const resposta = await fetch(opcoes.url, {
        headers: { "User-Agent": "Site-de-Vagas" },
      });

      if (!resposta.ok) {
        throw new Error(
          `Falha ao buscar ${opcoes.nome}: status ${resposta.status}`
        );
      }

      const xml = await resposta.text();
      const dados = parser.parse(xml);
      const itens = extrairItens(dados);

      const vagas: VagaColetada[] = [];

      for (const item of itens) {
        const titulo = item.title?.trim();
        const urlExterna = item.link?.trim();

        if (!titulo || !urlExterna) continue;

        vagas.push({
          titulo,
          origem: opcoes.nome,
          urlExterna,
          descricao: item.description?.trim() || undefined,
        });
      }

      return vagas;
    },
  };
}