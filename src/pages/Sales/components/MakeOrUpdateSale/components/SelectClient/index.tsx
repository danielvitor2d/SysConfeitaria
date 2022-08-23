import { HStack, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import Select, {
  components,
  OptionProps,
  StylesConfig,
  ControlProps,
  NoticeProps,
  SingleValue,
  ActionMeta,
  MultiValue,
} from "react-select";
import ClientContext from "../../../../../../contexts/ClientsContext";
import SaleContext from "../../../../../../contexts/SalesContext";
import { ClientOption, Sale } from "../../../../../../types";

export default function SelectClient() {
  const { clients } = useContext(ClientContext);
  const { mode, selectedSale, setSelectedSale } = useContext(SaleContext);

  const [data, setData] = useState<ClientOption[]>([]);
  const [client, setClient] = useState<ClientOption | null>(() => {
    if (mode === "create") return null;
    return {
      ...selectedSale.client,
      key: selectedSale.client.clientCode,
      value: selectedSale.client.clientName,
      label: selectedSale.client.clientName,
    };
  });

  const Control = ({
    children,
    ...props
  }: ControlProps<ClientOption, boolean>) => (
    <components.Control {...props}>{children}</components.Control>
  );

  const Option = (props: OptionProps<ClientOption, boolean>) => {
    return (
      <components.Option {...props} key={props.data.key}>
        {props.data.label}
      </components.Option>
    );
  };

  const NoOptionsMessage = (props: NoticeProps<ClientOption, boolean>) => {
    return (
      <components.NoOptionsMessage {...props}>
        {"Sem opções"}
      </components.NoOptionsMessage>
    );
  };

  const clientStyles: StylesConfig<ClientOption> = {
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
      backgroundColor: "#E8E8E8",
      minWidth: "200px",
    }),
  };

  useEffect(() => {
    setData(
      clients.map((client) => {
        return {
          ...client,
          key: client.clientCode,
          value: client.clientCode,
          label: client.clientName,
        };
      })
    );
  }, [clients]);

  useEffect(() => {
    if (selectedSale && client) {
      const { key, label, value, ...newClient } = client;
      selectedSale.client = newClient;
      setSelectedSale({ ...selectedSale });
    }
  }, [client]);

  return (
    <HStack>
      <Text
        minWidth={"120px"}
        maxWidth={"120px"}
        fontSize={"15px"}
        fontWeight={"600"}
        fontFamily={"Montserrat"}
      >
        {"Cliente"}
      </Text>
      <Select
        value={client}
        onChange={(
          newValue: MultiValue<ClientOption> | SingleValue<ClientOption>,
          _actionMeta: ActionMeta<ClientOption>
        ) => {
          if (
            _actionMeta.action === "deselect-option" ||
            _actionMeta.action === "clear"
          ) {
            setClient(null);
          } else if (_actionMeta.action === "select-option") {
            setClient({ ...(newValue as ClientOption) });
          }
        }}
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
        blurInputOnSelect={true}
        autoFocus={false}
        styles={clientStyles}
        isClearable={true}
        components={{
          Option,
          Control,
          NoOptionsMessage,
        }}
        options={data}
      />
    </HStack>
  );
}
