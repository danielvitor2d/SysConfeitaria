import { Badge, HStack, Text } from "@chakra-ui/react";
import { paymentMethod } from "../../../../../../types";
import Select, {
  components,
  OptionProps,
  StylesConfig,
  MultiValueGenericProps,
  NoticeProps,
} from "react-select";
import makeAnimated from "react-select/animated";

export default function SelectPaymentMethod() {
  const animatedComponents = makeAnimated();

  const paymentMethodStyles: StylesConfig<any> = {
    control: (styles) => ({
      ...styles,
      boxShadow: "unset",
      maxWidth: "280px",
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
    multiValue: (base) => ({
      ...base,
    }),
    multiValueLabel: (base) => ({
      ...base,
      backgroundColor: '#696d8a',
      color: 'white',
    }),
    multiValueRemove: (base) => ({
      ...base,
      backgroundColor: '#696d8a',
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: '#E8E8E8',
      minWidth: "200px",
    }),
  };

  const Option = (props: OptionProps<any, boolean>) => {
    return (
      <components.Option {...props} key={props.data.key}>
        <Badge colorScheme={"gray"}>{props.data.label}</Badge>
      </components.Option>
    );
  };

  const NoOptionsMessage = (props: NoticeProps<any, boolean>) => {
    return (
      <components.NoOptionsMessage {...props}>
        {"Sem opções"}
      </components.NoOptionsMessage>
    );
  };

  const MultiValueLabel = (props: MultiValueGenericProps<any, boolean>) => {
    return (
      <components.MultiValueLabel {...props} />
    );
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
        {"Pagamento"}
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
          Option,
          NoOptionsMessage,
          MultiValueLabel
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
