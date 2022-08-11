import { Badge, HStack, Text } from "@chakra-ui/react";
import Select, {
  components,
  OptionProps,
  StylesConfig,
  SingleValueProps,
  NoticeProps,
} from "react-select";
import { bagdeColor, SaleStatus, saleStatus } from "../../../../../../types";

export default function SelectSaleStatus() {
  const Option = (props: OptionProps<any, boolean>) => {
    return (
      <components.Option {...props} key={props.data.key}>
        <Badge colorScheme={bagdeColor[props.data.key as SaleStatus]}>
          {props.data.label}
        </Badge>
      </components.Option>
    );
  };

  const SingleValue = ({
    children,
    ...props
  }: SingleValueProps<any, boolean>) => (
    <components.SingleValue {...props}>
      <Badge colorScheme={bagdeColor[props.data.key as SaleStatus]}>
        {children}
      </Badge>
    </components.SingleValue>
  );

  const NoOptionsMessage = (props: NoticeProps<any, boolean>) => {
    return (
      <components.NoOptionsMessage {...props}>
        {"Sem opções"}
      </components.NoOptionsMessage>
    );
  };

  const saleStatusStyles: StylesConfig<any> = {
    control: (styles) => ({
      ...styles,
      boxShadow: "unset",
      width: "270px",
      backgroundColor: "#E8E8E8",
      ":focus": {
        ...styles[":focus"],
        borderColor: "#63342B",
      },
      ":hover": {
        ...styles[":hover"],
        borderColor: "#b9b9b9",
      },
      ":active": {
        ...styles[":active"],
        borderColor: "#63342B",
      },
      ":focus-visible": {
        ...styles[":focus-visible"],
        borderColor: "#63342B",
      },
      ":focus-within": {
        ...styles[":focus-within"],
        borderColor: "#63342B",
      },
      cursor: "pointer",
    }),
    option: (styles) => ({
      ...styles,
      cursor: "pointer",
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: '#E8E8E8',
      minWidth: "200px",
    }),
  };

  return (
    <HStack>
      <Text
        minWidth={"120px"}
        maxWidth={"120px"}
        fontSize={"15px"}
        fontWeight={"600"}
        fontFamily={"Montserrat"}
      >
        {"Status"}
      </Text>
      <Select
        placeholder={
          <Text
            color={"black"}
            fontSize={"15px"}
            fontWeight={"500"}
            fontFamily={"Montserrat"}
          >
            Selecione
          </Text>
        }
        components={{
          Option,
          SingleValue,
          NoOptionsMessage
        }}
        blurInputOnSelect={true}
        autoFocus={false}
        styles={saleStatusStyles}
        isClearable={true}
        defaultValue={{
          value: "Rascunho",
          label: "Rascunho",
          key: "draft",
        }}
        options={Object.entries(saleStatus).map((status) => {
          return {
            value: status[1],
            label: status[1],
            key: status[0],
          };
        })}
      />
    </HStack>
  );
}
