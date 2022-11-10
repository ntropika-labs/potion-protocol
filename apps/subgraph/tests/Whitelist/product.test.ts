import { test, clearStore } from "matchstick-as/assembly/index";
import { log } from "matchstick-as/assembly/log";
import { createProductWhitelisted } from "../events";
import { Address, Bytes } from "@graphprotocol/graph-ts";
import {
  MOCKED_TOKEN_A_ID,
  MOCKED_TOKEN_B_ID,
  MOCKED_TOKEN_C_ID,
} from "../constants";
import { assertBytesEntity as assertEntity, mockTokenCalls } from "../helpers";
import { handleProductWhitelist } from "../../src/token";

test("it can create a new Product after a productWhitelisted event", () => {
  const mockedEvent = createProductWhitelisted(
    Bytes.fromHexString(""),
    Address.fromBytes(MOCKED_TOKEN_A_ID),
    Address.fromBytes(MOCKED_TOKEN_B_ID),
    Address.fromBytes(MOCKED_TOKEN_C_ID),
    false
  );
  mockTokenCalls(MOCKED_TOKEN_A_ID, "8", "UNIT_TEST_TOKEN", "UTT");
  log.info(
    "Calling handleProductWhitelist with underlying {}, strike {}, collateral {}",
    [
      MOCKED_TOKEN_A_ID.toHexString(),
      MOCKED_TOKEN_B_ID.toHexString(),
      MOCKED_TOKEN_C_ID.toHexString(),
    ]
  );
  handleProductWhitelist(mockedEvent);
  const productID =
    MOCKED_TOKEN_A_ID.concat(MOCKED_TOKEN_B_ID).concat(MOCKED_TOKEN_C_ID);
  assertEntity("Product", productID, [
    ["id", productID.toHexString()],
    ["underlying", MOCKED_TOKEN_A_ID.toHexString()],
    ["strike", MOCKED_TOKEN_B_ID.toHexString()],
    ["collateral", MOCKED_TOKEN_C_ID.toHexString()],
    ["isPut", "false"],
    ["isWhitelisted", "true"],
  ]);
  clearStore();
});
