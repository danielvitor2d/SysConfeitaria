import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  HStack,
  Input,
  ModalFooter,
  Button,
  Text,
  useToast,
  Flex,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Item,
  ItemRow,
  paymentMethod,
  PaymentMethod,
  Sale,
} from "../../../../types";
import { fromDateAndTimeToLocalFormatted, fromDatetimeToLocalFormatted, getDatetimeLocalFormatted } from "../../../../util/getDate";
import SelectPaymentMethod from "./components/SelectPaymentMethod";
import SelectSaleStatus from "./components/SelectSaleStatus";
import SelectClient from "./components/SelectClient";
import { DeleteIcon } from "@chakra-ui/icons";
import { CellProps, Column, Row } from "react-table";
import Table from "./components/Table";
import {
  fromNumberToStringFormatted,
  toBRLWithSign,
} from "../../../../util/formatCurrency";
import { formatCode } from "../../../../util/formatCode";
import AddItem from "./components/AddItem";
import SaleContext from "../../../../contexts/SalesContext";
import GlobalContext from "../../../../contexts/GlobalContext";

import * as qz from "qz-tray";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { formatCellphone } from "../../../../util/formatCellphone";
import { isNull } from "lodash";

interface MakeSaleProps {
  handleMakeOrUpdateSale: (sale: Sale) => Promise<boolean>;
}

