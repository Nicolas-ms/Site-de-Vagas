import "dotenv/config";
import { coletarTodas } from "./executar";
import { prisma } from "@/app/lib/prisma";

async function main() {
  console.log("Iniciando coleta de vagas...\n");

  const totalAntes = await prisma.vaga.count();
  console.log(`Vagas no banco antes da coleta: ${totalAntes}\n`);

  const resultado = await coletarTodas();

  const totalDepois = await prisma.vaga.count();

  console.log("\n===== RESUMO =====");
  console.log(`Novas vagas indexadas: ${resultado.novas}`);
  console.log(`Vagas já existentes (duplicadas): ${resultado.existentes}`);
  console.log(`Fontes com falha: ${resultado.fontesComFalha.length || "nenhuma"}`);
  if (resultado.fontesComFalha.length) {
    console.log(`  - ${resultado.fontesComFalha.join("\n  - ")}`);
  }
  console.log(`Total de vagas no banco: ${totalDepois}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());