import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const categoria = searchParams.get("categoria") ?? "";

  const where: Record<string, unknown> = { ativa: true };

  if (categoria) {
    where.categoria = categoria;
  }

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

  return NextResponse.json(vagas);
}

export async function POST(request: Request) {
  const body = await request.json();

  const camposObrigatorios = ["titulo", "empresa", "descricao", "local"];
  for (const campo of camposObrigatorios) {
    if (!body[campo]) {
      return NextResponse.json(
        { error: `Campo "${campo}" é obrigatório.` },
        { status: 400 }
      );
    }
  }

  const vaga = await prisma.vaga.create({
    data: {
      titulo: String(body.titulo),
      empresa: String(body.empresa),
      descricao: String(body.descricao),
      salario: body.salario ? String(body.salario) : null,
      local: String(body.local),
      categoria: String(body.categoria || "Outros"),
      tipo: String(body.tipo || "CLT"),
      emailContato: String(body.emailContato || ""),
      ativa: true,
    },
  });

  return NextResponse.json(vaga, { status: 201 });
}