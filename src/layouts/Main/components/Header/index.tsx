import { Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { useContext, useMemo } from "react";
import PaymentContext from "../../../../contexts/PaymentContext";
import SaleContext from "../../../../contexts/SalesContext";
import { Payment, Sale } from "../../../../types";
import { compareDateStrict } from "../../../../util/compareDate";
import { toBRLWithSign } from "../../../../util/formatCurrency";
import {
  getDateMinusDays,
  fromDatetimeToLocalFormatted,
} from "../../../../util/getDate";

// cash receipts
// cash payments

export default function Header() {
  const { sales } = useContext(SaleContext);
  const { payments } = useContext(PaymentContext);

  const completedSale = useMemo(() => sales.filter(sale => sale.saleStatus === 'done'), [sales])

  const salesOfDay = useMemo(() => {
    return completedSale.filter((sale: Sale) => {
      const date = getDateMinusDays(1);
      return compareDateStrict(
        date,
        fromDatetimeToLocalFormatted(sale.createdAt)
      );
    });
  }, [completedSale]);

  const paymentsOfDay = useMemo(() => {
    return payments.filter((payment: Payment) => {
      const date = getDateMinusDays(1);
      return compareDateStrict(
        date,
        fromDatetimeToLocalFormatted(payment.createdAt)
      );
    });
  }, [payments]);

  const salesOfWeek = useMemo(() => {
    return completedSale.filter((sale: Sale) => {
      const date = getDateMinusDays(7);
      return compareDateStrict(
        date,
        fromDatetimeToLocalFormatted(sale.createdAt)
      );
    });
  }, [completedSale]);

  const paymentsOfWeek = useMemo(() => {
    return payments.filter((payment: Payment) => {
      const date = getDateMinusDays(7);
      return compareDateStrict(
        date,
        fromDatetimeToLocalFormatted(payment.createdAt)
      );
    });
  }, [payments]);

  const cashReceiptsOfDay = useMemo(() => {
    return (
      salesOfDay.reduce((prevValue: number, { fullValue }: Sale) => {
        return prevValue + Number(fullValue as number);
      }, 0) -
      paymentsOfDay.reduce((prevValue: number, { paymentValue }: Payment) => {
        return prevValue + Number(paymentValue as number);
      }, 0)
    );
  }, [salesOfDay, paymentsOfDay]);

  const cashReceiptsOfWeek = useMemo(() => {
    return (
      salesOfWeek.reduce((prevValue: number, { fullValue }: Sale) => {
        return prevValue + Number(fullValue as number);
      }, 0) -
      paymentsOfWeek.reduce((prevValue: number, { paymentValue }: Payment) => {
        return prevValue + Number(paymentValue as number);
      }, 0)
    );
  }, [salesOfWeek, paymentsOfWeek]);

  return (
    <Flex
      width={"100%"}
      height={"86px"}
      backgroundColor={"#482017"}
      alignContent={"flex-start"}
      justifyContent={"flex-start"}
      paddingX={"10px"}
    >
      <HStack>
        <Flex
          width={"190px"}
          height={"66px"}
          justifyContent={"center"}
          bg={"rgba(217, 217, 217, 0.19)"}
        >
          <VStack gap={0} justifyContent={"center"} justifyItems={"center"}>
            <Text
              fontFamily={"Montserrat"}
              fontWeight={"600"}
              fontStyle={"normal"}
              fontSize={"20px"}
              textAlign={"center"}
              color={"#FFF"}
              lineHeight={"24px"}
            >
              {"Caixa diário".toLocaleUpperCase()}
            </Text>
            <Text
              fontFamily={"Montserrat"}
              fontWeight={"600"}
              fontStyle={"normal"}
              fontSize={"20px"}
              textAlign={"center"}
              color={cashReceiptsOfDay >= 0 ? "#00B37E" : "#ff4646"}
              lineHeight={"24px"}
            >
              {toBRLWithSign(cashReceiptsOfDay)}
            </Text>
          </VStack>
        </Flex>
        <Flex
          width={"190px"}
          height={"66px"}
          justifyContent={"center"}
          bg={"rgba(217, 217, 217, 0.19)"}
        >
          <VStack gap={0} justifyContent={"center"} justifyItems={"center"}>
            <Text
              fontFamily={"Montserrat"}
              fontWeight={"600"}
              fontStyle={"normal"}
              fontSize={"20px"}
              textAlign={"center"}
              color={"#FFF"}
              lineHeight={"24px"}
            >
              {"Caixa semanal".toLocaleUpperCase()}
            </Text>
            <Text
              fontFamily={"Montserrat"}
              fontWeight={"600"}
              fontStyle={"normal"}
              fontSize={"20px"}
              textAlign={"center"}
              color={cashReceiptsOfWeek >= 0 ? "#00B37E" : "#ff4646"}
              lineHeight={"24px"}
            >
              {toBRLWithSign(cashReceiptsOfWeek)}
            </Text>
          </VStack>
        </Flex>
      </HStack>
    </Flex>
  );
}
