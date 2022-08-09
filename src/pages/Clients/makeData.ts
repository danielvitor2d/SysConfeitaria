import { faker } from "@faker-js/faker";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { Client, colorScheme } from "../../types";

const range = (len: any) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newClient = (): Client => {
  const clientFirstName = faker.name.firstName();
  const clientlastName = faker.name.lastName();
  return {
    clientCode: faker.random.numeric(6),
    clientName:
      clientFirstName + " " + faker.name.middleName() + " " + clientlastName,
    clientEmail: faker.internet.email(clientFirstName, clientlastName),
    contact: faker.phone.number("(8#) 9####-####"),
    avatar: faker.image.avatar(),
    color: faker.helpers.arrayElement(colorScheme) as string,
    clientDocument: faker.helpers.arrayElement([
      cnpj.format(cnpj.generate()),
      cpf.format(cpf.generate()),
    ]),
  };
};

export default function makeData(...lens: any[]) {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => {
      return {
        ...newClient(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}
