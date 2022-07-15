import { test, clearStore } from "matchstick-as/assembly/index";
import { log } from "matchstick-as/assembly/log";
import { BigInt, BigDecimal, Address } from "@graphprotocol/graph-ts";
import {
  MOCKED_TOKEN_A_ID,
  MOCKED_TOKEN_B_ID,
  MOCKED_TOKEN_C_ID,
  MOCKED_OTOKEN_ID,
  MOCKED_LP,
  COLLATERAL_PRECISION_DECIMALS,
} from "../constants";
import {
  assertBytesEntity,
  assertEntity,
  createNewOtoken,
  formatStrike,
} from "../helpers";
import { createOtokenCreated } from "../events";
import { mockDecimals } from "../mocks";
import { handleOtokenCreate } from "../../src/otoken";

// otoken creation
test("It can create an otoken", () => {
  createNewOtoken(
    MOCKED_OTOKEN_ID,
    MOCKED_TOKEN_A_ID,
    MOCKED_LP.toHexString(),
    MOCKED_TOKEN_B_ID,
    MOCKED_TOKEN_C_ID,
    MOCKED_TOKEN_C_ID,
    BigDecimal.fromString("100"),
    BigInt.fromString("30"),
    true,
    BigInt.fromString("18"),
    false,
    BigDecimal.fromString("200"),
    BigDecimal.fromString("100"),
    BigDecimal.fromString("0"),
    BigDecimal.fromString("5"),
    BigInt.fromString("12")
  );
  assertBytesEntity("OToken", MOCKED_OTOKEN_ID, [
    ["collateralAsset", MOCKED_TOKEN_C_ID],
    ["collateralized", "100"],
    ["creator", MOCKED_LP.toHexString()],
    ["decimals", "18"],
    ["expiry", "30"],
    ["isPut", "true"],
    ["liquiditySettled", "0"],
    ["numberOfOTokens", "5"],
    ["premium", "200"],
    ["purchasesCount", "12"],
    ["settled", "false"],
    ["strikeAsset", MOCKED_TOKEN_C_ID],
    ["strikePrice", "100"],
    ["tokenAddress", MOCKED_TOKEN_A_ID],
    ["underlyingAsset", MOCKED_TOKEN_B_ID],
  ]);
  clearStore();
});

// OtokenCreated event
test("It can handle the OtokenCreated event", () => {
  const mockedEvent = createOtokenCreated(
    Address.fromString(MOCKED_TOKEN_A_ID),
    MOCKED_LP,
    Address.fromString(MOCKED_TOKEN_B_ID),
    Address.fromString(MOCKED_TOKEN_C_ID),
    Address.fromString(MOCKED_TOKEN_C_ID),
    formatStrike("1000"),
    BigInt.fromString("30"),
    true
  );
  log.info("Preparing the mocked decimals function, it will return an 8", []);
  mockDecimals(MOCKED_OTOKEN_ID, COLLATERAL_PRECISION_DECIMALS.toString());
  log.info(
    "Calling handleOtokenCreate with parameters: { strikePrice: 1000, expiry: 30 }",
    []
  );
  handleOtokenCreate(mockedEvent);
  assertEntity("OToken", MOCKED_TOKEN_A_ID, [
    ["collateralAsset", MOCKED_TOKEN_C_ID],
    ["collateralized", "0"],
    ["creator", MOCKED_LP.toHexString()],
    ["decimals", COLLATERAL_PRECISION_DECIMALS.toString()],
    ["expiry", "30"],
    ["isPut", "true"],
    ["liquiditySettled", "0"],
    ["numberOfOTokens", "0"],
    ["premium", "0"],
    ["purchasesCount", "0"],
    ["settled", "false"],
    ["strikeAsset", MOCKED_TOKEN_C_ID],
    ["strikePrice", "1000"],
    ["tokenAddress", MOCKED_TOKEN_A_ID],
    ["underlyingAsset", MOCKED_TOKEN_B_ID],
  ]);
  clearStore();
});
