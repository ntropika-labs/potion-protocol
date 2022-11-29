import { handleRoleGranted, handleRoleRevoked } from "../src/investmentVault";
import { getVaultRole } from "../src/roles";

import { createRoleGranted, createRoleRevoked } from "./events";
import {
  mockAdminRole,
  mockOperatorRole,
  mockStrategistRole,
} from "./contractCalls";
import { assertEntity, mockHedgingVault } from "./helpers";

import {
  test,
  describe,
  clearStore,
  beforeAll,
  beforeEach,
  afterEach,
  assert,
} from "matchstick-as/assembly/index";
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";

const vaultAddress = Address.fromString(
  "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
);
const underlyingAddress = Address.fromString(
  "0x0000000000000000000000000000000000000002"
);
const actionAddress = Address.fromString(
  "0x0000000000000000000000000000000000000003"
);

const adminAddress = Address.fromString(
  "0x0000000000000000000000000000000000000010"
);
const operatorAddress = Address.fromString(
  "0x0000000000000000000000000000000000000020"
);
const strategistAddress = Address.fromString(
  "0x0000000000000000000000000000000000000030"
);

const adminRole = Bytes.fromHexString(
  "0x0000000000000000000000000000000000000100"
);
const operatorRole = Bytes.fromHexString(
  "0x0000000000000000000000000000000000000200"
);
const strategistRole = Bytes.fromHexString(
  "0x0000000000000000000000000000000000000300"
);

describe("RolesManager", () => {
  beforeAll(() => {
    mockAdminRole(vaultAddress, adminRole);
    mockOperatorRole(vaultAddress, operatorRole);
    mockStrategistRole(vaultAddress, strategistRole);
  });
  describe("helper methods", () => {
    describe("getVaultRole", () => {
      test("returns 'admin'", () => {
        const result = getVaultRole(adminRole, vaultAddress);
        assert.stringEquals(result, "admin");
      });

      test("returns 'operator'", () => {
        const result = getVaultRole(operatorRole, vaultAddress);
        assert.stringEquals(result, "operator");
      });

      test("returns 'strategist'", () => {
        const result = getVaultRole(strategistRole, vaultAddress);
        assert.stringEquals(result, "strategist");
      });

      test("returns an empty string as fallback", () => {
        const result = getVaultRole(Bytes.fromI32(0), vaultAddress);
        assert.stringEquals(result, "");
      });
    });
  });

  describe("InvestmentVault roles", () => {
    describe("handleRoleGranted", () => {
      beforeEach(() => {
        mockHedgingVault(
          vaultAddress,
          actionAddress,
          underlyingAddress,
          BigInt.fromString("30"),
          BigInt.fromString("20"),
          BigInt.fromString("0")
        );
      });

      afterEach(clearStore);

      test("admin role setted correctly", () => {
        const mockedEvent = createRoleGranted(
          adminRole,
          adminAddress,
          vaultAddress
        );
        handleRoleGranted(mockedEvent);
        assertEntity("HedgingVault", vaultAddress.toHexString(), [
          { field: "admin", value: adminAddress.toHexString() },
          {
            field: "operator",
            value: "0x0000000000000000000000000000000000000000",
          },
          {
            field: "strategist",
            value: "0x0000000000000000000000000000000000000000",
          },
        ]);
      });

      test("operator role setted correctly", () => {
        const mockedEvent = createRoleGranted(
          operatorRole,
          operatorAddress,
          vaultAddress
        );
        handleRoleGranted(mockedEvent);
        assertEntity("HedgingVault", vaultAddress.toHexString(), [
          {
            field: "admin",
            value: "0x0000000000000000000000000000000000000000",
          },
          {
            field: "operator",
            value: operatorAddress.toHexString(),
          },
          {
            field: "strategist",
            value: "0x0000000000000000000000000000000000000000",
          },
        ]);
      });

      test("strategist role setted correctly", () => {
        const mockedEvent = createRoleGranted(
          strategistRole,
          strategistAddress,
          vaultAddress
        );
        handleRoleGranted(mockedEvent);
        assertEntity("HedgingVault", vaultAddress.toHexString(), [
          {
            field: "admin",
            value: "0x0000000000000000000000000000000000000000",
          },
          {
            field: "operator",
            value: "0x0000000000000000000000000000000000000000",
          },
          {
            field: "strategist",
            value: strategistAddress.toHexString(),
          },
        ]);
      });
    });

    describe("handleRoleRevoked", () => {
      beforeEach(() => {
        mockHedgingVault(
          vaultAddress,
          actionAddress,
          underlyingAddress,
          BigInt.fromString("30"),
          BigInt.fromString("20"),
          BigInt.fromString("0"),
          adminAddress,
          operatorAddress,
          strategistAddress
        );
      });

      afterEach(clearStore);

      test("admin role revoked correctly", () => {
        const mockedEvent = createRoleRevoked(
          adminRole,
          adminAddress,
          vaultAddress
        );
        handleRoleRevoked(mockedEvent);
        assertEntity("HedgingVault", vaultAddress.toHexString(), [
          { field: "admin", value: "null" },
          { field: "operator", value: operatorAddress.toHexString() },
          { field: "strategist", value: strategistAddress.toHexString() },
        ]);
      });

      test("operator role revoked correctly", () => {
        const mockedEvent = createRoleRevoked(
          operatorRole,
          operatorAddress,
          vaultAddress
        );
        handleRoleRevoked(mockedEvent);
        assertEntity("HedgingVault", vaultAddress.toHexString(), [
          { field: "admin", value: adminAddress.toHexString() },
          { field: "operator", value: "null" },
          { field: "strategist", value: strategistAddress.toHexString() },
        ]);
      });

      test("strategist role revoked correctly", () => {
        const mockedEvent = createRoleRevoked(
          strategistRole,
          strategistAddress,
          vaultAddress
        );
        handleRoleRevoked(mockedEvent);
        assertEntity("HedgingVault", vaultAddress.toHexString(), [
          { field: "admin", value: adminAddress.toHexString() },
          { field: "operator", value: operatorAddress.toHexString() },
          { field: "strategist", value: "null" },
        ]);
      });
    });
  });
});
