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
} from "@chakra-ui/react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CellProps, Column } from "react-table";
import AuthContext from "../../contexts/AuthContext";
import { paymentMethod, saleStatus, SaleRow, bagdeColor } from "../../types";
import MakeSale from "./components/MakeSale";
import Table from "./components/Table";
import makeData from "./makeData";

export default function Sales() {
  const [isLargerThan1440] = useMediaQuery("(min-width: 1440px)");

  const navigate = useNavigate();

  const toast = useToast();

  const { signed } = useContext(AuthContext);

  const [data, setData] = useState<SaleRow[]>(() => makeData(55));

  const fetchIdRef = useRef(0);

  const {
    isOpen: isOpenMakeSale,
    onOpen: onOpenMakeSale,
    onClose: onCloseMakeSale,
  } = useDisclosure();

  const { register, handleSubmit, setValue } = useForm();

  const columns = useMemo(
    () =>
      [
        {
          Header: "Código".toUpperCase(),
          Footer: "Código".toUpperCase(),
          accessor: "saleCode",
          disableResizing: false,
          width: 95,
        },
        {
          Header: "Data".toUpperCase(),
          Footer: "Data".toUpperCase(),
          Cell: ({ value }) => <Text whiteSpace={"normal"}>{value}</Text>,
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
                <Text whiteSpace={"normal"}>{value.clientName}</Text>
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
          Cell: ({ value }) => <Text whiteSpace={"normal"}>{value}</Text>,
          accessor: "fullValue",
          disableResizing: false,
          isNumeric: true,
          width: 180,
        },
        {
          Header: "Pagamento".toUpperCase(),
          Footer: "Pagamento".toUpperCase(),
          Cell: ({ value }) => (
            <Badge colorScheme={"gray"}>
              <Text whiteSpace={"normal"}>{paymentMethod[value]}</Text>
            </Badge>
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
            <Badge colorScheme={bagdeColor[value]}>{saleStatus[value]}</Badge>
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
            <HStack>
              <EditIcon
                boxSize={"6"}
                cursor={"pointer"}
                onClick={() => handleUpdateRow(cellProps.row.original.saleCode)}
              />
              <DeleteIcon
                color={"red"}
                boxSize={"6"}
                cursor={"pointer"}
                onClick={() => handleRemoveRow(cellProps.row.original.saleCode)}
              />
            </HStack>
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

  async function handleRemoveRow(saleCode: string) {
    toast({
      title: "Removendo",
      description: `Removendo linha ${saleCode}`,
      status: "info",
    });
  }

  async function handleUpdateRow(saleCode: string) {
    toast({
      title: "Editando",
      description: `Editando linha ${saleCode}`,
      status: "info",
    });
  }

  // useEffect(() => {
  //   if (!signed) {
  //     // navigate("/login");
  //     window.location.reload()
  //   }
  // }, [signed]);

  return (
    <>
      <MakeSale
        isOpen={isOpenMakeSale}
        onClose={onCloseMakeSale}
        onOpen={onOpenMakeSale}
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
            onOpenDrawerAddSale={onOpenMakeSale}
          />
        </VStack>
      </Box>
    </>
  );
}
