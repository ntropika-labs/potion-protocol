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
  mockWithdrawalTicket,
  mockWithdrawalTickets,
  WithdrawalTicketParams,
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
import { createWithdrawalTicketId } from "../src/withdrawals";
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

const mockedRoundId = createRoundId(BigInt.fromString("1"), vaultAddress);
const mockedRoundId_B = createRoundId(BigInt.fromString("5"), vaultAddress);
const mockedCaller = Address.fromString(
  "0x0000000000000000000000000000000000000001"
);
const mockedInvestor = Address.fromString(
  "0x0000000000000000000000000000000000000002"
);

const mockedWithdrawalParams: WithdrawalTicketParams = {
  depositId: BigInt.fromString("2"),
  amount: BigInt.fromString("100"),
  amountRemaining: BigInt.fromString("100"),
  amountRedeemed: BigInt.fromString("0"),
  underlyings: BigInt.fromString("50"),
  underlyingsRemaining: BigInt.fromString("50"),
  underlyingsRedeemed: BigInt.fromString("0"),
};

const mockedWithdrawalParamsArray: WithdrawalTicketParams[] = [
  {
    depositId: BigInt.fromString("1"),
    amount: BigInt.fromString("10"),
    amountRemaining: BigInt.fromString("10"),
    amountRedeemed: BigInt.fromString("0"),
    underlyings: BigInt.fromString("5"),
    underlyingsRemaining: BigInt.fromString("5"),
    underlyingsRedeemed: BigInt.fromString("0"),
  },
  {
    depositId: BigInt.fromString("2"),
    amount: BigInt.fromString("100"),
    amountRemaining: BigInt.fromString("100"),
    amountRedeemed: BigInt.fromString("0"),
    underlyings: BigInt.fromString("50"),
    underlyingsRemaining: BigInt.fromString("50"),
    underlyingsRedeemed: BigInt.fromString("0"),
  },
  {
    depositId: BigInt.fromString("3"),
    amount: BigInt.fromString("500"),
    amountRemaining: BigInt.fromString("500"),
    amountRedeemed: BigInt.fromString("0"),
    underlyings: BigInt.fromString("250"),
    underlyingsRemaining: BigInt.fromString("250"),
    underlyingsRedeemed: BigInt.fromString("0"),
  },
  {
    depositId: BigInt.fromString("4"),
    amount: BigInt.fromString("1000"),
    amountRemaining: BigInt.fromString("1000"),
    amountRedeemed: BigInt.fromString("0"),
    underlyings: BigInt.fromString("500"),
    underlyingsRemaining: BigInt.fromString("500"),
    underlyingsRedeemed: BigInt.fromString("0"),
  },
];

