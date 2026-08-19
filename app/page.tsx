import Link from "next/link";
import VagaCard from "@/app/components/VagaCard";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

const categorias = [
  "Tecnologia",
  "Marketing",
  "Vendas",
  "Administrativo",
  "Atendimento",
  "Financeiro",
  "Outros",
];

export default async function Home({
  searchParams,
}: PageProps<"/">) {
  const { q = "", categoria = "" } = await searchParams;

  const where: Record<string, unknown> = { ativa: true };
  if (categoria) where.categoria = categoria;
  if (q) {
    where.OR = [
      { titulo: { contains: q } },
      { empresa: { contains: q } },
      { local: { contains: q } },
      { descricao: { contains: q } },
    ];
  }

  const vagas = await prisma.vaga.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="container">
      <header className="hero">
        <h1>Encontre sua próxima oportunidade</h1>
        <p>Vagas de emprego atualizadas todos os dias em diversas áreas.</p>
        <Link href="/vagas/nova" className="btn btn-primario">
          Publicar uma vaga
        </Link>
      </header>

      <form className="busca" method="get">
        <input
          type="search"
          name="q"
          placeholder="Buscar por cargo, empresa ou cidade..."
          defaultValue={q}
          className="busca-input"
        />
        <select name="categoria" defaultValue={categoria} className="busca-select">
          <option value="">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primario">
          Buscar
        </button>
      </form>

      <section>
        <h2 className="titulo-secao">
          {vagas.length > 0
            ? `${vagas.length} vaga${vagas.length > 1 ? "s" : ""} encontrada${
                vagas.length > 1 ? "s" : ""
              }`
            : "Nenhuma vaga encontrada"}
        </h2>

        {vagas.length === 0 ? (
          <p className="sem-resultados">
            Não encontramos vagas com esses filtros. Tente ajustar a busca.
          </p>
        ) : (
          <div className="lista-vagas">
            {vagas.map((vaga) => (
              <VagaCard key={vaga.id} vaga={vaga} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}