import {
  createCycleDurationChanged,
  createMaxPremiumPercentageChanged,
  createMaxSwapDurationChanged,
  createPremiumSlippageChanged,
  createStrikePercentageChanged,
  createSwapSlippageChanged,
} from "./events";
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
import {
  handleCycleDurationChanged,
  handleMaxPremiumPercentageChanged,
  handleMaxSwapDurationChanged,
  handlePremiumSlippageChanged,
  handleStrikePercentageChanged,
  handleSwapSlippageChanged,
} from "../src/potionBuyAction";

const contractAddress = Address.fromString(
  "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
);

function mockPotionBuyAction(): void {
  mockCycleDurationSecs(contractAddress, BigInt.fromString("45"));
  mockMaxPremiumPercentage(contractAddress, BigInt.fromString("15"));
  mockMaxSwapDurationSecs(contractAddress, BigInt.fromString("30"));
  mockNextCycleStartTimestamp(contractAddress, BigInt.fromString("5"));
  mockPremiumSlippage(contractAddress, BigInt.fromString("12"));
  mockStrikePercentage(contractAddress, BigInt.fromString("50"));
  mockSwapSlippage(contractAddress, BigInt.fromString("11"));
}

describe("PotionBuyAction", () => {
  describe("CycleDurationChanged", () => {
    beforeAll(() => {
      mockPotionBuyAction();
      const mockedEvent = createCycleDurationChanged(BigInt.fromString("10"));
      handleCycleDurationChanged(mockedEvent);
    });

    afterAll(clearStore);

    test("can handle the event", () => {
      assert.entityCount("PotionBuyAction", 1);
    });

    test("PotionBuyAction has been populated correctly", () => {
      assertEntity("PotionBuyAction", contractAddress.toHexString(), [
        { field: "cycleDurationSecs", value: "10" },
        { field: "maxPremiumPercentage", value: "15" },
        { field: "maxSwapDurationSecs", value: "30" },
        { field: "nextCycleStartTimestamp", value: "5" },
        { field: "premiumSlippage", value: "12" },
        { field: "strikePercentage", value: "50" },
        { field: "swapSlippage", value: "11" },
      ]);
    });
  });

  describe("MaxPremiumPercentageChanged", () => {
    beforeAll(() => {
      mockPotionBuyAction();
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

  describe("MaxSwapDurationChanged", () => {
    beforeAll(() => {
      mockPotionBuyAction();
      const mockedEvent = createMaxSwapDurationChanged(BigInt.fromString("10"));
      handleMaxSwapDurationChanged(mockedEvent);
    });

    afterAll(clearStore);

    test("can handle the event", () => {
      assert.entityCount("PotionBuyAction", 1);
    });

    test("PotionBuyAction has been populated correctly", () => {
      assertEntity("PotionBuyAction", contractAddress.toHexString(), [
        { field: "cycleDurationSecs", value: "45" },
        { field: "maxPremiumPercentage", value: "15" },
        { field: "maxSwapDurationSecs", value: "10" },
        { field: "nextCycleStartTimestamp", value: "5" },
        { field: "premiumSlippage", value: "12" },
        { field: "strikePercentage", value: "50" },
        { field: "swapSlippage", value: "11" },
      ]);
    });
  });

  describe("PremiumSlippageChanged", () => {
    beforeAll(() => {
      mockPotionBuyAction();
      const mockedEvent = createPremiumSlippageChanged(BigInt.fromString("10"));
      handlePremiumSlippageChanged(mockedEvent);
    });

    afterAll(clearStore);

    test("can handle the event", () => {
      assert.entityCount("PotionBuyAction", 1);
    });

    test("PotionBuyAction has been populated correctly", () => {
      assertEntity("PotionBuyAction", contractAddress.toHexString(), [
        { field: "cycleDurationSecs", value: "45" },
        { field: "maxPremiumPercentage", value: "15" },
        { field: "maxSwapDurationSecs", value: "30" },
        { field: "nextCycleStartTimestamp", value: "5" },
        { field: "premiumSlippage", value: "10" },
        { field: "strikePercentage", value: "50" },
        { field: "swapSlippage", value: "11" },
      ]);
    });
  });

  describe("StrikePercentageChanged", () => {
    beforeAll(() => {
      mockPotionBuyAction();
      const mockedEvent = createStrikePercentageChanged(
        BigInt.fromString("10")
      );
      handleStrikePercentageChanged(mockedEvent);
    });

    afterAll(clearStore);

    test("can handle the event", () => {
      assert.entityCount("PotionBuyAction", 1);
    });

    test("PotionBuyAction has been populated correctly", () => {
      assertEntity("PotionBuyAction", contractAddress.toHexString(), [
        { field: "cycleDurationSecs", value: "45" },
        { field: "maxPremiumPercentage", value: "15" },
        { field: "maxSwapDurationSecs", value: "30" },
        { field: "nextCycleStartTimestamp", value: "5" },
        { field: "premiumSlippage", value: "12" },
        { field: "strikePercentage", value: "10" },
        { field: "swapSlippage", value: "11" },
      ]);
    });
  });

  describe("SwapSlippageChanged", () => {
    beforeAll(() => {
      mockPotionBuyAction();
      const mockedEvent = createSwapSlippageChanged(BigInt.fromString("10"));
      handleSwapSlippageChanged(mockedEvent);
    });

    afterAll(clearStore);

    test("can handle the event", () => {
      assert.entityCount("PotionBuyAction", 1);
    });

    test("PotionBuyAction has been populated correctly", () => {
      assertEntity("PotionBuyAction", contractAddress.toHexString(), [
        { field: "cycleDurationSecs", value: "45" },
        { field: "maxPremiumPercentage", value: "15" },
        { field: "maxSwapDurationSecs", value: "30" },
        { field: "nextCycleStartTimestamp", value: "5" },
        { field: "premiumSlippage", value: "12" },
        { field: "strikePercentage", value: "50" },
        { field: "swapSlippage", value: "10" },
      ]);
    });
  });
});
