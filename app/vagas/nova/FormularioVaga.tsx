"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const categorias = [
  "Tecnologia",
  "Marketing",
  "Vendas",
  "Administrativo",
  "Atendimento",
  "Financeiro",
  "Outros",
];

const tipos = ["CLT", "PJ", "Estágio", "Temporário", "Freelance"];

const formularioInicial = {
  titulo: "",
  empresa: "",
  descricao: "",
  salario: "",
  local: "",
  categoria: "Tecnologia",
  tipo: "CLT",
  emailContato: "",
};

export default function FormularioVaga() {
  const router = useRouter();
  const [form, setForm] = useState(formularioInicial);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  function atualizar(campo: keyof typeof formularioInicial, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setEnviando(true);

    try {
      const resposta = await fetch("/api/vagas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.error ?? "Erro ao publicar a vaga.");
        setEnviando(false);
        return;
      }

      router.push(`/vagas/${dados.id}`);
    } catch {
      setErro("Erro de conexão. Tente novamente.");
      setEnviando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <label>
        Título da vaga *
        <input
          type="text"
          value={form.titulo}
          onChange={(e) => atualizar("titulo", e.target.value)}
          placeholder="Ex.: Desenvolvedor Frontend React"
          required
        />
      </label>

      <label>
        Nome da empresa *
        <input
          type="text"
          value={form.empresa}
          onChange={(e) => atualizar("empresa", e.target.value)}
          placeholder="Ex.: TechSolutions"
          required
        />
      </label>

      <label>
        Descrição da vaga *
        <textarea
          value={form.descricao}
          onChange={(e) => atualizar("descricao", e.target.value)}
          placeholder="Descreva as responsabilidades, requisitos e benefícios..."
          rows={6}
          required
        />
      </label>

      <div className="formulario-duas-colunas">
        <label>
          Salário (opcional)
          <input
            type="text"
            value={form.salario}
            onChange={(e) => atualizar("salario", e.target.value)}
            placeholder="Ex.: R$ 8.000 - R$ 10.000"
          />
        </label>

        <label>
          Local *
        <input
          type="text"
          value={form.local}
          onChange={(e) => atualizar("local", e.target.value)}
          placeholder="Ex.: Remoto ou São Paulo - SP"
          required
        />
        </label>
      </div>

      <div className="formulario-duas-colunas">
        <label>
          Categoria
          <select
            value={form.categoria}
            onChange={(e) => atualizar("categoria", e.target.value)}
          >
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label>
          Tipo de contrato
          <select
            value={form.tipo}
            onChange={(e) => atualizar("tipo", e.target.value)}
          >
            {tipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        E-mail para candidaturas
        <input
          type="email"
          value={form.emailContato}
          onChange={(e) => atualizar("emailContato", e.target.value)}
          placeholder="Ex.: rh@empresa.com.br"
        />
      </label>

      {erro && <p className="erro">{erro}</p>}

      <button type="submit" className="btn btn-primario" disabled={enviando}>
        {enviando ? "Publicando..." : "Publicar vaga"}
      </button>
    </form>
  );
}