import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const customTheme = extendTheme({
  components: {
    Table: {
      variants: {
        mytable: {
          table: {
            backgroundColor: "#E8E8E8",
          },
          tr: {
            // marginLeft: '10px',
          },
          th: {
            // color: '#000000',
            // borderBottom: "1px",
            // borderColor: '#7C7C8A',
          },
          td: {
            // borderBottom: "1px",
            // borderColor: '#FFFFFF',
          },
          tbody: {
            marginLeft: "10px",
            tr: {
              "&:nth-of-type(odd)": {
                "th, td": {
                  // borderBottomWidth: "1px",
                  // borderColor: '#7C7C8A',
                },
                td: {
                  background: "rgba(234, 195, 174, 0.8)",
                },
              },
            },
          },
          tfoot: {
            tr: {
              "&:last-of-type": {
                th: { borderBottomWidth: 0 },
              },
            },
          },
        },
      },
    },
  },
});
