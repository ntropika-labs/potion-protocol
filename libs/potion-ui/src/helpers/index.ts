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

export const getEnsOrAddress = (value: string) => {
  if (value.length === 42 && value.startsWith("0x")) {
    return value.substring(0, 6) + "..." + value.substring(value.length - 4);
  }
  return value;
};
