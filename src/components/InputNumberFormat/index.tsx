import { Text } from "@chakra-ui/react";
import NumberFormat, {
  NumberFormatValues,
  SourceInfo,
} from "react-number-format";
import currencyFormatter, {
  fromBRLWithSign,
  toBRLWithSign,
} from "../../util/formatCurrency";

interface InputNumberFormatProps {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  bg?: string;
  textColor?: string;
  prefix?: string;
}

export default function InputNumberFormat({
  value,
  setValue,
  bg,
  textColor,
  prefix,
}: InputNumberFormatProps) {
  return (
    <NumberFormat
      value={toBRLWithSign(value)}
      onValueChange={(values: NumberFormatValues, _sourceInfo: SourceInfo) => {
        // console.log(values);
        // console.log(fromBRLWithSign(values.formattedValue));
        // console.log("Value: " + value);
        // console.log("WithSign: " + toBRLWithSign(value));
        setValue(fromBRLWithSign(values.formattedValue));
      }}
      allowNegative={false}
      thousandSeparator={true}
      prefix={prefix || ""}
      format={(value: string | number) => {
        return currencyFormatter(value, prefix);
      }}
      renderText={(value: any) => {
        return <Text>{value}</Text>;
      }}
      style={{
        borderWidth: "1px",
        borderTopLeftRadius: "6px",
        borderBottomLeftRadius: "6px",
        borderTopRightRadius: prefix ? "6px" : undefined,
        borderBottomRightRadius: prefix ? "6px" : undefined,
        width: "100%",
        textAlign: "left",
        paddingLeft: "5%",
        height: "40px",
        borderColor: "#482017",
        boxShadow: "none",
        backgroundColor: bg,
        color: textColor,
      }}
    />
  );
}
