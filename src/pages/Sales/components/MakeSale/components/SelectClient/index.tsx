import { HStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import Select, {
  components,
  OptionProps,
  StylesConfig,
  MultiValueProps,
  MultiValueGenericProps,
  ControlProps,
  SingleValueProps,
} from "react-select";
import { ClientOption, ClientRow } from "../../../../../../types";
import makeData from "../../../../../Clients/makeData";

export default function SelectClient() {
  const [clients, setClients] = useState<ClientOption[]>(() => {
    const data = makeData(50);
    console.log(data);
    return data.map((client: ClientRow) => {
      Object.assign(client, {
        key: client.clientCode,
        value: client.clientCode,
        label: client.clientName,
      });
      // console.log(client)
      return { ...client };
    });
  });

  const filterClients = (inputValue: string) => {
    return clients.filter(
      (client: ClientRow) => true
      // client.clientName.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const promiseOptions = (inputValue: string) => {
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(filterClients(inputValue));
      }, 500);
    });
  };

  const CustomControlClient = ({
    children,
    ...props
  }: ControlProps<ClientOption, true>) => (
    <components.Control {...props}>{children}</components.Control>
  );

  const CustomOptionClient = (props: OptionProps<ClientOption, true>) => {
    return (
      <components.Option {...props} key={props.data.key}>
        {props.data.label}
      </components.Option>
    );
  };

  const clientStyles: StylesConfig<ClientOption> = {
    control: (styles) => ({
      ...styles,
      boxShadow: "unset",
      width: "270px",
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
  };

  return  (
    <HStack>
    <Text minWidth={"120px"} maxWidth={"120px"}>
      Cliente
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
      blurInputOnSelect={true}
      autoFocus={false}
      styles={clientStyles}
      isClearable={true}
      // cacheOptions
      // defaultOptions
      components={{
        Option: CustomOptionClient,
        Control: CustomControlClient,
      }}
      options={clients}
    />
  </HStack>
  )
}