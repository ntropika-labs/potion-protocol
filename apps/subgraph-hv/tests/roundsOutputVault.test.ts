import {
  createOutputNextRound,
  createOutputDepositWithReceipt,
  createOutputRedeemReceipt,
  createOutputRedeemReceiptBatch,
  createOutputWithdrawExchangeAsset,
  createOutputWithdrawExchangeAssetBatch,
} from "./events";
import { mockVault, mockCurrentRound } from "./contractCalls";
import {
  assertEntity,
  mockHedgingVault,
  mockWithdrawalRequest,
  mockWithdrawalRequests,
  WithdrawalRequestParams,
  mockRound,
  arrayToString,
} from "./helpers";
import {
  handleNextRound,
  handleDepositWithReceipt,
  handleRedeemReceipt,
  handleRedeemReceiptBatch,
  handleWithdrawExchangeAsset,
  handleWithdrawExchangeAssetBatch,
} from "../src/roundsOutputVault";
import {
  test,
  describe,
  clearStore,
  afterAll,
  beforeAll,
  assert,
} from "matchstick-as/assembly/index";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { createWithdrawalRequestId } from "../src/withdrawals";
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

const mockedWithdrawalParams: WithdrawalRequestParams = {
  depositId: BigInt.fromString("2"),
  amount: BigInt.fromString("100"),
  amountRedeemed: BigInt.fromString("0"),
  assets: BigInt.fromString("50"),
  remainingAssets: BigInt.fromString("0"),
};

const mockedWithdrawalParamsArray: WithdrawalRequestParams[] = [
  {
    depositId: BigInt.fromString("1"),
    amount: BigInt.fromString("10"),
    amountRedeemed: BigInt.fromString("0"),
    assets: BigInt.fromString("5"),
    remainingAssets: BigInt.fromString("0"),
  },
  {
    depositId: BigInt.fromString("2"),
    amount: BigInt.fromString("100"),
    amountRedeemed: BigInt.fromString("0"),
    assets: BigInt.fromString("50"),
    remainingAssets: BigInt.fromString("0"),
  },
  {
    depositId: BigInt.fromString("3"),
    amount: BigInt.fromString("500"),
    amountRedeemed: BigInt.fromString("0"),
    assets: BigInt.fromString("250"),
    remainingAssets: BigInt.fromString("0"),
  },
  {
    depositId: BigInt.fromString("4"),
    amount: BigInt.fromString("1000"),
    amountRedeemed: BigInt.fromString("0"),
    assets: BigInt.fromString("500"),
    remainingAssets: BigInt.fromString("0"),
  },
];

