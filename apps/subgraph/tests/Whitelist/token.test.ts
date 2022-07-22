import { test, clearStore } from "matchstick-as/assembly/index";
import { log } from "matchstick-as/assembly/log";
import { Address, Bytes } from "@graphprotocol/graph-ts";
import {
  MOCKED_TOKEN_A_ID,
  MOCKED_TOKEN_B_ID,
  MOCKED_TOKEN_C_ID,
  COLLATERAL_PRECISION_DECIMALS,
} from "../constants";
import {
  createCollateralWhitelisted,
  createProductWhitelisted,
} from "../events";
import { assertEntity, mockTokenCalls } from "../helpers";
import {
  handleCollateralWhitelist,
  handleProductWhitelist,
} from "../../src/token";

test("it can create a new collateral token after a collateralWhitelisted event", () => {
  const mockedEvent = createCollateralWhitelisted(
    Address.fromString(MOCKED_TOKEN_A_ID)
  );
  mockTokenCalls(
    MOCKED_TOKEN_A_ID,
    COLLATERAL_PRECISION_DECIMALS.toString(),
    "UNIT_TEST_TOKEN",
    "UTT"
  );
  log.info("Calling handleCollateralWhitelist with the following Token {}", [
    MOCKED_TOKEN_A_ID,
  ]);
  handleCollateralWhitelist(mockedEvent);
  assertEntity("Token", MOCKED_TOKEN_A_ID, [
    ["id", MOCKED_TOKEN_A_ID],
    ["address", MOCKED_TOKEN_A_ID],
    ["decimals", COLLATERAL_PRECISION_DECIMALS.toString()],
    ["name", "UNIT_TEST_TOKEN"],
    ["symbol", "UTT"],
    ["tokenType", "COLLATERAL"],
  ]);
  clearStore();
});

test("it can create a new underlying token after a productWhitelisted event", () => {
  const mockedEvent = createProductWhitelisted(
    Bytes.fromHexString(""),
    Address.fromString(MOCKED_TOKEN_A_ID),
    Address.fromString(MOCKED_TOKEN_B_ID),
    Address.fromString(MOCKED_TOKEN_C_ID),
    false
  );
  mockTokenCalls(
    MOCKED_TOKEN_A_ID,
    COLLATERAL_PRECISION_DECIMALS.toString(),
    "UNIT_TEST_TOKEN",
    "UTT"
  );
  handleProductWhitelist(mockedEvent);
  assertEntity("Token", MOCKED_TOKEN_A_ID, [
    ["id", MOCKED_TOKEN_A_ID],
    ["address", MOCKED_TOKEN_A_ID],
    ["decimals", COLLATERAL_PRECISION_DECIMALS.toString()],
    ["name", "UNIT_TEST_TOKEN"],
    ["symbol", "UTT"],
    ["tokenType", "UNDERLYING"],
  ]);
  clearStore();
});
