import { prisma } from "@/app/lib/prisma";
import type { FonteColetor, VagaColetada } from "./tipos";
import { criarFonteGitHub } from "./adaptadores/github";
import { criarFonteRss } from "./adaptadores/rss";

export const fontes: FonteColetor[] = [
  criarFonteGitHub(),
  criarFonteRss({
    nome: "Remotive",
    url: "https://remotive.com/remote-jobs/feed",
  }),
];

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