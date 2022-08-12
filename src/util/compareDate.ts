// is dateA before or same as dateB?
export const compareDate = (dateA: string, dateB: string) => {
  const [diaA, mesA, anoA] = dateA.split("/");
  const [diaB, mesB, anoB] = dateB.split("/");

  if (anoA < anoB) return true;
  if (anoA > anoB) return false;

  if (mesA < mesB) return true;
  if (mesA > mesB) return false;

  if (diaA < diaB) return true;
  if (diaA > diaB) return false;

  return true;
};
