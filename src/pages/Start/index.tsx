import { Flex, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useContext, useMemo } from "react";
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
  // const data = useMemo(() => {
  //   return {
  //     labels: [
  //       'Red',
  //       'Blue',
  //       'Yellow'
  //     ],
  //     datasets: [{
  //       label: 'My First Dataset',
  //       data: [300, 50, 100],
  //       backgroundColor: [
  //         'rgb(255, 99, 132)',
  //         'rgb(54, 162, 235)',
  //         'rgb(255, 205, 86)'
  //       ],
  //       hoverOffset: 4
  //     }]
  //   };
  // }, [])

  // // const config = {
  // //   type: 'pie',
  // //   data: data,
  // // };

  const { sales } = useContext(SaleContext);
  const { payments } = useContext(PaymentContext);

  const initDay = getDateMinusDays(0);
  const initWeek = getDateMinusDays(6);
  const initMonth = getDateMinusMonth(1);

  const lastDay = new Date(Date.now()).toLocaleDateString("pt-BR");

  let salesToReportDay = sales.filter((sale) => {
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

  let salesToReportWeek = sales.filter((sale) => {
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

  let salesToReportMonth = sales.filter((sale) => {
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
  }, [sales, payments]);

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
  }, [sales, payments]);

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
  }, [sales, payments]);

  const config: ChartConfig = {
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      aspectRatio: 1.618,
    },
  };

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
      {/* <Bar data={data} /> */}
    </VStack>
  );
}
