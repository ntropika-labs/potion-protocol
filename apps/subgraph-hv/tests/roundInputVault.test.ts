import {
  createNextRound,
  createDepositWithReceipt,
  createRedeemReceipt,
} from "./events";
import { mockVault, mockCurrentRound } from "./contractCalls";
import { assertEntity, mockHedgingVault, mockDepositRequest } from "./helpers";
import {
  handleNextRound,
  handleDepositWithReceipt,
  handleRedeemReceipt,
} from "../src/roundsInputVault";
import {
  test,
  describe,
  clearStore,
  afterAll,
  beforeAll,
  assert,
} from "matchstick-as/assembly/index";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { createDepositRequestId } from "../src/deposits";
import { createRoundId } from "../src/rounds";

const contractAddress = Address.fromString(
  "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
);

const vaultAddress = Address.fromString(
  "0x90cBa2Bbb19ecc291A12066Fd8329D65FA1f1947"
);

const actionAddress = Address.fromString(
  "0x0000000000000000000000000000000000000001"
);

const mockedRoundId = createRoundId(BigInt.fromString("1"), vaultAddress);
const mockedCaller = Address.fromString(
  "0x0000000000000000000000000000000000000001"
);
const mockedInvestor = Address.fromString(
  "0x0000000000000000000000000000000000000002"
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

  describe("DepositWithReceipt", () => {
    describe("new DepositRequest", () => {
      beforeAll(() => {
        mockCurrentRound(contractAddress, BigInt.fromString("1"));
        const mockedEvent = createDepositWithReceipt(
          mockedCaller,
          mockedInvestor,
          BigInt.fromString("5"),
          BigInt.fromString("10")
        );
        handleDepositWithReceipt(mockedEvent);
      });
      afterAll(clearStore);

      test("can handle event", () => {
        assert.entityCount("DepositRequest", 1);
        assert.entityCount("Investor", 1);
        assert.entityCount("Block", 1);
      });

      test("DepositRequest has been populated correctly", () => {
        assertEntity(
          "DepositRequest",
          createDepositRequestId(
            BigInt.fromString("5"),
            mockedInvestor
          ).toHexString(),
          [{ field: "amount", value: "10" }]
        );
      });
    });

    describe("DepositRequest already exists", () => {
      beforeAll(() => {
        mockDepositRequest(
          BigInt.fromString("2"),
          mockedRoundId,
          mockedInvestor,
          mockedCaller,
          BigInt.fromString("100"),
          BigInt.fromString("0"),
          BigInt.fromString("0"),
          contractAddress,
          contractAddress
        );
        mockCurrentRound(contractAddress, BigInt.fromString("1"));
        const mockedEvent = createDepositWithReceipt(
          mockedCaller,
          mockedInvestor,
          BigInt.fromString("2"),
          BigInt.fromString("10")
        );
        handleDepositWithReceipt(mockedEvent);
      });
      afterAll(clearStore);

      test("can handle event", () => {
        assert.entityCount("DepositRequest", 1);
        assert.entityCount("Investor", 1);
        assert.entityCount("Block", 1);
      });

      test("DepositRequest has been updated correctly", () => {
        assertEntity(
          "DepositRequest",
          createDepositRequestId(
            BigInt.fromString("2"),
            mockedInvestor
          ).toHexString(),
          [{ field: "amount", value: "110" }]
        );
      });
    });
  });

  describe("RedeemReceipt", () => {
    describe("RedeemReceipt has been called in a different round", () => {
      beforeAll(() => {
        mockDepositRequest(
          BigInt.fromString("2"),
          mockedRoundId,
          mockedInvestor,
          mockedCaller,
          BigInt.fromString("100"),
          BigInt.fromString("0"),
          BigInt.fromString("0"),
          contractAddress,
          contractAddress
        );
        mockCurrentRound(contractAddress, BigInt.fromString("5"));
        const mockedEvent = createRedeemReceipt(
          mockedCaller,
          mockedInvestor,
          mockedCaller,
          BigInt.fromString("2"),
          BigInt.fromString("10")
        );
        handleRedeemReceipt(mockedEvent);
      });
      afterAll(clearStore);

      test("can handle event", () => {
        assert.entityCount("DepositRequest", 1);
      });

      test("DepositRequest has been updated correctly", () => {
        assertEntity(
          "DepositRequest",
          createDepositRequestId(
            BigInt.fromString("2"),
            mockedInvestor
          ).toHexString(),
          [{ field: "amountRedeemed", value: "10" }]
        );
      });
    });

    describe("RedeemReceipt has been called in the same round", () => {
      beforeAll(() => {
        mockCurrentRound(contractAddress, BigInt.fromString("1"));
      });
      describe("user has requested a DepositRequest reduption", () => {
        beforeAll(() => {
          mockDepositRequest(
            BigInt.fromString("2"),
            mockedRoundId,
            mockedInvestor,
            mockedCaller,
            BigInt.fromString("100"),
            BigInt.fromString("0"),
            BigInt.fromString("0"),
            contractAddress,
            contractAddress
          );
          const mockedEvent = createRedeemReceipt(
            mockedCaller,
            mockedInvestor,
            mockedCaller,
            BigInt.fromString("2"),
            BigInt.fromString("40")
          );
          handleRedeemReceipt(mockedEvent);
        });
        afterAll(clearStore);

        test("can handle event", () => {
          assert.entityCount("DepositRequest", 1);
        });

        test("DepositRequest has been updated correctly", () => {
          assertEntity(
            "DepositRequest",
            createDepositRequestId(
              BigInt.fromString("2"),
              mockedInvestor
            ).toHexString(),
            [{ field: "amount", value: "60" }]
          );
        });
      });

      describe("user has requested a DepositRequest deletion", () => {
        beforeAll(() => {
          mockDepositRequest(
            BigInt.fromString("2"),
            mockedRoundId,
            mockedInvestor,
            mockedCaller,
            BigInt.fromString("100"),
            BigInt.fromString("0"),
            BigInt.fromString("0"),
            contractAddress,
            contractAddress
          );
          const mockedEvent = createRedeemReceipt(
            mockedCaller,
            mockedInvestor,
            mockedCaller,
            BigInt.fromString("2"),
            BigInt.fromString("100")
          );
          handleRedeemReceipt(mockedEvent);
        });
        afterAll(clearStore);

        test("can handle event", () => {
          assert.entityCount("DepositRequest", 0);
        });

        test("DepositRequest has been deleted", () => {
          assert.notInStore(
            "RedeemReceipt",
            createDepositRequestId(
              BigInt.fromString("2"),
              mockedInvestor
            ).toHexString()
          );
        });
      });
    });
  });
});
