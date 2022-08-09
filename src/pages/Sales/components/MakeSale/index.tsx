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
  Table as ChakraUITable,
  Select as ChakraUISelect,
  Badge,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Divider,
  Flex,
  Tooltip,
  TableContainer,
  Box,
  chakra,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import {
  ItemRow,
} from "../../../../types";
import { getDatetimeLocalFormatted } from "../../../../util/getDate";
import makeData from "./makeData";
import SelectPaymentMethod from "./components/SelectPaymentMethod";
import SelectSaleStatus from "./components/SelectSaleStatus";
import SelectClient from "./components/SelectClient";
import {
  DeleteIcon,
  EditIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import {
  CellProps,
  Column,
  useBlockLayout,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import Paginate from "./components/Table/Paginate";
import Table from "./components/Table";

interface MakeSaleProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function MakeSale({ isOpen, onOpen, onClose }: MakeSaleProps) {
  const toast = useToast();

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

  const columns = useMemo(
    () =>
      [
        {
          Header: "Código".toUpperCase(),
          Footer: "Código".toUpperCase(),
          accessor: "itemCode",
          disableResizing: false,
          width: 95,
        },
        {
          Header: "Produto".toUpperCase(),
          Footer: "Produto".toUpperCase(),
          Cell: ({ value }) => (
            <Text whiteSpace={"normal"}>{value.productName}</Text>
          ),
          accessor: "product",
          disableResizing: false,
          isNumeric: true,
          width: 250,
        },
        {
          Header: "Quantidade".toUpperCase(),
          Footer: "Quantidade".toUpperCase(),
          Cell: ({ value }) => <Text whiteSpace={"normal"}>{value}</Text>,
          accessor: "quantity",
          disableResizing: false,
          isNumeric: true,
          width: 150,
        },
        {
          Header: "Valor Unitário".toUpperCase(),
          Footer: "Valor Unitário".toUpperCase(),
          Cell: ({ value }) => (
            <Text whiteSpace={"normal"}>{"R$ " + value}</Text>
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
            <Text whiteSpace={"normal"}>{"R$ " + value}</Text>
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

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size={"6xl"}>
      <ModalOverlay />
      <ModalContent bg={"#FFFFFF"}>
        <ModalHeader>
          <Text>Cadastrar venda</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody bg={"#FFFFFF"}>
          <VStack>
            <HStack gap={20}>
              <VStack alignItems={"flex-start"}>
                <HStack>
                  <Text minWidth={"120px"} maxWidth={"120px"}>
                    Data
                  </Text>
                  <Input
                    defaultValue={getDatetimeLocalFormatted(
                      new Date(Date.now())
                    )}
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
            <Table
              columns={columns}
            />
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
              fontWeight={"500"}
              fontFamily={"Montserrat"}
            >
              Salvar
            </Text>
          </Button>
          <Button onClick={onClose}>
            <Text
              color={"black"}
              fontSize={"15px"}
              fontWeight={"500"}
              fontFamily={"Montserrat"}
            >
              Cancelar
            </Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
