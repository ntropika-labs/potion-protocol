import dayjs from "dayjs";
import _isNil from "lodash.isnil";

import { createValidExpiry } from "./time";

const _exists = (x: number) => !_isNil(x);

export const offsetToDate = (blockTimestamp: number, offset: number) => {
  return _exists(offset)
    ? dayjs.unix(blockTimestamp).add(offset, "day").format("ll")
    : "Invalid Date";
};

export const dateToOffset = (blockTimestamp: number, offset: number) => {
  if (_exists(offset)) {
    const expiration = dayjs.unix(offset);
    const today = dayjs.unix(createValidExpiry(blockTimestamp, 0));
    const diff = expiration.diff(today, "day");
    return diff;
  }
  return "Invalid Date";
};
