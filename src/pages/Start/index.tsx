import { Flex, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useMemo } from "react";
import { ChartConfig, Pie } from "@kimizuy/react-chartjs";
import SaleContext from "../../contexts/SalesContext";
import PaymentContext from "../../contexts/PaymentContext";
import {
  fromDatetimeToLocalFormatted,
  getDateMinusDays,
  getDateMinusMonth,
} from "../../util/getDate";
import { compareDate } from "../../util/compareDate";
import { fromNumberToStringFormatted } from "../../util/formatCurrency";

export default function Start() {
  const { sales } = useContext(SaleContext);
  const { payments } = useContext(PaymentContext);

  const completedSale = useMemo(() => sales.filter(sale => sale.saleStatus === 'done'), [sales])

  const initDay = getDateMinusDays(0);
  const initWeek = getDateMinusDays(6);
  const initMonth = getDateMinusMonth(1);

  const lastDay = new Date(Date.now()).toLocaleDateString("pt-BR");

  let salesToReportDay = completedSale.filter((sale) => {
    return compareDate(initDay, fromDatetimeToLocalFormatted(sale.createdAt));
  });

  let paymentsToReportDay = payments.filter((payment) => {
    return compareDate(
      initDay,
      fromDatetimeToLocalFormatted(payment.createdAt)
    );
  });

  let totalSalesDay = 0;

  salesToReportDay.forEach((sale) => {
    totalSalesDay += sale.fullValue as number;
  });

  let totalPaymentsDay = 0;

  paymentsToReportDay.forEach((payment) => {
    totalPaymentsDay += payment.paymentValue;
  });

  let salesToReportWeek = completedSale.filter((sale) => {
    return compareDate(initWeek, fromDatetimeToLocalFormatted(sale.createdAt));
  });

  let paymentsToReportWeek = payments.filter((payment) => {
    return compareDate(
      initWeek,
      fromDatetimeToLocalFormatted(payment.createdAt)
    );
  });

  let totalSalesWeek = 0;

  salesToReportWeek.forEach((sale) => {
    totalSalesWeek += sale.fullValue as number;
  });

  let totalPaymentsWeek = 0;

  paymentsToReportWeek.forEach((payment) => {
    totalPaymentsWeek += payment.paymentValue;
  });

  let salesToReportMonth = completedSale.filter((sale) => {
    return compareDate(initWeek, fromDatetimeToLocalFormatted(sale.createdAt));
  });

  let paymentsToReportMonth = payments.filter((payment) => {
    return compareDate(
      initWeek,
      fromDatetimeToLocalFormatted(payment.createdAt)
    );
  });

  let totalSalesMonth = 0;

  salesToReportMonth.forEach((sale) => {
    totalSalesMonth += sale.fullValue as number;
  });

  let totalPaymentsMonth = 0;

  paymentsToReportMonth.forEach((payment) => {
    totalPaymentsMonth += payment.paymentValue;
  });

  const options = {
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#2b2b2b",
          font: {
            size: 18,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || "";
            return (
              label +
              " R$ " +
              fromNumberToStringFormatted(context.raw as number)
            );
          },
        },
      },
    },
  };

  const config_01: ChartConfig = useMemo(() => {
    return {
      data: {
        labels: ["Vendas", "Pagamentos"],
        datasets: [
          {
            data: [totalSalesDay, totalPaymentsDay],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
            ],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options,
    };
  }, [completedSale, payments]);

  const config_02: ChartConfig = useMemo(() => {
    return {
      data: {
        labels: ["Vendas", "Pagamentos"],
        datasets: [
          {
            data: [totalSalesWeek, totalPaymentsWeek],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
            ],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options,
    };
  }, [completedSale, payments]);

  const config_03: ChartConfig = useMemo(() => {
    return {
      data: {
        labels: ["Vendas", "Pagamentos"],
        datasets: [
          {
            data: [totalSalesMonth, totalPaymentsMonth],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
            ],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options,
    };
  }, [completedSale, payments]);

  return (
    <VStack backgroundColor={"#FFF"} height={"100%"} gap={10}>
      <Text
        fontSize={"30px"}
        textAlign={"center"}
        fontFamily={"Montserrat"}
        fontWeight={"600"}
      >
        {"Entradas x Vendas".toUpperCase()}
      </Text>
      <SimpleGrid
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignContent={"center"}
        alignItems={"center"}
        columns={[1, 1, 1, 2, 3, 3]}
        gap={[55, 55, 55, 55, 45, 45]}
      >
        <Flex
          boxSize={"400px"}
          alignContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          gap={"25px"}
        >
          <Pie {...config_01} />
          <Text fontSize={"20px"} fontWeight={600} fontFamily={"Montserrat"}>
            {"Diário (" + initDay + " - " + lastDay + ")"}
          </Text>
        </Flex>
        <Flex
          boxSize={"400px"}
          alignContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          gap={"25px"}
        >
          <Pie {...config_02} />
          <Text fontSize={"20px"} fontWeight={600} fontFamily={"Montserrat"}>
            {"Semanal (" + initWeek + " - " + lastDay + ")"}
          </Text>
        </Flex>
        <Flex
          boxSize={"400px"}
          alignContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          gap={"25px"}
        >
          <Pie {...config_03} />
          <Text fontSize={"20px"} fontWeight={600} fontFamily={"Montserrat"}>
            {"Mensal (" + initMonth + " - " + lastDay + ")"}
          </Text>
        </Flex>
      </SimpleGrid>
    </VStack>
  );
}
