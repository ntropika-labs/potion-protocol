import {
  test,
  clearStore,
  describe,
  beforeEach,
  afterEach,
} from "matchstick-as/assembly/index";
import {
  createPoolId,
  createTemplateId,
  handleCurveSelected,
  handleOptionSettlementDistributed,
  handleOptionsSold,
} from "../../src/pools";
import { BigDecimal, BigInt, Address } from "@graphprotocol/graph-ts";
import {
  createCurveSelected,
  createOptionsSold,
  createOptionSettlementDistributed,
} from "../events";
import {
  assertEntity,
  createNewPool,
  createNewTemplate,
  createNewCurve,
  createNewOtoken,
} from "../helpers";
import {
  BIGINT_ONE_HUNDRED_AS_COLLATERAL,
  BIGINT_FIFTY_AS_COLLATERAL,
  BIGINT_TEN_AS_COLLATERAL,
  BIGINT_ZERO,
  MOCKED_CRITERIA_SET_ID,
  MOCKED_CURVE_ID,
  MOCKED_CURVE_A_ID,
  MOCKED_LP,
  MOCKED_OTOKEN_ID,
  MOCKED_TOKEN_A_ID,
  MOCKED_TOKEN_B_ID,
  MOCKED_TOKEN_C_ID,
} from "../constants";

