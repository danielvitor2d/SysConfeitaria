import { Faker, faker } from "@faker-js/faker";
import {
  Client,
  paymentMethod,
  Item,
  PaymentMethod,
  Product,
  Sale,
  SaleStatus,
  saleStatus,
  colorScheme,
} from "../../types";

const range = (len: any) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newSale = (): Sale => {
  return {
    saleCode: faker.random.numeric(6),
    createdAt: faker.date.past(2).toLocaleDateString("pt-BR"),
    fullValue: Number(faker.commerce.price(0, 10000, 2)),
    client: {
      clientName: faker.name.findName(),
      avatar: faker.image.avatar(),
      color: faker.helpers.arrayElement(colorScheme) as string,
    } as Client,
    items: [] as Item[],
    paymentMethod: faker.helpers.objectKey(paymentMethod) as PaymentMethod,
    saleStatus: faker.helpers.objectKey(saleStatus) as SaleStatus,
  };
};

export default function makeData(...lens: any[]) {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => {
      return {
        ...newSale(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}
