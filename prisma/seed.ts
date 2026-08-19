import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/app/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const categorias = [
  "Tecnologia",
  "Marketing",
  "Vendas",
  "Administrativo",
  "Atendimento",
  "Financeiro",
];

const vagasExemplo = [
  {
    titulo: "Desenvolvedor Frontend React",
    empresa: "TechSolutions",
    descricao:
      "Buscamos um desenvolvedor frontend apaixonado por React e TypeScript para construir interfaces modernas e escaláveis. Você fará parte de um time ágil e colaborativo.",
    salario: "R$ 8.000 - R$ 10.000",
    local: "Remoto",
    categoria: "Tecnologia",
    tipo: "CLT",
    emailContato: "rh@techsolutions.com.br",
  },
  {
    titulo: "Analista de Marketing Digital",
    empresa: "Agência Mais",
    descricao:
      "Responsável por planejar e executar campanhas digitais, gerenciar redes sociais e analisar métricas para otimizar resultados de nossos clientes.",
    salario: "R$ 4.500 - R$ 6.000",
    local: "São Paulo - SP",
    categoria: "Marketing",
    tipo: "CLT",
    emailContato: "vagas@agenciamais.com.br",
  },
  {
    titulo: "Vendedor B2B",
    empresa: "Comercial Atlas",
    descricao:
      "Atuar na prospecção e fechamento de novos contratos com empresas. Excelente comissão e possibilidade de crescimento rápido na carreira.",
    salario: "R$ 3.000 + comissão",
    local: "Belo Horizonte - MG",
    categoria: "Vendas",
    tipo: "PJ",
    emailContato: "carreiras@comercialatlas.com",
  },
  {
    titulo: "Auxiliar Administrativo",
    empresa: "Grupo Vale Verde",
    descricao:
      "Apoio nas rotinas administrativas, organização de documentos, atendimento interno e controle de planilhas. Perfil organizado é essencial.",
    salario: "R$ 2.200",
    local: "Curitiba - PR",
    categoria: "Administrativo",
    tipo: "CLT",
    emailContato: "adm@grupovaleverde.com.br",
  },
  {
    titulo: "Atendente de Suporte",
    empresa: "Conecta Telecom",
    descricao:
      "Atendimento ao cliente por chat e telefone, resolução de dúvidas e abertura de chamados. Treinamento completo oferecido pela empresa.",
    salario: null,
    local: "Remoto",
    categoria: "Atendimento",
    tipo: "CLT",
    emailContato: "rh@conectatelecom.com.br",
  },
  {
    titulo: "Analista Financeiro Júnior",
    empresa: "Finsol Consultoria",
    descricao:
      "Análise de contas a pagar e receber, conciliação bancária e apoio na elaboração de relatórios financeiros mensais.",
    salario: "R$ 4.000 - R$ 5.000",
    local: "Porto Alegre - RS",
    categoria: "Financeiro",
    tipo: "CLT",
    emailContato: "contato@finsol.com.br",
  },
  {
    titulo: "Desenvolvedor Backend Node.js",
    empresa: "DataCore",
    descricao:
      "Desenvolvimento de APIs REST e microsserviços com Node.js, integração com bancos de dados e arquitetura de sistemas de alta performance.",
    salario: "R$ 9.000 - R$ 12.000",
    local: "Remoto",
    categoria: "Tecnologia",
    tipo: "PJ",
    emailContato: "dev@datacore.tech",
  },
  {
    titulo: "Especialista em SEO",
    empresa: "RankUp Digital",
    descricao:
      "Estruturar estratégias de SEO on-page e off-page, otimizar sites e acompanhar posicionamento. Experiência com ferramentas de análise é um diferencial.",
    salario: "R$ 6.000 - R$ 8.000",
    local: "Rio de Janeiro - RJ",
    categoria: "Marketing",
    tipo: "PJ",
    emailContato: "seo@rankup.digital",
  },
];

async function main() {
  for (const vaga of vagasExemplo) {
    await prisma.vaga.create({
      data: {
        ...vaga,
        ativa: true,
      },
    });
  }
  console.log(`Seed concluído: ${vagasExemplo.length} vagas criadas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());