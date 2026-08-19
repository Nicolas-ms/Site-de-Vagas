import VagaCard from "@/app/components/VagaCard";
import AtualizarVagas from "@/app/components/AtualizarVagas";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: PageProps<"/">) {
  const { q = "" } = await searchParams;
  const termo = String(q).trim();

  const vagas = await prisma.vaga.findMany({
    where: termo
      ? {
          OR: [
            { titulo: { contains: termo } },
            { origem: { contains: termo } },
          ],
        }
      : undefined,
    orderBy: { criadoEm: "desc" },
    take: 200,
  });

  const origens = await prisma.vaga.groupBy({
    by: ["origem"],
    _count: { _all: true },
    orderBy: { _count: { origem: "desc" } },
  });

  return (
    <main className="container">
      <header className="hero">
        <h1>Vagas de TI e tecnologia em um só lugar</h1>
        <p>
          Indexamos vagas de várias fontes para você encontrar tudo em um único
          lugar.
        </p>
        <AtualizarVagas />
      </header>

      <form className="busca" method="get">
        <input
          type="search"
          name="q"
          placeholder="Buscar por cargo, tecnologia ou fonte..."
          defaultValue={termo}
          className="busca-input"
        />
        <button type="submit" className="btn btn-primario">
          Buscar
        </button>
      </form>

      <section className="fontes">
        <h2 className="titulo-secao">Fontes indexadas</h2>
        <div className="lista-fontes">
          {origens.map((fonte) => (
            <span key={fonte.origem} className="fonte">
              {fonte.origem}
              <strong>{fonte._count._all}</strong>
            </span>
          ))}
        </div>
      </section>

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
            Não encontramos vagas com esses termos. Tente outra busca.
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