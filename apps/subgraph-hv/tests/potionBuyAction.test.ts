import { createMaxPremiumPercentageChanged } from "./events";
import { assertEntity } from "./helpers";
import {
  mockNextCycleStartTimestamp,
  mockSwapSlippage,
  mockPremiumSlippage,
  mockMaxPremiumPercentage,
  mockMaxSwapDurationSecs,
  mockStrikePercentage,
  mockCycleDurationSecs,
} from "./contractCalls";
import {
  describe,
  test,
  assert,
  beforeAll,
  afterAll,
  clearStore,
} from "matchstick-as";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { handleMaxPremiumPercentageChanged } from "../src/potionBuyAction";

const contractAddress = Address.fromString(
  "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
);

describe("PotionBuyAction", () => {
  describe("MaxPremiumPercentageChanged", () => {
    beforeAll(() => {
      mockCycleDurationSecs(contractAddress, BigInt.fromString("45"));
      mockMaxPremiumPercentage(contractAddress, BigInt.fromString("15"));
      mockMaxSwapDurationSecs(contractAddress, BigInt.fromString("30"));
      mockNextCycleStartTimestamp(contractAddress, BigInt.fromString("5"));
      mockPremiumSlippage(contractAddress, BigInt.fromString("12"));
      mockStrikePercentage(contractAddress, BigInt.fromString("50"));
      mockSwapSlippage(contractAddress, BigInt.fromString("11"));
      const mockedEvent = createMaxPremiumPercentageChanged(
        BigInt.fromString("10")
      );
      handleMaxPremiumPercentageChanged(mockedEvent);
    });

    afterAll(clearStore);

    test("can handle the event", () => {
      assert.entityCount("PotionBuyAction", 1);
    });

    test("PotionBuyAction has been populated correctly", () => {
      assertEntity("PotionBuyAction", contractAddress.toHexString(), [
        { field: "cycleDurationSecs", value: "45" },
        { field: "maxPremiumPercentage", value: "10" },
        { field: "maxSwapDurationSecs", value: "30" },
        { field: "nextCycleStartTimestamp", value: "5" },
        { field: "premiumSlippage", value: "12" },
        { field: "strikePercentage", value: "50" },
        { field: "swapSlippage", value: "11" },
      ]);
    });
  });
});
