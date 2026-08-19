import Link from "next/link";
import { formatarData, formatarSalario } from "@/app/lib/formatacao";

type VagaProps = {
  id: string;
  titulo: string;
  empresa: string;
  salario: string | null;
  local: string;
  categoria: string;
  tipo: string;
  createdAt: Date | string;
};

export default function VagaCard({ vaga }: { vaga: VagaProps }) {
  return (
    <Link href={`/vagas/${vaga.id}`} className="vaga-card">
      <div className="vaga-card-top">
        <span className="vaga-tipo">{vaga.tipo}</span>
        <span className="vaga-data">{formatarData(vaga.createdAt)}</span>
      </div>
      <h2 className="vaga-titulo">{vaga.titulo}</h2>
      <p className="vaga-empresa">{vaga.empresa}</p>
      <div className="vaga-card-tags">
        <span className="tag">{vaga.local}</span>
        <span className="tag">{vaga.categoria}</span>
        <span className="tag tag-salario">{formatarSalario(vaga.salario)}</span>
      </div>
    </Link>
  );
}