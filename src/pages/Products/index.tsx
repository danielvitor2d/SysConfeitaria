import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, HStack, Input, InputGroup, InputLeftAddon, InputRightElement, Select, Text, useDisclosure, useMediaQuery, VStack } from "@chakra-ui/react";
import { faker } from "@faker-js/faker";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Column } from "react-table";
import AuthContext from "../../contexts/AuthContext";
import Table from "./components/Table";

import makeData from "./makeData";

const serverData = makeData(5);

export type Product = {
  productCode: string;
  productName: string;
  unitaryValue: string;
  actions?: string;
};

export default function Products() {
  const [isLargerThan1440] = useMediaQuery("(min-width: 1440px)");

  const navigate = useNavigate();

  const { signed } = useContext(AuthContext);

  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const fetchIdRef = useRef(0);

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { register, handleSubmit, setValue } = useForm()

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
          accessor: "productName",
          disableResizing: false,
          width: isLargerThan1440 ? 900 : 500,
        },
        {
          Header: "Valor Unitário/Kg/L".toUpperCase(),
          Footer: "Valor Unitário/Kg/L".toUpperCase(),
          accessor: "unitaryValue",
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
          width: 100,
        },
      ] as Array<Column<Product>>,
    [isLargerThan1440]
  );

  async function handleCreateProduct(dataForm: any) {
    setData(() => {
      const dataInput: Product  = {
        productCode: dataForm.productCode,
        productName: dataForm.productName,
        unitaryValue: dataForm.productValue + " " + dataForm.productUnid,
      }

      onClose()
      clearFields()

      return [ ...data, dataInput ]
    })
  }

  async function handleRemoveRow() {}

  async function handleUpdateRow() {}

  const clearFields = () => {
    setValue('productCode', '')
    setValue('productName', '')
    setValue('productValue', '')
    setValue('productUnid', 'unid')
  }

  const fetchData = useCallback(
    ({ pageSize, pageIndex }: { pageSize: number; pageIndex: number }) => {
      const fetchId = ++fetchIdRef.current;

      setLoading(true);

      setTimeout(() => {
        if (fetchId === fetchIdRef.current) {
          const startRow = pageSize * pageIndex;
          const endRow = startRow + pageSize;
          setData(serverData.slice(startRow, endRow));

          setPageCount(Math.ceil(serverData.length / pageSize));

          setLoading(false);
        }
      }, 1000);
    },
    []
  );

  useEffect(() => {
    if (!signed) {
      navigate("/");
    }
  }, [signed]);

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
      >
        <form onSubmit={handleSubmit(handleCreateProduct)} >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Adicionar novo produto</DrawerHeader>

            <DrawerBody>
              <VStack gap={5}>
                <VStack alignItems={'flex-start'}>
                  <Text textAlign={'left'}>
                    Código
                  </Text>
                  <Input {...register('productCode')} value={faker.random.numeric(6)} isReadOnly={true} />
                </VStack>
                <VStack alignItems={'flex-start'}>
                  <Text textAlign={'left'}>
                    Nome do produto
                  </Text>
                  <Input {...register('productName')} placeholder="Ex. Bolo de chocolate" />
                </VStack>
                <VStack alignItems={'flex-start'}>
                  <Text textAlign={'left'}>
                    Valor unitário/Kg/L
                  </Text>
                  <InputGroup>
                    <InputLeftAddon children={'R$'} />
                    <Input {...register('productValue')} placeholder={"Ex. 2,50"} />
                  </InputGroup>
                  <Select {...register('productUnid')} defaultValue={'unid'} >
                    <option key={'unid'} value={'unid'}>Unidade</option>
                    <option key={'Kg'} value={'g'}>Grama</option>
                    <option key={'Kg'} value={'Kg'}>Kilograma</option>
                    <option key={'L'} value={'L'}>Litro</option>
                  </Select>
                </VStack>
              </VStack>
            </DrawerBody>

            <DrawerFooter>
              <Button 
                mr={3}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                width={"full"}
                type={"submit"}
                backgroundColor={"#63342B"}
                _hover={{ backgroundColor: "#502A22" }}
                _active={{ backgroundColor: "#482017" }}
                colorScheme='blue'
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
            fetchData={fetchData}
            loading={loading}
            pageCount={pageCount}
            onOpenDrawerAddProduct={onOpen}
          />
        </VStack>
      </Box>
    </>
  );
}
