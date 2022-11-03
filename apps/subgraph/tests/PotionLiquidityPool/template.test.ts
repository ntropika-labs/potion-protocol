import { test, clearStore } from "matchstick-as/assembly/index";
import { log } from "matchstick-as/assembly/log";
import { handleDeposited, createTemplateId } from "../../src/pools";
import { BigDecimal } from "@graphprotocol/graph-ts";
import { createDeposited } from "../events";
import {
  assertEntity,
  createNewPool,
  createNewTemplate,
  createNewCurve,
} from "../helpers";
import {
  MOCKED_LP,
  BIGINT_ZERO,
  BIGINT_ONE,
  BIGINT_ONE_HUNDRED_AS_COLLATERAL,
  MOCKED_CURVE_ID,
  MOCKED_CRITERIA_SET_ID,
} from "../constants";

// template creation
test("It can create a template", () => {
  createNewTemplate(
    MOCKED_CURVE_ID,
    MOCKED_CRITERIA_SET_ID,
    "0",
    "0",
    MOCKED_LP
  );
  clearStore();
});

// Deposit event
test("It can deposit liquidity in an already existing pool with a template", () => {
  createNewCurve(
    MOCKED_CURVE_ID,
    BigDecimal.fromString("1"),
    BigDecimal.fromString("2"),
    BigDecimal.fromString("3"),
    BigDecimal.fromString("4"),
    BigDecimal.fromString("1")
  );
  log.info(
    "Trying to create a pool with poolId 0, lp '0x0000000000000000000000000000000000000001' and a size of 100",
    []
  );
  createNewTemplate(
    MOCKED_CURVE_ID,
    MOCKED_CRITERIA_SET_ID,
    "100",
    "0",
    MOCKED_LP
  );
  const templateId = createTemplateId(MOCKED_CURVE_ID, MOCKED_CRITERIA_SET_ID);
  createNewPool(MOCKED_LP, BIGINT_ZERO, "100", templateId);
  log.info("Stored the pool, proceding with the mocked event", []);
  const mockedEvent = createDeposited(
    MOCKED_LP,
    BIGINT_ZERO,
    BIGINT_ONE_HUNDRED_AS_COLLATERAL
  );
  log.info(
    "Calling handleDeposited with poolId 0, lp '0x0000000000000000000000000000000000000001' and amount 100",
    []
  );
  handleDeposited(mockedEvent);
  assertEntity("Template", templateId, [
    ["size", "200"],
    ["locked", "0"],
  ]);
  clearStore();
});
test("It can deposit liquidity in an already existing pool with a template that has other pools", () => {
  createNewCurve(
    MOCKED_CURVE_ID,
    BigDecimal.fromString("1"),
    BigDecimal.fromString("2"),
    BigDecimal.fromString("3"),
    BigDecimal.fromString("4"),
    BigDecimal.fromString("1")
  );
  createNewTemplate(
    MOCKED_CURVE_ID,
    MOCKED_CRITERIA_SET_ID,
    "150",
    "0",
    MOCKED_LP
  );
  const templateId = createTemplateId(MOCKED_CURVE_ID, MOCKED_CRITERIA_SET_ID);
  createNewPool(MOCKED_LP, BIGINT_ZERO, "100", templateId);
  log.info(
    "Created a pool with poolId 0, lp '0x0000000000000000000000000000000000000001' and a size of 100",
    []
  );
  createNewPool(MOCKED_LP, BIGINT_ONE, "50", templateId);
  log.info(
    "Created a pool with poolId 1, lp '0x0000000000000000000000000000000000000001' and a size of 50",
    []
  );
  log.info("Stored the pool, proceding with the mocked event", []);
  const mockedEvent = createDeposited(
    MOCKED_LP,
    BIGINT_ZERO,
    BIGINT_ONE_HUNDRED_AS_COLLATERAL
  );
  log.info(
    "Calling handleDeposited with poolId 0, lp '0x0000000000000000000000000000000000000001' and amount 100",
    []
  );
  handleDeposited(mockedEvent);
  assertEntity("Template", templateId, [
    ["size", "250"],
    ["locked", "0"],
  ]);
  clearStore();
});
