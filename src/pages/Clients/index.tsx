import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Tag,
  TagLabel,
  Text,
  useDisclosure,
  useMediaQuery,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CellProps, Column } from "react-table";
import AuthContext from "../../contexts/AuthContext";
import ClientsContext from "../../contexts/ClientsContext";
import GlobalContext from "../../contexts/GlobalContext";
import { Client, ClientRow } from "../../types";
import { formatCellphone } from "../../util/formatCellphone";
import { formatCode } from "../../util/formatCode";
import SaveOrUpdateClient from "./components/SaveOrUpdateClient";
import Table from "./components/Table";

export default function Clients() {
  const [isLargerThan1440] = useMediaQuery("(min-width: 1440px)");

  const toast = useToast();

  const navigate = useNavigate();

  const { clientCode } = useContext(GlobalContext);
  const { signed } = useContext(AuthContext);

  const [data, setData] = useState<ClientRow[]>([]);

  const { clients, addClient, updateClient, removeClient } =
    useContext(ClientsContext);

  const [client, setClient] = useState<Client>({} as Client);
  const [mode, setMode] = useState<"create" | "update">("create");

  const {
    isOpen: isOpenAddOrUpdateClient,
    onOpen: onOpenAddOrUpdateClient,
    onClose: onCloseAddOrUpdateClient,
  } = useDisclosure();

  const {
    isOpen: isOpenRemoveClient,
    onOpen: onOpenRemoveClient,
    onClose: onCloseRemoveClient,
  } = useDisclosure();

  const cancelRefRemoveClient = React.useRef(null);

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
                <Text
                  fontWeight={"600"}
                  fontFamily={"Montserrat"}
                  whiteSpace={"normal"}
                >
                  {value}
                </Text>
              </TagLabel>
            </Tag>
          ),
          accessor: "clientName",
          disableResizing: false,
          isNumeric: true,
          width: isLargerThan1440 ? 460 : 380,
        },
        {
          Header: "CPF/CNPJ".toUpperCase(),
          Footer: "CPF/CNPJ".toUpperCase(),
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
          accessor: "clientDocument",
          disableResizing: false,
          width: 220,
        },
        {
          Header: "E-mail".toUpperCase(),
          Footer: "E-mail".toUpperCase(),
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
          accessor: "clientEmail",
          disableResizing: false,
          width: 280,
        },
        {
          Header: "Celular".toUpperCase(),
          Footer: "Celular".toUpperCase(),
          Cell: ({ value }) => (
            <Flex
              height={"100%"}
              alignItems={"center"}
              justifyContent={"start"}
            >
              <Text fontWeight={"600"} fontFamily={"Montserrat"}>
                {formatCellphone(value)}
              </Text>
            </Flex>
          ),
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
                    await handleUpdateClient(cellProps.row.original)
                  }
                />
                <DeleteIcon
                  color={"red"}
                  boxSize={"6"}
                  cursor={"pointer"}
                  onClick={async () => {
                    onOpenRemoveClient();
                    setClient({
                      clientCode: cellProps.row.original.clientCode,
                    } as Client);
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
      ] as Array<Column<ClientRow>>,
    [isLargerThan1440]
  );

  async function handleAddOrUpdateClient(client: Client): Promise<boolean> {
    if (mode === "create") return await addClient(client);
    return await updateClient(client);
  }

  async function handleRemoveClient(clientCode: string): Promise<void> {
    const toastId = toast({
      title: "Removendo cliente",
      description: "Removendo dados",
      isClosable: true,
      status: "loading",
      variant: "left-accent",
      position: "bottom-right",
    });
    const result = await removeClient(clientCode);
    toast.close(toastId);
    if (result) {
      toast({
        title: "Cliente removido",
        description: "Dados removidos",
        isClosable: true,
        status: "success",
        variant: "left-accent",
        position: "bottom-right",
      });
    } else {
      toast({
        title: "Erro ao remover cliente",
        description:
          "Verifique sua conexão à internet ou tente novamente mais tarde",
        isClosable: true,
        status: "warning",
        variant: "left-accent",
        position: "bottom-right",
      });
    }
  }

  async function handleUpdateClient(client: ClientRow): Promise<void> {
    setMode("update");
    setClient({ ...(client as Client) });
    onOpenAddOrUpdateClient();
  }

  useEffect(() => {
    if (!signed) {
      navigate("/login");
    }
  }, [signed]);

  useEffect(() => {
    if (clients) setData([...clients]);
  }, [clients]);

  return (
    <>
      {isOpenAddOrUpdateClient && (
        <SaveOrUpdateClient
          handleAddOrUpdateClient={handleAddOrUpdateClient}
          isOpen={isOpenAddOrUpdateClient}
          onOpen={onOpenAddOrUpdateClient}
          onClose={onCloseAddOrUpdateClient}
          mode={mode}
          client={client}
        />
      )}
      <AlertDialog
        isOpen={isOpenRemoveClient}
        leastDestructiveRef={cancelRefRemoveClient}
        onClose={onCloseRemoveClient}
        closeOnEsc={true}
        closeOnOverlayClick={true}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {"Remover cliente"}
            </AlertDialogHeader>

            <AlertDialogBody>
              {"Você tem certeza disso? Essa ação não pode ser desfeita."}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRefRemoveClient} onClick={onCloseRemoveClient}>
                {"Cancelar"}
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleRemoveClient(client.clientCode);
                  onCloseRemoveClient();
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
          <Table
            columns={columns}
            data={data}
            onOpenDrawerAddClient={() => {
              setMode("create");
              setClient({
                clientCode: formatCode(clientCode),
                clientName: "",
                clientDocument: "",
                clientEmail: "",
                contact: "",
              });
              onOpenAddOrUpdateClient();
            }}
          />
        </VStack>
      </Box>
    </>
  );
}
