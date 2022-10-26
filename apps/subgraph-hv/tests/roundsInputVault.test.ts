import {
  createNextRound,
  createDepositWithReceipt,
  createRedeemReceipt,
  createRedeemReceiptBatch,
} from "./events";
import { mockVault, mockCurrentRound } from "./contractCalls";
import {
  assertEntity,
  mockHedgingVault,
  mockDepositRequest,
  mockDepositRequests,
  DepositRequestParams,
} from "./helpers";
import {
  handleNextRound,
  handleDepositWithReceipt,
  handleRedeemReceipt,
  handleRedeemReceiptBatch,
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
const mockedRoundId_B = createRoundId(BigInt.fromString("5"), vaultAddress);
const mockedCaller = Address.fromString(
  "0x0000000000000000000000000000000000000001"
);
const mockedInvestor = Address.fromString(
  "0x0000000000000000000000000000000000000002"
);

const mockedRoundParams: DepositRequestParams = {
  depositId: BigInt.fromString("2"),
  amount: BigInt.fromString("100"),
  amountRedeemed: BigInt.fromString("0"),
  remainingShares: BigInt.fromString("0"),
};

const mockedRoundParamsArray: DepositRequestParams[] = [
  {
    depositId: BigInt.fromString("1"),
    amount: BigInt.fromString("10"),
    amountRedeemed: BigInt.fromString("0"),
    remainingShares: BigInt.fromString("0"),
  },
  {
    depositId: BigInt.fromString("2"),
    amount: BigInt.fromString("100"),
    amountRedeemed: BigInt.fromString("0"),
    remainingShares: BigInt.fromString("0"),
  },
  {
    depositId: BigInt.fromString("3"),
    amount: BigInt.fromString("500"),
    amountRedeemed: BigInt.fromString("0"),
    remainingShares: BigInt.fromString("0"),
  },
  {
    depositId: BigInt.fromString("4"),
    amount: BigInt.fromString("1000"),
    amountRedeemed: BigInt.fromString("0"),
    remainingShares: BigInt.fromString("0"),
  },
];

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
          mockedRoundId,
          mockedInvestor,
          mockedCaller,
          mockedRoundParams,
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
          mockedRoundId,
          mockedInvestor,
          mockedCaller,
          mockedRoundParams,
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
            mockedRoundId,
            mockedInvestor,
            mockedCaller,
            mockedRoundParams,
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
            mockedRoundId,
            mockedInvestor,
            mockedCaller,
            mockedRoundParams,
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
            "DepositRequest",
            createDepositRequestId(
              BigInt.fromString("2"),
              mockedInvestor
            ).toHexString()
          );
        });
      });
    });
  });

  describe("RedeemReceiptBatch", () => {
    describe("redeems are all in the same round", () => {
      describe("redeems are all in the round where DepositRequests have been created", () => {
        beforeAll(() => {
          mockCurrentRound(contractAddress, BigInt.fromString("1"));
        });
        describe("requests are all to reduce DepositRequests", () => {
          beforeAll(() => {
            mockDepositRequests(
              mockedRoundId,
              mockedInvestor,
              mockedCaller,
              mockedRoundParamsArray,
              contractAddress,
              contractAddress
            );
            const mockedEvent = createRedeemReceiptBatch(
              mockedCaller,
              mockedInvestor,
              mockedCaller,
              [BigInt.fromString("1"), BigInt.fromString("3")],
              [BigInt.fromString("5"), BigInt.fromString("50")]
            );
            handleRedeemReceiptBatch(mockedEvent);
          });
          afterAll(clearStore);

          test("can handle the event", () => {
            assert.entityCount("DepositRequest", 4);
          });

          test("DepositRequest 1 has been updated correctly", () => {
            assertEntity(
              "DepositRequest",
              createDepositRequestId(
                BigInt.fromString("1"),
                mockedInvestor
              ).toHexString(),
              [{ field: "amount", value: "5" }]
            );
          });

          test("DepositRequest 3 has been updated correctly", () => {
            assertEntity(
              "DepositRequest",
              createDepositRequestId(
                BigInt.fromString("3"),
                mockedInvestor
              ).toHexString(),
              [{ field: "amount", value: "450" }]
            );
          });
        });
        describe("requests are all to delete DepositRequests", () => {
          beforeAll(() => {
            mockDepositRequests(
              mockedRoundId,
              mockedInvestor,
              mockedCaller,
              mockedRoundParamsArray,
              contractAddress,
              contractAddress
            );
            const mockedEvent = createRedeemReceiptBatch(
              mockedCaller,
              mockedInvestor,
              mockedCaller,
              [BigInt.fromString("2"), BigInt.fromString("3")],
              [BigInt.fromString("100"), BigInt.fromString("500")]
            );
            handleRedeemReceiptBatch(mockedEvent);
          });
          afterAll(clearStore);

          test("can handle the event", () => {
            assert.entityCount("DepositRequest", 2);
          });

          test("DepositRequest 2 has been deleted", () => {
            assert.notInStore(
              "DepositRequest",
              createDepositRequestId(
                BigInt.fromString("2"),
                mockedInvestor
              ).toHexString()
            );
          });

          test("DepositRequest 3 has been deleted", () => {
            assert.notInStore(
              "DepositRequest",
              createDepositRequestId(
                BigInt.fromString("3"),
                mockedInvestor
              ).toHexString()
            );
          });
        });
        describe("requests are a mix between reduce and delete DepositRequests", () => {
          beforeAll(() => {
            mockDepositRequests(
              mockedRoundId,
              mockedInvestor,
              mockedCaller,
              mockedRoundParamsArray,
              contractAddress,
              contractAddress
            );
            const mockedEvent = createRedeemReceiptBatch(
              mockedCaller,
              mockedInvestor,
              mockedCaller,
              [
                BigInt.fromString("2"),
                BigInt.fromString("3"),
                BigInt.fromString("4"),
              ],
              [
                BigInt.fromString("100"),
                BigInt.fromString("500"),
                BigInt.fromString("500"),
              ]
            );
            handleRedeemReceiptBatch(mockedEvent);
          });
          afterAll(clearStore);

          test("can handle the event", () => {
            assert.entityCount("DepositRequest", 2);
          });

          test("DepositRequest 2 has been deleted", () => {
            assert.notInStore(
              "DepositRequest",
              createDepositRequestId(
                BigInt.fromString("2"),
                mockedInvestor
              ).toHexString()
            );
          });

          test("DepositRequest 3 has been deleted", () => {
            assert.notInStore(
              "DepositRequest",
              createDepositRequestId(
                BigInt.fromString("3"),
                mockedInvestor
              ).toHexString()
            );
          });

          test("DepositRequest 4 has been updated correctly", () => {
            assertEntity(
              "DepositRequest",
              createDepositRequestId(
                BigInt.fromString("4"),
                mockedInvestor
              ).toHexString(),
              [{ field: "amount", value: "500" }]
            );
          });
        });
      });

      describe("requests are all to redeem DepositRequests", () => {
        beforeAll(() => {
          mockCurrentRound(contractAddress, BigInt.fromString("5"));
          mockDepositRequests(
            mockedRoundId,
            mockedInvestor,
            mockedCaller,
            mockedRoundParamsArray,
            contractAddress,
            contractAddress
          );
          const mockedEvent = createRedeemReceiptBatch(
            mockedCaller,
            mockedInvestor,
            mockedCaller,
            [BigInt.fromString("1"), BigInt.fromString("3")],
            [BigInt.fromString("5"), BigInt.fromString("50")]
          );
          handleRedeemReceiptBatch(mockedEvent);
        });
        afterAll(clearStore);

        test("can handle the event", () => {
          assert.entityCount("DepositRequest", 4);
        });

        test("DepositRequest 1 has been updated correctly", () => {
          assertEntity(
            "DepositRequest",
            createDepositRequestId(
              BigInt.fromString("1"),
              mockedInvestor
            ).toHexString(),
            [{ field: "amountRedeemed", value: "5" }]
          );
        });

        test("DepositRequest 3 has been updated correctly", () => {
          assertEntity(
            "DepositRequest",
            createDepositRequestId(
              BigInt.fromString("3"),
              mockedInvestor
            ).toHexString(),
            [{ field: "amountRedeemed", value: "50" }]
          );
        });
      });
    });

    describe("redeems are in multiple rounds", () => {
      describe("requests are a mix between redeem and reduce DepositRequests", () => {
        beforeAll(() => {
          mockCurrentRound(contractAddress, BigInt.fromString("5"));
          mockDepositRequests(
            mockedRoundId,
            mockedInvestor,
            mockedCaller,
            mockedRoundParamsArray.slice(0, 2),
            contractAddress,
            contractAddress
          );
          mockDepositRequests(
            mockedRoundId_B,
            mockedInvestor,
            mockedCaller,
            mockedRoundParamsArray.slice(2, 4),
            contractAddress,
            contractAddress
          );
          const mockedEvent = createRedeemReceiptBatch(
            mockedCaller,
            mockedInvestor,
            mockedCaller,
            [BigInt.fromString("1"), BigInt.fromString("3")],
            [BigInt.fromString("5"), BigInt.fromString("50")]
          );
          handleRedeemReceiptBatch(mockedEvent);
        });
        afterAll(clearStore);

        test("can handle the event", () => {
          assert.entityCount("DepositRequest", 4);
        });

        test("DepositRequest 1 has been updated correctly", () => {
          assertEntity(
            "DepositRequest",
            createDepositRequestId(
              BigInt.fromString("1"),
              mockedInvestor
            ).toHexString(),
            [{ field: "amountRedeemed", value: "5" }]
          );
        });

        test("DepositRequest 3 has been updated correctly", () => {
          assertEntity(
            "DepositRequest",
            createDepositRequestId(
              BigInt.fromString("3"),
              mockedInvestor
            ).toHexString(),
            [{ field: "amount", value: "450" }]
          );
        });
      });
      describe("requests are a mix between redeem and delete DepositRequests", () => {
        beforeAll(() => {
          mockCurrentRound(contractAddress, BigInt.fromString("5"));
          mockDepositRequests(
            mockedRoundId,
            mockedInvestor,
            mockedCaller,
            mockedRoundParamsArray.slice(0, 2),
            contractAddress,
            contractAddress
          );
          mockDepositRequests(
            mockedRoundId_B,
            mockedInvestor,
            mockedCaller,
            mockedRoundParamsArray.slice(2, 4),
            contractAddress,
            contractAddress
          );
          const mockedEvent = createRedeemReceiptBatch(
            mockedCaller,
            mockedInvestor,
            mockedCaller,
            [BigInt.fromString("1"), BigInt.fromString("3")],
            [BigInt.fromString("10"), BigInt.fromString("500")]
          );
          handleRedeemReceiptBatch(mockedEvent);
        });
        afterAll(clearStore);

        test("can handle the event", () => {
          assert.entityCount("DepositRequest", 3);
        });

        test("DepositRequest 1 has been updated correctly", () => {
          assertEntity(
            "DepositRequest",
            createDepositRequestId(
              BigInt.fromString("1"),
              mockedInvestor
            ).toHexString(),
            [{ field: "amountRedeemed", value: "10" }]
          );
        });

        test("DepositRequest 3 has been deleted", () => {
          assert.notInStore(
            "DepositRequest",
            createDepositRequestId(
              BigInt.fromString("3"),
              mockedInvestor
            ).toHexString()
          );
        });
      });
    });
  });
});