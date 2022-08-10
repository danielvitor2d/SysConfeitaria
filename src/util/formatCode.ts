export const formatCode = (value: number): string => {
  let stringValue = String(value)
  while (stringValue.length < 6) 
    stringValue = "0" + stringValue
  return stringValue
}