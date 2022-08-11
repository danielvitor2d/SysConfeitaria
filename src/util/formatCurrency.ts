export const toBRLWithSign = (value: number): string => {
  return value.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
};
export const toBRLWithoutSign = (value: number): string => {
  return value.toLocaleString("pt-br", {
    style: "currency",
    minimumFractionDigits: 2,
  });
};
export const fromBRLWithSign = (value: string): number => {
  if (value.length === 0) return 0;
  let numberValue = value.split("R$ ")[1];
  numberValue = numberValue.replace(".", "").replace(",", ".");
  return Number(numberValue);
};
export default function currencyFormatter(value: string | number) {
  if (!Number(value)) return "R$ 0,00";

  const amount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value) / 100);

  return `${amount}`;
}
