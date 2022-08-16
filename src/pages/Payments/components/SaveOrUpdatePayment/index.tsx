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
  DrawerFooter,
  Button,
  useToast,
  Text,
  HStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import GlobalContext from "../../../../contexts/GlobalContext";
import { Payment, PaymentRow } from "../../../../types";
import { formatCode } from "../../../../util/formatCode";
import InputNumberFormat from "../../../../components/InputNumberFormat";
import PaymentContext from "../../../../contexts/PaymentContext";
import { getDatetimeLocalFormatted } from "../../../../util/getDate";

interface SaveOrUpdatePaymentProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  handleAddOrUpdatePayment: (payment: Payment) => Promise<boolean>;
  mode: "create" | "update";
  payment?: Payment;
}

export default function SaveOrUpdatePayment({
  isOpen,
  onClose,
  mode,
  payment,
  handleAddOrUpdatePayment,
}: SaveOrUpdatePaymentProps) {
  const toast = useToast();

  const { paymentCode } = useContext(GlobalContext);
  const { payments } = useContext(PaymentContext);

  const [paymentValue, setPaymentValue] = useState<number>(0);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<PaymentRow>({
    defaultValues: {
      paymentCode: payment?.paymentCode || formatCode(paymentCode),
      paymentTitle: payment?.paymentTitle || "",
      paymentDescription: payment?.paymentDescription || "",
      paymentValue: payment?.paymentValue || 0,
      createdAt: getDatetimeLocalFormatted(new Date(Date.now())),
    },
    criteriaMode: "firstError",
  });

  async function handleCreateOrUpdatePayment(dataForm: PaymentRow) {
    const dataInput: PaymentRow = {
      paymentCode: dataForm.paymentCode,
      paymentTitle: dataForm.paymentTitle,
      paymentDescription: dataForm.paymentDescription,
      paymentValue: paymentValue,
      createdAt: dataForm.createdAt,
    };

    console.log("cretedAt: " + JSON.stringify(dataForm.createdAt, null, 2));

    const result = await handleAddOrUpdatePayment(dataInput);

    if (result) {
      toast({
        title: "Dados salvos",
        description: `Pagamento ${
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
    setValue("paymentCode", formatCode(paymentCode));
    setValue("paymentDescription", "");
    setValue("paymentTitle", "");
    setValue("createdAt", getDatetimeLocalFormatted(new Date(Date.now())));
    setPaymentValue(0);
  };

  useEffect(() => {
    if (payment && mode === "update") {
      setValue("paymentCode", payment.paymentCode);
      setValue("paymentDescription", payment.paymentDescription);
      setValue("paymentTitle", payment.paymentTitle);
      setValue("createdAt", payment.createdAt);
      setPaymentValue(payment.paymentValue);
    }
  }, [mode, payment, payments]);

  return (
    <Drawer isOpen={isOpen} placement={"right"} size={"sm"} onClose={onClose}>
      <form onSubmit={handleSubmit(handleCreateOrUpdatePayment)}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {mode === "create"
              ? "Adicionar novo pagamento"
              : "Atualizar pagamento"}
          </DrawerHeader>
          <DrawerBody>
            <VStack gap={5} width={"90%"}>
              <VStack alignItems={"flex-start"} width={"90%"}>
                <Text textAlign={"left"}>{"Código"}</Text>
                <Input {...register("paymentCode")} isReadOnly={true} />
              </VStack>
              <VStack alignItems={"flex-start"} width={"90%"}>
                <Text textAlign={"left"}>{"Título do pagamento"}</Text>
                <Input {...register("paymentTitle")} placeholder="Ex. Gás" />
                {errors.paymentTitle ? (
                  <Text fontSize={"12px"} textColor={"red"} alignSelf={"start"}>
                    Nome do pagamento é obrigatório
                  </Text>
                ) : (
                  <></>
                )}
              </VStack>
              <VStack alignItems={"flex-start"} width={"90%"}>
                <Text textAlign={"left"}>{"Descrição do pagamento"}</Text>
                <Input
                  {...register("paymentDescription")}
                  placeholder="Ex. Botijão de gás"
                />
              </VStack>
              <VStack alignItems={"flex-start"} width={"90%"}>
                <Text textAlign={"left"}>{"Valor do pagamento"}</Text>
                <InputGroup>
                  <InputNumberFormat
                    value={paymentValue}
                    setValue={setPaymentValue}
                    prefix={"R$ "}
                  />
                </InputGroup>
              </VStack>
              <VStack alignItems={"flex-start"} width={"90%"}>
                <Text>{"Data do pagamento"}</Text>
                <Input
                  {...register("createdAt")}
                  defaultValue={getDatetimeLocalFormatted(new Date(Date.now()))}
                  width={"100%"}
                  backgroundColor={"white"}
                  type={"datetime-local"}
                />
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
