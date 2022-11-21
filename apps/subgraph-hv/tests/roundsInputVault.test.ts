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
  mockToken,
  mockDepositTicket,
  mockDepositTickets,
  DepositTicketParams,
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
import { createDepositTicketId } from "../src/deposits";
import { createRoundId } from "../src/rounds";

const decimals = BigInt.fromI32(10).pow(18);

const contractAddress = Address.fromString(
  "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
);

const vaultAddress = Address.fromString(
  "0x90cBa2Bbb19ecc291A12066Fd8329D65FA1f1947"
);

const actionAddress = Address.fromString(
  "0x0000000000000000000000000000000000000001"
);

const underlyingAddress = Address.fromString(
  "0x0000000000000000000000000000000000000002"
);

const mockedRoundId = createRoundId(BigInt.fromString("1"), vaultAddress);
const mockedRoundId_B = createRoundId(BigInt.fromString("5"), vaultAddress);
const mockedCaller = Address.fromString(
  "0x0000000000000000000000000000000000000010"
);
const mockedInvestor = Address.fromString(
  "0x0000000000000000000000000000000000000020"
);

const mockedDepositParams: DepositTicketParams = {
  depositId: BigInt.fromString("2"),
  amount: BigInt.fromString("100"),
  amountRemaining: BigInt.fromString("100"),
  amountRedeemed: BigInt.fromString("0"),
  shares: BigInt.fromString("50"),
  sharesRemaining: BigInt.fromString("50"),
  sharesRedeemed: BigInt.fromString("0"),
};

const mockedDepositParamsArray: DepositTicketParams[] = [
  {
    depositId: BigInt.fromString("1"),
    amount: BigInt.fromString("10"),
    amountRemaining: BigInt.fromString("10"),
    amountRedeemed: BigInt.fromString("0"),
    shares: BigInt.fromString("5"),
    sharesRemaining: BigInt.fromString("5"),
    sharesRedeemed: BigInt.fromString("0"),
  },
  {
    depositId: BigInt.fromString("2"),
    amount: BigInt.fromString("100"),
    amountRemaining: BigInt.fromString("100"),
    amountRedeemed: BigInt.fromString("0"),
    shares: BigInt.fromString("50"),
    sharesRemaining: BigInt.fromString("50"),
    sharesRedeemed: BigInt.fromString("0"),
  },
  {
    depositId: BigInt.fromString("3"),
    amount: BigInt.fromString("500"),
    amountRemaining: BigInt.fromString("500"),
    amountRedeemed: BigInt.fromString("0"),
    shares: BigInt.fromString("250"),
    sharesRemaining: BigInt.fromString("250"),
    sharesRedeemed: BigInt.fromString("0"),
  },
  {
    depositId: BigInt.fromString("4"),
    amount: BigInt.fromString("1000"),
    amountRemaining: BigInt.fromString("1000"),
    amountRedeemed: BigInt.fromString("0"),
    shares: BigInt.fromString("500"),
    sharesRemaining: BigInt.fromString("500"),
    sharesRedeemed: BigInt.fromString("0"),
  },
];

