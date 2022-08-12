import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  Input,
  InputGroup,
  Select,
  DrawerFooter,
  Button,
  useToast,
  Text,
  HStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import GlobalContext from "../../../../contexts/GlobalContext";
import ProductContext from "../../../../contexts/ProductsContext";
import { Product, ProductRow } from "../../../../types";
import { formatCode } from "../../../../util/formatCode";
import InputNumberFormat from "../../../../components/InputNumberFormat";

interface SaveOrUpdateProductProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  handleAddOrUpdateProduct: (product: Product) => Promise<boolean>;
  mode: "create" | "update";
  product?: Product;
}

export default function SaveOrUpdateProduct({
  isOpen,
  onClose,
  mode,
  product,
  handleAddOrUpdateProduct,
}: SaveOrUpdateProductProps) {
  const toast = useToast();

  const { productCode } = useContext(GlobalContext);
  const { products } = useContext(ProductContext);

  const [unitaryValue, setUnitaryValue] = useState<number>(0);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<ProductRow>({
    defaultValues: {
      productCode: product?.productCode || formatCode(productCode),
      productName: product?.productName || "",
      unitaryValue: product?.unitaryValue || 0,
      unitaryType: product?.unitaryType || "",
    },
    criteriaMode: "firstError",
  });

  async function handleCreateOrUpdateProduct(dataForm: ProductRow) {
    const dataInput: ProductRow = {
      productCode: dataForm.productCode,
      productName: dataForm.productName,
      unitaryValue: unitaryValue,
      unitaryType: dataForm.unitaryType,
    };

    const result = await handleAddOrUpdateProduct(dataInput);

    if (result) {
      toast({
        title: "Dados salvos",
        description: `Produto ${
          mode === "create" ? "adicionado" : "atualizado"
        }`,
        isClosable: true,
        status: "success",
        variant: "left-accent",
        position: "bottom-right",
      });
      clearFields();
      onClose();
    } else {
      toast({
        title: "Erro ao adicionar",
        description:
          "Por favor, verifique os dados e/ou tente novamente mais tarde",
        isClosable: true,
        status: "warning",
        variant: "left-accent",
        position: "bottom-right",
      });
    }
  }

  const clearFields = () => {
    setValue("productCode", formatCode(productCode));
    setValue("productName", "");
    setValue("unitaryValue", 0);
    setValue("unitaryType", "unid");
  };

  useEffect(() => {
    if (product && mode === "update") {
      setValue("productCode", product.productCode);
      setValue("productName", product.productName);
      setValue("unitaryValue", product.unitaryValue);
      setValue("unitaryType", product.unitaryType);
      setUnitaryValue(product.unitaryValue);
    }
  }, [mode, product, products]);

  return (
    <Drawer isOpen={isOpen} placement={"right"} size={"sm"} onClose={onClose}>
      <form onSubmit={handleSubmit(handleCreateOrUpdateProduct)}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {mode === "create" ? "Adicionar novo produto" : "Atualizar produto"}
          </DrawerHeader>
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
                {errors.productName ? (
                  <Text fontSize={"12px"} textColor={"red"} alignSelf={"start"}>
                    Nome do produto é obrigatório
                  </Text>
                ) : (
                  <></>
                )}
              </VStack>
              <VStack alignItems={"flex-start"} width={"90%"}>
                <Text textAlign={"left"}>{"Valor unitário/Kg/g/L"}</Text>
                <InputGroup>
                  <InputNumberFormat
                    value={unitaryValue}
                    setValue={setUnitaryValue}
                    prefix={"R$ "}
                  />
                </InputGroup>
                {/* {errors.unitaryValue ? (
                  <Text fontSize={"12px"} textColor={"red"} alignSelf={"start"}>
                    Valor do produto é obrigatório
                  </Text>
                ) : (
                  <></>
                )} */}
                <Select {...register("unitaryType")} defaultValue={"unid"}>
                  <option key={"unid"} value={"unid"}>
                    Unidade
                  </option>
                  <option key={"g"} value={"g"}>
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
            <HStack width={"100%"} gap={2}>
              <Button width={"full"} onClick={onClose}>
                <Text fontWeight={"600"} fontFamily={"Montserrat"}>
                  {"Cancelar"}
                </Text>
              </Button>
              <Button
                width={"full"}
                type={"submit"}
                backgroundColor={"#63342B"}
                _hover={{ backgroundColor: "#502A22" }}
                _active={{ backgroundColor: "#482017" }}
                colorScheme="blue"
              >
                <Text fontWeight={"600"} fontFamily={"Montserrat"}>
                  {mode === "create" ? "Salvar" : "Atualizar"}
                </Text>
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
}
