import dayjs from "dayjs";

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

export const shortDigitFormatter = (value: number): string => {
  const numberFormatter = new Intl.NumberFormat(navigator.language, {
    notation: "compact",
    compactDisplay: "short",
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  });

  return value === 0 ? value.toString() : numberFormatter.format(value);
};

export const dateFormatter = (value: string, isTimestamp: boolean) => {
  if (isTimestamp) {
    return dayjs.unix(parseInt(value)).format("ll");
  } else {
    return dayjs(value).format("ll");
  }
};
