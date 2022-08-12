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
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  useToast,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  ButtonGroup,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Item, Product } from "../../../../../../types";
import { toBRLWithSign } from "../../../../../../util/formatCurrency";
import SelectProduct from "./components/SelectProduct";

export default function AddItem() {
  const [step, setStep] = useState(1);
  const [item, setItem] = useState<Item>({
    quantity: 1,
  } as Item);

  const toast = useToast();

  useEffect(() => {
    console.log("Mudou: " + JSON.stringify(item, null, 2));
  }, [item]);

  return (
    <Popover placement="bottom" closeOnBlur={false}>
      <PopoverTrigger>
        <Button
          backgroundColor={"#70453c"}
          _hover={{ backgroundColor: "#502A22" }}
          _active={{ backgroundColor: "#482017" }}
          marginRight={3}
          alignSelf={"flex-end"}
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
            {step === 1 ? "Escolha um produto" : "Escolha a quantidade"}
          </Text>
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
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
                  {"Valor total"}
                </Text>
                <Badge borderRadius={"5px"}>
                  <Text
                    fontWeight={"600"}
                    fontFamily={"Montserrat"}
                    textAlign={"left"}
                    alignSelf={"flex-start"}
                    fontSize={"20px"}
                  >
                    {toBRLWithSign(item.product.unitaryValue * item.quantity)}
                  </Text>
                </Badge>
              </HStack>
              <NumberInput
                borderRadius={"5px"}
                bg={"#E8E8E8"}
                textColor={"#000"}
                step={1}
                defaultValue={1}
                min={1}
                value={item.quantity}
                onChange={(_valueAsString: string, valueAsNumber: number) => {
                  Object.assign(item, {
                    quantity: valueAsNumber
                  })
                  setItem({ ...item })
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
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
                }}
                colorScheme={"blue"}
              >
                {"Voltar"}
              </Button>
            )}
            <Button
              size={"sm"}
              colorScheme={step === 1 ? undefined : 'green'}
              backgroundColor={step !== 1 ? undefined : "#E8E8E8"}
              _hover={step !== 1 ? undefined : {
                backgroundColor: "#d3d3d3",
              }}
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
