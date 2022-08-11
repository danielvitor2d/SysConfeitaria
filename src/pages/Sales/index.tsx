import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  VStack,
  Text,
  useMediaQuery,
  useDisclosure,
  HStack,
  Badge,
  Tag,
  Avatar,
  TagLabel,
  useToast,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Input,
  Table as ChakraUITable,
  Flex,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CellProps, Column } from "react-table";
import AuthContext from "../../contexts/AuthContext";
import GlobalContext from "../../contexts/GlobalContext";
import SalesContext from "../../contexts/SalesContext";
import {
  paymentMethod,
  saleStatus,
  SaleRow,
  bagdeColor,
  Sale,
} from "../../types";
import { toBRLWithSign } from "../../util/formatCurrency";
import MakeOrUpdateSale from "./components/MakeOrUpdateSale";
import Table from "./components/Table";
import makeData from "./makeData";

export default function Sales() {
  const [isLargerThan1440] = useMediaQuery("(min-width: 1440px)");

  const navigate = useNavigate();

  const toast = useToast();

  const { saleCode } = useContext(GlobalContext);
  const { signed } = useContext(AuthContext);

  const [data, setData] = useState<SaleRow[]>(() => makeData(55));

  const { sales, addSale, updateSale, removeSale } = useContext(SalesContext);

  const [sale, setSale] = useState<Sale>({} as Sale);
  const [mode, setMode] = useState<"create" | "update">("create");

  const {
    isOpen: isOpenMakeOrUpdateSale,
    onOpen: onOpenMakeOrUpdateSale,
    onClose: onCloseMakeOrUpdateSale,
  } = useDisclosure();

  const {
    isOpen: isOpenRemoveSale,
    onOpen: onOpenRemoveSale,
    onClose: onCloseRemoveSale,
  } = useDisclosure();

  const cancelRefRemoveSale = React.useRef(null);

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
          accessor: "saleCode",
          disableResizing: false,
          width: 95,
        },
        {
          Header: "Data".toUpperCase(),
          Footer: "Data".toUpperCase(),
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
          accessor: "createdAt",
          disableResizing: false,
          width: 180,
        },
        {
          Header: "Cliente".toUpperCase(),
          Footer: "Cliente".toUpperCase(),
          Cell: ({ value }) => (
            <Tag size={"lg"} colorScheme={value.color} borderRadius={"full"}>
              <Avatar
                src={value.avatar}
                size="xs"
                name={value.clientName}
                ml={-1}
                mr={2}
              />
              <TagLabel>
                <Flex
                  height={"100%"}
                  alignItems={"center"}
                  justifyContent={"start"}
                >
                  <Text
                    fontWeight={"500"}
                    fontFamily={"Montserrat"}
                    fontSize={"16px"}
                  >
                    {value.clientName + "H"}
                  </Text>
                </Flex>
              </TagLabel>
            </Tag>
          ),
          accessor: "client",
          disableResizing: false,
          isNumeric: true,
          width: isLargerThan1440 ? 250 : 150,
        },
        {
          Header: "Total".toUpperCase(),
          Footer: "Total".toUpperCase(),
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
          accessor: "fullValue",
          disableResizing: false,
          isNumeric: true,
          width: 180,
        },
        {
          Header: "Pagamento".toUpperCase(),
          Footer: "Pagamento".toUpperCase(),
          Cell: ({ value }) => (
            <Flex
              height={"100%"}
              alignItems={"center"}
              justifyContent={"start"}
            >
              <Badge colorScheme={"gray"}>
                <Text whiteSpace={"normal"}>{paymentMethod[value]}</Text>
              </Badge>
            </Flex>
          ),
          accessor: "paymentMethod",
          disableResizing: false,
          isNumeric: true,
          width: 250,
        },
        {
          Header: "Status".toUpperCase(),
          Footer: "Status".toUpperCase(),
          Cell: ({ value }) => (
            <Flex
              height={"100%"}
              alignItems={"center"}
              justifyContent={"start"}
            >
              <Badge colorScheme={bagdeColor[value]}>{saleStatus[value]}</Badge>
            </Flex>
          ),
          accessor: "saleStatus",
          disableResizing: false,
          isNumeric: true,
          width: 250,
        },
        {
          Header: "Ações".toUpperCase(),
          Footer: "Ações".toUpperCase(),
          accessor: "actions",
          Cell: (cellProps: CellProps<SaleRow, string | undefined>) => (
            <Flex
              gap={2}
              height={"100%"}
              alignItems={"center"}
              justifyContent={"start"}
            >
              <EditIcon
                boxSize={"6"}
                cursor={"pointer"}
                onClick={() => handleUpdateSale(cellProps.row.original)}
              />
              <DeleteIcon
                color={"red"}
                boxSize={"6"}
                cursor={"pointer"}
                onClick={() => handleRemoveRow(cellProps.row.original.saleCode)}
              />
            </Flex>
          ),
          disableResizing: true,
          disableSortBy: true,
          disableFilters: true,
          disableGlobalFilter: true,
          width: 100,
        },
      ] as Array<Column<SaleRow>>,
    [isLargerThan1440]
  );

  async function handleMakeOrUpdateSale(sale: Sale): Promise<boolean> {
    if (mode === "create") return await addSale(sale);
    return await updateSale(sale);
  }

  async function handleRemoveRow(saleCode: string) {
    toast({
      title: "Removendo",
      description: `Removendo linha ${saleCode}`,
      status: "info",
    });
  }

  async function handleUpdateSale(sale: SaleRow): Promise<void> {
    setMode("update");
    setSale({ ...(sale as Sale) });
    onOpenMakeOrUpdateSale();
  }

  useEffect(() => {
    if (!signed) {
      navigate("/login");
    }
  }, [signed]);

  useEffect(() => {
    if (sales) setData([...sales]);
  }, [sales]);

  return (
    <>
      <MakeOrUpdateSale
        handleMakeOrUpdateSale={handleMakeOrUpdateSale}
        isOpen={isOpenMakeOrUpdateSale}
        onClose={onCloseMakeOrUpdateSale}
        onOpen={onOpenMakeOrUpdateSale}
        mode={mode}
        sale={sale}
      />
      <Box
        width={"100%"}
        paddingX={"1rem"}
        overflowY={"auto"}
        paddingBottom={"1rem"}
      >
        <VStack gap={2} paddingTop={"20px"} alignItems={"flex-start"}>
          <Text
            fontFamily={"Inter"}
            textColor={"#63342B"}
            fontStyle={"normal"}
            fontWeight={"600"}
            fontSize={"32px"}
          >
            {"Vendas".toUpperCase()}
          </Text>
          <Table
            columns={columns}
            data={data}
            onOpenDrawerAddSale={onOpenMakeOrUpdateSale}
          />
        </VStack>
      </Box>
    </>
  );
}
