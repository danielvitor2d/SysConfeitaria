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
  fractionDigits?: number
}

export default function InputNumberFormat({
  value,
  setValue,
  bg,
  textColor,
  prefix,
  fractionDigits
}: InputNumberFormatProps) {
  return (
    <NumberFormat
      onValueChange={(values: NumberFormatValues, _sourceInfo: SourceInfo) => {
        if (values.formattedValue.length === 0)
          setValue(0.000)
        else
          setValue(fromBRLWithSign(values.formattedValue))
      }}
      allowNegative={false}
      prefix={prefix || ""}
      format={(value: string | number) => {
        return currencyFormatter(value, prefix, fractionDigits);
      }}
      renderText={(formattedValue: string) => {
        return <Text>{formattedValue}</Text>;
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
