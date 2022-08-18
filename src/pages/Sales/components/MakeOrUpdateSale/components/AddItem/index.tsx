import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  Box,
  Text,
  useToast,
  ButtonGroup,
  VStack,
  HStack,
  Badge,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import InputNumberFormat from "../../../../../../components/InputNumberFormat";
import { Item, ItemRow } from "../../../../../../types";
import { toBRLWithSign } from "../../../../../../util/formatCurrency";
import SelectProduct from "./components/SelectProduct";

interface AddItemProps {
  handleAddItem: (itemRow: ItemRow) => void;
  isOpenAddItem: boolean;
  onOpenAddItem: () => void;
  onCloseAddItem: () => void;
}

export default function AddItem({
  handleAddItem,
  isOpenAddItem,
  onOpenAddItem,
  onCloseAddItem,
}: AddItemProps) {
  const [step, setStep] = useState(1);
  const [item, setItem] = useState<Item>({
    quantity: 0.0,
  } as Item);

  const [quantity, setQuantity] = useState<number>(0);

  const toast = useToast();

  const handleCloseAddItem = () => {
    setStep(1);
    setItem({
      quantity,
    } as Item);
    setQuantity(0);
    onCloseAddItem();
  };

  useEffect(() => {
    Object.assign(item, {
      quantity: quantity,
      totalValue: quantity * item.unitaryValue,
    });
    setItem({ ...item });
  }, [quantity]);

  return (
    <Popover placement="bottom" closeOnBlur={false} isOpen={isOpenAddItem}>
      <PopoverTrigger>
        <Button
          backgroundColor={"#70453c"}
          _hover={{ backgroundColor: "#502A22" }}
          _active={{ backgroundColor: "#482017" }}
          marginRight={3}
          alignSelf={"flex-end"}
          onClick={onOpenAddItem}
        >
          <Text
            color={"white"}
            fontSize={"15px"}
            fontWeight={"600"}
            fontFamily={"Montserrat"}
          >
            {"Novo item"}
          </Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        width={"300px"}
        color="white"
        bg="#70453c"
        borderColor="#63342A"
      >
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          <Text
            fontWeight={"600"}
            fontFamily={"Montserrat"}
            textAlign={"left"}
            alignSelf={"flex-start"}
          >
            {step === 1 ? "Escolha um produto" : `Escolha a quantidade`}
          </Text>
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton onClick={handleCloseAddItem} />
        <PopoverBody>
          {step === 1 ? (
            <SelectProduct setItem={setItem} />
          ) : (
            <VStack gap={2}>
              <HStack
                paddingX={2}
                alignSelf={"flex-start"}
                gap={2}
                width={"100%"}
                justifyContent={"space-between"}
              >
                <Text
                  fontWeight={"600"}
                  fontFamily={"Montserrat"}
                  textAlign={"left"}
                  alignSelf={"center"}
                  pl={2}
                >
                  {"Produto"}
                </Text>
                <Badge borderRadius={"5px"}>
                  <Text
                    fontWeight={"600"}
                    fontFamily={"Montserrat"}
                    textAlign={"left"}
                    alignSelf={"flex-start"}
                    fontSize={"12px"}
                    whiteSpace={"normal"}
                  >
                    {item.product.productName}
                  </Text>
                </Badge>
              </HStack>
              <HStack
                paddingX={2}
                alignSelf={"flex-start"}
                gap={2}
                width={"100%"}
                justifyContent={"space-between"}
              >
                <Text
                  fontWeight={"600"}
                  fontFamily={"Montserrat"}
                  textAlign={"left"}
                  alignSelf={"center"}
                  pl={2}
                >
                  {"Valor unitário"}
                </Text>
                <Badge borderRadius={"5px"}>
                  <Text
                    fontWeight={"600"}
                    fontFamily={"Montserrat"}
                    textAlign={"left"}
                    alignSelf={"flex-start"}
                    fontSize={"16px"}
                  >
                    {toBRLWithSign(item.product.unitaryValue)}
                  </Text>
                </Badge>
              </HStack>
              <HStack
                paddingX={2}
                alignSelf={"flex-start"}
                gap={2}
                width={"100%"}
                justifyContent={"space-between"}
              >
                <Text
                  fontWeight={"600"}
                  fontFamily={"Montserrat"}
                  textAlign={"left"}
                  alignSelf={"center"}
                  pl={2}
                >
                  {"Valor total"}
                </Text>
                <Badge borderRadius={"5px"}>
                  <Text
                    fontWeight={"600"}
                    fontFamily={"Montserrat"}
                    textAlign={"left"}
                    alignSelf={"flex-start"}
                    fontSize={"16px"}
                  >
                    {toBRLWithSign(item.product.unitaryValue * item.quantity)}
                  </Text>
                </Badge>
              </HStack>
              <InputGroup>
                <InputNumberFormat
                  bg={"#E8E8E8"}
                  textColor={"#000"}
                  value={quantity}
                  setValue={setQuantity}
                />
                <InputRightAddon
                  bg={"#E8E8E8"}
                  color={"#000"}
                  children={`${item.product.unitaryType}`}
                  borderRadius={"6px"}
                  borderColor={"#482017"}
                />
              </InputGroup>
            </VStack>
          )}
        </PopoverBody>
        <PopoverFooter
          border="0"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pb={4}
        >
          <Box fontSize="sm">{`Passo ${step} de 2`}</Box>
          <ButtonGroup>
            {step === 2 && (
              <Button
                size={"sm"}
                onClick={() => {
                  setStep(1);
                  setItem({
                    quantity: 0,
                  } as Item);
                  setQuantity(0);
                }}
                colorScheme={"blue"}
              >
                {"Voltar"}
              </Button>
            )}
            <Button
              size={"sm"}
              colorScheme={step === 1 ? undefined : "green"}
              backgroundColor={step !== 1 ? undefined : "#E8E8E8"}
              _hover={
                step !== 1
                  ? undefined
                  : {
                      backgroundColor: "#d3d3d3",
                    }
              }
              color={step !== 1 ? "#FFF" : "#000"}
              onClick={() => {
                if (step === 1) {
                  if (item.product) {
                    setStep(2);
                  } else {
                    toast({
                      title: "Produto não selecionado",
                      description: "Selecione um produto para continuar",
                      isClosable: true,
                      duration: 4000,
                      position: "bottom-right",
                      status: "warning",
                      variant: "left-accent",
                    });
                  }
                } else {
                  console.log(
                    "[AddItem] item: " + JSON.stringify(item, null, 2)
                  );
                  handleAddItem(item);
                  handleCloseAddItem();
                }
              }}
            >
              {step === 1 ? "Próximo" : "Adicionar"}
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}
