import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { formatarData, formatarSalario } from "@/app/lib/formatacao";

export const dynamic = "force-dynamic";

export default async function PaginaVaga(props: PageProps<"/vagas/[id]">) {
  const { id } = await props.params;

  const vaga = await prisma.vaga.findUnique({
    where: { id },
  });

  if (!vaga) {
    notFound();
  }

  return (
    <main className="container detalhe">
      <Link href="/" className="voltar">
        &larr; Voltar para a lista
      </Link>

      <article className="vaga-detalhe">
        <div className="vaga-detalhe-cabecalho">
          <div>
            <span className="vaga-tipo">{vaga.tipo}</span>
            <h1>{vaga.titulo}</h1>
            <p className="vaga-empresa">{vaga.empresa}</p>
          </div>
          <div className="vaga-info-data">{formatarData(vaga.createdAt)}</div>
        </div>

        <div className="vaga-detalhe-tags">
          <div className="tag">
            <strong>Local:</strong> {vaga.local}
          </div>
          <div className="tag">
            <strong>Categoria:</strong> {vaga.categoria}
          </div>
          <div className="tag tag-salario">
            <strong>Salário:</strong> {formatarSalario(vaga.salario)}
          </div>
        </div>

        <h2>Descrição da vaga</h2>
        <p className="vaga-descricao">{vaga.descricao}</p>

        {vaga.emailContato && (
          <div className="vaga-candidatura">
            <h2>Como se candidatar</h2>
            <p>
              Envie seu currículo para{" "}
              <a href={`mailto:${vaga.emailContato}`}>{vaga.emailContato}</a>
            </p>
          </div>
        )}
      </article>
    </main>
  );
}