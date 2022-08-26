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
import { faPrint, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CellProps, Column, Row } from "react-table";
import AuthContext from "../../contexts/AuthContext";
import SalesContext from "../../contexts/SalesContext";
import {
  paymentMethod,
  saleStatus,
  SaleRow,
  bagdeColor,
  Sale,
  Item,
  PaymentMethod,
} from "../../types";
import { compareDate } from "../../util/compareDate";
import {
  fromNumberToStringFormatted,
  toBRLWithSign,
} from "../../util/formatCurrency";
import {
  fromDateAndTimeToLocalFormatted,
  fromDatetimeToLocalFormatted,
} from "../../util/getDate";
import MakeOrUpdateSale from "./components/MakeOrUpdateSale";
import Table from "./components/Table";

import * as qz from "qz-tray";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { formatCellphone } from "../../util/formatCellphone";
import GlobalContext from "../../contexts/GlobalContext";

export default function Sales() {
  const [isLargerThan1440] = useMediaQuery("(min-width: 1440px)");

  const navigate = useNavigate();

  const toast = useToast();

  const { printer, phone, ruaNumero, cidadeEstado } = useContext(GlobalContext);
  const { signed } = useContext(AuthContext);

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
    resetSelectedSale,
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

  const sortByDateCreatedAt = useCallback(
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

  const sortByPaymentDate = useCallback(
    (
      rowA: Row<SaleRow>,
      rowB: Row<SaleRow>,
      _columnId: String,
      _desc: boolean
    ) => {
      if (!rowA.values["paymentDate"]) return -1
      if (!rowB.values["paymentDate"]) return 1
      return compareDate(rowA.values["paymentDate"], rowB.values["paymentDate"])
        ? -1
        : 1;
    },
    []
  );

  const handlePrintSale = async (saleToPrint: Sale) => {
    console.log(JSON.stringify(saleToPrint, null, 2));
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

    const printSaleCode = saleToPrint.saleCode ?? "000000";
    const printClientName =
      saleToPrint?.client?.clientName ?? "Sem identificação";
    const printPhone = saleToPrint?.client?.contact
      ? formatCellphone(saleToPrint?.client?.contact)
      : "(xx) xxxxx-xxxx";

    // 48 colunas

    const printItems: string[] = [
      "\x1B" + "\x45" + "\x0D",
      `Cód. Produto    Qtde. Unid. Vl.unit. Valor total\n`,
      "\x1B" + "\x45\n",
      "\x1B" + "\x4D" + "\x31",
    ];

    saleToPrint?.items?.forEach((item: Item) => {
      const prodName = item.product.productName;
      const itemQuantity = fromNumberToStringFormatted(item.quantity);
      const unitaryType = item.product.unitaryType;
      const unitaryValue = toBRLWithSign(item.unitaryValue);
      const totalValue = toBRLWithSign(item.totalValue);

      printItems.push(
        `${item.product.productCode} ${prodName
          .substring(0, 28)
          .padEnd(29, " ")}${itemQuantity} ${unitaryType.padStart(
          2,
          " "
        )} ${unitaryValue} ${totalValue}\n`
      );
    });

    printItems.push("\x1B" + "\x4D" + "\x30");

    const printPaymentForms: string[] = [];

    saleToPrint.paymentMethods.forEach((method: PaymentMethod) => {
      printPaymentForms.push(`${paymentMethod[method]}\n`);
    });

    const printAddressExists =
      saleToPrint?.client?.address?.rua &&
      saleToPrint?.client?.address?.numero &&
      saleToPrint?.client?.address?.cidade &&
      saleToPrint?.client?.address?.estado &&
      saleToPrint?.client?.address?.cep;

    const printAddressError = "Endereço não informado".toUpperCase();

    const printRua = `${saleToPrint?.client?.address?.rua}, ${saleToPrint?.client?.address?.numero}`;
    const printCidade = `${saleToPrint?.client?.address?.cidade}, ${saleToPrint?.client?.address?.estado}`;
    const printCEP = `${saleToPrint?.client?.address?.cep}`;

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
      `${ruaNumero}\n`,
      `${cidadeEstado}`,

      "\x1B" + "\x74" + "\x10",
      "\x0A" + "\x0A", // Quebra de linha

      `Cupom de Venda Nº ${printSaleCode}` + "\x0A" + "\x0A", // Imprimo número do pedido
      "\x1B" + "\x61" + "\x30", // Defino o alinhamento a esquerda

      "\x1B" + "\x45" + "\x0D", // Ativo negrito
      `Cliente: ${printClientName}` + "\x0A", // Imprimo nome do cliente
      `Telefone: ${printPhone}` + "\x0A", // Imprimo telefone
      "\x1B" + "\x45\n", // Desativo negrito

      // Imprimo linha tracejada
      "------------------------------------------------" + "\x0A",
      ...printItems,
      // Imprimo linha tracejada
      "------------------------------------------------" + "\x0A",

      `Total                                 ${toBRLWithSign(
        saleToPrint.fullValue as number
      )}` + "\x0A", // Imprimo o total do pedido

      // Imprimo linha tracejada
      "------------------------------------------------" + "\x0A",

      "\x1B" + "\x45" + "\x0D", // Ativo negrito
      "Data da venda: ", // Imprimo o tipo de pagamento
      "\x1B" + "\x45\n", // Desativo negrito
      `${fromDateAndTimeToLocalFormatted(saleToPrint.createdAt)}\n\n`,

      "\x1B" + "\x45" + "\x0D", // Ativo negrito
      "Forma(s) de pagamento: \n", // Imprimo o tipo de pagamento
      "\x1B" + "\x45\n", // Desativo negrito
      ...printPaymentForms, // Imprimindo cartões
      "\x0A",

      "\x1B" + "\x45" + "\x0D", // Ativo negrito
      "Endereço: \n", // Imprimo o tipo de pagamento
      "\x1B" + "\x45\n", // Desativo negrito
      printAddressExists ? printRua + "\x0A" : printAddressError,
      printAddressError ? printCidade + "\x0A" : "",
      printAddressError ? printCEP + "\x0A" : "",

      "\x0A",
      "\x1B" + "\x61" + "\x31", // Defino o alinhamento ao centro
      `NÃO É DOCUMENTO FISCAL` + "\x0A" + "\x0A", // Imprimo observação

      // "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A",
      "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A",
      "\x1B" + "\x69", // Corto o papel
      "\x10" + "\x14" + "\x01" + "\x00" + "\x05", // Dou um pulso
    ];

    console.log(JSON.stringify(order, null, 2));

    qz.print(config, order).catch((err: any) => {
      console.error(err);
    });
  };

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
          sortType: sortByDateCreatedAt,
          isSorted: true,
          disableResizing: false,
          width: 140,
        },
        {
          Header: "D. do Pagamento".toUpperCase(),
          Footer: "D. do Pagamento".toUpperCase(),
          Cell: ({ value }) => (
            <Flex
              height={"100%"}
              alignItems={"center"}
              justifyContent={"start"}
            >
              <Text fontWeight={"600"} fontFamily={"Montserrat"}>
                {value ? fromDatetimeToLocalFormatted(value) : "Não pago"}
              </Text>
            </Flex>
          ),
          accessor: "paymentDate",
          sortType: sortByPaymentDate,
          isSorted: true,
          disableResizing: false,
          width: 140,
        },
        {
          Header: "Cliente".toUpperCase(),
          Footer: "Cliente".toUpperCase(),
          Cell: ({ value }) => (
            <Flex
              height={"100%"}
              alignItems={"center"}
              justifyContent={"start"}
            >
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
                      {value.clientName || 'Cliente sem identificação'}
                    </Text>
                  </Flex>
                </TagLabel>
              </Tag>
            </Flex>
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
              <FontAwesomeIcon
                color={"#1A202C"}
                size={"lg"}
                cursor={"pointer"}
                onClick={() => handlePrintSale(cellProps.row.original)}
                icon={faPrint}
              />
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
          width: 120,
        },
      ] as Array<Column<SaleRow>>,
    [isLargerThan1440, selectedSale, setSelectedSale]
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
