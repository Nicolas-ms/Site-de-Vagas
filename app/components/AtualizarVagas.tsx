"use client";

import { useState } from "react";

export default function AtualizarVagas() {
  const [estado, setEstado] = useState<"ocioso" | "carregando" | "pronto" | "erro">(
    "ocioso"
  );
  const [mensagem, setMensagem] = useState("");

  async function atualizar() {
    setEstado("carregando");
    setMensagem("");
    try {
      const resposta = await fetch("/api/coletar", { method: "POST" });
      const dados = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.erro ?? "Erro ao atualizar.");
      }
      setMensagem(
        `Indexadas ${dados.novas} novas vagas (${dados.existentes} já existiam).`
      );
      setEstado("pronto");
      setTimeout(() => setEstado("ocioso"), 4000);
    } catch (e) {
      setMensagem(`Erro: ${String(e)}`);
      setEstado("erro");
    }
  }

  return (
    <div className="atualizar">
      <button
        type="button"
        onClick={atualizar}
        className="btn btn-primario"
        disabled={estado === "carregando"}
      >
        {estado === "carregando" ? "Atualizando..." : "Atualizar vagas"}
      </button>
      {mensagem && (
        <p className={estado === "erro" ? "erro" : "ok"}>{mensagem}</p>
      )}
    </div>
  );
}