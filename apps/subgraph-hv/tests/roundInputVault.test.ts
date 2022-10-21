import { createNextRound } from "./events";
import { mockVault } from "./contractCalls";
import { assertEntity, mockHedgingVault } from "./helpers";
import { handleNextRound } from "../src/roundsInputVault";
import {
  test,
  describe,
  clearStore,
  afterAll,
  beforeAll,
  assert,
} from "matchstick-as/assembly/index";
import { Address, BigInt } from "@graphprotocol/graph-ts";

const contractAddress = Address.fromString(
  "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
);

const vaultAddress = Address.fromString(
  "0x90cBa2Bbb19ecc291A12066Fd8329D65FA1f1947"
);

const actionAddress = Address.fromString(
  "0x0000000000000000000000000000000000000001"
);

describe("roundsInputVault", () => {
  beforeAll(() => {
    mockVault(contractAddress, vaultAddress);
  });
  describe("NextRound", () => {
    beforeAll(() => {
      mockHedgingVault(
        vaultAddress,
        vaultAddress,
        actionAddress,
        BigInt.fromString("30"),
        BigInt.fromString("0")
      );
      const mockedEvent = createNextRound(BigInt.fromString("1"));
      handleNextRound(mockedEvent);
    });

    afterAll(clearStore);

    test("can handle event", () => {
      assert.entityCount("Round", 1);
    });

    test("HedgingVault has been updated correctly", () => {
      assertEntity("HedgingVault", vaultAddress.toHexString(), [
        { field: "currentRound", value: "1" },
      ]);
    });
  });
});
