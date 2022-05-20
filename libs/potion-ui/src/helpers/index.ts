export const currencyFormatter = (value: number, currency: string) => {
  return Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: "USD",
    compactDisplay: "short",
    notation: "compact",
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace("$", `${currency} `);
};
