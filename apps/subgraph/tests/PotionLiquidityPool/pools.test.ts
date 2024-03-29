import { test, clearStore } from "matchstick-as/assembly/index";
import { log } from "matchstick-as/assembly/log";
import {
  createPoolId,
  handleCurveSelected,
  handleCriteriaSetSelected,
  handleDeposited,
  handleWithdrawn,
} from "../../src/pools";
import { BigDecimal } from "@graphprotocol/graph-ts";
import {
  createDeposited,
  createWithdrawn,
  createCurveSelected,
  createCriteriaSetSelected,
} from "../events";
import {
  assertEntity,
  createNewPool,
  createNewCurve,
  createNewCriteriaSet,
} from "../helpers";
import {
  MOCKED_LP,
  BIGINT_ZERO,
  BIGINT_ONE_HUNDRED_AS_COLLATERAL,
  MOCKED_CURVE_ID,
  MOCKED_CRITERIA_SET_ID,
} from "../constants";

// Test pool creation
test("It can create a pool", () => {
  log.info(
    "Trying to create a pool with poolId 0 and lp '0x0000000000000000000000000000000000000001'",
    []
  );
  createNewPool(MOCKED_LP, BIGINT_ZERO, "0", "");
  assertEntity("Pool", createPoolId(MOCKED_LP, BIGINT_ZERO), [
    ["size", "0"],
    ["unlocked", "0"],
    ["locked", "0"],
    ["lp", "0x0000000000000000000000000000000000000001"],
    ["pnlTotal", "0"],
    ["pnlPercentage", "0"],
    ["liquidityAtTrades", "0"],
  ]);
  clearStore();
});

// Test Deposit event
test("It can deposit liquidity in an already existing pool without a template", () => {
  log.info(
    "Trying to create a pool with poolId 0, lp '0x0000000000000000000000000000000000000001' and a size of 100",
    []
  );
  createNewPool(MOCKED_LP, BIGINT_ZERO, "100", "");
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
  assertEntity("Pool", createPoolId(MOCKED_LP, BIGINT_ZERO), [
    ["size", "200"],
    ["unlocked", "200"],
    ["locked", "0"],
    ["initialBalance", "100"],
  ]);
  clearStore();
});

// Test Withdrawn event
test("It can withdraw from a pool without a template leaving some liquidity inside", () => {
  createNewPool(MOCKED_LP, BIGINT_ZERO, "200", "");
  const mockedEvent = createWithdrawn(
    MOCKED_LP,
    BIGINT_ZERO,
    BIGINT_ONE_HUNDRED_AS_COLLATERAL
  );
  log.info(
    "Calling handleWithdrawn with poolId 0, lp '0x0000000000000000000000000000000000000001' and amount 100",
    []
  );
  handleWithdrawn(mockedEvent);
  assertEntity("Pool", createPoolId(MOCKED_LP, BIGINT_ZERO), [
    ["size", "100"],
    ["unlocked", "100"],
    ["locked", "0"],
    ["initialBalance", "200"],
  ]);
  clearStore();
});

test("It can withdraw from a pool without a template leaving it without liquidity", () => {
  createNewPool(MOCKED_LP, BIGINT_ZERO, "100", "");
  const mockedEvent = createWithdrawn(
    MOCKED_LP,
    BIGINT_ZERO,
    BIGINT_ONE_HUNDRED_AS_COLLATERAL
  );
  log.info(
    "Calling handleWithdrawn with poolId 0, lp '0x0000000000000000000000000000000000000001' and amount 100",
    []
  );
  handleWithdrawn(mockedEvent);
  assertEntity("Pool", createPoolId(MOCKED_LP, BIGINT_ZERO), [
    ["size", "0"],
    ["unlocked", "0"],
    ["locked", "0"],
    ["initialBalance", "100"],
  ]);
  clearStore();
});

