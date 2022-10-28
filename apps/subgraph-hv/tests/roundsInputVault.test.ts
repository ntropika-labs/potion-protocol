import {
  createNextRound,
  createDepositWithReceipt,
  createRedeemReceipt,
  createRedeemReceiptBatch,
  createWithdrawExchangeAsset,
  createWithdrawExchangeAssetBatch,
} from "./events";
import { mockVault, mockCurrentRound } from "./contractCalls";
import {
  assertEntity,
  mockHedgingVault,
  mockDepositRequest,
  mockDepositRequests,
  DepositRequestParams,
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

const mockedDepositParams: DepositRequestParams = {
  depositId: BigInt.fromString("2"),
  amount: BigInt.fromString("100"),
  amountRedeemed: BigInt.fromString("0"),
  shares: BigInt.fromString("50"),
  remainingShares: BigInt.fromString("0"),
};

const mockedDepositParamsArray: DepositRequestParams[] = [
  {
    depositId: BigInt.fromString("1"),
    amount: BigInt.fromString("10"),
    amountRedeemed: BigInt.fromString("0"),
    shares: BigInt.fromString("5"),
    remainingShares: BigInt.fromString("0"),
  },
  {
    depositId: BigInt.fromString("2"),
    amount: BigInt.fromString("100"),
    amountRedeemed: BigInt.fromString("0"),
    shares: BigInt.fromString("50"),
    remainingShares: BigInt.fromString("0"),
  },
  {
    depositId: BigInt.fromString("3"),
    amount: BigInt.fromString("500"),
    amountRedeemed: BigInt.fromString("0"),
    shares: BigInt.fromString("250"),
    remainingShares: BigInt.fromString("0"),
  },
  {
    depositId: BigInt.fromString("4"),
    amount: BigInt.fromString("1000"),
    amountRedeemed: BigInt.fromString("0"),
    shares: BigInt.fromString("500"),
    remainingShares: BigInt.fromString("0"),
  },
];

describe("roundsInputVault", () => {
  beforeAll(() => {
    mockVault(contractAddress, vaultAddress);
  });

  describe("NextRound", () => {
    beforeAll(() => {
      mockDepositRequests(
        mockedRoundId,
        vaultAddress,
        mockedInvestor,
        mockedCaller,
        mockedDepositParamsArray,
        contractAddress,
        contractAddress
      );
      mockRound(
        BigInt.fromString("1"),
        vaultAddress,
        [
          createDepositRequestId(
            BigInt.fromString("1"),
            vaultAddress,
            mockedInvestor
          ),
          createDepositRequestId(
            BigInt.fromString("2"),
            vaultAddress,
            mockedInvestor
          ),
          createDepositRequestId(
            BigInt.fromString("3"),
            vaultAddress,
            mockedInvestor
          ),
          createDepositRequestId(
            BigInt.fromString("4"),
            vaultAddress,
            mockedInvestor
          ),
        ],
        [],
        BigInt.fromString("5")
      );
      mockHedgingVault(
        vaultAddress,
        vaultAddress,
        actionAddress,
        BigInt.fromString("30"),
        BigInt.fromString("0")
      );
      const mockedEvent = createNextRound(
        BigInt.fromString("2"),
        BigInt.fromString("10")
      );
      handleNextRound(mockedEvent);
    });

    afterAll(clearStore);

    test("can handle event", () => {
      assert.entityCount("Round", 2);
      assert.entityCount("DepositRequest", 4);
    });

    test("HedgingVault has been updated correctly", () => {
      assertEntity("HedgingVault", vaultAddress.toHexString(), [
        { field: "currentRound", value: "2" },
      ]);
    });

    test("Round 1 has been updated correctly", () => {
      assertEntity(
        "Round",
        createRoundId(BigInt.fromString("1"), vaultAddress).toHexString(),
        [{ field: "exchangeRate", value: "10" }]
      );
    });

    test("DepositRequest 1 shares has been updated correctly", () => {
      assertEntity(
        "DepositRequest",
        createDepositRequestId(
          BigInt.fromString("1"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [{ field: "shares", value: "100" }]
      );
    });

    test("DepositRequest 2 shares has been updated correctly", () => {
      assertEntity(
        "DepositRequest",
        createDepositRequestId(
          BigInt.fromString("2"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [{ field: "shares", value: "1000" }]
      );
    });

    test("DepositRequest 3 shares has been updated correctly", () => {
      assertEntity(
        "DepositRequest",
        createDepositRequestId(
          BigInt.fromString("3"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [{ field: "shares", value: "5000" }]
      );
    });

    test("DepositRequest 4 shares has been updated correctly", () => {
      assertEntity(
        "DepositRequest",
        createDepositRequestId(
          BigInt.fromString("4"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [{ field: "shares", value: "10000" }]
      );
    });
  });

  describe("DepositWithReceipt", () => {
    describe("new DepositRequest", () => {
      beforeAll(() => {
        mockRound(BigInt.fromString("1"), vaultAddress);
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
        assert.entityCount("Round", 1);
      });

      test("DepositRequest has been populated correctly", () => {
        assertEntity(
          "DepositRequest",
          createDepositRequestId(
            BigInt.fromString("5"),
            vaultAddress,
            mockedInvestor
          ).toHexString(),
          [{ field: "amount", value: "10" }]
        );
      });

      test("DepositRequest has been added to the Round", () => {
        const ids = [
          createDepositRequestId(
            BigInt.fromString("5"),
            vaultAddress,
            mockedInvestor
          ).toHexString(),
        ];
        assertEntity("Round", mockedRoundId.toHexString(), [
          { field: "depositRequests", value: arrayToString(ids) },
        ]);
      });
    });

    describe("DepositRequest already exists", () => {
      beforeAll(() => {
        mockDepositRequest(
          mockedRoundId,
          vaultAddress,
          mockedInvestor,
          mockedCaller,
          mockedDepositParams,
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
        mockDepositRequest(
          mockedRoundId,
          vaultAddress,
          mockedInvestor,
          mockedCaller,
          mockedDepositParams,
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
      describe("user has requested a DepositRequest reduption", () => {
        beforeAll(() => {
          mockDepositRequest(
            mockedRoundId,
            vaultAddress,
            mockedInvestor,
            mockedCaller,
            mockedDepositParams,
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
              vaultAddress,
              mockedInvestor
            ).toHexString(),
            [{ field: "amount", value: "60" }]
          );
        });
      });

      describe("user has requested a DepositRequest deletion", () => {
        beforeAll(() => {
          mockRound(BigInt.fromString("1"), vaultAddress, [
            createDepositRequestId(
              BigInt.fromString("2"),
              vaultAddress,
              mockedInvestor
            ),
          ]);
          mockDepositRequest(
            mockedRoundId,
            vaultAddress,
            mockedInvestor,
            mockedCaller,
            mockedDepositParams,
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
          assert.entityCount("Round", 1);
        });

        test("DepositRequest has been deleted", () => {
          assert.notInStore(
            "DepositRequest",
            createDepositRequestId(
              BigInt.fromString("2"),
              vaultAddress,
              mockedInvestor
            ).toHexString()
          );
        });

        test("DepositRequest has been removed from the Round", () => {
          assertEntity("Round", mockedRoundId.toHexString(), [
            { field: "depositRequests", value: "[]" },
          ]);
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
              vaultAddress,
              mockedInvestor,
              mockedCaller,
              mockedDepositParamsArray,
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
                vaultAddress,
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
                vaultAddress,
                mockedInvestor
              ).toHexString(),
              [{ field: "amount", value: "450" }]
            );
          });
        });
        describe("requests are all to delete DepositRequests", () => {
          beforeAll(() => {
            mockRound(BigInt.fromString("1"), vaultAddress, [
              createDepositRequestId(
                BigInt.fromString("1"),
                vaultAddress,
                mockedInvestor
              ),
              createDepositRequestId(
                BigInt.fromString("2"),
                vaultAddress,
                mockedInvestor
              ),
              createDepositRequestId(
                BigInt.fromString("3"),
                vaultAddress,
                mockedInvestor
              ),
              createDepositRequestId(
                BigInt.fromString("4"),
                vaultAddress,
                mockedInvestor
              ),
            ]);
            mockDepositRequests(
              mockedRoundId,
              vaultAddress,
              mockedInvestor,
              mockedCaller,
              mockedDepositParamsArray,
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
            assert.entityCount("Round", 1);
          });

          test("DepositRequest 2 has been deleted", () => {
            assert.notInStore(
              "DepositRequest",
              createDepositRequestId(
                BigInt.fromString("2"),
                vaultAddress,
                mockedInvestor
              ).toHexString()
            );
          });

          test("DepositRequest 3 has been deleted", () => {
            assert.notInStore(
              "DepositRequest",
              createDepositRequestId(
                BigInt.fromString("3"),
                vaultAddress,
                mockedInvestor
              ).toHexString()
            );
          });

          test("DepositRequest 2 and 3 have been removed from the Round", () => {
            const ids = [
              createDepositRequestId(
                BigInt.fromString("1"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
              createDepositRequestId(
                BigInt.fromString("4"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
            ];
            assertEntity("Round", mockedRoundId.toHexString(), [
              { field: "depositRequests", value: arrayToString(ids) },
            ]);
          });
        });
        describe("requests are a mix between reduce and delete DepositRequests", () => {
          beforeAll(() => {
            mockRound(BigInt.fromString("1"), vaultAddress, [
              createDepositRequestId(
                BigInt.fromString("1"),
                vaultAddress,
                mockedInvestor
              ),
              createDepositRequestId(
                BigInt.fromString("2"),
                vaultAddress,
                mockedInvestor
              ),
              createDepositRequestId(
                BigInt.fromString("3"),
                vaultAddress,
                mockedInvestor
              ),
              createDepositRequestId(
                BigInt.fromString("4"),
                vaultAddress,
                mockedInvestor
              ),
            ]);
            mockDepositRequests(
              mockedRoundId,
              vaultAddress,
              mockedInvestor,
              mockedCaller,
              mockedDepositParamsArray,
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
            assert.entityCount("Round", 1);
          });

          test("DepositRequest 2 has been deleted", () => {
            assert.notInStore(
              "DepositRequest",
              createDepositRequestId(
                BigInt.fromString("2"),
                vaultAddress,
                mockedInvestor
              ).toHexString()
            );
          });

          test("DepositRequest 3 has been deleted", () => {
            assert.notInStore(
              "DepositRequest",
              createDepositRequestId(
                BigInt.fromString("3"),
                vaultAddress,
                mockedInvestor
              ).toHexString()
            );
          });

          test("DepositRequest 4 has been updated correctly", () => {
            assertEntity(
              "DepositRequest",
              createDepositRequestId(
                BigInt.fromString("4"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
              [{ field: "amount", value: "500" }]
            );
          });

          test("DepositRequest 2 and 3 have been removed from the Round", () => {
            const ids = [
              createDepositRequestId(
                BigInt.fromString("1"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
              createDepositRequestId(
                BigInt.fromString("4"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
            ];
            assertEntity("Round", mockedRoundId.toHexString(), [
              { field: "depositRequests", value: arrayToString(ids) },
            ]);
          });
        });
      });

      describe("requests are all to redeem DepositRequests", () => {
        beforeAll(() => {
          mockCurrentRound(contractAddress, BigInt.fromString("5"));
          mockDepositRequests(
            mockedRoundId,
            vaultAddress,
            mockedInvestor,
            mockedCaller,
            mockedDepositParamsArray,
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
              vaultAddress,
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
              vaultAddress,
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
            vaultAddress,
            mockedInvestor,
            mockedCaller,
            mockedDepositParamsArray.slice(0, 2),
            contractAddress,
            contractAddress
          );
          mockDepositRequests(
            mockedRoundId_B,
            vaultAddress,
            mockedInvestor,
            mockedCaller,
            mockedDepositParamsArray.slice(2, 4),
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
              vaultAddress,
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
              vaultAddress,
              mockedInvestor
            ).toHexString(),
            [{ field: "amount", value: "450" }]
          );
        });
      });
      describe("requests are a mix between redeem and delete DepositRequests", () => {
        beforeAll(() => {
          mockRound(BigInt.fromString("1"), vaultAddress, [
            createDepositRequestId(
              BigInt.fromString("1"),
              vaultAddress,
              mockedInvestor
            ),
            createDepositRequestId(
              BigInt.fromString("2"),
              vaultAddress,
              mockedInvestor
            ),
          ]);
          mockRound(BigInt.fromString("5"), vaultAddress, [
            createDepositRequestId(
              BigInt.fromString("3"),
              vaultAddress,
              mockedInvestor
            ),
            createDepositRequestId(
              BigInt.fromString("4"),
              vaultAddress,
              mockedInvestor
            ),
          ]);
          mockCurrentRound(contractAddress, BigInt.fromString("5"));
          mockDepositRequests(
            mockedRoundId,
            vaultAddress,
            mockedInvestor,
            mockedCaller,
            mockedDepositParamsArray.slice(0, 2),
            contractAddress,
            contractAddress
          );
          mockDepositRequests(
            mockedRoundId_B,
            vaultAddress,
            mockedInvestor,
            mockedCaller,
            mockedDepositParamsArray.slice(2, 4),
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
          assert.entityCount("Round", 2);
        });

        test("DepositRequest 1 has been updated correctly", () => {
          assertEntity(
            "DepositRequest",
            createDepositRequestId(
              BigInt.fromString("1"),
              vaultAddress,
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
              vaultAddress,
              mockedInvestor
            ).toHexString()
          );
        });

        test("DepositRequest 3 has been removed from Round 5", () => {
          const ids = [
            createDepositRequestId(
              BigInt.fromString("4"),
              vaultAddress,
              mockedInvestor
            ).toHexString(),
          ];
          assertEntity("Round", mockedRoundId_B.toHexString(), [
            { field: "depositRequests", value: arrayToString(ids) },
          ]);
        });
      });
    });
  });

  describe("WithdrawExchangeAsset", () => {
    beforeAll(() => {
      mockDepositRequest(
        mockedRoundId,
        vaultAddress,
        mockedInvestor,
        mockedCaller,
        mockedDepositParams,
        contractAddress,
        contractAddress
      );
      const mockedEvent = createWithdrawExchangeAsset(
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
      assert.entityCount("DepositRequest", 1);
    });

    test("DepositRequest has been updated correctly", () => {
      assertEntity(
        "DepositRequest",
        createDepositRequestId(
          BigInt.fromString("2"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "amount", value: "70" },
          { field: "amountRedeemed", value: "15" },
          { field: "remainingShares", value: "35" },
        ]
      );
    });
  });

  describe("WithdrawExchangeAssetBatch", () => {
    beforeAll(() => {
      mockDepositRequests(
        mockedRoundId,
        vaultAddress,
        mockedInvestor,
        mockedCaller,
        mockedDepositParamsArray,
        contractAddress,
        contractAddress
      );
      const mockedEvent = createWithdrawExchangeAssetBatch(
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
      assert.entityCount("DepositRequest", 4);
    });

    test("DepositRequest 1 has been updated correctly", () => {
      assertEntity(
        "DepositRequest",
        createDepositRequestId(
          BigInt.fromString("1"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "amount", value: "9" },
          { field: "amountRedeemed", value: "5" },
          { field: "remainingShares", value: "0" },
        ]
      );
    });
    test("DepositRequest 2 has been updated correctly", () => {
      assertEntity(
        "DepositRequest",
        createDepositRequestId(
          BigInt.fromString("2"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "amount", value: "0" },
          { field: "amountRedeemed", value: "5" },
          { field: "remainingShares", value: "45" },
        ]
      );
    });
    test("DepositRequest 4 has been updated correctly", () => {
      assertEntity(
        "DepositRequest",
        createDepositRequestId(
          BigInt.fromString("4"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "amount", value: "1000" },
          { field: "amountRedeemed", value: "5" },
          { field: "remainingShares", value: "495" },
        ]
      );
    });
  });
});
