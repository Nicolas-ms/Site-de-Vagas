import { prisma } from "@/app/lib/prisma";
import type { FonteColetor, VagaColetada } from "./tipos";
import { criarFonteGitHub } from "./adaptadores/github";
import { criarFonteRss } from "./adaptadores/rss";
import { criarFonteJson } from "./adaptadores/json";

const gupyToken = process.env.GUPY_API_TOKEN;

export const fontes: FonteColetor[] = [
  criarFonteGitHub(),

  criarFonteJson({
    nome: "Remotive",
    url: "https://remotive.com/api/remote-jobs",
    obterLista: (dados) =>
      (dados as { jobs?: unknown[] }).jobs ?? (dados as unknown[]),
    mapear: (item) => {
      const j = item as { title?: string; url?: string };
      return j.title && j.url
        ? { titulo: j.title, urlExterna: j.url }
        : null;
    },
  }),

  criarFonteJson({
    nome: "RemoteOK",
    url: "https://remoteok.com/api",
    obterLista: (dados) => {
      const lista = dados as unknown[];
      return lista.slice(1);
    },
    mapear: (item) => {
      const j = item as { position?: string; url?: string };
      return j.position && j.url
        ? { titulo: j.position, urlExterna: j.url }
        : null;
    },
  }),

  criarFonteJson({
    nome: "Jobicy",
    url: "https://jobicy.com/api/v2/remote-jobs",
    obterLista: (dados) => (dados as { jobs?: unknown[] }).jobs ?? [],
    mapear: (item) => {
      const j = item as { jobTitle?: string; url?: string };
      return j.jobTitle && j.url
        ? { titulo: j.jobTitle, urlExterna: j.url }
        : null;
    },
  }),

  criarFonteRss({
    nome: "WeWorkRemotely",
    url: "https://weworkremotely.com/remote-jobs.rss",
  }),

  criarFonteRss({
    nome: "Himalayas",
    url: "https://himalayas.app/jobs/rss",
  }),

  criarFonteJson({
    nome: "Trampos",
    url: "http://trampos.co/api/oportunidades.json",
    obterLista: (dados) => dados as unknown[],
    mapear: (item) => {
      const o = (item as { opportunity?: { name?: string; permalink?: string } })
        .opportunity;
      return o && o.name && o.permalink
        ? { titulo: o.name, urlExterna: o.permalink }
        : null;
    },
  }),
];

if (gupyToken) {
  fontes.push(
    criarFonteJson({
      nome: "Gupy",
      url: "https://api.gupy.io/api/v1/jobs",
      obterLista: (dados) =>
        (dados as { results?: unknown[] }).results ?? [],
      mapear: (item) => {
        const j = item as { name?: string; url?: string; id?: number };
        return j.name && j.url
          ? { titulo: j.name, urlExterna: j.url }
          : null;
      },
      headers: { Authorization: `Bearer ${gupyToken}` },
    })
  );
} else {
  console.warn(
    "Gupy não configurada: defina GUPY_API_TOKEN no .env para indexar vagas da Gupy."
  );
}

export async function coletarTodas(): Promise<{
  novas: number;
  existentes: number;
  fontesComFalha: string[];
}> {
  let novas = 0;
  let existentes = 0;
  const fontesComFalha: string[] = [];

  const resultados: VagaColetada[] = [];

  for (const fonte of fontes) {
    try {
      const vagas = await fonte.coletar();
      resultados.push(...vagas);
      console.log(`[${fonte.nome}] ${vagas.length} vagas coletadas`);
    } catch (erro) {
      fontesComFalha.push(fonte.nome);
      console.error(`[${fonte.nome}] erro:`, erro);
    }
  }

  for (const vaga of resultados) {
    try {
      await prisma.vaga.create({
        data: {
          titulo: vaga.titulo,
          origem: vaga.origem,
          urlExterna: vaga.urlExterna,
          descricao: vaga.descricao,
        },
      });
      novas++;
    } catch {
      // urlExterna duplicada (já indexada) — ignora
      existentes++;
    }
  }

  return { novas, existentes, fontesComFalha };
}