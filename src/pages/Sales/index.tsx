import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  VStack,
  Text,
  useMediaQuery,
  useDisclosure,
  Badge,
  Tag,
  Avatar,
  TagLabel,
  useToast,
  Flex,
  Wrap,
  WrapItem,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { CellProps, Column, Row } from "react-table";
import AuthContext from "../../contexts/AuthContext";
import SaleContext from "../../contexts/SalesContext";
import SalesContext from "../../contexts/SalesContext";
import {
  paymentMethod,
  saleStatus,
  SaleRow,
  bagdeColor,
  Sale,
} from "../../types";
import { compareDate } from "../../util/compareDate";
import { toBRLWithSign } from "../../util/formatCurrency";
import { fromDatetimeToLocalFormatted } from "../../util/getDate";
import MakeOrUpdateSale from "./components/MakeOrUpdateSale";
import Table from "./components/Table";

export default function Sales() {
  const [isLargerThan1440] = useMediaQuery("(min-width: 1440px)");

  const navigate = useNavigate();

  const toast = useToast();

  const { signed } = useContext(AuthContext);
  const { resetSelectedSale } = useContext(SaleContext);

  const {
    mode,
    setMode,
    selectedSale,
    setSelectedSale,
    sales,
    addSale,
    updateSale,
    removeSale,
    isOpenMakeOrUpdateSale,
    onOpenMakeOrUpdateSale,
  } = useContext(SalesContext);

  const cancelRefRemoveSale = React.useRef(null);

  const sortByClientName = useCallback(
    (
      rowA: Row<SaleRow>,
      rowB: Row<SaleRow>,
      _columnId: String,
      _desc: boolean
    ) => {
      if (rowA.values["client"].clientName < rowB.values["client"].clientName)
        return -1;
      return 1;
    },
    []
  );

  const sortByDate = useCallback(
    (
      rowA: Row<SaleRow>,
      rowB: Row<SaleRow>,
      _columnId: String,
      _desc: boolean
    ) => {
      return compareDate(rowA.values["createdAt"], rowB.values["createdAt"])
        ? -1
        : 1;
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
          accessor: "saleCode",
          disableResizing: false,
          width: 110,
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
                {fromDatetimeToLocalFormatted(value)}
              </Text>
            </Flex>
          ),
          accessor: "createdAt",
          sortType: sortByDate,
          isSorted: true,
          disableResizing: false,
          width: 140,
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
                    whiteSpace={"normal"}
                  >
                    {value.clientName}
                  </Text>
                </Flex>
              </TagLabel>
            </Tag>
          ),
          accessor: "client",
          disableResizing: false,
          sortType: sortByClientName,
          isNumeric: true,
          width: isLargerThan1440 ? 350 : 250,
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
          Cell: ({ value: paymentMethods }) => (
            <Wrap
              height={"100%"}
              alignItems={"center"}
              justifyContent={"start"}
              gap={1}
            >
              {paymentMethods &&
                paymentMethods.map((value, index) => (
                  <WrapItem key={index}>
                    <Badge colorScheme={"gray"}>
                      <Text whiteSpace={"normal"}>{paymentMethod[value]}</Text>
                    </Badge>
                  </WrapItem>
                ))}
            </Wrap>
          ),
          accessor: "paymentMethods",
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
          width: 180,
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
                onClick={() => handleClickUpdateSale(cellProps.row.original)}
              />
              <DeleteIcon
                color={"red"}
                boxSize={"6"}
                cursor={"pointer"}
                onClick={() => handleClickRemoveSale(cellProps.row.original)}
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

  async function handleClickUpdateSale(sale: SaleRow): Promise<void> {
    setMode("update");

    const { actions, ...saleToUpdate } = sale;
    setSelectedSale(saleToUpdate);

    onOpenMakeOrUpdateSale();
  }

  async function handleMakeOrUpdateSale(sale: Sale): Promise<boolean> {
    if (mode === "create") {
      const result = await addSale(sale);
      resetSelectedSale();
      return result;
    }
    const result = await updateSale(sale);
    resetSelectedSale();
    return result;
  }

  async function handleClickRemoveSale(sale: SaleRow) {
    const { actions, ...saleToUpdate } = sale;
    setSelectedSale(saleToUpdate);

    onOpenRemoveSale();
  }

  async function handleRemoveSale(saleCode: string): Promise<void> {
    if (saleCode.length === 0) return;
    const toastId = toast({
      title: "Removendo venda",
      description: "Removendo dados",
      isClosable: true,
      status: "loading",
      variant: "left-accent",
      position: "bottom-right",
    });
    const result = await removeSale(saleCode);
    resetSelectedSale();
    toast.close(toastId);
    if (result) {
      toast({
        title: "Venda removida",
        description: "Dados removidos",
        isClosable: true,
        status: "success",
        variant: "left-accent",
        position: "bottom-right",
      });
    } else {
      toast({
        title: "Erro ao remover venda",
        description:
          "Verifique sua conexão à internet ou tente novamente mais tarde",
        isClosable: true,
        status: "warning",
        variant: "left-accent",
        position: "bottom-right",
      });
    }
  }

  useEffect(() => {
    if (!signed) {
      navigate("/login");
    }
  }, [signed]);

  const {
    isOpen: isOpenRemoveSale,
    onOpen: onOpenRemoveSale,
    onClose: onCloseRemoveSale,
  } = useDisclosure();

  return (
    <>
      {isOpenMakeOrUpdateSale ? (
        <MakeOrUpdateSale handleMakeOrUpdateSale={handleMakeOrUpdateSale} />
      ) : (
        <></>
      )}
      <AlertDialog
        isOpen={isOpenRemoveSale}
        leastDestructiveRef={cancelRefRemoveSale}
        onClose={onOpenRemoveSale}
        closeOnEsc={true}
        closeOnOverlayClick={true}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {"Remover venda"}
            </AlertDialogHeader>

            <AlertDialogBody>
              {
                "Você tem certeza de que quer remover essa venda? Essa ação não poderá ser desfeita"
              }
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRefRemoveSale}
                onClick={() => {
                  resetSelectedSale();
                  onCloseRemoveSale();
                }}
              >
                {"Cancelar"}
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleRemoveSale(selectedSale.saleCode);
                  onCloseRemoveSale();
                }}
                ml={3}
              >
                {"Remover"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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
            data={sales}
            onOpenDrawerAddSale={onOpenMakeOrUpdateSale}
          />
        </VStack>
      </Box>
    </>
  );
}
