import { test, describe, assert } from "matchstick-as/assembly/index";
import { BigInt } from "@graphprotocol/graph-ts";
import { BigIntPow } from "../src/helpers";

describe("helpers methods", () => {
  describe("BigIntPow", () => {
    test("it works with BigInt.fromString", () => {
      const result = BigIntPow(BigInt.fromString("10"), BigInt.fromString("6"));
      assert.bigIntEquals(result, BigInt.fromString("10").pow(6));
    });

    test("it works with BigInt.fromI32", () => {
      const result = BigIntPow(BigInt.fromI32(10), BigInt.fromI32(18));
      assert.bigIntEquals(result, BigInt.fromI32(10).pow(18));
    });

    test("it returns Number.MAX_SAFE_INTEGER if exp isn't u8 like", () => {
      const MAX_SAFE_INTEGER = (Number.MAX_SAFE_INTEGER as u64).toString();
      const result = BigIntPow(BigInt.fromI32(10), BigInt.fromI32(256));
      assert.stringEquals(result.toString(), MAX_SAFE_INTEGER);
    });
  });
});