describe("events handlers", () => {
  // setup mocked entities
  beforeEach(() => {
    createNewCurve(
      MOCKED_CURVE_ID,
      BigDecimal.fromString("1"),
      BigDecimal.fromString("2"),
      BigDecimal.fromString("3"),
      BigDecimal.fromString("4"),
      BigDecimal.fromString("1")
    );
    createNewOtoken(
      MOCKED_OTOKEN_ID,
      MOCKED_TOKEN_A_ID,
      MOCKED_LP,
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
    createNewTemplate(
      MOCKED_CURVE_ID,
      MOCKED_CRITERIA_SET_ID,
      "100000",
      "0",
      MOCKED_LP
    );
    const templateId = createTemplateId(
      MOCKED_CURVE_ID,
      MOCKED_CRITERIA_SET_ID
    );
    createNewPool(MOCKED_LP, BIGINT_ZERO, "100000", templateId);
  });
  afterEach(() => {
    clearStore();
  });

  // tests
  test("it can handle OptionsSold", () => {
    const mockedEvent = createOptionsSold(
      MOCKED_LP,
      BIGINT_ZERO,
      Address.fromBytes(MOCKED_OTOKEN_ID),
      MOCKED_CURVE_ID,
      BigInt.fromString("5"),
      BIGINT_ONE_HUNDRED_AS_COLLATERAL,
      BIGINT_FIFTY_AS_COLLATERAL
    );
    handleOptionsSold(mockedEvent);
    assertEntity("Pool", createPoolId(MOCKED_LP, BIGINT_ZERO), [
      ["size", "100050"],
      ["locked", "100"],
      ["unlocked", "99950"],
      ["liquidityAtTrades", "100000"],
      ["pnlTotal", "50"],
    ]);
    assertEntity(
      "Template",
      createTemplateId(MOCKED_CURVE_ID, MOCKED_CRITERIA_SET_ID),
      [
        ["size", "100050"],
        ["locked", "100"],
        ["liquidityAtTrades", "100000"],
        ["pnlTotal", "50"],
      ]
    );
  });

  test("it can handle OptionSettlementDistributed", () => {
    const mockedOptionsSold = createOptionsSold(
      MOCKED_LP,
      BIGINT_ZERO,
      Address.fromBytes(MOCKED_OTOKEN_ID),
      MOCKED_CURVE_ID,
      BigInt.fromString("5"),
      BIGINT_ONE_HUNDRED_AS_COLLATERAL,
      BIGINT_FIFTY_AS_COLLATERAL
    );
    handleOptionsSold(mockedOptionsSold);
    const mockedEvent = createOptionSettlementDistributed(
      Address.fromBytes(MOCKED_OTOKEN_ID),
      MOCKED_LP,
      BIGINT_ZERO,
      BIGINT_TEN_AS_COLLATERAL
    );
    handleOptionSettlementDistributed(mockedEvent);
    assertEntity("Pool", createPoolId(MOCKED_LP, BIGINT_ZERO), [
      ["size", "100000"],
      ["locked", "0"],
      ["unlocked", "100000"],
      ["liquidityAtTrades", "100000"],
      ["pnlTotal", "0"],
    ]);
    assertEntity(
      "Template",
      createTemplateId(MOCKED_CURVE_ID, MOCKED_CRITERIA_SET_ID),
      [
        ["size", "100000"],
        ["locked", "0"],
        ["liquidityAtTrades", "100000"],
        ["pnlTotal", "0"],
      ]
    );
  });
});

describe("OptionsSold and OptionSettlementDistributed mixed with template changes", () => {
  // setup mocked entities
  beforeEach(() => {
    createNewCurve(
      MOCKED_CURVE_ID,
      BigDecimal.fromString("1"),
      BigDecimal.fromString("2"),
      BigDecimal.fromString("3"),
      BigDecimal.fromString("4"),
      BigDecimal.fromString("1")
    );
    createNewCurve(
      MOCKED_CURVE_A_ID,
      BigDecimal.fromString("2"),
      BigDecimal.fromString("3"),
      BigDecimal.fromString("4"),
      BigDecimal.fromString("5"),
      BigDecimal.fromString("1")
    );
    createNewOtoken(
      MOCKED_OTOKEN_ID,
      MOCKED_TOKEN_A_ID,
      MOCKED_LP,
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
    createNewTemplate(
      MOCKED_CURVE_ID,
      MOCKED_CRITERIA_SET_ID,
      "100000",
      "0",
      MOCKED_LP
    );
    const templateId = createTemplateId(
      MOCKED_CURVE_ID,
      MOCKED_CRITERIA_SET_ID
    );
    createNewPool(MOCKED_LP, BIGINT_ZERO, "100000", templateId);
    const mockedEvent = createOptionsSold(
      MOCKED_LP,
      BIGINT_ZERO,
      Address.fromBytes(MOCKED_OTOKEN_ID),
      MOCKED_CURVE_ID,
      BigInt.fromString("5"),
      BIGINT_ONE_HUNDRED_AS_COLLATERAL,
      BIGINT_FIFTY_AS_COLLATERAL
    );
    handleOptionsSold(mockedEvent);
  });
  afterEach(() => {
    clearStore();
  });

  //tests
  test("after a curve change, OptionSettlementDistributed updates size/locked and PnL of the correct templates", () => {
    const templateChangeEvent = createCurveSelected(
      MOCKED_LP,
      BIGINT_ZERO,
      MOCKED_CURVE_A_ID
    );
    handleCurveSelected(templateChangeEvent);
    const mockedEvent = createOptionSettlementDistributed(
      Address.fromBytes(MOCKED_OTOKEN_ID),
      MOCKED_LP,
      BIGINT_ZERO,
      BIGINT_ONE_HUNDRED_AS_COLLATERAL
    );
    handleOptionSettlementDistributed(mockedEvent);
    const previousTemplateId = createTemplateId(
      MOCKED_CURVE_ID,
      MOCKED_CRITERIA_SET_ID
    );
    const currentTemplateId = createTemplateId(
      MOCKED_CURVE_A_ID,
      MOCKED_CRITERIA_SET_ID
    );
    assertEntity("Pool", createPoolId(MOCKED_LP, BIGINT_ZERO), [
      ["size", "100050"],
      ["locked", "0"],
      ["unlocked", "100050"],
      ["liquidityAtTrades", "100000"],
      ["pnlTotal", "50"],
    ]);
    assertEntity("Template", previousTemplateId, [
      ["size", "0"],
      ["locked", "0"],
      ["liquidityAtTrades", "100000"],
      ["pnlTotal", "50"],
    ]);
    assertEntity("Template", currentTemplateId, [
      ["size", "100050"],
      ["locked", "0"],
      ["liquidityAtTrades", "0"],
      ["pnlTotal", "0"],
    ]);
  });
});
