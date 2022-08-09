export const toBRLWithSign = (value: number) => {
  return value.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
};
export const toBRLWithoutSign = (value: number) => {
  return value.toLocaleString("pt-br", {
    style: "currency",
    minimumFractionDigits: 2,
  });
};
export default function currencyFormatter(value: string | number) {
  if (!Number(value)) return "R$ 0,00";

  const amount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value) / 100);

  return `${amount}`;
}
