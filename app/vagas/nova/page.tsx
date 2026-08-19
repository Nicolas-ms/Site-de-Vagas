import Link from "next/link";
import FormularioVaga from "./FormularioVaga";

export default function NovaVaga() {
  return (
    <main className="container">
      <Link href="/" className="voltar">
        &larr; Voltar para a lista
      </Link>
      <h1 className="pagina-titulo">Publicar uma vaga</h1>
      <p className="pagina-subtitulo">
        Preencha as informações abaixo para divulgar sua oportunidade.
      </p>
      <FormularioVaga />
    </main>
  );
}