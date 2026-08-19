export function formatarData(data: Date | string): string {
  const d = new Date(data);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatarSalario(salario: string | null): string {
  return salario || "A combinar";
}