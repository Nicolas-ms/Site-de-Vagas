import type { FonteColetor, VagaColetada } from "../tipos";

type Issue = {
  title: string;
  html_url: string;
  body: string | null;
  pull_request?: unknown;
};

const repositorios = [
  "backend-br/vagas",
  "frontendbr/vagas",
  "react-brasil/vagas",
];

export function criarFonteGitHub(): FonteColetor {
  return {
    nome: "GitHub Vagas",
    coletar: async () => {
      const vagas: VagaColetada[] = [];

      for (const repo of repositorios) {
        const url = `https://api.github.com/repos/${repo}/issues?state=open&per_page=50`;
        const resposta = await fetch(url, {
          headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "Site-de-Vagas",
          },
        });

        if (!resposta.ok) {
          console.warn(`Falha ao buscar ${repo}: status ${resposta.status}`);
          continue;
        }

        const issues: Issue[] = await resposta.json();

        for (const issue of issues) {
          if (issue.pull_request) continue;

          const titulo = issue.title.trim();
          const urlExterna = issue.html_url;

          if (!titulo || !urlExterna) continue;

          vagas.push({
            titulo,
            origem: repo,
            urlExterna,
            descricao: issue.body?.slice(0, 1000) ?? undefined,
          });
        }
      }

      return vagas;
    },
  };
}