import { cssVar, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const $bg = cssVar("tooltip-bg");
const $arrowBg = cssVar("popper-arrow-bg");

const bg = mode("gray.700", "gray.300");

export const customTheme = extendTheme({
  components: {
    Divider: {
      baseStyle: {
        // [$bg.variable]: `#2D3748`,
        // px: "8px",
        // py: "2px",
        // bg: [$bg.reference],
        // [$arrowBg.variable]: [$bg.reference],
        // color: mode("whiteAlpha.900", "gray.900"),
        // borderRadius: "sm",
        // fontWeight: "medium",
        // fontSize: "sm",
        // boxShadow: "md",
        // maxW: "320px",
        // zIndex: "tooltip",
      },
    },
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
