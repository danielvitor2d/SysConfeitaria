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
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
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
import { Product, ProductRow } from "../../types";
import Table from "./components/Table";

import makeData from "./makeData";
import { toBRLWithSign } from "../../util/formatCurrency";
import InputNumberFormat from "../../components/InputNumberFormat";
import GlobalContext from "../../contexts/GlobalContext";
import ProductContext from "../../contexts/ProductsContext";
import SaveOrUpdateProduct from "./components/SaveOrUpdateProduct";
import React from "react";
import { formatCode } from "../../util/formatCode";

export default function Products() {
  const [isLargerThan1440] = useMediaQuery("(min-width: 1440px)");

  const toast = useToast();

  const navigate = useNavigate();

  const { productCode } = useContext(GlobalContext);
  const { signed } = useContext(AuthContext);

  const [data, setData] = useState<ProductRow[]>([]);

  const { products, addProduct, updateProduct, removeProduct } =
    useContext(ProductContext);

  const [product, setProduct] = useState<Product>({} as Product);
  const [mode, setMode] = useState<"create" | "update">("create");

  const {
    isOpen: isOpenAddOrUpdateProduct,
    onOpen: onOpenAddOrUpdateProduct,
    onClose: onCloseAddOrUpdateProduct,
  } = useDisclosure();

  const {
    isOpen: isOpenRemoveProduct,
    onOpen: onOpenRemoveProduct,
    onClose: onCloseRemoveProduct,
  } = useDisclosure();

  const cancelRefRemoveProduct = React.useRef(null);

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
          accessor: "productCode",
          disableResizing: false,
          width: 100,
        },
        {
          Header: "Nome do Produto".toUpperCase(),
          Footer: "Nome do Produto".toUpperCase(),
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
          accessor: "productName",
          disableResizing: false,
          width: isLargerThan1440 ? 600 : 350,
        },
        {
          Header: "Valor Unitário/Kg/L".toUpperCase(),
          Footer: "Valor Unitário/Kg/L".toUpperCase(),
          accessor: "unitaryValue",
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
          Header: "Tipo unitário".toUpperCase(),
          Footer: "Tipo unitário".toUpperCase(),
          accessor: "unitaryType",
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
          disableResizing: false,
          isNumeric: true,
          width: 250,
        },
        {
          Header: "Ações".toUpperCase(),
          Footer: "Ações".toUpperCase(),
          accessor: "actions",
          Cell: (cellProps: CellProps<ProductRow, string | undefined>) => (
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
                    await handleUpdateProduct(cellProps.row.original)
                  }
                />
                <DeleteIcon
                  color={"red"}
                  boxSize={"6"}
                  cursor={"pointer"}
                  onClick={async () => {
                    onOpenRemoveProduct();
                    setProduct({
                      productCode: cellProps.row.original.productCode,
                    } as Product);
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
      ] as Array<Column<ProductRow>>,
    [isLargerThan1440]
  );

  async function handleAddOrUpdateProduct(product: Product): Promise<boolean> {
    if (mode === "create") return await addProduct(product);
    return await updateProduct(product);
  }

  async function handleRemoveProduct(productCode: string): Promise<void> {
    const toastId = toast({
      title: "Removendo produto",
      description: "Removendo dados",
      isClosable: true,
      status: "loading",
      variant: "left-accent",
      position: "bottom-right",
    });
    const result = await removeProduct(productCode);
    toast.close(toastId);
    if (result) {
      toast({
        title: "Produto removido",
        description: "Dados removidos",
        isClosable: true,
        status: "success",
        variant: "left-accent",
        position: "bottom-right",
      });
    } else {
      toast({
        title: "Erro ao remover produto",
        description:
          "Verifique sua conexão à internet ou tente novamente mais tarde",
        isClosable: true,
        status: "warning",
        variant: "left-accent",
        position: "bottom-right",
      });
    }
  }

  async function handleUpdateProduct(product: ProductRow): Promise<void> {
    setMode("update");
    setProduct({ ...(product as Product) });
    onOpenAddOrUpdateProduct();
  }

  useEffect(() => {
    if (!signed) {
      navigate("/login");
    }
  }, [signed]);

  useEffect(() => {
    if (products) setData([...products]);
  }, [products]);

  return (
    <>
      {isOpenAddOrUpdateProduct && (
        <SaveOrUpdateProduct
          handleAddOrUpdateProduct={handleAddOrUpdateProduct}
          isOpen={isOpenAddOrUpdateProduct}
          onOpen={onOpenAddOrUpdateProduct}
          onClose={onCloseAddOrUpdateProduct}
          mode={mode}
          product={product}
        />
      )}
      <AlertDialog
        isOpen={isOpenRemoveProduct}
        leastDestructiveRef={cancelRefRemoveProduct}
        onClose={onCloseRemoveProduct}
        closeOnEsc={true}
        closeOnOverlayClick={true}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {"Remover produto"}
            </AlertDialogHeader>

            <AlertDialogBody>
              {"Você tem certeza disso? Essa ação não pode ser desfeita."}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRefRemoveProduct}
                onClick={onCloseRemoveProduct}
              >
                {"Cancelar"}
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleRemoveProduct(product.productCode);
                  onCloseRemoveProduct();
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
            onOpenDrawerAddProduct={() => {
              setMode("create");
              setProduct({
                productCode: formatCode(productCode),
                productName: "",
                unitaryValue: 0,
                unitaryType: "unid",
              });
              onOpenAddOrUpdateProduct();
            }}
          />
        </VStack>
      </Box>
    </>
  );
}
