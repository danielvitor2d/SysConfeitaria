export type Product = {
  productCode: string;
  productName: string;
  unitaryValue: number;
  unitaryType: unitaryType;
};

export interface ProductRow extends Product {
  actions?: string;
}

export interface ProductOption extends Product {
  value?: string;
  label?: string;
  key?: string;
}

export interface ProductDocument extends Product {
  _id?: string;
}

export type Payment = {
  paymentCode: string;
  paymentTitle: string;
  paymentDescription: string;
  paymentValue: number;
  createdAt: string;
};

export interface PaymentRow extends Payment {
  actions?: string;
}

export interface PaymentOption extends Payment {
  value?: string;
  label?: string;
  key?: string;
}

export interface PaymentDocument extends Payment {
  _id?: string;
}

export type Client = {
  clientCode: string;
  clientName: string;
  clientEmail: string | null;
  clientDocument: string;
  contact: string;
  avatar?: string;
  color?: string;
  address: {
    rua?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    complemento?: string;
    referencia?: string;
    cep?: string;
  };
};

export interface ClientRow extends Client {
  actions?: string;
}

export interface ClientOption extends Client {
  value?: string;
  label?: string;
  key?: string;
}

export interface ClientDocument extends Client {
  _id?: string;
}

export type Item = {
  itemCode: string;
  product: Product;
  quantity: number;
  unitaryValue: number;
  totalValue: number;
};

export interface ItemRow extends Item {
  actions?: string;
}

export interface ItemDocument extends Item {
  _id?: string;
}

export type Sale = {
  saleCode: string;
  items: Item[];
  client: Client;
  saleStatus: SaleStatus;
  fullValue: string | number;
  createdAt: string;
  paymentMethods: PaymentMethod[];
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
  | "promissory"
  | "transference"
  | "pay-link";

export type TranslatedPaymentMethod =
  | "Dinheiro"
  | "Pix"
  | "Cartão de Crédito"
  | "Cartão de Débito"
  | "Boleto"
  | "Promissória"
  | "Transferência"
  | "Link de Pagamento";

export const paymentMethod: Record<PaymentMethod, TranslatedPaymentMethod> = {
  cash: "Dinheiro",
  pix: "Pix",
  "credit-card": "Cartão de Crédito",
  "debit-card": "Cartão de Débito",
  "bank-payment-slip": "Boleto",
  promissory: "Promissória",
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

export type unitaryType = 'Kg' | 'g' | 'L' | 'unid'