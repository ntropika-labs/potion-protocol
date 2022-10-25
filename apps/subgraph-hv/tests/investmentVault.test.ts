import {
  createActionsAdded,
  createVaultPositionEntered,
  createVaultPositionExited,
  createDeposit,
  createWithdraw,
} from "./events";
import {
  mockAsset,
  mockTotalAssets,
  mockTokenName,
  mockTokenSymbol,
  mockTokenDecimals,
} from "./contractCalls";
import {
  assertEntity,
  mockHedgingVault,
  mockPotionBuyAction,
  mockRound,
} from "./helpers";
import {
  handleActionsAdded,
  handleDeposit,
  handleVaultPositionEntered,
  handleVaultPositionExited,
  handleWithdraw,
} from "../src/investmentVault";
import {
  test,
  describe,
  clearStore,
  afterAll,
  beforeAll,
  assert,
} from "matchstick-as/assembly/index";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { createRoundId } from "../src/rounds";

const contractAddress = Address.fromString(
  "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
);
const assetAddress = Address.fromString(
  "0x90cBa2Bbb19ecc291A12066Fd8329D65FA1f1947"
);
const actionAddress = Address.fromString(
  "0x0000000000000000000000000000000000000001"
);
const investorAddress = Address.fromString(
  "0x0000000000000000000000000000000000001000"
);

const mockedRoundId = createRoundId(
  BigInt.fromString("0"),
  contractAddress
).toHexString();

