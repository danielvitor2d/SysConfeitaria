import { Text } from "@chakra-ui/react";
import {
  ChangeHandler,
  RefCallBack,
  UseFormClearErrors,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";
import NumberFormat, {
  NumberFormatValues,
  SourceInfo,
} from "react-number-format";
import { ClientRow } from "../../../types";
import { formatCellphone } from "../../../util/formatCellphone";

interface CellphoneNumberFormatProps {
  name: string;
  setValue: UseFormSetValue<any>;
  setError: UseFormSetError<any>;
  clearErrors: UseFormClearErrors<any>;
  defaultValue: string;
}

export default function CellphoneNumberFormat({
  name,
  setValue,
  setError,
  clearErrors,
  defaultValue,
}: CellphoneNumberFormatProps) {
  return (
    <NumberFormat
      onValueChange={(values: NumberFormatValues, _sourceInfo: SourceInfo) => {
        setValue(name, values.value);
        if (values.value.length === 0) {
          setError(name, { type: "focus" }, { shouldFocus: true });
        } else {
          clearErrors(name);
        }
      }}
      defaultValue={formatCellphone(defaultValue)}
      displayType={"input"}
      placeholder={"Ex.: (88) 98898-2314"}
      style={{
        borderColor: "#E2E8F0",
        borderWidth: "1px",
        borderRadius: "6px",
        height: "40px",
        width: "100%",
        textAlign: "left",
        paddingLeft: "5%",
      }}
      allowNegative={false}
      thousandSeparator={false}
      format={"(##) #####-####"}
      renderText={(formattedValue: string) => {
        return <Text>{formattedValue}</Text>;
      }}
    />
  );
}
