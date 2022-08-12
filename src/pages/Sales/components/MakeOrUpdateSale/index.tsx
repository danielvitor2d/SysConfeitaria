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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  Client,
  Item,
  ItemRow,
  PaymentMethod,
  Sale,
  SaleRow,
} from "../../../../types";
import { getDatetimeLocalFormatted } from "../../../../util/getDate";
import SelectPaymentMethod from "./components/SelectPaymentMethod";
import SelectSaleStatus from "./components/SelectSaleStatus";
import SelectClient from "./components/SelectClient";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { CellProps, Column, Row } from "react-table";
import Table from "./components/Table";
import { toBRLWithSign } from "../../../../util/formatCurrency";
import { formatCode } from "../../../../util/formatCode";
import GlobalContext from "../../../../contexts/GlobalContext";
import SaleContext from "../../../../contexts/SalesContext";
import AddItem from "./components/AddItem";

interface MakeSaleProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  handleMakeOrUpdateSale: (sale: Sale) => Promise<boolean>;
  mode: "create" | "update";
  sale?: Sale;
}

export default function MakeSale({
  isOpen,
  onOpen,
  onClose,
  handleMakeOrUpdateSale,
  mode,
  sale: saleToUpdate,
}: MakeSaleProps) {
  const toast = useToast();

  const { saleCode } = useContext(GlobalContext);
  const { sales } = useContext(SaleContext);

  const [sale, setSale] = useState<Sale>({
    saleCode: formatCode(saleCode),
    createdAt: getDatetimeLocalFormatted(new Date(Date.now())),
    saleStatus: "draft",
    paymentMethods: [] as PaymentMethod[],
    items: [] as Item[],
    fullValue: 0,
    client: {} as Client,
  } as Sale);

  useEffect(() => {
    console.log("atualizou: " + JSON.stringify(sale, null, 2));
  }, [sale]);

  async function handleRemoveRow(itemCode: string) {
    toast({
      title: "Removendo",
      description: `Removendo linha ${itemCode}`,
      status: "info",
    });
  }

  async function handleUpdateRow(itemCode: string) {
    toast({
      title: "Editando",
      description: `Editando linha ${itemCode}`,
      status: "info",
    });
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
          Cell: ({ value }) => (
            <Flex
              height={"100%"}
              alignItems={"center"}
              justifyContent={"start"}
            >
              <Text fontWeight={"600"} fontFamily={"Montserrat"}>
                {value}
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
              <Text fontWeight={"600"} fontFamily={"Montserrat"}>
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
          Cell: ({ value }) => (
            <Flex
              height={"100%"}
              alignItems={"center"}
              justifyContent={"start"}
            >
              <Text fontWeight={"600"} fontFamily={"Montserrat"}>
                {value}
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
            <HStack>
              <EditIcon
                boxSize={"6"}
                cursor={"pointer"}
                onClick={() => handleUpdateRow(cellProps.row.original.itemCode)}
              />
              <DeleteIcon
                color={"red"}
                boxSize={"6"}
                cursor={"pointer"}
                onClick={() => handleRemoveRow(cellProps.row.original.itemCode)}
              />
            </HStack>
          ),
          disableResizing: true,
          disableSortBy: true,
          width: 100,
        },
      ] as Array<Column<ItemRow>>,
    []
  );

  async function handleMakeSale(dataForm: SaleRow) {}

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size={"5xl"}>
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
                      fontFamily={"Montserrat"}
                    >
                      {"Data"}
                    </Text>
                    <Input
                      value={sale.createdAt}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        Object.assign(sale, {
                          createdAt: event.target.value,
                        });
                        setSale({ ...sale });
                      }}
                      backgroundColor={"#E8E8E8"}
                      type={"datetime-local"}
                    />
                  </HStack>
                  <SelectClient sale={sale} setSale={setSale} />
                </VStack>
                <VStack alignItems={"flex-start"}>
                  <SelectPaymentMethod sale={sale} setSale={setSale} />
                  <SelectSaleStatus sale={sale} setSale={setSale} />
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
                <AddItem />
              </HStack>
              <Table columns={columns} />
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            backgroundColor={"#63342B"}
            _hover={{ backgroundColor: "#502A22" }}
            _active={{ backgroundColor: "#482017" }}
            marginRight={3}
          >
            <Text
              color={"white"}
              fontSize={"15px"}
              fontWeight={"600"}
              fontFamily={"Montserrat"}
            >
              {"Salvar"}
            </Text>
          </Button>
          <Button
            onClick={onClose}
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
