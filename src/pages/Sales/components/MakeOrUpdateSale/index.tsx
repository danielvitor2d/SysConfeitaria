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
import { Item, ItemRow, Sale } from "../../../../types";
import { getDatetimeLocalFormatted } from "../../../../util/getDate";
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

interface MakeSaleProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  handleMakeOrUpdateSale: (sale: Sale) => Promise<boolean>;
}

export default function MakeSale({
  isOpen,
  onClose,
  handleMakeOrUpdateSale,
}: MakeSaleProps) {
  const toast = useToast();

  const { mode, setMode, selectedSale, setSelectedSale, resetSelectedSale } =
    useContext(SaleContext);

  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    if (selectedSale !== null) {
      const newTotalValue = selectedSale.items.reduce(
        (
          previousValue: number,
          currentValue: ItemRow,
          _currentIndex: number,
          _array: ItemRow[]
        ) => {
          return previousValue + currentValue.totalValue;
        },
        0
      );

      Object.assign(selectedSale, {
        fullValue: newTotalValue,
      });

      setSelectedSale({ ...selectedSale });
    }
  }, [selectedSale.items]);

  const handleAddItem = (itemRow: ItemRow) => {
    if (selectedSale !== null) {
      selectedSale.items = [itemRow, ...selectedSale.items];
      setSelectedSale({ ...selectedSale });
    }
  };

  async function handleRemoveItem(itemIndex: number) {
    const toastId = toast({
      title: "Removendo item",
      description: "Removendo dados",
      isClosable: true,
      status: "loading",
      variant: "left-accent",
      position: "bottom-right",
    });

    if (selectedSale !== null) {
      selectedSale.items.splice(Number(itemIndex), 1);
      setSelectedSale({ ...selectedSale });
    }

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
  }

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
      onClose();
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

  const clearFields = () => {
    setMode("create");
    resetSelectedSale();
    // setSelectedSale({
    //   saleCode: formatCode(saleCode),
    //   createdAt: getDatetimeLocalFormatted(new Date(Date.now())),
    //   saleStatus: "draft",
    //   paymentMethods: [] as PaymentMethod[],
    //   items: [] as Item[],
    //   fullValue: 0,
    //   client: {} as Client,
    // } as Sale);
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
        isOpen={isOpen}
        onClose={() => {
          clearFields();
          onClose();
        }}
        size={"5xl"}
      >
        <ModalOverlay />
        <ModalContent bg={"#f1f1f1"}>
          <ModalHeader>
            <Text>{"Cadastrar venda"}</Text>
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
                        value={
                          selectedSale?.createdAt ||
                          getDatetimeLocalFormatted(new Date(Date.now()))
                        }
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          if (selectedSale) {
                            Object.assign(selectedSale, {
                              createdAt: event.target.value,
                            });
                            setSelectedSale({ ...selectedSale });
                          }
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
                    handleAddItem={handleAddItem}
                    isOpenAddItem={isOpenAddItem}
                    onOpenAddItem={onOpenAddItem}
                    onCloseAddItem={onCloseAddItem}
                  />
                </HStack>
                <Table columns={columns} data={selectedSale?.items || []} />
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
                    onClose();
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