describe("roundsInputVault", () => {
  beforeAll(() => {
    mockVault(contractAddress, vaultAddress);
  });

  describe("NextRound", () => {
    beforeAll(() => {
      mockDepositTickets(
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
          createDepositTicketId(
            BigInt.fromString("1"),
            vaultAddress,
            mockedInvestor
          ),
          createDepositTicketId(
            BigInt.fromString("2"),
            vaultAddress,
            mockedInvestor
          ),
          createDepositTicketId(
            BigInt.fromString("3"),
            vaultAddress,
            mockedInvestor
          ),
          createDepositTicketId(
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
        actionAddress,
        underlyingAddress,
        BigInt.fromString("30"),
        BigInt.fromString("0")
      );
      mockToken(
        underlyingAddress,
        "MOCKED UNDERLYING",
        "MUND",
        BigInt.fromI32(6)
      );
      const mockedEvent = createNextRound(
        BigInt.fromString("2"),
        BigInt.fromString("10").times(decimals)
      );
      handleNextRound(mockedEvent);
    });

    afterAll(clearStore);

    test("can handle event", () => {
      assert.entityCount("Round", 2);
      assert.entityCount("DepositTicket", 4);
    });

    test("HedgingVault has been updated correctly", () => {
      assertEntity("HedgingVault", vaultAddress.toHexString(), [
        { field: "currentRound", value: "2" },
        { field: "lastUnderlyingToShareRate", value: "10000000000000000000" },
      ]);
    });

    test("Round 1 has been updated correctly", () => {
      assertEntity(
        "Round",
        createRoundId(BigInt.fromString("1"), vaultAddress).toHexString(),
        [{ field: "underlyingToShareRate", value: "10000000000000000000" }]
      );
    });

    test("DepositTicket 1 shares has been updated correctly", () => {
      assertEntity(
        "DepositTicket",
        createDepositTicketId(
          BigInt.fromString("1"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "shares", value: "100000000000000" },
          { field: "sharesRemaining", value: "100000000000000" },
        ]
      );
    });

    test("DepositTicket 2 shares has been updated correctly", () => {
      assertEntity(
        "DepositTicket",
        createDepositTicketId(
          BigInt.fromString("2"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "shares", value: "1000000000000000" },
          { field: "sharesRemaining", value: "1000000000000000" },
        ]
      );
    });

    test("DepositTicket 3 shares has been updated correctly", () => {
      assertEntity(
        "DepositTicket",
        createDepositTicketId(
          BigInt.fromString("3"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "shares", value: "5000000000000000" },
          { field: "sharesRemaining", value: "5000000000000000" },
        ]
      );
    });

    test("DepositTicket 4 shares has been updated correctly", () => {
      assertEntity(
        "DepositTicket",
        createDepositTicketId(
          BigInt.fromString("4"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "shares", value: "10000000000000000" },
          { field: "sharesRemaining", value: "10000000000000000" },
        ]
      );
    });
  });

  describe("DepositWithReceipt", () => {
    describe("new DepositTicket", () => {
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
        assert.entityCount("DepositTicket", 1);
        assert.entityCount("Investor", 1);
        assert.entityCount("Block", 1);
        assert.entityCount("Round", 1);
      });

      test("DepositTicket has been populated correctly", () => {
        assertEntity(
          "DepositTicket",
          createDepositTicketId(
            BigInt.fromString("5"),
            vaultAddress,
            mockedInvestor
          ).toHexString(),
          [
            { field: "amount", value: "10" },
            { field: "amountRemaining", value: "10" },
            { field: "amountRedeemed", value: "0" },
          ]
        );
      });

      test("DepositTicket has been added to the Round", () => {
        const ids = [
          createDepositTicketId(
            BigInt.fromString("5"),
            vaultAddress,
            mockedInvestor
          ).toHexString(),
        ];
        assertEntity("Round", mockedRoundId.toHexString(), [
          { field: "depositTickets", value: arrayToString(ids) },
        ]);
      });
    });

    describe("DepositTicket already exists", () => {
      beforeAll(() => {
        mockDepositTicket(
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
        assert.entityCount("DepositTicket", 1);
        assert.entityCount("Investor", 1);
        assert.entityCount("Block", 1);
      });

      test("DepositTicket has been updated correctly", () => {
        assertEntity(
          "DepositTicket",
          createDepositTicketId(
            BigInt.fromString("2"),
            vaultAddress,
            mockedInvestor
          ).toHexString(),
          [
            { field: "amount", value: "110" },
            { field: "amountRemaining", value: "110" },
            { field: "amountRedeemed", value: "0" },
          ]
        );
      });
    });
  });

  describe("RedeemReceipt", () => {
    describe("RedeemReceipt has been called in a different round", () => {
      beforeAll(() => {
        mockDepositTicket(
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
        assert.entityCount("DepositTicket", 1);
      });

      test("DepositTicket has been updated correctly", () => {
        assertEntity(
          "DepositTicket",
          createDepositTicketId(
            BigInt.fromString("2"),
            vaultAddress,
            mockedInvestor
          ).toHexString(),
          [
            { field: "amount", value: "100" },
            { field: "amountRemaining", value: "90" },
            { field: "amountRedeemed", value: "10" },
          ]
        );
      });
    });

    describe("RedeemReceipt has been called in the same round", () => {
      beforeAll(() => {
        mockCurrentRound(contractAddress, BigInt.fromString("1"));
      });
      describe("user has requested a DepositTicket reduption", () => {
        beforeAll(() => {
          mockDepositTicket(
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
          assert.entityCount("DepositTicket", 1);
        });

        test("DepositTicket has been updated correctly", () => {
          assertEntity(
            "DepositTicket",
            createDepositTicketId(
              BigInt.fromString("2"),
              vaultAddress,
              mockedInvestor
            ).toHexString(),
            [
              { field: "amount", value: "60" },
              { field: "amountRemaining", value: "60" },
            ]
          );
        });
      });

      describe("user has requested a DepositTicket deletion", () => {
        beforeAll(() => {
          mockRound(BigInt.fromString("1"), vaultAddress, [
            createDepositTicketId(
              BigInt.fromString("2"),
              vaultAddress,
              mockedInvestor
            ),
          ]);
          mockDepositTicket(
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
          assert.entityCount("DepositTicket", 0);
          assert.entityCount("Round", 1);
        });

        test("DepositTicket has been deleted", () => {
          assert.notInStore(
            "DepositTicket",
            createDepositTicketId(
              BigInt.fromString("2"),
              vaultAddress,
              mockedInvestor
            ).toHexString()
          );
        });

        test("DepositTicket has been removed from the Round", () => {
          assertEntity("Round", mockedRoundId.toHexString(), [
            { field: "depositTickets", value: "[]" },
          ]);
        });
      });
    });
  });

  describe("RedeemReceiptBatch", () => {
    describe("redeems are all in the same round", () => {
      describe("redeems are all in the round where DepositTickets have been created", () => {
        beforeAll(() => {
          mockCurrentRound(contractAddress, BigInt.fromString("1"));
        });
        describe("requests are all to reduce DepositTickets", () => {
          beforeAll(() => {
            mockDepositTickets(
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
            assert.entityCount("DepositTicket", 4);
          });

          test("DepositTicket 1 has been updated correctly", () => {
            assertEntity(
              "DepositTicket",
              createDepositTicketId(
                BigInt.fromString("1"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
              [
                { field: "amount", value: "5" },
                { field: "amountRemaining", value: "5" },
              ]
            );
          });

          test("DepositTicket 3 has been updated correctly", () => {
            assertEntity(
              "DepositTicket",
              createDepositTicketId(
                BigInt.fromString("3"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
              [
                { field: "amount", value: "450" },
                { field: "amountRemaining", value: "450" },
              ]
            );
          });
        });
        describe("requests are all to delete DepositTickets", () => {
          beforeAll(() => {
            mockRound(BigInt.fromString("1"), vaultAddress, [
              createDepositTicketId(
                BigInt.fromString("1"),
                vaultAddress,
                mockedInvestor
              ),
              createDepositTicketId(
                BigInt.fromString("2"),
                vaultAddress,
                mockedInvestor
              ),
              createDepositTicketId(
                BigInt.fromString("3"),
                vaultAddress,
                mockedInvestor
              ),
              createDepositTicketId(
                BigInt.fromString("4"),
                vaultAddress,
                mockedInvestor
              ),
            ]);
            mockDepositTickets(
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
            assert.entityCount("DepositTicket", 2);
            assert.entityCount("Round", 1);
          });

          test("DepositTicket 2 has been deleted", () => {
            assert.notInStore(
              "DepositTicket",
              createDepositTicketId(
                BigInt.fromString("2"),
                vaultAddress,
                mockedInvestor
              ).toHexString()
            );
          });

          test("DepositTicket 3 has been deleted", () => {
            assert.notInStore(
              "DepositTicket",
              createDepositTicketId(
                BigInt.fromString("3"),
                vaultAddress,
                mockedInvestor
              ).toHexString()
            );
          });

          test("DepositTicket 2 and 3 have been removed from the Round", () => {
            const ids = [
              createDepositTicketId(
                BigInt.fromString("1"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
              createDepositTicketId(
                BigInt.fromString("4"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
            ];
            assertEntity("Round", mockedRoundId.toHexString(), [
              { field: "depositTickets", value: arrayToString(ids) },
            ]);
          });
        });
        describe("requests are a mix between reduce and delete DepositTickets", () => {
          beforeAll(() => {
            mockRound(BigInt.fromString("1"), vaultAddress, [
              createDepositTicketId(
                BigInt.fromString("1"),
                vaultAddress,
                mockedInvestor
              ),
              createDepositTicketId(
                BigInt.fromString("2"),
                vaultAddress,
                mockedInvestor
              ),
              createDepositTicketId(
                BigInt.fromString("3"),
                vaultAddress,
                mockedInvestor
              ),
              createDepositTicketId(
                BigInt.fromString("4"),
                vaultAddress,
                mockedInvestor
              ),
            ]);
            mockDepositTickets(
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
            assert.entityCount("DepositTicket", 2);
            assert.entityCount("Round", 1);
          });

          test("DepositTicket 2 has been deleted", () => {
            assert.notInStore(
              "DepositTicket",
              createDepositTicketId(
                BigInt.fromString("2"),
                vaultAddress,
                mockedInvestor
              ).toHexString()
            );
          });

          test("DepositTicket 3 has been deleted", () => {
            assert.notInStore(
              "DepositTicket",
              createDepositTicketId(
                BigInt.fromString("3"),
                vaultAddress,
                mockedInvestor
              ).toHexString()
            );
          });

          test("DepositTicket 4 has been updated correctly", () => {
            assertEntity(
              "DepositTicket",
              createDepositTicketId(
                BigInt.fromString("4"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
              [
                { field: "amount", value: "500" },
                { field: "amountRemaining", value: "500" },
              ]
            );
          });

          test("DepositTicket 2 and 3 have been removed from the Round", () => {
            const ids = [
              createDepositTicketId(
                BigInt.fromString("1"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
              createDepositTicketId(
                BigInt.fromString("4"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
            ];
            assertEntity("Round", mockedRoundId.toHexString(), [
              { field: "depositTickets", value: arrayToString(ids) },
            ]);
          });
        });
      });

      describe("requests are all to redeem DepositTickets", () => {
        beforeAll(() => {
          mockCurrentRound(contractAddress, BigInt.fromString("5"));
          mockDepositTickets(
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
          assert.entityCount("DepositTicket", 4);
        });

        test("DepositTicket 1 has been updated correctly", () => {
          assertEntity(
            "DepositTicket",
            createDepositTicketId(
              BigInt.fromString("1"),
              vaultAddress,
              mockedInvestor
            ).toHexString(),
            [{ field: "amountRedeemed", value: "5" }]
          );
        });

        test("DepositTicket 3 has been updated correctly", () => {
          assertEntity(
            "DepositTicket",
            createDepositTicketId(
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
      describe("requests are a mix between redeem and reduce DepositTickets", () => {
        beforeAll(() => {
          mockCurrentRound(contractAddress, BigInt.fromString("5"));
          mockDepositTickets(
            mockedRoundId,
            vaultAddress,
            mockedInvestor,
            mockedCaller,
            mockedDepositParamsArray.slice(0, 2),
            contractAddress,
            contractAddress
          );
          mockDepositTickets(
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
          assert.entityCount("DepositTicket", 4);
        });

        test("DepositTicket 1 has been updated correctly", () => {
          assertEntity(
            "DepositTicket",
            createDepositTicketId(
              BigInt.fromString("1"),
              vaultAddress,
              mockedInvestor
            ).toHexString(),
            [
              { field: "amount", value: "10" },
              { field: "amountRemaining", value: "5" },
              { field: "amountRedeemed", value: "5" },
            ]
          );
        });

        test("DepositTicket 3 has been updated correctly", () => {
          assertEntity(
            "DepositTicket",
            createDepositTicketId(
              BigInt.fromString("3"),
              vaultAddress,
              mockedInvestor
            ).toHexString(),
            [
              { field: "amount", value: "450" },
              { field: "amountRemaining", value: "450" },
            ]
          );
        });
      });
      describe("requests are a mix between redeem and delete DepositTickets", () => {
        beforeAll(() => {
          mockRound(BigInt.fromString("1"), vaultAddress, [
            createDepositTicketId(
              BigInt.fromString("1"),
              vaultAddress,
              mockedInvestor
            ),
            createDepositTicketId(
              BigInt.fromString("2"),
              vaultAddress,
              mockedInvestor
            ),
          ]);
          mockRound(BigInt.fromString("5"), vaultAddress, [
            createDepositTicketId(
              BigInt.fromString("3"),
              vaultAddress,
              mockedInvestor
            ),
            createDepositTicketId(
              BigInt.fromString("4"),
              vaultAddress,
              mockedInvestor
            ),
          ]);
          mockCurrentRound(contractAddress, BigInt.fromString("5"));
          mockDepositTickets(
            mockedRoundId,
            vaultAddress,
            mockedInvestor,
            mockedCaller,
            mockedDepositParamsArray.slice(0, 2),
            contractAddress,
            contractAddress
          );
          mockDepositTickets(
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
          assert.entityCount("DepositTicket", 3);
          assert.entityCount("Round", 2);
        });

        test("DepositTicket 1 has been updated correctly", () => {
          assertEntity(
            "DepositTicket",
            createDepositTicketId(
              BigInt.fromString("1"),
              vaultAddress,
              mockedInvestor
            ).toHexString(),
            [
              { field: "amount", value: "10" },
              { field: "amountRemaining", value: "0" },
              { field: "amountRedeemed", value: "10" },
            ]
          );
        });

        test("DepositTicket 3 has been deleted", () => {
          assert.notInStore(
            "DepositTicket",
            createDepositTicketId(
              BigInt.fromString("3"),
              vaultAddress,
              mockedInvestor
            ).toHexString()
          );
        });

        test("DepositTicket 3 has been removed from Round 5", () => {
          const ids = [
            createDepositTicketId(
              BigInt.fromString("4"),
              vaultAddress,
              mockedInvestor
            ).toHexString(),
          ];
          assertEntity("Round", mockedRoundId_B.toHexString(), [
            { field: "depositTickets", value: arrayToString(ids) },
          ]);
        });
      });
    });
  });

  describe("WithdrawExchangeAsset", () => {
    beforeAll(() => {
      mockDepositTicket(
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
        mockedCaller,
        mockedInvestor,
        BigInt.fromString("15"),
        BigInt.fromString("2"),
        BigInt.fromString("30")
      );
      handleWithdrawExchangeAsset(mockedEvent);
    });
    afterAll(clearStore);

    test("can handle event", () => {
      assert.entityCount("DepositTicket", 1);
    });

    test("DepositTicket has been updated correctly", () => {
      assertEntity(
        "DepositTicket",
        createDepositTicketId(
          BigInt.fromString("2"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "amount", value: "100" },
          { field: "amountRemaining", value: "70" },
          { field: "amountRedeemed", value: "30" },
          { field: "shares", value: "50" },
          { field: "sharesRemaining", value: "35" },
          { field: "sharesRedeemed", value: "15" },
        ]
      );
    });
  });

  describe("WithdrawExchangeAssetBatch", () => {
    beforeAll(() => {
      mockDepositTickets(
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
        mockedCaller,
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
      assert.entityCount("DepositTicket", 4);
    });

    test("DepositTicket 1 has been updated correctly", () => {
      assertEntity(
        "DepositTicket",
        createDepositTicketId(
          BigInt.fromString("1"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "amount", value: "10" },
          { field: "amountRemaining", value: "9" },
          { field: "amountRedeemed", value: "1" },
          { field: "shares", value: "5" },
          { field: "sharesRemaining", value: "0" },
          { field: "sharesRedeemed", value: "5" },
        ]
      );
    });
    test("DepositTicket 2 has been updated correctly", () => {
      assertEntity(
        "DepositTicket",
        createDepositTicketId(
          BigInt.fromString("2"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "amount", value: "100" },
          { field: "amountRemaining", value: "0" },
          { field: "amountRedeemed", value: "100" },
          { field: "shares", value: "50" },
          { field: "sharesRemaining", value: "45" },
          { field: "sharesRedeemed", value: "5" },
        ]
      );
    });
    test("DepositTicket 4 has been updated correctly", () => {
      assertEntity(
        "DepositTicket",
        createDepositTicketId(
          BigInt.fromString("4"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "amount", value: "1000" },
          { field: "amountRemaining", value: "1000" },
          { field: "amountRedeemed", value: "0" },
          { field: "shares", value: "500" },
          { field: "sharesRemaining", value: "495" },
          { field: "sharesRedeemed", value: "5" },
        ]
      );
    });
  });
});
