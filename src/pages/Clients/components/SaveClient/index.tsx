import {
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  Input,
  DrawerFooter,
  Button,
} from "@chakra-ui/react";
import { faker } from "@faker-js/faker";
import { cpf } from "cpf-cnpj-validator";
import { useForm } from "react-hook-form";
import { ClientRow } from "../../../../types";

interface SaveClientProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setData: React.Dispatch<React.SetStateAction<ClientRow[]>>;
}

export default function SaveClient({
  isOpen,
  onClose,
  setData,
}: SaveClientProps) {
  const { register, handleSubmit, setValue } = useForm<ClientRow>();

  async function handleCreateClient(dataForm: ClientRow) {
    setData((prevData: ClientRow[]) => {
      const dataInput: ClientRow = {
        clientCode: dataForm.clientCode,
        clientName: dataForm.clientName,
        contact: dataForm.contact,
        clientEmail: dataForm.clientEmail,
        clientDocument: dataForm.clientDocument,
      };

      onClose();
      clearFields();

      return [dataInput, ...prevData];
    });
  }

  const clearFields = () => {
    setValue("clientCode", faker.random.numeric(6));
    setValue("clientName", "");
    setValue("contact", "");
    setValue("contact", "");
    setValue("clientEmail", "");
    setValue("clientDocument", "");
  };

  return (
    <Drawer isOpen={isOpen} placement={"right"} size={"sm"} onClose={onClose}>
      <form onSubmit={handleSubmit(handleCreateClient)}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{"Adicionar novo cliente"}</DrawerHeader>
          <DrawerBody>
            <VStack gap={5} width={"90%"}>
              <VStack alignItems={"flex-start"} width={"90%"}>
                <Text textAlign={"left"}>Código</Text>
                <Input
                  {...register("clientCode")}
                  value={faker.random.numeric(6)}
                  isReadOnly={true}
                />
              </VStack>
              <VStack alignItems={"flex-start"} width={"90%"}>
                <Text textAlign={"left"}>{"Nome do cliente"}</Text>
                <Input
                  {...register("clientName")}
                  placeholder="Ex. Fulano de Tal"
                />
              </VStack>
              <VStack alignItems={"flex-start"} width={"90%"}>
                <Text textAlign={"left"}>{"Celular"}</Text>
                <Input
                  {...register("contact")}
                  placeholder={`Ex. ${faker.phone.number("(8#) 9####-####")}`}
                />
              </VStack>
              <VStack alignItems={"flex-start"} width={"90%"}>
                <Text textAlign={"left"}>{"E-mail"}</Text>
                <Input
                  {...register("clientEmail")}
                  placeholder={"Ex. abcdef@gmail.com"}
                />
              </VStack>
              <VStack alignItems={"flex-start"} width={"90%"}>
                <Text textAlign={"left"}>{"CPF/CNPJ"}</Text>
                <Input
                  {...register("clientDocument")}
                  placeholder={`Ex. ${cpf.format(cpf.generate())}`}
                />
              </VStack>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              width={"full"}
              type={"submit"}
              backgroundColor={"#63342B"}
              _hover={{ backgroundColor: "#502A22" }}
              _active={{ backgroundColor: "#482017" }}
              colorScheme="blue"
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
}
