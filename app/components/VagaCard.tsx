import { formatarData } from "@/app/lib/formatacao";

type VagaProps = {
  id: string;
  titulo: string;
  origem: string;
  urlExterna: string;
  criadoEm: Date | string;
};

export default function VagaCard({ vaga }: { vaga: VagaProps }) {
  return (
    <a
      href={vaga.urlExterna}
      target="_blank"
      rel="noopener noreferrer"
      className="vaga-card"
    >
      <div className="vaga-card-top">
        <span className="vaga-tipo">{vaga.origem}</span>
        <span className="vaga-data">{formatarData(vaga.criadoEm)}</span>
      </div>
      <h2 className="vaga-titulo">{vaga.titulo}</h2>
      <p className="vaga-abrir">Abrir vaga &rarr;</p>
    </a>
  );
}