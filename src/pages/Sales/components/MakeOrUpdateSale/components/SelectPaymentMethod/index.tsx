import { Badge, HStack, Text } from "@chakra-ui/react";
import {
  PaymentMethod,
  paymentMethod,
  Sale,
  SaleStatus,
} from "../../../../../../types";
import Select, {
  components,
  OptionProps,
  StylesConfig,
  MultiValueGenericProps,
  NoticeProps,
  ActionMeta,
  MultiValue,
  SingleValue,
} from "react-select";
import makeAnimated from "react-select/animated";
import React, { useEffect, useState } from "react";

interface SelectPaymentMethodProps {
  mode: "create" | "update";
  sale: Sale;
  setSale: React.Dispatch<React.SetStateAction<Sale>>;
}

export default function SelectPaymentMethod({
  mode,
  sale,
  setSale,
}: SelectPaymentMethodProps) {
  const animatedComponents = makeAnimated();

  const [methods, setMethods] = useState<PaymentMethod[]>(() => {
    if (mode === "create" || !sale.paymentMethods) return [];
    return [ ...sale.paymentMethods ];
  });

  const paymentMethodStyles: StylesConfig<any> = {
    control: (styles) => ({
      ...styles,
      boxShadow: "unset",
      minWidth: "250px",
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
      backgroundColor: "#EDF2F7",
      color: "#1A202C",
      fontWeight: "600",
    }),
    multiValueRemove: (base) => ({
      ...base,
      backgroundColor: "#EDF2F7",
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: "#E8E8E8",
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
    return <components.MultiValueLabel {...props} />;
  };

  useEffect(() => {
    Object.assign(sale, {
      paymentMethods: methods,
    });
    setSale({ ...sale });
  }, [methods]);

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
            {"Selecione"}
          </Text>
        }
        value={methods.map((_method) => {
          return {
            key: _method,
            label: paymentMethod[_method],
            value: paymentMethod[_method],
          };
        })}
        onChange={(
          _newValue: MultiValue<any> | SingleValue<any>,
          actionMeta: ActionMeta<any>
        ) => {
          if (
            actionMeta.action === "deselect-option" ||
            actionMeta.action === "clear"
          ) {
            setMethods([]);
          } else if (actionMeta.action === "select-option") {
            setMethods([...methods, actionMeta.option.key]);
          } else if (actionMeta.action === "remove-value") {
            setMethods((prevMethods) => {
              return [
                ...prevMethods.filter(
                  (_method) => _method != actionMeta.removedValue.key
                ),
              ];
            });
          }
        }}
        components={{
          ...animatedComponents,
          Option,
          NoOptionsMessage,
          MultiValueLabel,
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