export default function MakeSale({ handleMakeOrUpdateSale }: MakeSaleProps) {
  const toast = useToast();

  const { saleCode } = useContext(GlobalContext);

  const {
    mode,
    setMode,
    selectedSale,
    setSelectedSale,
    resetSelectedSale,
    isOpenMakeOrUpdateSale,
    onCloseMakeOrUpdateSale,
  } = useContext(SaleContext);

  const { printer, phone } = useContext(GlobalContext);

  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    selectedSale.fullValue = selectedSale.items.reduce(
      (previousValue: number, currentValue: ItemRow) => {
        return previousValue + currentValue.totalValue;
      },
      0
    );

    setSelectedSale({ ...selectedSale });
  }, [selectedSale.items]);

  const handleClickAddItem = (itemRow: ItemRow) => {
    const { actions, ...newItemRow } = itemRow;
    selectedSale.items = [...selectedSale.items, newItemRow];
    setSelectedSale({ ...selectedSale });
  };

  const handleRemoveItem = (itemIndex: number) => {
    const toastId = toast({
      title: "Removendo item",
      description: "Removendo dados",
      isClosable: true,
      status: "loading",
      variant: "left-accent",
      position: "bottom-right",
    });

    selectedSale.items = selectedSale.items.filter(
      (_item, index) => index !== itemIndex
    );
    setSelectedSale({ ...selectedSale });

    const result = true;

    toast.close(toastId);

    if (result) {
      toast({
        title: "Item removido",
        description: "Dados removidos",
        isClosable: true,
        status: "success",
        variant: "left-accent",
        position: "bottom-right",
      });
    } else {
      toast({
        title: "Erro ao remover item",
        description:
          "Verifique sua conexão à internet ou tente novamente mais tarde",
        isClosable: true,
        status: "warning",
        variant: "left-accent",
        position: "bottom-right",
      });
    }
  };

  const sortByProductName = useCallback(
    (
      rowA: Row<ItemRow>,
      rowB: Row<ItemRow>,
      _columnId: String,
      _desc: boolean
    ) => {
      if (
        rowA.values["product"].productName < rowB.values["product"].productName
      )
        return -1;
      return 1;
    },
    []
  );

  const columns = useMemo(
    () =>
      [
        {
          Header: "Código".toUpperCase(),
          Footer: "Código".toUpperCase(),
          Cell: ({ row }) => (
            <Flex
              height={"100%"}
              alignItems={"center"}
              justifyContent={"start"}
            >
              <Text fontWeight={"600"} fontFamily={"Montserrat"}>
                {formatCode(row.index + 1)}
              </Text>
            </Flex>
          ),
          accessor: "itemCode",
          disableResizing: false,
          width: 95,
        },
        {
          Header: "Produto".toUpperCase(),
          Footer: "Produto".toUpperCase(),
          Cell: ({ value }) => (
            <Flex
              height={"100%"}
              alignItems={"center"}
              justifyContent={"start"}
            >
              <Text
                fontWeight={"600"}
                fontFamily={"Montserrat"}
                whiteSpace={"normal"}
              >
                {value.productName}
              </Text>
            </Flex>
          ),
          accessor: "product",
          sortType: sortByProductName,
          disableResizing: false,
          isNumeric: true,
          width: 250,
        },
        {
          Header: "Quantidade".toUpperCase(),
          Footer: "Quantidade".toUpperCase(),
          Cell: ({ value, row }) => (
            <Flex
              height={"100%"}
              alignItems={"center"}
              justifyContent={"start"}
            >
              <Text fontWeight={"600"} fontFamily={"Montserrat"}>
                {fromNumberToStringFormatted(value) +
                  " " +
                  row.original.product.unitaryType}
              </Text>
            </Flex>
          ),
          accessor: "quantity",
          disableResizing: false,
          isNumeric: true,
          width: 150,
        },
        {
          Header: "Valor Unitário".toUpperCase(),
          Footer: "Valor Unitário".toUpperCase(),
          Cell: ({ value }) => (
            <Flex
              height={"100%"}
              alignItems={"center"}
              justifyContent={"start"}
            >
              <Text fontWeight={"600"} fontFamily={"Montserrat"}>
                {toBRLWithSign(Number(value))}
              </Text>
            </Flex>
          ),
          accessor: "unitaryValue",
          disableResizing: false,
          isNumeric: true,
          width: 150,
        },
        {
          Header: "Valor Total".toUpperCase(),
          Footer: "Valor Total".toUpperCase(),
          Cell: ({ value }) => (
            <Flex
              height={"100%"}
              alignItems={"center"}
              justifyContent={"start"}
            >
              <Text fontWeight={"600"} fontFamily={"Montserrat"}>
                {toBRLWithSign(Number(value))}
              </Text>
            </Flex>
          ),
          accessor: "totalValue",
          disableResizing: false,
          isNumeric: true,
          width: 150,
        },
        {
          Header: "Ações".toUpperCase(),
          Footer: "Ações".toUpperCase(),
          accessor: "actions",
          Cell: (cellProps: CellProps<ItemRow, string | undefined>) => (
            <Flex alignItems={"center"} justifyContent={"center"}>
              <DeleteIcon
                color={"red"}
                boxSize={"6"}
                cursor={"pointer"}
                onClick={() => {
                  setItem({
                    itemCode: String(cellProps.row.index),
                  } as Item);
                  onOpenRemoveItem();
                  // handleRemoveItem(cellProps.row.index)
                }}
              />
            </Flex>
          ),
          disableResizing: true,
          disableSortBy: true,
          width: 100,
        },
      ] as Array<Column<ItemRow>>,
    []
  );

  async function handleFinishSale() {
    if (selectedSale === null) return;
    // console.log("Agora vai: " + JSON.stringify(selectedSale, null, 2))
    // Verificar data
    // Verificar Pagamento
    if (
      !(selectedSale.paymentMethods && selectedSale.paymentMethods.length > 0)
    ) {
      toast({
        title: "Dados faltando",
        description: "Por favor, escolha um ou mais métodos de pagamento",
        isClosable: true,
        status: "warning",
        variant: "left-accent",
        position: "bottom-right",
      });
      return;
    }
    // Verificar cliente
    if (!selectedSale.client) {
      toast({
        title: "Dados faltando",
        description: "Por favor, escolha um cliente",
        isClosable: true,
        status: "warning",
        variant: "left-accent",
        position: "bottom-right",
      });
      return;
    }
    // Verificar Status
    if (!(selectedSale.saleStatus && selectedSale.saleStatus.length > 0)) {
      toast({
        title: "Dados faltando",
        description: "Por favor, selecione um status",
        isClosable: true,
        status: "warning",
        variant: "left-accent",
        position: "bottom-right",
      });
      return;
    }
    // Verificar items
    if (!(selectedSale.items && selectedSale.items.length > 0)) {
      toast({
        title: "Dados faltando",
        description: "Por favor, selecione um ou mais itens para a venda",
        isClosable: true,
        status: "warning",
        variant: "left-accent",
        position: "bottom-right",
      });
      return;
    }

    const toastId = toast({
      title: "Verificação",
      description: "Salvando dados",
      isClosable: true,
      status: "loading",
      variant: "left-accent",
      position: "bottom-right",
    });

    if (await handleMakeOrUpdateSale({ ...selectedSale })) {
      toast.close(toastId);
      toast({
        title: "Dados salvos",
        description: `Venda ${mode === "create" ? "finalizada" : "atualizada"}`,
        isClosable: true,
        status: "success",
        variant: "left-accent",
        position: "bottom-right",
        duration: 3000,
      });
      clearFields();
      onCloseMakeOrUpdateSale();
    } else {
      toast({
        title: "Erro ao salvar venda",
        description:
          "Por favor, verifique os dados e/ou tente novamente mais tarde",
        isClosable: true,
        status: "warning",
        variant: "left-accent",
        position: "bottom-right",
      });
    }
  }

  const spliter = (str: string, nr: number) => {
    const parts = [];
    for (let i = 0, length = str.length; i < length; i += nr) {
      parts.push(str.substring(i, i + nr));
    }
    return parts;
  };

  const handlePrintSale = async () => {
    console.log("Imprimindo...");
    var config = qz.configs.create(printer, { encoding: "Cp1252" });

    const storage = getStorage();
    const pathReference = ref(storage, "logo2_confeitaria.png");
    const urlImage = await getDownloadURL(pathReference);

    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = (event) => {
      const blob = xhr.response;
    };
    xhr.open("GET", urlImage);
    xhr.send();

    const printSaleCode = selectedSale.saleCode ?? "000000";
    const printClientName =
      selectedSale?.client?.clientName ?? "Sem identificação";
    const printPhone =
      formatCellphone(selectedSale?.client?.contact) ?? "(xx) xxxxx-xxxx";

    // 48 colunas

    const printItems: string[] = [
      "\x1B" + "\x45" + "\x0D",
      `Produto         Qtde. Unid. Vl.unit. Valor total\n\n`,
      "\x1B" + "\x45\n",
    ];

    selectedSale?.items?.forEach((item: Item) => {
      const prodName = spliter(item.product.productName, 20);

      //coxinha             3,000  un  R$ 6,00  R$ 18,00
      prodName.forEach((value, index) => {
        if (index === prodName.length - 1) {
          const itemQuantity = fromNumberToStringFormatted(
            item.quantity
          )
          const unitaryType = item.product.unitaryType
          const unitaryValue = toBRLWithSign(item.unitaryValue)
          const totalValue = toBRLWithSign(item.totalValue)

          printItems.push(
            `${value.padEnd(21, ' ')} ${itemQuantity}  ${unitaryType.padStart(2, ' ')}  ${unitaryValue}  ${totalValue}\n\n`
          );
        } else {
          const space = " ".repeat(48 - value.length);
          printItems.push(`${value}${space}\n\n`);
        }
      });
    });

    const printPaymentForms: string[] = [];

    selectedSale.paymentMethods.forEach((method: PaymentMethod) => {
      printPaymentForms.push(`${paymentMethod[method]}\n`);
    });

    const printAddressExists =
      !isNull(selectedSale?.client?.address?.rua) &&
      !isNull(selectedSale?.client?.address?.numero) &&
      !isNull(selectedSale?.client?.address?.cidade) &&
      !isNull(selectedSale?.client?.address?.estado) &&
      !isNull(selectedSale?.client?.address?.cep)

    const printAddressError = "Endereço não informado".toUpperCase();

    const printRua = `${selectedSale?.client?.address?.rua}, ${selectedSale?.client?.address?.numero}`;
    const printCidade = `${selectedSale?.client?.address?.cidade}, ${selectedSale?.client?.address?.estado}`;
    const printCEP = `${selectedSale?.client?.address?.cep}`;

    var order = [
      "\x1B" + "\x40", // Inicializo o documento
      "\x10" + "\x14" + "\x01" + "\x00" + "\x05", // É dado um pulso para iniciar a impressão
      "\x1B" + "\x61" + "\x31", // Defino o alinhamento ao centro

      // Imprimo a logo
      {
        type: "raw",
        format: "image",
        flavor: "file",
        data: urlImage,
        options: { language: "escp", dotDensity: "double" },
      },
      `${formatCellphone(phone)}\n`,
      `Av. Pedro Alves, 130\n`,
      `Centro, Acopiara-CE`,

      "\x1B" + "\x74" + "\x10",
      "\x0A" + "\x0A", // Quebra de linha

      `Cupom de Venda Nº ${printSaleCode}` + "\x0A" + "\x0A", // Imprimo número do pedido
      "\x0A", // Quebra de linha
      "\x0A",
      "\x1B" + "\x61" + "\x30", // Defino o alinhamento a esquerda

      "\x1B" + "\x45" + "\x0D", // Ativo negrito
      `Cliente: ${printClientName}` + "\x0A", // Imprimo nome do cliente
      `Telefone: ${printPhone}` + "\x0A", // Imprimo telefone
      "\x1B" + "\x45\n", // Desativo negrito

      // Imprimo linha tracejada
      "------------------------------------------------" + "\x0A" + "\x0A",
      ...printItems,
      // Imprimo linha tracejada
      "------------------------------------------------" + "\x0A" + "\x0A",

      "\x1B" + "\x21" + "\x30", // Ativo modo em
      `Total          ${toBRLWithSign(selectedSale.fullValue as number)}` + "\x0A", // Imprimo o total do pedido
      "\x1B" + "\x21" + "\x0A" + "\x1B" + "\x45" + "\x0A" + "\x0A", // Desativo modo em

      // Imprimo linha tracejada
      "------------------------------------------------" + "\x0A" + "\x0A",

      "\x1B" + "\x45" + "\x0D", // Ativo negrito
      "Data da venda: ", // Imprimo o tipo de pagamento
      "\x1B" + "\x45\n", // Desativo negrito
      `${fromDateAndTimeToLocalFormatted(selectedSale.createdAt)}\n\n`,

      "\x1B" + "\x45" + "\x0D", // Ativo negrito
      "Formas de pagamento: \n", // Imprimo o tipo de pagamento
      "\x1B" + "\x45\n", // Desativo negrito
      ...printPaymentForms, // Imprimindo cartões
      '\x0A',

      printAddressExists ? printRua + "\x0A": printAddressError,
      printAddressError ? printCidade + "\x0A": '',
      printAddressError ? printCEP + "\x0A": '',

      "\x0A",
      "\x1B" + "\x61" + "\x31", // Defino o alinhamento ao centro
      `NÃO É DOCUMENTO FISCAL` + "\x0A" + "\x0A", // Imprimo observação

      "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A",
      "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A",
      "\x1B" + "\x69", // Corto o papel
      "\x10" + "\x14" + "\x01" + "\x00" + "\x05", // Dou um pulso
    ];

    console.log(JSON.stringify(order, null, 2));

    qz.print(config, order).catch((err: any) => {
      console.error(err);
    });
  };

  const clearFields = () => {
    setMode("create");
    resetSelectedSale();
  };

  const cancelRefRemoveItem = React.useRef(null);

  const {
    isOpen: isOpenAddItem,
    onOpen: onOpenAddItem,
    onClose: onCloseAddItem,
  } = useDisclosure();

  const {
    isOpen: isOpenRemoveItem,
    onOpen: onOpenRemoveItem,
    onClose: onCloseRemoveItem,
  } = useDisclosure();

  useEffect(() => {
    mode === "create" &&
      setSelectedSale({
        ...selectedSale,
        createdAt: getDatetimeLocalFormatted(new Date(Date.now())),
      });
  }, []);

  useEffect(() => {
    // console.log("saleCode: " + saleCode)

    if (mode === "create") {
      const { saleCode: _saleCode, ...rest } = selectedSale;
      setSelectedSale({
        ...rest,
        saleCode: formatCode(saleCode),
      });
    }
  }, [saleCode]);

  // useEffect(() => {
  //   console.log("sale: " + JSON.stringify(selectedSale, null, 2))

  // }, [selectedSale]);

  return (
    <>
      <AlertDialog
        isOpen={isOpenRemoveItem}
        leastDestructiveRef={cancelRefRemoveItem}
        onClose={onCloseRemoveItem}
        closeOnEsc={true}
        closeOnOverlayClick={true}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {"Remover item"}
            </AlertDialogHeader>

            <AlertDialogBody>
              {"Você tem certeza de que quer remover esse item?"}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRefRemoveItem} onClick={onCloseRemoveItem}>
                {"Cancelar"}
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  if (item !== null) handleRemoveItem(Number(item.itemCode));
                  onCloseRemoveItem();
                  setItem(null);
                }}
                ml={3}
              >
                {"Remover"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Modal
        isOpen={isOpenMakeOrUpdateSale}
        onClose={() => {
          clearFields();
          onCloseMakeOrUpdateSale();
        }}
        closeOnEsc={true}
        closeOnOverlayClick={true}
        size={"5xl"}
      >
        <ModalOverlay />
        <ModalContent bg={"#f1f1f1"}>
          <ModalHeader>
            <HStack>
              <Text>{"Cadastrar venda"}</Text>
              <Button
                backgroundColor={"#63342B"}
                _hover={{ backgroundColor: "#502A22" }}
                _active={{ backgroundColor: "#482017" }}
                marginRight={3}
                onClick={() => handlePrintSale()}
              >
                <Text
                  color={"white"}
                  fontSize={"15px"}
                  fontWeight={"600"}
                  fontFamily={"Montserrat"}
                >
                  {"Imprimir venda"}
                </Text>
              </Button>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody bg={"#f1f1f1"}>
            <VStack gap={5} width={"95%"} margin={"auto"}>
              <VStack gap={2} width={"100%"}>
                <Text
                  alignSelf={"flex-start"}
                  fontSize={"25px"}
                  fontWeight={"600"}
                  fontFamily={"Montserrat"}
                >
                  {"Dados da venda"}
                </Text>
                <HStack gap={20}>
                  <VStack alignItems={"flex-start"}>
                    <HStack>
                      <Text
                        minWidth={"120px"}
                        maxWidth={"120px"}
                        fontWeight={"600"}
                        fontSize={"15px"}
                        fontFamily={"Montserrat"}
                      >
                        {"Data"}
                      </Text>
                      <Input
                        value={selectedSale.createdAt}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          Object.assign(selectedSale, {
                            createdAt: event.target.value,
                          });
                          setSelectedSale({ ...selectedSale });
                        }}
                        backgroundColor={"#E8E8E8"}
                        type={"datetime-local"}
                      />
                    </HStack>
                    <SelectClient />
                  </VStack>
                  <VStack alignItems={"flex-start"}>
                    <SelectPaymentMethod />
                    <SelectSaleStatus />
                  </VStack>
                </HStack>
              </VStack>
              <VStack gap={3} alignItems={"center"} width={"100%"}>
                <HStack gap={4} width={"100%"} justifyContent={"space-between"}>
                  <Text
                    alignSelf={"flex-start"}
                    fontSize={"25px"}
                    fontWeight={"600"}
                    fontFamily={"Montserrat"}
                  >
                    {"Itens da venda"}
                  </Text>
                  <AddItem
                    handleAddItem={handleClickAddItem}
                    isOpenAddItem={isOpenAddItem}
                    onOpenAddItem={onOpenAddItem}
                    onCloseAddItem={onCloseAddItem}
                  />
                </HStack>
                <Table columns={columns} data={selectedSale.items} />
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack
              paddingLeft={"25px"}
              width={"100%"}
              justifyContent={"space-between"}
            >
              <HStack gap={0}>
                <Text textAlign={"end"} fontSize={"20px"} fontWeight={"600"}>
                  {"Valor total: "}
                </Text>
                <Text textAlign={"end"} fontSize={"20px"}>
                  {"R$ " +
                    fromNumberToStringFormatted(
                      (selectedSale?.fullValue as number) || 0
                    )}
                </Text>
              </HStack>
              <HStack gap={1}>
                <Button
                  backgroundColor={"#63342B"}
                  _hover={{ backgroundColor: "#502A22" }}
                  _active={{ backgroundColor: "#482017" }}
                  marginRight={3}
                  onClick={() => handleFinishSale()}
                >
                  <Text
                    color={"white"}
                    fontSize={"15px"}
                    fontWeight={"600"}
                    fontFamily={"Montserrat"}
                  >
                    {"Finalizar venda"}
                  </Text>
                </Button>
                <Button
                  onClick={() => {
                    clearFields();
                    onCloseMakeOrUpdateSale();
                  }}
                  backgroundColor={"#E8E8E8"}
                  _hover={{
                    backgroundColor: "#d3d3d3",
                  }}
                >
                  <Text
                    color={"black"}
                    fontSize={"15px"}
                    fontWeight={"600"}
                    fontFamily={"Montserrat"}
                  >
                    {"Cancelar"}
                  </Text>
                </Button>
              </HStack>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