describe("roundsOutputVault", () => {
  beforeAll(() => {
    mockVault(contractAddress, vaultAddress);
  });

  describe("NextRound", () => {
    beforeAll(() => {
      mockWithdrawalTickets(
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
          createWithdrawalTicketId(
            BigInt.fromString("1"),
            vaultAddress,
            mockedInvestor
          ),
          createWithdrawalTicketId(
            BigInt.fromString("2"),
            vaultAddress,
            mockedInvestor
          ),
          createWithdrawalTicketId(
            BigInt.fromString("3"),
            vaultAddress,
            mockedInvestor
          ),
          createWithdrawalTicketId(
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
        BigInt.fromString("10").times(decimals)
      );
      handleNextRound(mockedEvent);
    });

    afterAll(clearStore);

    test("can handle event", () => {
      assert.entityCount("Round", 2);
      assert.entityCount("WithdrawalTicket", 4);
    });

    test("HedgingVault has been updated correctly", () => {
      assertEntity("HedgingVault", vaultAddress.toHexString(), [
        { field: "currentRound", value: "2" },
        { field: "lastShareToUnderlyingRate", value: "10000000000000000000" },
      ]);
    });

    test("Round 1 has been updated correctly", () => {
      assertEntity(
        "Round",
        createRoundId(BigInt.fromString("1"), vaultAddress).toHexString(),
        [{ field: "shareToUnderlyingRate", value: "10000000000000000000" }]
      );
    });

    test("WithdrawalTicket 1 underlyings has been updated correctly", () => {
      assertEntity(
        "WithdrawalTicket",
        createWithdrawalTicketId(
          BigInt.fromString("1"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "underlyings", value: "100" },
          { field: "underlyingsRemaining", value: "100" },
        ]
      );
    });

    test("WithdrawalTicket 2 underlyings has been updated correctly", () => {
      assertEntity(
        "WithdrawalTicket",
        createWithdrawalTicketId(
          BigInt.fromString("2"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "underlyings", value: "1000" },
          { field: "underlyingsRemaining", value: "1000" },
        ]
      );
    });

    test("WithdrawalTicket 3 underlyings has been updated correctly", () => {
      assertEntity(
        "WithdrawalTicket",
        createWithdrawalTicketId(
          BigInt.fromString("3"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "underlyings", value: "5000" },
          { field: "underlyingsRemaining", value: "5000" },
        ]
      );
    });

    test("WithdrawalTicket 4 underlyings has been updated correctly", () => {
      assertEntity(
        "WithdrawalTicket",
        createWithdrawalTicketId(
          BigInt.fromString("4"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "underlyings", value: "10000" },
          { field: "underlyingsRemaining", value: "10000" },
        ]
      );
    });
  });

  describe("DepositWithReceipt", () => {
    describe("new WithdrawalTicket", () => {
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
        assert.entityCount("WithdrawalTicket", 1);
        assert.entityCount("Investor", 1);
        assert.entityCount("Block", 1);
        assert.entityCount("Round", 1);
      });

      test("WithdrawalTicket has been populated correctly", () => {
        assertEntity(
          "WithdrawalTicket",
          createWithdrawalTicketId(
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

      test("WithdrawalTicket has been added to the Round", () => {
        const ids = [
          createWithdrawalTicketId(
            BigInt.fromString("5"),
            vaultAddress,
            mockedInvestor
          ).toHexString(),
        ];
        assertEntity("Round", mockedRoundId.toHexString(), [
          { field: "withdrawalTickets", value: arrayToString(ids) },
        ]);
      });
    });

    describe("WithdrawalTicket already exists", () => {
      beforeAll(() => {
        mockWithdrawalTicket(
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
        assert.entityCount("WithdrawalTicket", 1);
        assert.entityCount("Investor", 1);
        assert.entityCount("Block", 1);
      });

      test("WithdrawalTicket has been updated correctly", () => {
        assertEntity(
          "WithdrawalTicket",
          createWithdrawalTicketId(
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
        mockWithdrawalTicket(
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
        assert.entityCount("WithdrawalTicket", 1);
      });

      test("WithdrawalTicket has been updated correctly", () => {
        assertEntity(
          "WithdrawalTicket",
          createWithdrawalTicketId(
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
      describe("user has requested a WithdrawalTicket reduption", () => {
        beforeAll(() => {
          mockWithdrawalTicket(
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
          assert.entityCount("WithdrawalTicket", 1);
        });

        test("WithdrawalTicket has been updated correctly", () => {
          assertEntity(
            "WithdrawalTicket",
            createWithdrawalTicketId(
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

      describe("user has requested a WithdrawalTicket deletion", () => {
        beforeAll(() => {
          mockRound(
            BigInt.fromString("1"),
            vaultAddress,
            [],
            [
              createWithdrawalTicketId(
                BigInt.fromString("2"),
                vaultAddress,
                mockedInvestor
              ),
            ]
          );
          mockWithdrawalTicket(
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
          assert.entityCount("WithdrawalTicket", 0);
          assert.entityCount("Round", 1);
        });

        test("WithdrawalTicket has been deleted", () => {
          assert.notInStore(
            "WithdrawalTicket",
            createWithdrawalTicketId(
              BigInt.fromString("2"),
              vaultAddress,
              mockedInvestor
            ).toHexString()
          );
        });

        test("WithdrawalTicket has been removed from the Round", () => {
          assertEntity("Round", mockedRoundId.toHexString(), [
            { field: "withdrawalTickets", value: "[]" },
          ]);
        });
      });
    });
  });

  describe("RedeemReceiptBatch", () => {
    describe("redeems are all in the same round", () => {
      describe("redeems are all in the round where WithdrawalTickets have been created", () => {
        beforeAll(() => {
          mockCurrentRound(contractAddress, BigInt.fromString("1"));
        });
        describe("requests are all to reduce WithdrawalTickets", () => {
          beforeAll(() => {
            mockWithdrawalTickets(
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
            assert.entityCount("WithdrawalTicket", 4);
          });

          test("WithdrawalTicket 1 has been updated correctly", () => {
            assertEntity(
              "WithdrawalTicket",
              createWithdrawalTicketId(
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

          test("WithdrawalTicket 3 has been updated correctly", () => {
            assertEntity(
              "WithdrawalTicket",
              createWithdrawalTicketId(
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
        describe("requests are all to delete WithdrawalTickets", () => {
          beforeAll(() => {
            mockRound(
              BigInt.fromString("1"),
              vaultAddress,
              [],
              [
                createWithdrawalTicketId(
                  BigInt.fromString("1"),
                  vaultAddress,
                  mockedInvestor
                ),
                createWithdrawalTicketId(
                  BigInt.fromString("2"),
                  vaultAddress,
                  mockedInvestor
                ),
                createWithdrawalTicketId(
                  BigInt.fromString("3"),
                  vaultAddress,
                  mockedInvestor
                ),
                createWithdrawalTicketId(
                  BigInt.fromString("4"),
                  vaultAddress,
                  mockedInvestor
                ),
              ]
            );
            mockWithdrawalTickets(
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
            assert.entityCount("WithdrawalTicket", 2);
            assert.entityCount("Round", 1);
          });

          test("WithdrawalTicket 2 has been deleted", () => {
            assert.notInStore(
              "WithdrawalTicket",
              createWithdrawalTicketId(
                BigInt.fromString("2"),
                vaultAddress,
                mockedInvestor
              ).toHexString()
            );
          });

          test("WithdrawalTicket 3 has been deleted", () => {
            assert.notInStore(
              "WithdrawalTicket",
              createWithdrawalTicketId(
                BigInt.fromString("3"),
                vaultAddress,
                mockedInvestor
              ).toHexString()
            );
          });

          test("WithdrawalTicket 2 and 3 have been removed from the Round", () => {
            const ids = [
              createWithdrawalTicketId(
                BigInt.fromString("1"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
              createWithdrawalTicketId(
                BigInt.fromString("4"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
            ];
            assertEntity("Round", mockedRoundId.toHexString(), [
              { field: "withdrawalTickets", value: arrayToString(ids) },
            ]);
          });
        });
        describe("requests are a mix between reduce and delete WithdrawalTickets", () => {
          beforeAll(() => {
            mockRound(
              BigInt.fromString("1"),
              vaultAddress,
              [],
              [
                createWithdrawalTicketId(
                  BigInt.fromString("1"),
                  vaultAddress,
                  mockedInvestor
                ),
                createWithdrawalTicketId(
                  BigInt.fromString("2"),
                  vaultAddress,
                  mockedInvestor
                ),
                createWithdrawalTicketId(
                  BigInt.fromString("3"),
                  vaultAddress,
                  mockedInvestor
                ),
                createWithdrawalTicketId(
                  BigInt.fromString("4"),
                  vaultAddress,
                  mockedInvestor
                ),
              ]
            );
            mockWithdrawalTickets(
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
            assert.entityCount("WithdrawalTicket", 2);
            assert.entityCount("Round", 1);
          });

          test("WithdrawalTicket 2 has been deleted", () => {
            assert.notInStore(
              "WithdrawalTicket",
              createWithdrawalTicketId(
                BigInt.fromString("2"),
                vaultAddress,
                mockedInvestor
              ).toHexString()
            );
          });

          test("WithdrawalTicket 3 has been deleted", () => {
            assert.notInStore(
              "WithdrawalTicket",
              createWithdrawalTicketId(
                BigInt.fromString("3"),
                vaultAddress,
                mockedInvestor
              ).toHexString()
            );
          });

          test("WithdrawalTicket 4 has been updated correctly", () => {
            assertEntity(
              "WithdrawalTicket",
              createWithdrawalTicketId(
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

          test("WithdrawalTicket 2 and 3 have been removed from the Round", () => {
            const ids = [
              createWithdrawalTicketId(
                BigInt.fromString("1"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
              createWithdrawalTicketId(
                BigInt.fromString("4"),
                vaultAddress,
                mockedInvestor
              ).toHexString(),
            ];
            assertEntity("Round", mockedRoundId.toHexString(), [
              { field: "withdrawalTickets", value: arrayToString(ids) },
            ]);
          });
        });
      });

      describe("requests are all to redeem WithdrawalTickets", () => {
        beforeAll(() => {
          mockCurrentRound(contractAddress, BigInt.fromString("5"));
          mockWithdrawalTickets(
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
          assert.entityCount("WithdrawalTicket", 4);
        });

        test("WithdrawalTicket 1 has been updated correctly", () => {
          assertEntity(
            "WithdrawalTicket",
            createWithdrawalTicketId(
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

        test("WithdrawalTicket 3 has been updated correctly", () => {
          assertEntity(
            "WithdrawalTicket",
            createWithdrawalTicketId(
              BigInt.fromString("3"),
              vaultAddress,
              mockedInvestor
            ).toHexString(),
            [
              { field: "amount", value: "500" },
              { field: "amountRemaining", value: "450" },
              { field: "amountRedeemed", value: "50" },
            ]
          );
        });
      });
    });

    describe("redeems are in multiple rounds", () => {
      describe("requests are a mix between redeem and reduce WithdrawalTickets", () => {
        beforeAll(() => {
          mockCurrentRound(contractAddress, BigInt.fromString("5"));
          mockWithdrawalTickets(
            mockedRoundId,
            vaultAddress,
            mockedInvestor,
            mockedCaller,
            mockedWithdrawalParamsArray.slice(0, 2),
            contractAddress,
            contractAddress
          );
          mockWithdrawalTickets(
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
          assert.entityCount("WithdrawalTicket", 4);
        });

        test("WithdrawalTicket 1 has been updated correctly", () => {
          assertEntity(
            "WithdrawalTicket",
            createWithdrawalTicketId(
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

        test("WithdrawalTicket 3 has been updated correctly", () => {
          assertEntity(
            "WithdrawalTicket",
            createWithdrawalTicketId(
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
      describe("requests are a mix between redeem and delete WithdrawalTickets", () => {
        beforeAll(() => {
          mockRound(
            BigInt.fromString("1"),
            vaultAddress,
            [],
            [
              createWithdrawalTicketId(
                BigInt.fromString("1"),
                vaultAddress,
                mockedInvestor
              ),
              createWithdrawalTicketId(
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
              createWithdrawalTicketId(
                BigInt.fromString("3"),
                vaultAddress,
                mockedInvestor
              ),
              createWithdrawalTicketId(
                BigInt.fromString("4"),
                vaultAddress,
                mockedInvestor
              ),
            ]
          );
          mockCurrentRound(contractAddress, BigInt.fromString("5"));
          mockWithdrawalTickets(
            mockedRoundId,
            vaultAddress,
            mockedInvestor,
            mockedCaller,
            mockedWithdrawalParamsArray.slice(0, 2),
            contractAddress,
            contractAddress
          );
          mockWithdrawalTickets(
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
          assert.entityCount("WithdrawalTicket", 3);
          assert.entityCount("Round", 2);
        });

        test("WithdrawalTicket 1 has been updated correctly", () => {
          assertEntity(
            "WithdrawalTicket",
            createWithdrawalTicketId(
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

        test("WithdrawalTicket 3 has been deleted", () => {
          assert.notInStore(
            "WithdrawalTicket",
            createWithdrawalTicketId(
              BigInt.fromString("3"),
              vaultAddress,
              mockedInvestor
            ).toHexString()
          );
        });

        test("WithdrawalTicket 3 has been removed from Round 5", () => {
          const ids = [
            createWithdrawalTicketId(
              BigInt.fromString("4"),
              vaultAddress,
              mockedInvestor
            ).toHexString(),
          ];
          assertEntity("Round", mockedRoundId_B.toHexString(), [
            { field: "withdrawalTickets", value: arrayToString(ids) },
          ]);
        });
      });
    });
  });

  describe("WithdrawExchangeAsset", () => {
    beforeAll(() => {
      mockWithdrawalTicket(
        mockedRoundId,
        vaultAddress,
        mockedInvestor,
        mockedCaller,
        mockedWithdrawalParams,
        contractAddress,
        contractAddress
      );
      mockRound(
        BigInt.fromString("1"),
        vaultAddress,
        [],
        [],
        BigInt.fromString("3")
      );
      const mockedEvent = createOutputWithdrawExchangeAsset(
        mockedInvestor,
        mockedInvestor,
        mockedInvestor,
        BigInt.fromString("45"),
        BigInt.fromString("2"),
        BigInt.fromString("15")
      );
      handleWithdrawExchangeAsset(mockedEvent);
    });
    afterAll(clearStore);

    test("can handle event", () => {
      assert.entityCount("WithdrawalTicket", 1);
    });

    test("WithdrawalTicket has been updated correctly", () => {
      assertEntity(
        "WithdrawalTicket",
        createWithdrawalTicketId(
          BigInt.fromString("2"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "amount", value: "100" },
          { field: "amountRemaining", value: "85" },
          { field: "amountRedeemed", value: "15" },
          { field: "underlyings", value: "50" },
          { field: "underlyingsRemaining", value: "5" },
          { field: "underlyingsRedeemed", value: "45" },
        ]
      );
    });
  });

  describe("WithdrawExchangeAssetBatch", () => {
    beforeAll(() => {
      mockWithdrawalTickets(
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
        [],
        BigInt.fromString("5")
      );
      const mockedEvent = createOutputWithdrawExchangeAssetBatch(
        mockedInvestor,
        mockedInvestor,
        mockedInvestor,
        BigInt.fromString("55"),
        [
          BigInt.fromString("1"),
          BigInt.fromString("2"),
          BigInt.fromString("4"),
        ],
        [
          BigInt.fromString("1"),
          BigInt.fromString("10"),
          BigInt.fromString("0"),
        ]
      );
      handleWithdrawExchangeAssetBatch(mockedEvent);
    });
    afterAll(clearStore);

    test("can handle event", () => {
      assert.entityCount("WithdrawalTicket", 4);
    });

    test("WithdrawalTicket 1 has been updated correctly", () => {
      assertEntity(
        "WithdrawalTicket",
        createWithdrawalTicketId(
          BigInt.fromString("1"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "amount", value: "10" },
          { field: "amountRemaining", value: "9" },
          { field: "amountRedeemed", value: "1" },
          { field: "underlyings", value: "5" },
          { field: "underlyingsRemaining", value: "0" },
          { field: "underlyingsRedeemed", value: "5" },
        ]
      );
    });
    test("WithdrawalTicket 2 has been updated correctly", () => {
      assertEntity(
        "WithdrawalTicket",
        createWithdrawalTicketId(
          BigInt.fromString("2"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "amount", value: "100" },
          { field: "amountRemaining", value: "90" },
          { field: "amountRedeemed", value: "10" },
          { field: "underlyings", value: "50" },
          { field: "underlyingsRemaining", value: "0" },
          { field: "underlyingsRedeemed", value: "50" },
        ]
      );
    });
    test("WithdrawalTicket 4 has been updated correctly", () => {
      assertEntity(
        "WithdrawalTicket",
        createWithdrawalTicketId(
          BigInt.fromString("4"),
          vaultAddress,
          mockedInvestor
        ).toHexString(),
        [
          { field: "amount", value: "1000" },
          { field: "amountRemaining", value: "1000" },
          { field: "amountRedeemed", value: "0" },
          { field: "underlyings", value: "500" },
          { field: "underlyingsRemaining", value: "500" },
          { field: "underlyingsRedeemed", value: "0" },
        ]
      );
    });
  });
});
