import { faker } from "@faker-js/faker";
import { Product } from ".";

const range = (len: any) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (): Product => {
  return {
    productCode: faker.random.numeric(6),
    productName: faker.commerce.productDescription(),
    unitaryValue: faker.commerce.price().toString(),
  };
};

export default function makeData(...lens: any[]) {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}
