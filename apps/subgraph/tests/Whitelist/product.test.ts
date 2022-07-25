import { test, clearStore } from "matchstick-as/assembly/index";
import { log } from "matchstick-as/assembly/log";
import { createProductWhitelisted } from "../events";
import { Address, Bytes } from "@graphprotocol/graph-ts";
import {
  MOCKED_TOKEN_A_ID,
  MOCKED_TOKEN_B_ID,
  MOCKED_TOKEN_C_ID,
} from "../constants";
import { assertEntity, mockTokenCalls } from "../helpers";
import { handleProductWhitelist } from "../../src/token";

test("it can create a new Product after a productWhitelisted event", () => {
  const mockedEvent = createProductWhitelisted(
    Bytes.fromHexString(""),
    Address.fromString(MOCKED_TOKEN_A_ID),
    Address.fromString(MOCKED_TOKEN_B_ID),
    Address.fromString(MOCKED_TOKEN_C_ID),
    false
  );
  mockTokenCalls(MOCKED_TOKEN_A_ID, "8", "UNIT_TEST_TOKEN", "UTT");
  log.info(
    "Calling handleProductWhitelist with underlying {}, strike {}, collateral {}",
    [MOCKED_TOKEN_A_ID, MOCKED_TOKEN_B_ID, MOCKED_TOKEN_C_ID]
  );
  handleProductWhitelist(mockedEvent);
  const productID = MOCKED_TOKEN_A_ID + MOCKED_TOKEN_B_ID + MOCKED_TOKEN_C_ID;
  assertEntity("Product", productID, [
    ["id", productID],
    ["underlying", MOCKED_TOKEN_A_ID],
    ["strike", MOCKED_TOKEN_B_ID],
    ["collateral", MOCKED_TOKEN_C_ID],
    ["isPut", "false"],
    ["isWhitelisted", "true"],
  ]);
  clearStore();
});