describe("roundsOutputVault", () => {
  beforeAll(() => {
    mockVault(contractAddress, vaultAddress);
  });

  describe("NextRound", () => {
    beforeAll(() => {
      mockWithdrawalRequests(
        mockedRoundId,
        vaultAddress,
        mockedInvestor,
        mockedCaller,
        mockedWithdrawalParamsArray,
        contractAddress,
        contractAddress
      );
      mockRound(
        BigInt.fromString("1"),
        vaultAddress,
        [],
        [
          createWithdrawalRequestId(
            BigInt.fromString("1"),
            vaultAddress,
            mockedInvestor
          ),
          createWithdrawalRequestId(
            BigInt.fromString("2"),
            vaultAddress,
            mockedInvestor
          ),
          createWithdrawalRequestId(
            BigInt.fromString("3"),
            vaultAddress,
            mockedInvestor
          ),
          createWithdrawalRequestId(
            BigInt.fromString("4"),
            vaultAddress,
            mockedInvestor
          ),
        ],
        BigInt.fromString("5")
      );
      mockHedgingVault(
        vaultAddress,
        vaultAddress,
        actionAddress,
        BigInt.fromString("30"),
        BigInt.fromString("0")
      );
      const mockedEvent = createOutputNextRound(
        BigInt.fromString("2"),
        BigInt.fromString("10")
      );
      handleNextRound(mockedEvent);
    });

    afterAll(clearStore);

    test("can handle event", () => {
      assert.entityCount("Round", 2);
      assert.entityCount("WithdrawalRequest", 4);
    });

    test("HedgingVault has been updated correctly", () => {
      assertEntity("HedgingVault", vaultAddress.toHexString(), [
        { field: "currentRound", value: "2" },
        { field: "lastShareToAssetRate", value: "10" },
      ]);
    });

    test("Round 1 has been updated correctly", () => {
      assertEntity(
        "Round",
        createRoundId(BigInt.fromString("1"), vaultAddress).toHexString(),
        [{ field: "shareToAssetRate", value: "10" }]
      );
    });

    test("WithdrawalRequest 1 assets has been updated correctly", () => {
      assertEntity(
        "WithdrawalRequest",
        createWithdrawalRequestId(
          BigInt.fromString("1"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "assets", value: "100" },
          { field: "remainingAssets", value: "100" },
        ]
      );
    });

    test("WithdrawalRequest 2 assets has been updated correctly", () => {
      assertEntity(
        "WithdrawalRequest",
        createWithdrawalRequestId(
          BigInt.fromString("2"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "assets", value: "1000" },
          { field: "remainingAssets", value: "1000" },
        ]
      );
    });

    test("WithdrawalRequest 3 assets has been updated correctly", () => {
      assertEntity(
        "WithdrawalRequest",
        createWithdrawalRequestId(
          BigInt.fromString("3"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "assets", value: "5000" },
          { field: "remainingAssets", value: "5000" },
        ]
      );
    });

    test("WithdrawalRequest 4 assets has been updated correctly", () => {
      assertEntity(
        "WithdrawalRequest",
        createWithdrawalRequestId(
          BigInt.fromString("4"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "assets", value: "10000" },
          { field: "remainingAssets", value: "10000" },
        ]
      );
    });
  });

  describe("DepositWithReceipt", () => {
    describe("new WithdrawalRequest", () => {
      beforeAll(() => {
        mockRound(BigInt.fromString("1"), vaultAddress);
        mockCurrentRound(contractAddress, BigInt.fromString("1"));
        const mockedEvent = createOutputDepositWithReceipt(
          mockedCaller,
          mockedInvestor,
          BigInt.fromString("5"),
          BigInt.fromString("10")
        );
        handleDepositWithReceipt(mockedEvent);
      });
      afterAll(clearStore);

      test("can handle event", () => {
        assert.entityCount("WithdrawalRequest", 1);
        assert.entityCount("Investor", 1);
        assert.entityCount("Block", 1);
        assert.entityCount("Round", 1);
      });

      test("WithdrawalRequest has been populated correctly", () => {
        assertEntity(
          "WithdrawalRequest",
          createWithdrawalRequestId(
            BigInt.fromString("5"),
            vaultAddress,
            mockedInvestor
          ).toHexString(),
          [{ field: "amount", value: "10" }]
        );
      });

      test("WithdrawalRequest has been added to the Round", () => {
        const ids = [
          createWithdrawalRequestId(
            BigInt.fromString("5"),
            vaultAddress,
            mockedInvestor
          ).toHexString(),
        ];
        assertEntity("Round", mockedRoundId.toHexString(), [
          { field: "withdrawalRequests", value: arrayToString(ids) },
        ]);
      });
    });

    describe("WithdrawalRequest already exists", () => {
      beforeAll(() => {
        mockWithdrawalRequest(
          mockedRoundId,
          vaultAddress,
          mockedInvestor,
          mockedCaller,
          mockedWithdrawalParams,
          contractAddress,
          contractAddress
        );
        mockCurrentRound(contractAddress, BigInt.fromString("1"));
        const mockedEvent = createOutputDepositWithReceipt(
          mockedCaller,
          mockedInvestor,
          BigInt.fromString("2"),
          BigInt.fromString("10")
        );
        handleDepositWithReceipt(mockedEvent);
      });
      afterAll(clearStore);

      test("can handle event", () => {
        assert.entityCount("WithdrawalRequest", 1);
        assert.entityCount("Investor", 1);
        assert.entityCount("Block", 1);
      });

      test("WithdrawalRequest has been updated correctly", () => {
        assertEntity(
          "WithdrawalRequest",
          createWithdrawalRequestId(
            BigInt.fromString("2"),
            vaultAddress,
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
        mockWithdrawalRequest(
          mockedRoundId,
          vaultAddress,
          mockedInvestor,
          mockedCaller,
          mockedWithdrawalParams,
          contractAddress,
          contractAddress
        );
        mockCurrentRound(contractAddress, BigInt.fromString("5"));
        const mockedEvent = createOutputRedeemReceipt(
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
        assert.entityCount("WithdrawalRequest", 1);
      });

      test("WithdrawalRequest has been updated correctly", () => {
        assertEntity(
          "WithdrawalRequest",
          createWithdrawalRequestId(
            BigInt.fromString("2"),
            vaultAddress,
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
      describe("user has requested a WithdrawalRequest reduption", () => {
        beforeAll(() => {
          mockWithdrawalRequest(
            mockedRoundId,
            vaultAddress,
            mockedInvestor,
            mockedCaller,
            mockedWithdrawalParams,
            contractAddress,
            contractAddress
          );
          const mockedEvent = createOutputRedeemReceipt(
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
          assert.entityCount("WithdrawalRequest", 1);
        });

        test("WithdrawalRequest has been updated correctly", () => {
          assertEntity(
            "WithdrawalRequest",
            createWithdrawalRequestId(
              BigInt.fromString("2"),
              vaultAddress,
              mockedInvestor
            ).toHexString(),
            [{ field: "amount", value: "60" }]
          );
        });
      });

      describe("user has requested a WithdrawalRequest deletion", () => {
        beforeAll(() => {
          mockRound(
            BigInt.fromString("1"),
            vaultAddress,
            [],
            [
              createWithdrawalRequestId(
                BigInt.fromString("2"),
                vaultAddress,
                mockedInvestor
              ),
            ]
          );
          mockWithdrawalRequest(
            mockedRoundId,
            vaultAddress,
            mockedInvestor,
            mockedCaller,
            mockedWithdrawalParams,
            contractAddress,
            contractAddress
          );
          const mockedEvent = createOutputRedeemReceipt(
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
          assert.entityCount("WithdrawalRequest", 0);
          assert.entityCount("Round", 1);
        });

        test("WithdrawalRequest has been deleted", () => {
          assert.notInStore(
            "WithdrawalRequest",
            createWithdrawalRequestId(
              BigInt.fromString("2"),
              vaultAddress,
              mockedInvestor
            ).toHexString()
          );
        });

        test("WithdrawalRequest has been removed from the Round", () => {
          assertEntity("Round", mockedRoundId.toHexString(), [
            { field: "withdrawalRequests", value: "[]" },
          ]);
        });
      });
    });
  });

  describe("RedeemReceiptBatch", () => {
    describe("redeems are all in the same round", () => {
      describe("redeems are all in the round where WithdrawalRequests have been created", () => {
        beforeAll(() => {
          mockCurrentRound(contractAddress, BigInt.fromString("1"));
        });
        describe("requests are all to reduce WithdrawalRequests", () => {
          beforeAll(() => {
            mockWithdrawalRequests(
              mockedRoundId,
              vaultAddress,
              mockedInvestor,
              mockedCaller,
              mockedWithdrawalParamsArray,
              contractAddress,
              contractAddress
            );
            const mockedEvent = createOutputRedeemReceiptBatch(
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
            assert.entityCount("WithdrawalRequest", 4);
          });

          test("WithdrawalRequest 1 has been updated correctly", () => {
            assertEntity(
              "WithdrawalRequest",
              createWithdrawalRequestId(
                BigInt.fromString("1"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
              [{ field: "amount", value: "5" }]
            );
          });

          test("WithdrawalRequest 3 has been updated correctly", () => {
            assertEntity(
              "WithdrawalRequest",
              createWithdrawalRequestId(
                BigInt.fromString("3"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
              [{ field: "amount", value: "450" }]
            );
          });
        });
        describe("requests are all to delete WithdrawalRequests", () => {
          beforeAll(() => {
            mockRound(
              BigInt.fromString("1"),
              vaultAddress,
              [],
              [
                createWithdrawalRequestId(
                  BigInt.fromString("1"),
                  vaultAddress,
                  mockedInvestor
                ),
                createWithdrawalRequestId(
                  BigInt.fromString("2"),
                  vaultAddress,
                  mockedInvestor
                ),
                createWithdrawalRequestId(
                  BigInt.fromString("3"),
                  vaultAddress,
                  mockedInvestor
                ),
                createWithdrawalRequestId(
                  BigInt.fromString("4"),
                  vaultAddress,
                  mockedInvestor
                ),
              ]
            );
            mockWithdrawalRequests(
              mockedRoundId,
              vaultAddress,
              mockedInvestor,
              mockedCaller,
              mockedWithdrawalParamsArray,
              contractAddress,
              contractAddress
            );
            const mockedEvent = createOutputRedeemReceiptBatch(
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
            assert.entityCount("WithdrawalRequest", 2);
            assert.entityCount("Round", 1);
          });

          test("WithdrawalRequest 2 has been deleted", () => {
            assert.notInStore(
              "WithdrawalRequest",
              createWithdrawalRequestId(
                BigInt.fromString("2"),
                vaultAddress,
                mockedInvestor
              ).toHexString()
            );
          });

          test("WithdrawalRequest 3 has been deleted", () => {
            assert.notInStore(
              "WithdrawalRequest",
              createWithdrawalRequestId(
                BigInt.fromString("3"),
                vaultAddress,
                mockedInvestor
              ).toHexString()
            );
          });

          test("WithdrawalRequest 2 and 3 have been removed from the Round", () => {
            const ids = [
              createWithdrawalRequestId(
                BigInt.fromString("1"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
              createWithdrawalRequestId(
                BigInt.fromString("4"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
            ];
            assertEntity("Round", mockedRoundId.toHexString(), [
              { field: "withdrawalRequests", value: arrayToString(ids) },
            ]);
          });
        });
        describe("requests are a mix between reduce and delete WithdrawalRequests", () => {
          beforeAll(() => {
            mockRound(
              BigInt.fromString("1"),
              vaultAddress,
              [],
              [
                createWithdrawalRequestId(
                  BigInt.fromString("1"),
                  vaultAddress,
                  mockedInvestor
                ),
                createWithdrawalRequestId(
                  BigInt.fromString("2"),
                  vaultAddress,
                  mockedInvestor
                ),
                createWithdrawalRequestId(
                  BigInt.fromString("3"),
                  vaultAddress,
                  mockedInvestor
                ),
                createWithdrawalRequestId(
                  BigInt.fromString("4"),
                  vaultAddress,
                  mockedInvestor
                ),
              ]
            );
            mockWithdrawalRequests(
              mockedRoundId,
              vaultAddress,
              mockedInvestor,
              mockedCaller,
              mockedWithdrawalParamsArray,
              contractAddress,
              contractAddress
            );
            const mockedEvent = createOutputRedeemReceiptBatch(
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
            assert.entityCount("WithdrawalRequest", 2);
            assert.entityCount("Round", 1);
          });

          test("WithdrawalRequest 2 has been deleted", () => {
            assert.notInStore(
              "WithdrawalRequest",
              createWithdrawalRequestId(
                BigInt.fromString("2"),
                vaultAddress,
                mockedInvestor
              ).toHexString()
            );
          });

          test("WithdrawalRequest 3 has been deleted", () => {
            assert.notInStore(
              "WithdrawalRequest",
              createWithdrawalRequestId(
                BigInt.fromString("3"),
                vaultAddress,
                mockedInvestor
              ).toHexString()
            );
          });

          test("WithdrawalRequest 4 has been updated correctly", () => {
            assertEntity(
              "WithdrawalRequest",
              createWithdrawalRequestId(
                BigInt.fromString("4"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
              [{ field: "amount", value: "500" }]
            );
          });

          test("WithdrawalRequest 2 and 3 have been removed from the Round", () => {
            const ids = [
              createWithdrawalRequestId(
                BigInt.fromString("1"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
              createWithdrawalRequestId(
                BigInt.fromString("4"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
            ];
            assertEntity("Round", mockedRoundId.toHexString(), [
              { field: "withdrawalRequests", value: arrayToString(ids) },
            ]);
          });
        });
      });

      describe("requests are all to redeem WithdrawalRequests", () => {
        beforeAll(() => {
          mockCurrentRound(contractAddress, BigInt.fromString("5"));
          mockWithdrawalRequests(
            mockedRoundId,
            vaultAddress,
            mockedInvestor,
            mockedCaller,
            mockedWithdrawalParamsArray,
            contractAddress,
            contractAddress
          );
          const mockedEvent = createOutputRedeemReceiptBatch(
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
          assert.entityCount("WithdrawalRequest", 4);
        });

        test("WithdrawalRequest 1 has been updated correctly", () => {
          assertEntity(
            "WithdrawalRequest",
            createWithdrawalRequestId(
              BigInt.fromString("1"),
              vaultAddress,
              mockedInvestor
            ).toHexString(),
            [{ field: "amountRedeemed", value: "5" }]
          );
        });

        test("WithdrawalRequest 3 has been updated correctly", () => {
          assertEntity(
            "WithdrawalRequest",
            createWithdrawalRequestId(
              BigInt.fromString("3"),
              vaultAddress,
              mockedInvestor
            ).toHexString(),
            [{ field: "amountRedeemed", value: "50" }]
          );
        });
      });
    });

    describe("redeems are in multiple rounds", () => {
      describe("requests are a mix between redeem and reduce WithdrawalRequests", () => {
        beforeAll(() => {
          mockCurrentRound(contractAddress, BigInt.fromString("5"));
          mockWithdrawalRequests(
            mockedRoundId,
            vaultAddress,
            mockedInvestor,
            mockedCaller,
            mockedWithdrawalParamsArray.slice(0, 2),
            contractAddress,
            contractAddress
          );
          mockWithdrawalRequests(
            mockedRoundId_B,
            vaultAddress,
            mockedInvestor,
            mockedCaller,
            mockedWithdrawalParamsArray.slice(2, 4),
            contractAddress,
            contractAddress
          );
          const mockedEvent = createOutputRedeemReceiptBatch(
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
          assert.entityCount("WithdrawalRequest", 4);
        });

        test("WithdrawalRequest 1 has been updated correctly", () => {
          assertEntity(
            "WithdrawalRequest",
            createWithdrawalRequestId(
              BigInt.fromString("1"),
              vaultAddress,
              mockedInvestor
            ).toHexString(),
            [{ field: "amountRedeemed", value: "5" }]
          );
        });

        test("WithdrawalRequest 3 has been updated correctly", () => {
          assertEntity(
            "WithdrawalRequest",
            createWithdrawalRequestId(
              BigInt.fromString("3"),
              vaultAddress,
              mockedInvestor
            ).toHexString(),
            [{ field: "amount", value: "450" }]
          );
        });
      });
      describe("requests are a mix between redeem and delete WithdrawalRequests", () => {
        beforeAll(() => {
          mockRound(
            BigInt.fromString("1"),
            vaultAddress,
            [],
            [
              createWithdrawalRequestId(
                BigInt.fromString("1"),
                vaultAddress,
                mockedInvestor
              ),
              createWithdrawalRequestId(
                BigInt.fromString("2"),
                vaultAddress,
                mockedInvestor
              ),
            ]
          );
          mockRound(
            BigInt.fromString("5"),
            vaultAddress,
            [],
            [
              createWithdrawalRequestId(
                BigInt.fromString("3"),
                vaultAddress,
                mockedInvestor
              ),
              createWithdrawalRequestId(
                BigInt.fromString("4"),
                vaultAddress,
                mockedInvestor
              ),
            ]
          );
          mockCurrentRound(contractAddress, BigInt.fromString("5"));
          mockWithdrawalRequests(
            mockedRoundId,
            vaultAddress,
            mockedInvestor,
            mockedCaller,
            mockedWithdrawalParamsArray.slice(0, 2),
            contractAddress,
            contractAddress
          );
          mockWithdrawalRequests(
            mockedRoundId_B,
            vaultAddress,
            mockedInvestor,
            mockedCaller,
            mockedWithdrawalParamsArray.slice(2, 4),
            contractAddress,
            contractAddress
          );
          const mockedEvent = createOutputRedeemReceiptBatch(
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
          assert.entityCount("WithdrawalRequest", 3);
          assert.entityCount("Round", 2);
        });

        test("WithdrawalRequest 1 has been updated correctly", () => {
          assertEntity(
            "WithdrawalRequest",
            createWithdrawalRequestId(
              BigInt.fromString("1"),
              vaultAddress,
              mockedInvestor
            ).toHexString(),
            [{ field: "amountRedeemed", value: "10" }]
          );
        });

        test("WithdrawalRequest 3 has been deleted", () => {
          assert.notInStore(
            "WithdrawalRequest",
            createWithdrawalRequestId(
              BigInt.fromString("3"),
              vaultAddress,
              mockedInvestor
            ).toHexString()
          );
        });

        test("WithdrawalRequest 3 has been removed from Round 5", () => {
          const ids = [
            createWithdrawalRequestId(
              BigInt.fromString("4"),
              vaultAddress,
              mockedInvestor
            ).toHexString(),
          ];
          assertEntity("Round", mockedRoundId_B.toHexString(), [
            { field: "withdrawalRequests", value: arrayToString(ids) },
          ]);
        });
      });
    });
  });

  describe("WithdrawExchangeAsset", () => {
    beforeAll(() => {
      mockWithdrawalRequest(
        mockedRoundId,
        vaultAddress,
        mockedInvestor,
        mockedCaller,
        mockedWithdrawalParams,
        contractAddress,
        contractAddress
      );
      const mockedEvent = createOutputWithdrawExchangeAsset(
        mockedCaller,
        mockedInvestor,
        mockedCaller,
        BigInt.fromString("15"),
        BigInt.fromString("2"),
        BigInt.fromString("30")
      );
      handleWithdrawExchangeAsset(mockedEvent);
    });
    afterAll(clearStore);

    test("can handle event", () => {
      assert.entityCount("WithdrawalRequest", 1);
    });

    test("WithdrawalRequest has been updated correctly", () => {
      assertEntity(
        "WithdrawalRequest",
        createWithdrawalRequestId(
          BigInt.fromString("2"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "amount", value: "70" },
          { field: "amountRedeemed", value: "15" },
          { field: "remainingAssets", value: "35" },
        ]
      );
    });
  });

  describe("WithdrawExchangeAssetBatch", () => {
    beforeAll(() => {
      mockWithdrawalRequests(
        mockedRoundId,
        vaultAddress,
        mockedInvestor,
        mockedCaller,
        mockedWithdrawalParamsArray,
        contractAddress,
        contractAddress
      );
      const mockedEvent = createOutputWithdrawExchangeAssetBatch(
        mockedCaller,
        mockedInvestor,
        mockedInvestor,
        BigInt.fromString("5"),
        [
          BigInt.fromString("1"),
          BigInt.fromString("2"),
          BigInt.fromString("4"),
        ],
        [
          BigInt.fromString("1"),
          BigInt.fromString("100"),
          BigInt.fromString("0"),
        ]
      );
      handleWithdrawExchangeAssetBatch(mockedEvent);
    });
    afterAll(clearStore);

    test("can handle event", () => {
      assert.entityCount("WithdrawalRequest", 4);
    });

    test("WithdrawalRequest 1 has been updated correctly", () => {
      assertEntity(
        "WithdrawalRequest",
        createWithdrawalRequestId(
          BigInt.fromString("1"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "amount", value: "9" },
          { field: "amountRedeemed", value: "5" },
          { field: "remainingAssets", value: "0" },
        ]
      );
    });
    test("WithdrawalRequest 2 has been updated correctly", () => {
      assertEntity(
        "WithdrawalRequest",
        createWithdrawalRequestId(
          BigInt.fromString("2"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "amount", value: "0" },
          { field: "amountRedeemed", value: "5" },
          { field: "remainingAssets", value: "45" },
        ]
      );
    });
    test("WithdrawalRequest 4 has been updated correctly", () => {
      assertEntity(
        "WithdrawalRequest",
        createWithdrawalRequestId(
          BigInt.fromString("4"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "amount", value: "1000" },
          { field: "amountRedeemed", value: "5" },
          { field: "remainingAssets", value: "495" },
        ]
      );
    });
  });
});
