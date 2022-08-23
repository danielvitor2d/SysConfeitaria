export const toBRLWithSign = (value: number): string => {
  return value.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
};
export const toBRLWithoutSign = (value: number): string => {
  return value.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};
export const fromBRLWithSign = (value: string): number => {
  if (value.length === 0) return 0;
  let numberValue =
    value.split("R$ ").length === 1
      ? value.split("R$ ")[0]
      : value.split("R$ ")[1];
  if (!numberValue || numberValue.length === 0) return 0;
  numberValue = numberValue.replace(".", "").replace(",", ".");
  return Number(numberValue);
};
export default function currencyFormatter(
  value: string | number,
  prefix?: string,
  fractionDigits?: number
) {
  if (!Number(value)) return prefix ? `R$ 0,00` : `0,${'0'.repeat(fractionDigits || 2)}`;

  if (prefix) {
    const amount = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value) / 100);
    return `${amount}`;
  }

  return toBRL(Number(value), fractionDigits);
}
export const toBRL = (value: number, fractionDigits?: number) => {
  const stringValue = String(value);
  return toNumberString(stringValue, fractionDigits);
};
export const fromBRL = (value: string) => {
  return (
    Number(value.split(",")[0].replace(".", "") || 0) +
    Number(value.split(",")[1]) / 100
  );
};

export function toNumberString(value: string, fractionDigits: number = 2) {
  var result = value;

  // Deixa apenas números
  result = result.replace(/[\D]+/g, "");
  result = result.replace(/[^0-9]/, "");

  // Remove os zeros do começo
  result = result.replace(/\b0/g, "");

  if (result.length === 0) return `0,${'0'.repeat(fractionDigits)}`;

  result = result.padStart(fractionDigits + 1, '0')

  // Separa os últimos por vírgula
  if (fractionDigits === 2) result = result.replace(/(\d)(\d{2})$/, "$1,$2");
  else if (fractionDigits === 3) result = result.replace(/(\d)(\d{3})$/, "$1,$2");

  if (result.length > 6) {
    result = result.replace(/(?=(\d{3})+(\D))\B/g, ".");
  }

  return result;
}
export const fromNumberToStringFormatted = (value: number): string => {
  let valueAsString = String(value.toFixed(2));
  if (valueAsString.includes(".")) {
    let integerPartString = valueAsString.split(".")[0];
    let decimalPartString = valueAsString.split(".")[1];

    if (integerPartString.length > 3) {
      integerPartString = integerPartString.replace(/(?=(\d{3})+(\D))\B/g, ".");
    }

    return integerPartString + "," + decimalPartString;
  } else {
    if (valueAsString.length > 3) {
      valueAsString = valueAsString.replace(/(?=(\d{3})+(\D))\B/g, ".");
    }

    return valueAsString + ",00";
  }
};
// export const fromNumberToBRLFormatted = (value: number): string => {
//   let valueAsString = String(value)
//   if (valueAsString.includes(".")) {
//     let integerPartString =  valueAsString.split(".")[0]
//     let decimalPartString =  valueAsString.split(".")[1]

//     if (integerPartString.length > 3) {
//       integerPartString = integerPartString.replace(/(?=(\d{3})+(\D))\B/g, ".");
//     }

//     return integerPartString + "," + decimalPartString
//   } else {
//     if (valueAsString.length > 3) {
//       valueAsString = valueAsString.replace(/(?=(\d{3})+(\D))\B/g, ".");
//     }

//     return valueAsString + ",00"
//   }
// };
