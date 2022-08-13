import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { useContext, useMemo } from "react";
import SaleContext from "../../../../contexts/SalesContext";
import { Sale } from "../../../../types";
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

  const salesOfDay = useMemo(() => {
    return sales.filter((sale: Sale) => {
      const date = getDateMinusDays(1);
      return compareDateStrict(
        date,
        fromDatetimeToLocalFormatted(sale.createdAt)
      );
    });
  }, []);

  const salesOfWeek = useMemo(() => {
    return sales.filter((sale: Sale) => {
      const date = getDateMinusDays(30);
      return compareDateStrict(
        date,
        fromDatetimeToLocalFormatted(sale.createdAt)
      );
    });
  }, []);

  const cashReceiptsOfDay = useMemo(() => {
    return salesOfDay.reduce((prevValue: number, { fullValue }: Sale) => {
      return prevValue + Number(fullValue as number);
    }, 0);
  }, [salesOfDay]);

  const cashReceiptsOfWeek = useMemo(() => {
    return salesOfWeek.reduce((prevValue: number, { fullValue }: Sale) => {
      return prevValue + Number(fullValue as number);
    }, 0);
  }, [salesOfWeek]);

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
              color={"#00B37E"}
              lineHeight={"24px"}
            >
              {/* {'R$ 355,90'.toLocaleUpperCase()} */}
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
              color={"#00B37E"}
              lineHeight={"24px"}
            >
              {/* {'R$ 2678,75'.toLocaleUpperCase()} */}
              {toBRLWithSign(cashReceiptsOfWeek)}
            </Text>
          </VStack>
        </Flex>
      </HStack>
    </Flex>
  );
}
