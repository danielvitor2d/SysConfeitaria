import { PaymentMethod, paymentMethod, Sale } from "../../../types";
import { fromNumberToStringFormatted } from "../../../util/formatCurrency";
import makeData from "../makeData";
import { PageSize, Margins, CustomTableLayout } from 'pdfmake/interfaces'

export const salesReport = (sales: any[], tableLayout: { exampleLayout: CustomTableLayout }) => {
  const data = (() => makeData(300))();
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

  console.log(rows);

  return {
    content: [
      {
        text: [
          'Relatório de vendas',
          // {
          //   image: './src/assets/logo_matrix.png'
          // } 
        ],
        fontSize: 20, 
        bold: true,
        style: 'header'
      },
      // {
      //   image: './src/assets/logo_matrix.png',
      //   width: 100,
      //   height: 100,
      // },
      {
        // layout: "lightHorizontalLines",
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          layout: tableLayout.exampleLayout,
          headerRows: 1,
          widths: [70, 200, 70, 150],
          body: [
            [
              { text: "Nº da venda", bold: true },
              { text: "Cliente", bold: true },
              { text: "Valor", bold: true },
              { text: "Forma de pagamento", bold: true },
            ],
            ...rows,
          ],
        },
      },
    ],
    pageSize: 'A4' as PageSize,
    pageMargins: [ 30, 30, 60, 60 ] as Margins,
  };
};
