import { NextResponse } from "next/server";
import { coletarTodas } from "@/app/lib/coletor/executar";

export const runtime = "nodejs";

export async function POST() {
  try {
    const resultado = await coletarTodas();
    return NextResponse.json({
      ok: true,
      ...resultado,
    });
  } catch (erro) {
    return NextResponse.json(
      { ok: false, erro: String(erro) },
      { status: 500 }
    );
  }
}