test("It raises an error when we try to withdraw from a pool that doesn't exist", () => {
  const mockedEvent = createWithdrawn(
    MOCKED_LP,
    BIGINT_ZERO,
    BIGINT_ONE_HUNDRED_AS_COLLATERAL
  );
  log.info(
    "Calling handleWithdrawn with poolId 0, lp '0x0000000000000000000000000000000000000001' and amount 100",
    []
  );
  handleWithdrawn(mockedEvent);
  clearStore();
});

test("It raises an error when we try to withdraw more liqudity than what was actually available in the pool", () => {
  createNewPool(MOCKED_LP, BIGINT_ZERO, "50", "");
  const mockedEvent = createWithdrawn(
    MOCKED_LP,
    BIGINT_ZERO,
    BIGINT_ONE_HUNDRED_AS_COLLATERAL
  );
  log.info(
    "Calling handleWithdrawn with poolId 0, lp '0x0000000000000000000000000000000000000001' and amount 100",
    []
  );
  handleWithdrawn(mockedEvent);
  clearStore();
});

// CurveSelected tests
test("It can assign a new curve to a new pool", () => {
  const mockedEvent = createCurveSelected(
    MOCKED_LP,
    BIGINT_ZERO,
    MOCKED_CURVE_ID
  );
  log.info(
    "Calling handleCurveSelected with poolId 0, lp '0x0000000000000000000000000000000000000001' and curveId '0x00000000000000000000000000000000000000100'",
    []
  );
  handleCurveSelected(mockedEvent);
  assertEntity("Pool", createPoolId(MOCKED_LP, BIGINT_ZERO), [
    ["size", "0"],
    ["unlocked", "0"],
    ["locked", "0"],
    ["lp", "0x0000000000000000000000000000000000000001"],
  ]);
  clearStore();
});

test("It can assign an existing curve to a new pool", () => {
  createNewCurve(
    MOCKED_CURVE_ID,
    BigDecimal.fromString("1"),
    BigDecimal.fromString("2"),
    BigDecimal.fromString("3"),
    BigDecimal.fromString("4"),
    BigDecimal.fromString("1")
  );
  log.info(
    "Created curve with parameters { a: 1, b: 2, c: 3, d: 4, maxUtil: 1 }",
    []
  );
  const mockedEvent = createCurveSelected(
    MOCKED_LP,
    BIGINT_ZERO,
    MOCKED_CURVE_ID
  );
  log.info(
    "Calling handleCurveSelected with poolId 0, lp '0x0000000000000000000000000000000000000001' and curveId '0x00000000000000000000000000000000000000100'",
    []
  );
  handleCurveSelected(mockedEvent);
  assertEntity("Pool", createPoolId(MOCKED_LP, BIGINT_ZERO), [
    ["size", "0"],
    ["unlocked", "0"],
    ["locked", "0"],
    ["lp", "0x0000000000000000000000000000000000000001"],
  ]);
  clearStore();
});

test("It can assign a new curve to an existing pool", () => {
  createNewPool(MOCKED_LP, BIGINT_ZERO, "0", "");
  log.info(
    "Created pool with poolId 0 and lp '0x0000000000000000000000000000000000000001'",
    []
  );
  const mockedEvent = createCurveSelected(
    MOCKED_LP,
    BIGINT_ZERO,
    MOCKED_CURVE_ID
  );
  log.info(
    "Calling handleCurveSelected with poolId 0, lp '0x0000000000000000000000000000000000000001' and curveId '0x00000000000000000000000000000000000000100'",
    []
  );
  handleCurveSelected(mockedEvent);
  assertEntity("Pool", createPoolId(MOCKED_LP, BIGINT_ZERO), [
    ["size", "0"],
    ["unlocked", "0"],
    ["locked", "0"],
    ["initialBalance", "0"],
  ]);
  clearStore();
});

