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
} from "../../../../types";

const range = (len: any) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newSale = (): Item => {
  const quantity = Number(faker.random.numeric(2));
  const unitaryValue = Number(faker.commerce.price(0, 10000, 2));
  return {
    itemCode: faker.random.numeric(6),
    product: {
      productName: faker.commerce.productName(),
    } as Product,
    quantity,
    unitaryValue,
    totalValue: quantity * unitaryValue,
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
