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
import GlobalContext from "../../contexts/GlobalContext";
import SalesContext from "../../contexts/SalesContext";
import {
  paymentMethod,
  saleStatus,
  SaleRow,
  bagdeColor,
  Sale,
  Item,
  PaymentMethod,
  Client,
} from "../../types";
import { compareDate } from "../../util/compareDate";
import { formatCode } from "../../util/formatCode";
import { toBRLWithSign } from "../../util/formatCurrency";
import {
  fromDatetimeToLocalFormatted,
  getDatetimeLocalFormatted,
} from "../../util/getDate";
import MakeOrUpdateSale from "./components/MakeOrUpdateSale";
import Table from "./components/Table";

export default function Sales() {
  const [isLargerThan1440] = useMediaQuery("(min-width: 1440px)");

  const navigate = useNavigate();

  const toast = useToast();

  const { saleCode } = useContext(GlobalContext);
  const { signed } = useContext(AuthContext);

  const [data, setData] = useState<SaleRow[]>([]);

  const {
    sales,
    addSale,
    updateSale,
    removeSale,
    isOpenMakeOrUpdateSale,
    onOpenMakeOrUpdateSale,
    onCloseMakeOrUpdateSale,
  } = useContext(SalesContext);

  const [sale, setSale] = useState<Sale>({} as Sale);
  const [mode, setMode] = useState<"create" | "update">("create");

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
                onClick={() => handleUpdateSale(cellProps.row.original)}
              />
              <DeleteIcon
                color={"red"}
                boxSize={"6"}
                cursor={"pointer"}
                onClick={() => {
                  setSale({
                    saleCode: cellProps.row.original.saleCode,
                  } as Sale);
                  handleRemoveRow(cellProps.row.original.saleCode);
                }}
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
    if (mode === "create") {
      const result = await addSale(sale);
      setSale({
        saleCode: formatCode(saleCode),
        createdAt: getDatetimeLocalFormatted(new Date(Date.now())),
        saleStatus: "draft",
        paymentMethods: [] as PaymentMethod[],
        items: [] as Item[],
        fullValue: 0,
        client: {} as Client,
      } as Sale);
      return result;
    }
    const result = await updateSale(sale);
    setSale({
      saleCode: formatCode(saleCode),
      createdAt: getDatetimeLocalFormatted(new Date(Date.now())),
      saleStatus: "draft",
      paymentMethods: [] as PaymentMethod[],
      items: [] as Item[],
      fullValue: 0,
      client: {} as Client,
    } as Sale);
    return result;
  }

  async function handleRemoveRow(saleCode: string) {
    onOpenRemoveSale();
  }

  async function handleRemoveSale(saleCode: string): Promise<void> {
    const toastId = toast({
      title: "Removendo venda",
      description: "Removendo dados",
      isClosable: true,
      status: "loading",
      variant: "left-accent",
      position: "bottom-right",
    });
    const result = await removeSale(saleCode);
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

  const {
    isOpen: isOpenRemoveSale,
    onOpen: onOpenRemoveSale,
    onClose: onCloseRemoveSale,
  } = useDisclosure();

  return (
    <>
      {isOpenMakeOrUpdateSale ? (
        <MakeOrUpdateSale
          handleMakeOrUpdateSale={handleMakeOrUpdateSale}
          isOpen={isOpenMakeOrUpdateSale}
          onClose={onCloseMakeOrUpdateSale}
          onOpen={onOpenMakeOrUpdateSale}
          mode={mode}
          setMode={setMode}
          setSale={setSale}
          sale={sale}
        />
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
              <Button ref={cancelRefRemoveSale} onClick={onCloseRemoveSale}>
                {"Cancelar"}
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleRemoveSale(sale.saleCode);
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
            data={data}
            onOpenDrawerAddSale={onOpenMakeOrUpdateSale}
          />
        </VStack>
      </Box>
    </>
  );
}
