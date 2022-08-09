import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  HStack,
  Tag,
  TagLabel,
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
import { ClientRow } from "../../types";
import SaveClient from "./components/SaveClient";
import Table from "./components/Table";

import makeData from "./makeData";

export default function Clients() {
  const [isLargerThan1440] = useMediaQuery("(min-width: 1440px)");

  const toast = useToast();

  const navigate = useNavigate();

  const { signed } = useContext(AuthContext);

  const [data, setData] = useState<ClientRow[]>(() => makeData(25));

  const { isOpen, onOpen, onClose } = useDisclosure();

  const columns = useMemo(
    () =>
      [
        {
          Header: "Código".toUpperCase(),
          Footer: "Código".toUpperCase(),
          accessor: "clientCode",
          disableResizing: false,
          width: 100,
        },
        {
          Header: "Cliente".toUpperCase(),
          Footer: "Cliente".toUpperCase(),
          Cell: ({ value, row }) => (
            <Tag
              size={"lg"}
              colorScheme={row.original.color}
              borderRadius={"full"}
            >
              <Avatar
                src={row.original.avatar}
                size="xs"
                name={row.original.clientName}
                ml={-1}
                mr={2}
              />
              <TagLabel>
                <Text whiteSpace={"normal"}>{value}</Text>
              </TagLabel>
            </Tag>
          ),
          accessor: "clientName",
          disableResizing: false,
          isNumeric: true,
          width: isLargerThan1440 ? 360 : 300,
        },
        {
          Header: "CPF/CNPJ".toUpperCase(),
          Footer: "CPF/CNPJ".toUpperCase(),
          accessor: "clientDocument",
          disableResizing: false,
          width: 220,
        },
        {
          Header: "E-mail".toUpperCase(),
          Footer: "E-mail".toUpperCase(),
          accessor: "clientEmail",
          disableResizing: false,
          width: 320,
        },
        {
          Header: "Celular".toUpperCase(),
          Footer: "Celular".toUpperCase(),
          accessor: "contact",
          disableResizing: false,
          isNumeric: true,
          width: 220,
        },
        {
          Header: "Ações".toUpperCase(),
          Footer: "Ações".toUpperCase(),
          accessor: "actions",
          Cell: (cellProps: CellProps<ClientRow, string | undefined>) => (
            <HStack>
              <EditIcon
                boxSize={"6"}
                cursor={"pointer"}
                onClick={() =>
                  handleUpdateRow(cellProps.row.original.clientCode)
                }
              />
              <DeleteIcon
                color={"red"}
                boxSize={"6"}
                cursor={"pointer"}
                onClick={() =>
                  handleRemoveRow(cellProps.row.original.clientCode)
                }
              />
            </HStack>
          ),
          disableResizing: true,
          disableSortBy: true,
          disableFilters: true,
          disableGlobalFilter: true,
          width: 100,
        },
      ] as Array<Column<ClientRow>>,
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

  useEffect(() => {
    if (!signed) {
      navigate("/");
    }
  }, [signed]);

  return (
    <>
      <SaveClient
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        setData={setData}
      />
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
              {"Clientes".toUpperCase()}
            </Text>
            <Text
              fontFamily={"Inter"}
              textColor={"#63342B"}
              fontStyle={"normal"}
              fontWeight={"600"}
              fontSize={"18px"}
              noOfLines={[3, 2, 1]}
            >
              {"Aqui você pode gerenciar seus clientes com facilidade"}
            </Text>
          </VStack>
          <Table columns={columns} data={data} onOpenDrawerAddClient={onOpen} />
        </VStack>
      </Box>
    </>
  );
}
