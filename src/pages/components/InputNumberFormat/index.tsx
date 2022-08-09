import { Text } from "@chakra-ui/react";
import { FocusEventHandler, useMemo, useState } from "react";
import NumberFormat from "react-number-format";
import currencyFormatter from "../../../util/formatCurrency";

export default function InputNumberFormat() {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [active, setActive] = useState(false);  

  const buttonStyle = useMemo<React.CSSProperties>(() => {
    console.log(hover, active)
    return {
      'borderWidth': "1px",
      'borderRadius': "6px",
      'width': "100%",
      'textAlign': "left",
      'paddingLeft': "5%",
      'height': '40px',
      'borderColor': active ? '#482017' : hover ? '#482017' : '#E2E8F0',
      'boxShadow': 'none',
    }
  }, [hover, active])

  return (
    <NumberFormat
      onPointerOver={()=> setHover(true)}
      onPointerOut={() => setHover(false)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={(e: any)=> {
        setActive(true)
        e.currentTarget.setSelectionRange(
          e.currentTarget.value.length,
          e.currentTarget.value.length
        )
      }}
      onSelect={() => {
        setActive(true)
      }}
      onBlur={() => setActive(false)}
      onPointerDown={()=> setActive(false)}
      onPointerUp={() => setActive(true)}
      defaultValue={"0,00"}
      allowNegative={false}
      thousandSeparator={","}
      prefix={"R$ "}
      format={currencyFormatter}
      renderText={(value: any) => {
        return <Text>{value}</Text>;
      }}
      style={buttonStyle}
    /> 
  )
}