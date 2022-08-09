export type Product = {
  productCode: string;
  productName: string;
  unitaryValue: string;
};

export interface ProductRow extends Product {
  actions?: string;
}

export interface ProductDocument extends Product {
  _id?: string;
}

export type Client = {
  clientCode: string;
  clientName: string;
  clientEmail: string | null;
  contact: string;
  avatar?: string;
  color?: string;
};

export interface ClientRow extends Client {
  actions?: string;
}

export interface ClientDocument extends Client {
  _id?: string;
}

export type Item = {
  itemCode: string;
  product: Product;
  quantity: number;
  value: number;
};

export type Sale = {
  saleCode: string;
  items: Item[];
  client: Client;
  saleStatus: SaleStatus;
  fullValue: string | number;
  createdAt: string;
  paymentMethod: PaymentMethod;
};

export interface SaleRow extends Sale {
  actions?: string;
}

export interface SaleDocument extends Sale {
  _id?: string;
}

export type SaleStatus =
  | "done"
  | "draft"
  | "awaiting-payment"
  | "canceled"
  | "repaid";

export type TranslatedSaleStatus =
  | "Concluído"
  | "Rascunho"
  | "Aguardando"
  | "Cancelado"
  | "Reembolsado";

export const saleStatus: Record<SaleStatus, TranslatedSaleStatus> = {
  done: "Concluído",
  draft: "Rascunho",
  "awaiting-payment": "Aguardando",
  canceled: "Cancelado",
  repaid: "Reembolsado",
};

export const bagdeColor: Record<SaleStatus, string> = {
  done: "green",
  canceled: "red",
  "awaiting-payment": "blue",
  draft: "yellow",
  repaid: "gray",
};

export type PaymentMethod =
  | "cash"
  | "pix"
  | "credit-card"
  | "debit-card"
  | "bank-payment-slip"
  | "crediary"
  | "transference"
  | "pay-link";

export type TranslatedPaymentMethod =
  | "Dinheiro"
  | "PIX"
  | "Cartão de Crédito"
  | "Cartão de Débito"
  | "Boleto"
  | "Crediário"
  | "Transferência"
  | "Link de Pagamento";

export const paymentMethod: Record<PaymentMethod, TranslatedPaymentMethod> = {
  cash: "Dinheiro",
  pix: "PIX",
  "credit-card": "Cartão de Crédito",
  "debit-card": "Cartão de Débito",
  "bank-payment-slip": "Boleto",
  crediary: "Crediário",
  transference: "Transferência",
  "pay-link": "Link de Pagamento",
};

export const colorScheme: string[] = [
  // "whiteAlpha",
  "blackAlpha",
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "cyan",
  "purple",
  "pink",
  "linkedin",
  "facebook",
  "messenger",
  "whatsapp",
  "twitter",
  "telegram",
];
