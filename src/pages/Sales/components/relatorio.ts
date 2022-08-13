import { PaymentMethod, paymentMethod, Sale } from "../../../types";
import {
  fromNumberToStringFormatted,
  toBRLWithSign,
} from "../../../util/formatCurrency";
import makeData from "../makeData";

import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
import {
  PageSize,
  Margins,
  CustomTableLayout,
  Node,
  TDocumentDefinitions,
} from "pdfmake/interfaces";
import { getBase64ImageFromURL } from "./Table";
import {
  fromDatetimeToLocalFormatted,
  getDateMinusDays,
} from "../../../util/getDate";
import { compareDateStrict } from "../../../util/compareDate";
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

const tableLayouts = {
  exampleLayout: {
    hLineWidth: function (i: number, node: any) {
      // return (i == 0 ? 0 : (i === 1 || i === node.table) ? 2 : 1);
      return 0;
    },
    vLineWidth: function (i: number, node: any) {
      // return (i === 0 || i === node.table.widths.length) ? 2 : 0;
      return 0;
    },
    hLineColor: function (i: number, node: any) {
      return i === 0
        ? "white"
        : i === 1 || i === node.table.body.length
        ? "#CBC9CA"
        : "#D9D9D9";
    },
    vLineColor: function (i: number, node: any) {
      return i === 0 || i === node.table.widths.length ? "#CBC9CA" : "white";
    },
    // hLineStyle: function (i: number, node: any) {
    //   if (i === 1 || i === node.table.body.length) {
    //     return { length: 10 };
    //   }
    //   return null;
    // },
    // vLineStyle: function (i: number, node: any) {
    //   if (i === 0 || i === node.table.widths.length) {
    //     return null;
    //   }
    //   return {dash: {length: 4}};
    // },
    fillColor: function (rowIndex: number, _node: any, _columnIndex: number) {
      return rowIndex != 0 && rowIndex % 2 === 1 ? "#CCCCCC" : null;
    },
    defaultBorder: true,
  } as CustomTableLayout,
};

export const salesReport = async (
  sales: any[],
  type: "daily" | "weekly" | "monthly"
) => {
  const data = sales.filter((sale) => {
    if (type === "daily") {
      const date = getDateMinusDays(1);
      // console.log("Date days: " + date)
      // console.log("createdAt: " + sale.createdAt)
      // console.log("Date now: " + fromDatetimeToLocalFormatted(sale.createdAt))
      // return sale.createdAt
      return compareDateStrict(
        date,
        fromDatetimeToLocalFormatted(sale.createdAt)
      );
    } else if (type === "weekly") {
      const date = getDateMinusDays(7);
      // console.log("Date weekly: " + date)
      // console.log("createdAt: " + sale.createdAt)
      // console.log("Date now: " + fromDatetimeToLocalFormatted(sale.createdAt))
      return compareDateStrict(
        date,
        fromDatetimeToLocalFormatted(sale.createdAt)
      );
    } else {
      const date = getDateMinusDays(30);
      // console.log("Date monthly: " + date)
      // console.log("createdAt: " + sale.createdAt)
      // console.log("Date now: " + fromDatetimeToLocalFormatted(sale.createdAt))
      return compareDateStrict(
        date,
        fromDatetimeToLocalFormatted(sale.createdAt)
      );
    }
  });
  //(() => makeData(300))();
  const rows = data.map((sale: any) => {
    return [
      sale.saleCode,
      sale.client.clientName,
      "R$ " + fromNumberToStringFormatted(sale.fullValue),
      sale.paymentMethods.reduce(
        (
          previousValue: string,
          currentValue: any,
          _currentIndex: number,
          _array: any[]
        ) => {
          if (!previousValue || previousValue.length === 0)
            return paymentMethod[currentValue as PaymentMethod];
          return (
            previousValue + ", " + paymentMethod[currentValue as PaymentMethod]
          );
        },
        ""
      ),
    ];
  });

  const totalValue = data.reduce((previousValue: any, currentValue: any) => {
    return previousValue + currentValue.fullValue;
  }, 0);

  return {
    content: [
      {
        columns: [
          {
            text: ["Relatório de\n", "vendas"],
            fontSize: 24,
            bold: true,
            style: "header",
          },
          {
            image: await getBase64ImageFromURL("./src/assets/logo_matrix.png"),
            width: 150,
            height: 55,
          },
        ],
        margin: [0, 0, 0, 15],
      },
      {
        columns: [
          {
            text: [
              { text: "Caixa total: ", fontSize: 14, bold: true },
              toBRLWithSign(totalValue),
            ],
            margin: [0, 0, 0, 15],
          },
          {
            text: [
              { text: "Data: ", fontSize: 14, bold: true },
              // fromDatetimeToLocalFormatted()
              new Date(Date.now()).toLocaleDateString("pt-BR"),
            ],
            margin: [0, 0, 0, 5],
          },
        ],
      },
      {
        // layout: "lightHorizontalLines",
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: [75, 200, 70, 150],
          body: [
            [
              { text: "Nº da venda", bold: true, fontSize: 13 },
              { text: "Cliente", bold: true, fontSize: 13 },
              { text: "Valor", bold: true, fontSize: 13 },
              { text: "Forma de pagamento", bold: true, fontSize: 13 },
            ],
            ...rows,
          ],
          keepWithHeaderRows: 25,
        },
        layout: tableLayouts.exampleLayout,
        // layout: {
        //   fillColor: function (rowIndex: number, _node: any, _columnIndex: number) {
        //     return (rowIndex > 0 && rowIndex % 2 === 1) ? '#CCCCCC' : null;
        //   }
        // }
      },
    ],
    pageSize: "A4" as PageSize,
    pageMargins: [30, 30, 60, 60] as Margins,
  };
};
