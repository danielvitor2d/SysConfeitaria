import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  HStack,
  Text,
  useDisclosure,
  useMediaQuery,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CellProps, Column } from "react-table";
import AuthContext from "../../contexts/AuthContext";
import { PaymentRow, Payment } from "../../types";
import Table from "./components/Table";

import { toBRLWithSign } from "../../util/formatCurrency";
import GlobalContext from "../../contexts/GlobalContext";
import React from "react";
import { formatCode } from "../../util/formatCode";
import PaymentContext from "../../contexts/PaymentContext";
import SaveOrUpdatePayment from "./components/SaveOrUpdatePayment";

export default function Payments() {
  const [isLargerThan1440] = useMediaQuery("(min-width: 1440px)");

  const toast = useToast();

  const navigate = useNavigate();

  const { paymentCode } = useContext(GlobalContext);
  const { signed } = useContext(AuthContext);

  const [data, setData] = useState<PaymentRow[]>([]);

  const { payments, addPayment, updatePayment, removePayment } =
    useContext(PaymentContext);

  const [payment, setPayment] = useState<Payment>({} as Payment);
  const [mode, setMode] = useState<"create" | "update">("create");

  const {
    isOpen: isOpenAddOrUpdatePayment,
    onOpen: onOpenAddOrUpdatePayment,
    onClose: onCloseAddOrUpdatePayment,
  } = useDisclosure();

  const {
    isOpen: isOpenRemovePayment,
    onOpen: onOpenRemovePayment,
    onClose: onCloseRemovePayment,
  } = useDisclosure();

  const cancelRefRemovePayment = React.useRef(null);

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
          accessor: "paymentCode",
          disableResizing: false,
          width: 100,
        },
        {
          Header: "Título".toUpperCase(),
          Footer: "Título".toUpperCase(),
          Cell: ({ value }) => (
            <Flex
              height={"100%"}
              alignItems={"center"}
              justifyContent={"start"}
            >
              <Text
                fontWeight={"600"}
                whiteSpace={"normal"}
                fontFamily={"Montserrat"}
              >
                {value}
              </Text>
            </Flex>
          ),
          accessor: "paymentTitle",
          disableResizing: false,
          width: 350,
        },
        {
          Header: "Descrição".toUpperCase(),
          Footer: "Descrição".toUpperCase(),
          Cell: ({ value }) => (
            <Flex
              height={"100%"}
              alignItems={"center"}
              justifyContent={"start"}
            >
              <Text
                fontWeight={"600"}
                whiteSpace={"normal"}
                fontFamily={"Montserrat"}
              >
                {value}
              </Text>
            </Flex>
          ),
          accessor: "paymentDescription",
          disableResizing: false,
          width: 350,
        },
        {
          Header: "Valor unitário/Kg/g/L".toUpperCase(),
          Footer: "Valor unitário/Kg/g/L".toUpperCase(),
          accessor: "paymentValue",
          Cell: ({ value }) => (
            <Flex
              height={"100%"}
              alignItems={"center"}
              justifyContent={"start"}
            >
              <Text fontWeight={"600"} fontFamily={"Montserrat"}>
                {toBRLWithSign(value)}
              </Text>
            </Flex>
          ),
          disableResizing: false,
          isNumeric: true,
          width: 250,
        },
        {
          Header: "Ações".toUpperCase(),
          Footer: "Ações".toUpperCase(),
          accessor: "actions",
          Cell: (cellProps: CellProps<PaymentRow, string | undefined>) => (
            <Flex
              height={"100%"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <HStack>
                <EditIcon
                  boxSize={"6"}
                  cursor={"pointer"}
                  onClick={async () =>
                    await handleUpdatePayment(cellProps.row.original)
                  }
                />
                <DeleteIcon
                  color={"red"}
                  boxSize={"6"}
                  cursor={"pointer"}
                  onClick={async () => {
                    onOpenRemovePayment();
                    setPayment({
                      paymentCode: cellProps.row.original.paymentCode,
                    } as Payment);
                  }}
                />
              </HStack>
            </Flex>
          ),
          disableResizing: true,
          disableSortBy: true,
          disableFilters: true,
          disableGlobalFilter: true,
          width: 100,
        },
      ] as Array<Column<PaymentRow>>,
    [isLargerThan1440]
  );

  async function handleAddOrUpdatePayment(payment: Payment): Promise<boolean> {
    if (mode === "create") return await addPayment(payment);
    return await updatePayment(payment);
  }

  async function handleRemovePayment(paymentCode: string): Promise<void> {
    const toastId = toast({
      title: "Removendo pagamento",
      description: "Removendo dados",
      isClosable: true,
      status: "loading",
      variant: "left-accent",
      position: "bottom-right",
    });
    const result = await removePayment(paymentCode);
    toast.close(toastId);
    if (result) {
      toast({
        title: "Pagamento removido",
        description: "Dados removidos",
        isClosable: true,
        status: "success",
        variant: "left-accent",
        position: "bottom-right",
      });
    } else {
      toast({
        title: "Erro ao remover pagamento",
        description:
          "Verifique sua conexão à internet ou tente novamente mais tarde",
        isClosable: true,
        status: "warning",
        variant: "left-accent",
        position: "bottom-right",
      });
    }
  }

  async function handleUpdatePayment(payment: PaymentRow): Promise<void> {
    setMode("update");
    setPayment({ ...(payment as Payment) });
    onOpenAddOrUpdatePayment();
  }

  useEffect(() => {
    if (!signed) {
      navigate("/login");
    }
  }, [signed]);

  useEffect(() => {
    if (payments) setData([...payments]);
  }, [payments]);

  return (
    <>
      {isOpenAddOrUpdatePayment && (
        <SaveOrUpdatePayment
          handleAddOrUpdatePayment={handleAddOrUpdatePayment}
          isOpen={isOpenAddOrUpdatePayment}
          onOpen={onOpenAddOrUpdatePayment}
          onClose={onCloseAddOrUpdatePayment}
          mode={mode}
          payment={payment}
        />
      )}
      <AlertDialog
        isOpen={isOpenRemovePayment}
        leastDestructiveRef={cancelRefRemovePayment}
        onClose={onCloseRemovePayment}
        closeOnEsc={true}
        closeOnOverlayClick={true}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {"Remover pagamento"}
            </AlertDialogHeader>

            <AlertDialogBody>
              {"Você tem certeza disso? Essa ação não pode ser desfeita."}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRefRemovePayment}
                onClick={onCloseRemovePayment}
              >
                {"Cancelar"}
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleRemovePayment(payment.paymentCode);
                  onCloseRemovePayment();
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
          <VStack alignItems={"flex-start"}>
            <Text
              fontFamily={"Inter"}
              textColor={"#63342B"}
              fontStyle={"normal"}
              fontWeight={"600"}
              fontSize={"32px"}
            >
              {"Pagamentos".toUpperCase()}
            </Text>
            <Text
              fontFamily={"Inter"}
              textColor={"#63342B"}
              fontStyle={"normal"}
              fontWeight={"600"}
              fontSize={"18px"}
              noOfLines={[3, 2, 1]}
            >
              {"Cadastre seus pagamentos aqui!"}
            </Text>
          </VStack>
          <Table
            columns={columns}
            data={data}
            onOpenDrawerAddPayment={() => {
              setMode("create");
              setPayment({
                paymentCode: formatCode(paymentCode),
                paymentTitle: "",
                paymentDescription: "",
                paymentValue: 0,
                createdAt: "",
              });
              onOpenAddOrUpdatePayment();
            }}
          />
        </VStack>
      </Box>
    </>
  );
}
