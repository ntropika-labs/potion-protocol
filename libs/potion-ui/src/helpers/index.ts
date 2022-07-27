import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(duration);

const locale = navigator.language ?? "en-US";

const shortNumberFormatter = new Intl.NumberFormat(locale, {
  notation: "compact",
  compactDisplay: "short",
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
});

const usdFormatter = new Intl.NumberFormat(locale, {
  style: "currency",
  currency: "USD",
  compactDisplay: "short",
  notation: "compact",
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

export const currencyFormatter = (value: number, currency: string) => {
  console.log(value);
  return usdFormatter.format(value).replace("$", `${currency} `);
};
export const shortCurrencyFormatter = (value: number, currency: string) =>
  value === 0 ? "0" : currencyFormatter(value, currency);
export const shortDigitFormatter = (value: number): string =>
  value === 0 ? "0" : shortNumberFormatter.format(value);
export const dateFormatter = (value: string, isTimestamp: boolean) => {
  if (isTimestamp) {
    return dayjs.unix(parseInt(value)).format("ll");
  }
  return dayjs(value).format("ll");
};

export const getEnsOrAddress = (value: string) => {
  if (value.length === 42 && value.startsWith("0x")) {
    return `${value.substring(0, 6)}...${value.substring(value.length - 4)}`;
  }
  return value;
};

// PnL formatting
type PnlTrend = "up" | "down" | "flat";
const trendToColorMap: Map<PnlTrend, string> = new Map([
  ["up", "text-accent-400"],
  ["down", "text-error-400"],
  ["flat", ""],
]);

const trendToSymbolMap: Map<PnlTrend, string> = new Map([
  ["up", "+"],
  ["down", "-"],
  ["flat", ""],
]);

export const getPnlTrend = (pnl: number) => {
  if (pnl > 0) {
    return "up";
  } else if (pnl < 0) {
    return "down";
  }
  return "flat";
};

export const getPnlColor = (pnl: number) =>
  trendToColorMap.get(getPnlTrend(pnl));

export const pnlFormatter = (pnl: number) => {
  const symbol = trendToSymbolMap.get(getPnlTrend(pnl));
  return `${symbol} ${pnl.toFixed(2)}%`;
};

export const getTimeDifference = (
  startTimestamp: dayjs.Dayjs,
  endTimestamp: dayjs.Dayjs,
  asDuration = true,
  humanReadable = true
) => {
  let diff: number | duration.Duration | string =
    startTimestamp.diff(endTimestamp);
  if (asDuration) {
    diff = dayjs.duration(diff);

    if (humanReadable) {
      diff = diff.humanize();
    }
  }

  return diff;
};