describe("InvestmentVault tests", () => {
  beforeAll(() => {
    // mock contracts calls
    mockAsset(contractAddress, assetAddress);
    mockTotalAssets(contractAddress, BigInt.fromString("10"));
    // mock erc20 properties
    mockTokenName(contractAddress, "TEST_HV");
    mockTokenSymbol(contractAddress, "THV");
    mockTokenDecimals(contractAddress, BigInt.fromString("6"));
    //  mock underlying asset
    mockTokenName(assetAddress, "TEST_TOKEN");
    mockTokenSymbol(assetAddress, "TET");
    mockTokenDecimals(assetAddress, BigInt.fromString("18"));
  });

  describe("handleActionsAdded", () => {
    beforeAll(() => {
      mockPotionBuyAction(
        actionAddress,
        BigInt.fromString("0"),
        BigInt.fromString("0"),
        BigInt.fromString("0"),
        BigInt.fromString("0"),
        BigInt.fromString("0"),
        BigInt.fromString("0"),
        BigInt.fromString("0")
      );
      const mockedEvent = createActionsAdded([actionAddress]);
      handleActionsAdded(mockedEvent);
    });

    afterAll(clearStore);

    test("can handle the event", () => {
      assert.entityCount("HedgingVault", 1);
      assert.entityCount("Token", 2);
    });

    test("HedgingVault has been populated correctly", () => {
      assertEntity("HedgingVault", contractAddress.toHexString(), [
        {
          field: "action",
          value: "0x0000000000000000000000000000000000000001",
        },
        { field: "asset", value: assetAddress.toHexString() },
        { field: "shareToken", value: contractAddress.toHexString() },
        { field: "totalAssets", value: "10" },
      ]);
    });

    test("PotionBuyAction has been connected to HedgingVault", () => {
      assert.fieldEquals(
        "PotionBuyAction",
        actionAddress.toHexString(),
        "vault",
        contractAddress.toHexString()
      );
    });

    test("Token entities have been populated correctly", () => {
      assertEntity("Token", contractAddress.toHexString(), [
        { field: "name", value: "TEST_HV" },
        { field: "symbol", value: "THV" },
        { field: "decimals", value: "6" },
      ]);
      assertEntity("Token", assetAddress.toHexString(), [
        { field: "name", value: "TEST_TOKEN" },
        { field: "symbol", value: "TET" },
        { field: "decimals", value: "18" },
      ]);
    });
  });

  describe("handleVaultPositionEntered", () => {
    beforeAll(() => {
      mockHedgingVault(
        contractAddress,
        assetAddress,
        actionAddress,
        BigInt.fromString("30"),
        BigInt.fromString("0")
      );
      mockRound(BigInt.fromString("0"), contractAddress);
      const mockedEvent = createVaultPositionEntered(
        BigInt.fromString("100"),
        BigInt.fromString("50")
      );
      handleVaultPositionEntered(mockedEvent);
    });

    afterAll(clearStore);

    test("can handle the event", () => {
      assert.entityCount("HedgingVault", 1);
      assert.entityCount("Round", 1);
      assert.entityCount("Block", 1);
    });

    test("Round has been updated correctly", () => {
      assertEntity("Round", mockedRoundId, [
        { field: "assetsInvested", value: "50" },
        { field: "blockEntered", value: contractAddress.toHexString() },
      ]);
    });

    test("HedgingVault has been updated correctly", () => {
      assertEntity("HedgingVault", contractAddress.toHexString(), [
        { field: "lastAssetsInvested", value: "50" },
        { field: "totalAssets", value: "100" },
      ]);
    });
  });

  describe("handleVaultPositionExited", () => {
    beforeAll(() => {
      mockHedgingVault(
        contractAddress,
        assetAddress,
        actionAddress,
        BigInt.fromString("20"),
        BigInt.fromString("0")
      );
      mockRound(BigInt.fromString("0"), contractAddress);
      const mockedEvent = createVaultPositionExited(BigInt.fromString("60"));
      handleVaultPositionExited(mockedEvent);
    });

    afterAll(clearStore);

    test("can handle the event", () => {
      assert.entityCount("HedgingVault", 1);
      assert.entityCount("Round", 1);
      assert.entityCount("Block", 1);
    });

    test("Round has been updated correctly", () => {
      assertEntity("Round", mockedRoundId, [
        { field: "totalAssetsAtRoundEnd", value: "60" },
        { field: "blockExited", value: contractAddress.toHexString() },
      ]);
    });

    test("HedgingVault has been updated correctly", () => {
      assertEntity("HedgingVault", contractAddress.toHexString(), [
        { field: "totalAssets", value: "60" },
      ]);
    });
  });

  describe("Deposit", () => {
    beforeAll(() => {
      mockHedgingVault(
        contractAddress,
        assetAddress,
        actionAddress,
        BigInt.fromString("20"),
        BigInt.fromString("0")
      );
      mockRound(BigInt.fromString("0"), contractAddress);
      const mockedEvent = createDeposit(
        investorAddress,
        investorAddress,
        BigInt.fromString("50"),
        BigInt.fromString("10")
      );
      handleDeposit(mockedEvent);
    });
    afterAll(clearStore);

    test("can handle the event", () => {
      assert.entityCount("HedgingVault", 1);
      assert.entityCount("Deposit", 1);
      assert.entityCount("Block", 1);
    });

    test("Deposit has been created correctly", () => {
      assertEntity("Deposit", contractAddress.concatI32(0).toHexString(), [
        { field: "amount", value: "50" },
        { field: "shareAmount", value: "10" },
      ]);
    });
  });

  describe("Withdraw", () => {
    beforeAll(() => {
      mockHedgingVault(
        contractAddress,
        assetAddress,
        actionAddress,
        BigInt.fromString("20"),
        BigInt.fromString("0")
      );
      mockRound(BigInt.fromString("0"), contractAddress);
      const mockedEvent = createWithdraw(
        investorAddress,
        investorAddress,
        investorAddress,
        BigInt.fromString("50"),
        BigInt.fromString("10")
      );
      handleWithdraw(mockedEvent);
    });
    afterAll(clearStore);

    test("can handle the event", () => {
      assert.entityCount("HedgingVault", 1);
      assert.entityCount("Withdrawal", 1);
      assert.entityCount("Block", 1);
    });

    test("Withdrawal has been created correctly", () => {
      assertEntity("Withdrawal", contractAddress.concatI32(0).toHexString(), [
        { field: "amount", value: "50" },
        { field: "shareAmount", value: "10" },
      ]);
    });
  });
});
