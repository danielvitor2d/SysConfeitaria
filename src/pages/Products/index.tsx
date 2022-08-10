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
  InputGroup,
  Select,
  Text,
  useDisclosure,
  useMediaQuery,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { faker } from "@faker-js/faker";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CellProps, Column } from "react-table";
import AuthContext from "../../contexts/AuthContext";
import { ProductRow } from "../../types";
import Table from "./components/Table";

import makeData from "./makeData";
import { toBRLWithSign } from "../../util/formatCurrency";
import InputNumberFormat from "../components/InputNumberFormat";

export default function Products() {
  const [isLargerThan1440] = useMediaQuery("(min-width: 1440px)");

  const toast = useToast();

  const navigate = useNavigate();

  const { signed } = useContext(AuthContext);

  const [data, setData] = useState<ProductRow[]>(() => makeData(50));
  const [loading, setLoading] = useState(false);

  const fetchIdRef = useRef(0);

  const [unitaryValue, setUnitaryValue] = useState<number>(0);

  useEffect(() => {
    console.log("unitaryValue: " + unitaryValue);
  }, [unitaryValue]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, setValue, getValues } = useForm<ProductRow>({
    defaultValues: {
      productCode: faker.random.numeric(6),
      productName: "",
      unitaryType: "unid",
      unitaryValue: 0,
    },
  });

  const columns = useMemo(
    () =>
      [
        {
          Header: "Código".toUpperCase(),
          Footer: "Código".toUpperCase(),
          accessor: "productCode",
          disableResizing: false,
          width: 100,
        },
        {
          Header: "Nome do Produto".toUpperCase(),
          Footer: "Nome do Produto".toUpperCase(),
          Cell: ({ value }) => <Text whiteSpace={"normal"}>{value}</Text>,
          accessor: "productName",
          disableResizing: false,
          width: isLargerThan1440 ? 600 : 350,
        },
        {
          Header: "Tipo unitário".toUpperCase(),
          Footer: "Tipo unitário".toUpperCase(),
          accessor: "unitaryType",
          Cell: ({ value }) => <Text>{value}</Text>,
          disableResizing: false,
          isNumeric: true,
          width: 250,
        },
        {
          Header: "Valor Unitário/Kg/L".toUpperCase(),
          Footer: "Valor Unitário/Kg/L".toUpperCase(),
          accessor: "unitaryValue",
          Cell: ({ value }) => <Text>{toBRLWithSign(value)}</Text>,
          disableResizing: false,
          isNumeric: true,
          width: 250,
        },
        {
          Header: "Ações".toUpperCase(),
          Footer: "Ações".toUpperCase(),
          accessor: "actions",
          Cell: (cellProps: CellProps<ProductRow, string | undefined>) => (
            <HStack>
              <EditIcon
                boxSize={"6"}
                cursor={"pointer"}
                onClick={() =>
                  handleUpdateRow(cellProps.row.original.productCode)
                }
              />
              <DeleteIcon
                color={"red"}
                boxSize={"6"}
                cursor={"pointer"}
                onClick={() =>
                  handleRemoveRow(cellProps.row.original.productCode)
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
      ] as Array<Column<ProductRow>>,
    [isLargerThan1440]
  );

  async function handleCreateProduct(dataForm: ProductRow) {
    setData((prevDataInput: ProductRow[]) => {
      const dataInput: ProductRow = {
        productCode: dataForm.productCode,
        productName: dataForm.productName,
        unitaryValue: unitaryValue,
        unitaryType: dataForm.unitaryType,
      };

      onClose();
      clearFields();

      return [dataInput, ...prevDataInput];
    });
  }

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

  const clearFields = () => {
    setValue("productCode", faker.random.numeric(6));
    setValue("productName", "");
    setValue("unitaryValue", 0);
    setValue("unitaryType", "unid");
  };

  useEffect(() => {
    if (!signed) {
      navigate("/");
    }
  }, [signed]);

  return (
    <>
      <Drawer isOpen={isOpen} placement={"right"} size={"sm"} onClose={onClose}>
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Adicionar novo produto</DrawerHeader>
            <DrawerBody>
              <VStack gap={5} width={"90%"}>
                <VStack alignItems={"flex-start"} width={"90%"}>
                  <Text textAlign={"left"}>{"Código"}</Text>
                  <Input {...register("productCode")} isReadOnly={true} />
                </VStack>
                <VStack alignItems={"flex-start"} width={"90%"}>
                  <Text textAlign={"left"}>{"Nome do produto"}</Text>
                  <Input
                    {...register("productName")}
                    placeholder="Ex. Bolo de chocolate"
                  />
                </VStack>
                <VStack alignItems={"flex-start"} width={"90%"}>
                  <Text textAlign={"left"}>{"Valor unitário/Kg/L"}</Text>
                  <InputGroup>
                    {/* <InputLeftAddon children={"R$"} /> */}
                    {/* <Input
                      {...register("unitaryValue")}
                      defaultValue={0}
                      placeholder={"Ex. 2,50"}
                    /> */}
                    <InputNumberFormat
                      value={unitaryValue}
                      setValue={setUnitaryValue}
                    />
                  </InputGroup>
                  <Select {...register("unitaryType")} defaultValue={"unid"}>
                    <option key={"unid"} value={"unid"}>
                      Unidade
                    </option>
                    <option key={"Kg"} value={"g"}>
                      Grama
                    </option>
                    <option key={"Kg"} value={"Kg"}>
                      Quilograma
                    </option>
                    <option key={"L"} value={"L"}>
                      Litro
                    </option>
                  </Select>
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
              {"Produtos".toUpperCase()}
            </Text>
            <Text
              fontFamily={"Inter"}
              textColor={"#63342B"}
              fontStyle={"normal"}
              fontWeight={"600"}
              fontSize={"18px"}
              noOfLines={[3, 2, 1]}
            >
              {"Gerencie seus produtos aqui!"}
            </Text>
          </VStack>
          <Table
            columns={columns}
            data={data}
            onOpenDrawerAddProduct={onOpen}
          />
        </VStack>
      </Box>
    </>
  );
}
