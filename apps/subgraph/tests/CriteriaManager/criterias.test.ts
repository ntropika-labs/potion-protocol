import { test, clearStore } from "matchstick-as/assembly/index";
import { log } from "matchstick-as/assembly/log";
import {
  handleCriteriaAdded,
  handleCriteriaSetAdded,
} from "../../src/criterias";
import { BigDecimal, BigInt, Address } from "@graphprotocol/graph-ts";
import {
  assertBytesEntity as assertEntity,
  createNewCriteria,
  createNewCriteriaSet,
  createNewCriteriaJoinedCriteriaSet,
} from "../helpers";
import { createCriteriaAdded, createCriteriaSetAdded } from "../events";
import {
  MOCKED_CRITERIA_ID,
  MOCKED_CRITERIA_A_ID,
  MOCKED_CRITERIA_B_ID,
  MOCKED_CRITERIA_SET_ID,
  MOCKED_TOKEN_A_ID,
  MOCKED_TOKEN_B_ID,
} from "../constants";

// criteria creation
test("It can create a criteria", () => {
  createNewCriteria(
    MOCKED_CRITERIA_ID,
    MOCKED_TOKEN_A_ID,
    MOCKED_TOKEN_B_ID,
    true,
    BigDecimal.fromString("100"),
    BigInt.fromString("30")
  );
  log.info(
    "Created criteria with maxStrikePercent 100 and maxDurationInDays 30",
    []
  );
  assertEntity("Criteria", MOCKED_CRITERIA_ID, [
    ["isPut", "true"],
    ["maxStrikePercent", "100"],
    ["maxDurationInDays", "30"],
  ]);
  clearStore();
});

// criteriaSet creation
test("It can create a criteriaSet", () => {
  createNewCriteriaSet(MOCKED_CRITERIA_SET_ID);
  clearStore();
});

// criteria joined to a CriteriaSet
test("It can join a criteria with a CriteriaSet", () => {
  createNewCriteria(
    MOCKED_CRITERIA_ID,
    MOCKED_TOKEN_A_ID,
    MOCKED_TOKEN_B_ID,
    true,
    BigDecimal.fromString("100"),
    BigInt.fromString("30")
  );
  log.info(
    "Created criteria with maxStrikePercent 100 and maxDurationInDays 30",
    []
  );
  createNewCriteriaSet(MOCKED_CRITERIA_SET_ID);
  createNewCriteriaJoinedCriteriaSet(
    MOCKED_CRITERIA_ID,
    MOCKED_CRITERIA_SET_ID
  );
  clearStore();
});

// CriteriaAdded event
test("In can handle the CriteriaAdded event whn the criteria doesn't exist", () => {
  const mockedEvent = createCriteriaAdded(
    MOCKED_CRITERIA_ID,
    Address.fromBytes(MOCKED_TOKEN_A_ID),
    Address.fromBytes(MOCKED_TOKEN_B_ID),
    true,
    BigInt.fromString("100"),
    BigInt.fromString("30")
  );
  log.info(
    "Invoking handleCriteriaAdded with parameters { isPut: true, maxStrikePercent: 100, maxDurationInDays: 30 }",
    []
  );
  handleCriteriaAdded(mockedEvent);
  assertEntity("Criteria", MOCKED_CRITERIA_ID, [
    ["isPut", "true"],
    ["maxStrikePercent", "100"],
    ["maxDurationInDays", "30"],
  ]);
  clearStore();
});
test("In can handle the CriteriaAdded event when the criteria is already present", () => {
  createNewCriteria(
    MOCKED_CRITERIA_ID,
    MOCKED_TOKEN_A_ID,
    MOCKED_TOKEN_B_ID,
    true,
    BigDecimal.fromString("100"),
    BigInt.fromString("30")
  );
  log.info(
    "Created criteria with maxStrikePercent 100 and maxDurationInDays 30",
    []
  );
  const mockedEvent = createCriteriaAdded(
    MOCKED_CRITERIA_ID,
    Address.fromBytes(MOCKED_TOKEN_A_ID),
    Address.fromBytes(MOCKED_TOKEN_B_ID),
    true,
    BigInt.fromString("100"),
    BigInt.fromString("30")
  );
  log.info(
    "Invoking handleCriteriaAdded with parameters { maxStrikePercent: 1000, maxDurationInDays: 200 }",
    []
  );
  handleCriteriaAdded(mockedEvent);
  assertEntity("Criteria", MOCKED_CRITERIA_ID, [
    ["isPut", "true"],
    ["maxStrikePercent", "100"],
    ["maxDurationInDays", "30"],
  ]);
  clearStore();
});

// CriteriaSetAdded event
test("In can handle CriteriaSetAdded", () => {
  createNewCriteria(
    MOCKED_CRITERIA_A_ID,
    MOCKED_TOKEN_A_ID,
    MOCKED_TOKEN_B_ID,
    true,
    BigDecimal.fromString("100"),
    BigInt.fromString("30")
  );
  log.info(
    "Created criteria with maxStrikePercent 100 and maxDurationInDays 30",
    []
  );
  createNewCriteria(
    MOCKED_CRITERIA_B_ID,
    MOCKED_TOKEN_A_ID,
    MOCKED_TOKEN_B_ID,
    true,
    BigDecimal.fromString("200"),
    BigInt.fromString("13")
  );
  log.info(
    "Created criteria with maxStrikePercent 200 and maxDurationInDays 13",
    []
  );
  const mockedEvent = createCriteriaSetAdded(MOCKED_CRITERIA_SET_ID, [
    MOCKED_CRITERIA_A_ID,
    MOCKED_CRITERIA_B_ID,
  ]);
  log.info(
    "Invoking handleCriteriaSetAdded passing criteriaSetId '0x0000000000000000000000000000000000001000' and as criterias ['0x0000000000000000000000000000000000000200', '0x0000000000000000000000000000000000000300']",
    []
  );
  handleCriteriaSetAdded(mockedEvent);
  clearStore();
});
