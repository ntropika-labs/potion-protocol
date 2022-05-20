export const currencyFormatter = (value: number, currency: string) => {
  return Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: "USD",
  })
    .format(value)
    .replace("$", `${currency} `);
};
