import { faker } from "@faker-js/faker";
import { Product } from "../../types";

const range = (len: any) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newProduct = (): Product => {
  return {
    productCode: faker.random.numeric(6),
    productName: faker.commerce.productName(),
    unitaryValue: Number(faker.commerce.price(0, 10000, 2)),
    unitaryType: faker.helpers.arrayElement(["unid", "g", "Kg", "L"]),
  };
};

export default function makeData(...lens: any[]) {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => {
      return {
        ...newProduct(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}
