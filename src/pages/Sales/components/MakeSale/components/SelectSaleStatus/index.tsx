import { Badge, HStack, Text } from "@chakra-ui/react";
import Select, {
  components,
  OptionProps,
  StylesConfig,
  MultiValueProps,
  MultiValueGenericProps,
  ControlProps,
  SingleValueProps,
} from "react-select";
import { bagdeColor, SaleStatus, saleStatus } from "../../../../../../types";

export default function SelectSaleStatus() {
  const CustomOptionSaleStatus = (props: OptionProps<any, true>) => {
    return (
      <components.Option {...props} key={props.data.key}>
        <Badge colorScheme={bagdeColor[props.data.key as SaleStatus]}>
          {props.data.label}
        </Badge>
      </components.Option>
    );
  };

  const CustomSingleValueStatus = ({
    children,
    ...props
  }: SingleValueProps<any>) => (
    <components.SingleValue {...props}>
      <Badge colorScheme={bagdeColor[props.data.key as SaleStatus]}>
        {children}
      </Badge>
    </components.SingleValue>
  );

  const saleStatusStyles: StylesConfig<any> = {
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

  return (
    <HStack>
      <Text minWidth={"120px"} maxWidth={"120px"}>
        Status
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
          Option: CustomOptionSaleStatus,
          SingleValue: CustomSingleValueStatus,
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
        // defaultOptions
        // components={animatedComponents}
        options={Object.entries(saleStatus).map((status) => {
          return {
            value: status[1],
            label: status[1],
            key: status[0],
          };
        })}
      />
      {/* <Menu closeOnSelect={true}>
      <MenuButton
        as={Button}
        type={"submit"}
        _hover={{
          borderColor: "#b9b9b9",
        }}
        _active={{
          borderColor: "#63342B",
          borderWidth: "2px",
          ".font-awesome-icon": {
            color: "#525252",
          },
        }}
        backgroundColor={"white"}
        borderColor={"#CCCCCC"}
        borderWidth={"2px"}
        borderRadius={"4px"}
        width={"220px"}
        textAlign={"start"}
        sx={{
          ".font-awesome-icon:hover": {
            color: "#929292",
          },
        }}
        rightIcon={
          <Flex gap={2} alignItems={"center"}>
            <Divider
              height={"20px"}
              marginRight={1}
              borderColor={"#CCCCCC"}
              orientation={"vertical"}
            />
            <FontAwesomeIcon
              className="font-awesome-icon"
              icon={faAngleDown}
              color={"#CCCCCC"}
            />
          </Flex>
        }
      >
        <Text
          color={"black"}
          fontSize={"15px"}
          fontWeight={"500"}
          fontFamily={"Montserrat"}
        >
          {newSaleStatus === null ? (
            "Selecione"
          ) : (
            <Badge colorScheme={bagdeColor[newSaleStatus]}>
              {saleStatus[newSaleStatus as SaleStatus]}
            </Badge>
          )}
        </Text>
      </MenuButton>
      <MenuList minWidth="240px">
        <MenuOptionGroup
          title="Status da venda"
          type="radio"
          defaultValue={"draft"}
          onChange={(value) => {
            setNewSaleStatus(value as SaleStatus);
          }}
        >
          {Object.entries(saleStatus).map((value: string[]) => (
            <MenuItemOption key={value[0]} value={value[0]}>
              <Badge
                colorScheme={bagdeColor[value[0] as SaleStatus]}
              >
                {value[1]}
              </Badge>
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu> */}
    </HStack>
  );
}
