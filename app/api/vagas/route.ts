import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  const vagas = await prisma.vaga.findMany({
    where: q
      ? {
          OR: [{ titulo: { contains: q } }, { origem: { contains: q } }],
        }
      : undefined,
    orderBy: { criadoEm: "desc" },
    take: 200,
  });

  return NextResponse.json(vagas);
}