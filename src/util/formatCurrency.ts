export const toBRLWithSign = (value: number) => {
  return value.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
};
export const toBRLWithoutSign = (value: number) => {
  return value.toLocaleString("pt-br", {
    style: "currency",
    minimumFractionDigits: 2,
  });
};