test("It can assign an existing curve to an exististing pool", () => {
  createNewPool(MOCKED_LP, BIGINT_ZERO, "0", "");
  log.info(
    "Created pool with poolId 0 and lp '0x0000000000000000000000000000000000000001'",
    []
  );
  createNewCurve(
    MOCKED_CURVE_ID,
    BigDecimal.fromString("1"),
    BigDecimal.fromString("2"),
    BigDecimal.fromString("3"),
    BigDecimal.fromString("4"),
    BigDecimal.fromString("1")
  );
  log.info(
    "Created curve with parameters { a: 1, b: 2, c: 3, d: 4, maxUtil: 1 }",
    []
  );
  const mockedEvent = createCurveSelected(
    MOCKED_LP,
    BIGINT_ZERO,
    MOCKED_CURVE_ID
  );
  log.info(
    "Calling handleCurveSelected with poolId 0, lp '0x0000000000000000000000000000000000000001' and curveId '0x00000000000000000000000000000000000000100'",
    []
  );
  handleCurveSelected(mockedEvent);
  assertEntity("Pool", createPoolId(MOCKED_LP, BIGINT_ZERO), [
    ["size", "0"],
    ["unlocked", "0"],
    ["locked", "0"],
    ["initialBalance", "0"],
  ]);
  clearStore();
});

// CriteriaSetSelected tests
test("It can assign an existing criteriaSet to a new pool", () => {
  createNewCriteriaSet(MOCKED_CRITERIA_SET_ID);
  log.info(
    "Created criteriaSet with id '0x00000000000000000000000000000000000001000'",
    []
  );
  const mockedEvent = createCriteriaSetSelected(
    MOCKED_LP,
    BIGINT_ZERO,
    MOCKED_CRITERIA_SET_ID
  );
  log.info(
    "Calling handleCriteriaSetSelected with poolId 0, lp '0x0000000000000000000000000000000000000001' and criteriaSetId '0x00000000000000000000000000000000000001000'",
    []
  );
  handleCriteriaSetSelected(mockedEvent);
  assertEntity("Pool", createPoolId(MOCKED_LP, BIGINT_ZERO), [
    ["size", "0"],
    ["unlocked", "0"],
    ["locked", "0"],
    ["lp", "0x0000000000000000000000000000000000000001"],
  ]);
  clearStore();
});

test("It can assign a new criteriaSet to an existing pool", () => {
  createNewPool(MOCKED_LP, BIGINT_ZERO, "0", "");
  log.info(
    "Created pool with poolId 0 and lp '0x0000000000000000000000000000000000000001'",
    []
  );
  const mockedEvent = createCriteriaSetSelected(
    MOCKED_LP,
    BIGINT_ZERO,
    MOCKED_CRITERIA_SET_ID
  );
  log.info(
    "Calling handleCriteriaSetSelected with poolId 0, lp '0x0000000000000000000000000000000000000001' and criteriaSetId '0x00000000000000000000000000000000000001000'",
    []
  );
  handleCriteriaSetSelected(mockedEvent);
  assertEntity("Pool", createPoolId(MOCKED_LP, BIGINT_ZERO), [
    ["size", "0"],
    ["unlocked", "0"],
    ["locked", "0"],
    ["lp", "0x0000000000000000000000000000000000000001"],
  ]);
  clearStore();
});

test("It can assign an existing criteriaSet to an exististing pool", () => {
  createNewPool(MOCKED_LP, BIGINT_ZERO, "0", "");
  log.info(
    "Created pool with poolId 0 and lp '0x0000000000000000000000000000000000000001'",
    []
  );
  createNewCriteriaSet(MOCKED_CRITERIA_SET_ID);
  log.info(
    "Created criteriaSet with id '0x00000000000000000000000000000000000001000'",
    []
  );
  const mockedEvent = createCriteriaSetSelected(
    MOCKED_LP,
    BIGINT_ZERO,
    MOCKED_CRITERIA_SET_ID
  );
  log.info(
    "Calling handleCriteriaSetSelected with poolId 0, lp '0x0000000000000000000000000000000000000001' and criteriaSetId '0x00000000000000000000000000000000000001000'",
    []
  );
  handleCriteriaSetSelected(mockedEvent);
  assertEntity("Pool", createPoolId(MOCKED_LP, BIGINT_ZERO), [
    ["size", "0"],
    ["unlocked", "0"],
    ["locked", "0"],
    ["initialBalance", "0"],
  ]);
  clearStore();
});
