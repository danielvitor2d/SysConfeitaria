import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Input,
  Text,
  useDisclosure,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import { faker } from "@faker-js/faker";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Column } from "react-table";
import AuthContext from "../../contexts/AuthContext";
import { ClientRow } from "../../types";
import Table from "./components/Table";

import makeData from "./makeData";

export default function Clients() {
  const [isLargerThan1440] = useMediaQuery("(min-width: 1440px)");

  const navigate = useNavigate();

  const { signed } = useContext(AuthContext);

  const [data, setData] = useState<ClientRow[]>(() => makeData(25));
  const [loading, setLoading] = useState(false);
  const fetchIdRef = useRef(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, setValue } = useForm();

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
          accessor: "clientName",
          disableResizing: false,
          width: isLargerThan1440 ? 600 : 400,
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
          width: 250,
        },
        {
          Header: "Ações".toUpperCase(),
          Footer: "Ações".toUpperCase(),
          accessor: "actions",
          Cell: () => (
            <HStack>
              <EditIcon />
              <DeleteIcon color={"red"} />
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

  async function handleCreateClient(dataForm: any) {
    setData(() => {
      const dataInput: ClientRow = {
        clientCode: dataForm.clientCode,
        clientName: dataForm.clientName,
        contact: dataForm.clientContact,
        clientEmail: dataForm.clientEmail,
      };

      onClose();
      clearFields();

      return [...data, dataInput];
    });
  }

  async function handleRemoveRow() {}

  async function handleUpdateRow() {}

  const clearFields = () => {
    setValue("clientName", "");
    setValue("clientContact", "");
    setValue("contact", "");
    setValue("clientEmail", "");
  };

  // const fetchData = useCallback(
  //   ({ pageSize, pageIndex }: { pageSize: number; pageIndex: number }) => {
  //     const fetchId = ++fetchIdRef.current;

  //     setLoading(true);

  //     setTimeout(() => {
  //       if (fetchId === fetchIdRef.current) {
  //         const startRow = pageSize * pageIndex;
  //         const endRow = startRow + pageSize;
  //         setData(serverData.slice(startRow, endRow));

  //         setLoading(false);
  //       }
  //     }, 1000);
  //   },
  //   []
  // );

  useEffect(() => {
    if (!signed) {
      navigate("/");
    }
  }, [signed]);

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <form onSubmit={handleSubmit(handleCreateClient)}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Adicionar novo cliente</DrawerHeader>

            <DrawerBody>
              <VStack gap={5}>
                <VStack alignItems={"flex-start"}>
                  <Text textAlign={"left"}>Código</Text>
                  <Input
                    {...register("clientCode")}
                    value={faker.random.numeric(6)}
                    isReadOnly={true}
                  />
                </VStack>
                <VStack alignItems={"flex-start"}>
                  <Text textAlign={"left"}>Nome do cliente</Text>
                  <Input
                    {...register("clientName")}
                    placeholder="Ex. Fulano de Tal"
                  />
                </VStack>
                <VStack alignItems={"flex-start"}>
                  <Text textAlign={"left"}>Celular</Text>
                  <Input
                    {...register("clientContact")}
                    placeholder={`Ex. ${faker.phone.number("(8#) 9####-####")}`}
                  />
                </VStack>
                <VStack alignItems={"flex-start"}>
                  <Text textAlign={"left"}>E-mail</Text>
                  <Input
                    {...register("clientEmail")}
                    placeholder={"Ex. abcdef@gmail.com"}
                  />
                </VStack>
              </VStack>
            </DrawerBody>

            <DrawerFooter>
              <Button mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                width={"full"}
                type={"submit"}
                backgroundColor={"#63342B"}
                _hover={{ backgroundColor: "#502A22" }}
                _active={{ backgroundColor: "#482017" }}
                colorScheme="blue"
              >
                Save
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
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
            loading={loading}
            onOpenDrawerAddClient={onOpen}
          />
        </VStack>
      </Box>
    </>
  );
}
