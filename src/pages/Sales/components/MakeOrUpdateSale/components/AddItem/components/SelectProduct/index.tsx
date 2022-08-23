import { Text } from "@chakra-ui/react";
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
import ProductContext from "../../../../../../../../contexts/ProductsContext";
import { Item, Product, ProductOption } from "../../../../../../../../types";

export default function SelectProduct({
  setItem,
}: {
  setItem: React.Dispatch<React.SetStateAction<Item>>;
}) {
  const { products } = useContext(ProductContext);

  const [data, setData] = useState<ProductOption[]>();
  const [product, setProduct] = useState<ProductOption | null>(null);

  const Control = ({
    children,
    ...props
  }: ControlProps<ProductOption, boolean>) => (
    <components.Control {...props}>{children}</components.Control>
  );

  const Option = (props: OptionProps<ProductOption, boolean>) => {
    return (
      <components.Option {...props} key={props.data.key}>
        {props.data.label}
      </components.Option>
    );
  };

  const NoOptionsMessage = (props: NoticeProps<ProductOption, boolean>) => {
    return (
      <components.NoOptionsMessage {...props}>
        {"Sem opções"}
      </components.NoOptionsMessage>
    );
  };

  const productStyles: StylesConfig<ProductOption> = {
    control: (styles) => ({
      ...styles,
      boxShadow: "unset",
      width: "auto",
      backgroundColor: "#E8E8E8",
      whiteSpace: "normal",
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
      whiteSpace: "normal",
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: "#E8E8E8",
      minWidth: "200px",
      color: "#000000",
    }),
  };

  useEffect(() => {
    if (products)
      setData(
        products.map((product) => {
          return {
            ...product,
            key: product.productCode,
            value: product.productCode,
            label: product.productName,
          };
        })
      );
  }, [products]);

  useEffect(() => {
    setItem((prevItem: Item) => {
      if (!product) return { ...(prevItem as Item) };
      const { key, value, label, ...newProd } = product;

      Object.assign(prevItem, {
        product: newProd as Product,
        unitaryValue: newProd.unitaryValue,
        totalValue: newProd?.unitaryValue,
        quantity: newProd?.unitaryType === 'unid' ? 1.0 : 0.0
      });

      return { ...(prevItem as Item) };
    });
  }, [product]);

  return (
    <Select
      value={product}
      onChange={(
        newValue: MultiValue<ProductOption> | SingleValue<ProductOption>,
        _actionMeta: ActionMeta<ProductOption>
      ) => {
        if (
          _actionMeta.action === "deselect-option" ||
          _actionMeta.action === "clear"
        ) {
          setProduct(null);
        } else if (_actionMeta.action === "select-option") {
          setProduct({ ...(newValue as ProductOption) });
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
      styles={productStyles}
      isClearable={true}
      components={{
        Option,
        Control,
        NoOptionsMessage,
      }}
      options={data}
    />
  );
}
