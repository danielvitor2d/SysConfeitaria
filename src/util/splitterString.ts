export const spliter = (str: string, nr: number) => {
  const parts = [];
  for (let i = 0, length = str.length; i < length; i += nr) {
    parts.push(str.substring(i, i + nr));
  }
  return parts;
};
