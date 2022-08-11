import { cssVar, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const $bg = cssVar("tooltip-bg");
const $arrowBg = cssVar("popper-arrow-bg");

const bg = mode("gray.700", "gray.300");

export const customTheme = extendTheme({
  components: {
    Table: {
      variants: {
        mytable: {
          table: {
            backgroundColor: "#E8E8E8",
          },
          tbody: {
            marginLeft: "10px",
            tr: {
              "&:nth-of-type(odd)": {
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
        mytable2: {
          table: {
            backgroundColor: "#f1f1f1",
          },
          tbody: {
            marginLeft: "10px",
            tr: {
              "&:nth-of-type(odd)": {
                td: {
                  background: "#E9CAB9",
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
