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
  useToast,
  HStack,
} from "@chakra-ui/react";
import { faker } from "@faker-js/faker";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ClientContext from "../../../../contexts/ClientsContext";
import GlobalContext from "../../../../contexts/GlobalContext";
import { Client, ClientRow, colorScheme } from "../../../../types";
import { formatCode } from "../../../../util/formatCode";
import { cpfCnpjMask } from "../../../../util/formatCpfCnpj";
import CellphoneNumberFormat from "../../../components/CellphoneInputFormat";

interface SaveOrUpdateClientProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  handleAddOrUpdateClient: (client: Client) => Promise<boolean>;
  mode: "create" | "update";
  client?: Client;
}

export default function SaveOrUpdateClient({
  isOpen,
  onClose,
  mode,
  client,
  handleAddOrUpdateClient,
}: SaveOrUpdateClientProps) {
  const toast = useToast();

  const { clientCode } = useContext(GlobalContext);
  const { clients } = useContext(ClientContext);

  const [document, setDocument] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<ClientRow>({
    defaultValues: {
      clientCode: client?.clientCode || formatCode(clientCode),
      clientName: client?.clientName || "",
      clientDocument: client?.clientDocument || "",
      clientEmail: client?.clientEmail || "",
      contact: client?.contact || "",
    },
    criteriaMode: "firstError",
  });

  async function handleCreateOrUpdateClient(dataForm: ClientRow) {
    const documentNumberCpf = cpf.strip(document);
    const documentNumberCnpj = cnpj.strip(document);

    if (!cpf.isValid(documentNumberCpf) && !cnpj.isValid(documentNumberCnpj)) {
      toast({
        title: "Dados inválidos",
        description: "CPF/CNPJ inválido",
        isClosable: true,
        variant: "left-accent",
        status: "warning",
        position: "bottom-right",
      });
      return;
    }

    const dataInput: Client = {
      clientCode: dataForm.clientCode,
      clientName: dataForm.clientName,
      contact: dataForm.contact,
      clientEmail: dataForm.clientEmail,
      clientDocument: document,
      color: faker.helpers.arrayElement(colorScheme) as string
    };

    const result = await handleAddOrUpdateClient(dataInput);

    if (result) {
      toast({
        title: "Dados salvos",
        description: `Cliente ${
          mode === "create" ? "adicionado" : "atualizado"
        }`,
        isClosable: true,
        status: "success",
        variant: "left-accent",
        position: "bottom-right",
      });
      clearFields();
      onClose();
    } else {
      toast({
        title: "Erro ao adicionar",
        description:
          "Por favor, verifique os dados e/ou tente novamente mais tarde",
        isClosable: true,
        status: "warning",
        variant: "left-accent",
        position: "bottom-right",
      });
    }
  }

  const clearFields = () => {
    setValue("clientCode", formatCode(clientCode));
    setValue("clientName", "");
    setValue("clientEmail", "");
    setValue("clientDocument", "");
    setDocument("");
  };

  useEffect(() => {
    if (client && mode === "update") {
      setValue("clientCode", client.clientCode);
      setValue("clientName", client.clientName);
      setValue("clientEmail", client.clientEmail);
      setValue("clientDocument", client.clientDocument);
      setValue("contact", client.contact);
      setDocument(client.clientDocument);
    }
  }, [mode, client, clients]);

  return (
    <Drawer isOpen={isOpen} placement={"right"} size={"sm"} onClose={onClose}>
      <form onSubmit={handleSubmit(handleCreateOrUpdateClient)}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {mode === "create" ? "Adicionar novo cliente" : "Atualizar cliente"}
          </DrawerHeader>
          <DrawerBody>
            <VStack gap={5} width={"90%"}>
              <VStack alignItems={"flex-start"} width={"90%"}>
                <Text textAlign={"left"}>Código</Text>
                <Input {...register("clientCode")} isReadOnly={true} />
              </VStack>
              <VStack alignItems={"flex-start"} width={"90%"}>
                <Text textAlign={"left"}>{"Nome do cliente"}</Text>
                <Input
                  {...register("clientName", { required: true })}
                  placeholder="Ex. Fulano de Tal"
                />
                {errors.clientName ? (
                  <Text fontSize={"12px"} textColor={"red"} alignSelf={"start"}>
                    Nome do cliente é obrigatório
                  </Text>
                ) : (
                  <></>
                )}
              </VStack>
              <VStack alignItems={"flex-start"} width={"90%"}>
                <Text textAlign={"left"}>{"Celular"}</Text>
                <CellphoneNumberFormat
                  name={"contact"}
                  setValue={setValue}
                  setError={setError}
                  clearErrors={clearErrors}
                  defaultValue={client?.contact || ""}
                />
                {errors.contact ? (
                  <Text fontSize={"12px"} textColor={"red"} alignSelf={"start"}>
                    Contato de celular é obrigatório
                  </Text>
                ) : (
                  <></>
                )}
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
                  value={document}
                  maxLength={18}
                  onChange={(e: any) => {
                    setDocument(cpfCnpjMask(e.target.value) as string);
                  }}
                  placeholder={"Ex.: 818.459.140-31"}
                />
              </VStack>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack width={"100%"} gap={2}>
              <Button width={"full"} onClick={onClose}>
                <Text fontWeight={"600"} fontFamily={"Montserrat"}>
                  {"Cancelar"}
                </Text>
              </Button>
              <Button
                width={"full"}
                type={"submit"}
                backgroundColor={"#63342B"}
                _hover={{ backgroundColor: "#502A22" }}
                _active={{ backgroundColor: "#482017" }}
                colorScheme="blue"
                onClick={() => {
                  if (
                    watch("contact") === undefined ||
                    watch("contact").length === 0
                  ) {
                    setError(
                      "contact",
                      { type: "focus" },
                      { shouldFocus: true }
                    );
                    return;
                  }
                }}
              >
                <Text fontWeight={"600"} fontFamily={"Montserrat"}>
                  {mode === "create" ? "Salvar" : "Atualizar"}
                </Text>
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
}
