import { Badge, HStack, Text } from "@chakra-ui/react";
import { paymentMethod } from "../../../../../../types";
import Select, {
  components,
  OptionProps,
  StylesConfig,
  MultiValueProps,
  MultiValueGenericProps,
  ControlProps,
  SingleValueProps,
  MultiValueRemoveProps,
  NoticeProps,
} from "react-select";
import makeAnimated from "react-select/animated";
import { TooltipPrimitive } from "@atlaskit/tooltip";

export default function SelectPaymentMethod() {
  const animatedComponents = makeAnimated()

  const paymentMethodStyles: StylesConfig<any> = {
    control: (styles) => ({
      ...styles,
      boxShadow: "unset",
      maxWidth: "280px",
      backgroundColor: "white",
      ":focus": {
        ...styles[":focus"],
        borderColor: "#63342B",
        // backgroundColor: 'blue'
      },
      ":hover": {
        ...styles[":hover"],
        borderColor: "#b9b9b9",
        // backgroundColor: 'red'
      },
      ":active": {
        ...styles[":active"],
        borderColor: "#63342B",
        // backgroundColor: 'blue'
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
      // border: `1px dotted red`,
      // height: '100%',
    }),
    multiValue: (base) => ({
      ...base,
      // justifyContent: 'space-between',
      // width: 'auto'
    }),
    menu: (styles) => ({
      ...styles,
      minWidth: "200px",
    })
  };

  const CustomOptionPaymentMethod = (props: OptionProps<any, true>) => {
    return (
      <components.Option {...props} key={props.data.key}>
        <Badge colorScheme={"gray"}>
          {props.data.label}
        </Badge>
      </components.Option>
    );
  };

  const NoOptionsMessage = (props: NoticeProps) => {
    return (
      <components.NoOptionsMessage {...props}>
        {"Sem opções"}
      </components.NoOptionsMessage>
    );
  };
  
  return (
    <HStack>
      <Text minWidth={"120px"} maxWidth={"120px"}>
        Pagamento
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
          ...animatedComponents,
          Option: CustomOptionPaymentMethod,
          NoOptionsMessage,
        }}
        blurInputOnSelect={true}
        autoFocus={false}
        styles={paymentMethodStyles}
        isClearable={true}
        isMulti={true}
        options={Object.entries(paymentMethod).map((payment) => {
          return {
            value: payment[1],
            label: payment[1],
            key: payment[0],
          };
        })}
      />
    </HStack>
  );
}
