import { describe, expect, it } from "vitest";
import { groupVaultsByUnderlyingAndDeposit } from "../hedgingVaults";

describe("hedgingVault helper", () => {
  describe("groupVaultsByUnderlyingAndDeposit", () => {
    const vaultsRes = [
      {
        address: "0x4c2f7092c2ae51d986befee378e50bd4db99c901",
        underlying: {
          address: "0xMock1",
          name: "Mock 1",
          symbol: "MCK1",
          decimals: 18,
        },
        action: {
          maxPremium: "15.0",
          cycleDurationInSecs: "86400",
        },
        rounds: [
          {
            depositTickets: [
              {
                id: "0xmock",
                __typename: "DepositTicket",
              },
            ],
          },
        ],
        hedgingRate: "100.0",
        strikePercentage: "80.0",
        strategy: "PROTECTIVE_PUT",
      },
      {
        address: "0xa7c59f010700930003b33ab25a7a0679c860f29c",
        underlying: {
          address: "0xMock1",
          name: "Mock 1",
          symbol: "MCK1",
          decimals: 18,
        },
        action: {
          maxPremium: "15.0",
          cycleDurationInSecs: "86400",
        },
        rounds: [],
        hedgingRate: "200.0",
        strikePercentage: "80.0",
        strategy: "STRADDLE",
      },
      {
        address: "0xd6e1afe5ca8d00a2efc01b89997abe2de47fdfaf",
        underlying: {
          address: "0xMock2",
          name: "Mock 2",
          symbol: "MCK2",
          decimals: 18,
        },
        action: {
          maxPremium: "15.0",
          cycleDurationInSecs: "172800",
        },
        rounds: [{ depositTickets: [] }],
        size: "0",
        hedgingRate: "100.0",
        strikePercentage: "80.0",
        strategy: "PROTECTIVE_PUT",
      },
    ];

    it("can parse empty data", () => {
      const parsedVaults = groupVaultsByUnderlyingAndDeposit([]);

      expect(parsedVaults).toHaveProperty("availableUnderlyings");
      expect(parsedVaults).toHaveProperty("personalVaults");
      expect(parsedVaults).toHaveProperty("vaultsByUnderlying");

      expect(parsedVaults.vaultsByUnderlying).toBeDefined();
      expect(parsedVaults.personalVaults).toHaveLength(0);
      expect(parsedVaults.availableUnderlyings).toHaveLength(0);
    });

    it("can parse correct data", () => {
      const parsedVaults = groupVaultsByUnderlyingAndDeposit(vaultsRes);

      expect(parsedVaults).toHaveProperty("availableUnderlyings");
      expect(parsedVaults).toHaveProperty("personalVaults");
      expect(parsedVaults).toHaveProperty("availableUnderlyings");

      expect(parsedVaults.vaultsByUnderlying).toHaveProperty("0xMock1");
      expect(parsedVaults.vaultsByUnderlying).toHaveProperty("0xMock1[0]");
      expect(parsedVaults.vaultsByUnderlying).toHaveProperty("0xMock1[1]");
      expect(parsedVaults.vaultsByUnderlying).toHaveProperty("0xMock2");
      expect(parsedVaults.personalVaults).toHaveLength(1);
      expect(parsedVaults.personalVaults).toContainEqual(vaultsRes[0]);
      expect(parsedVaults.availableUnderlyings).toHaveLength(2);
    });

    describe("can set the correct strategy", () => {
      const parsedVaults = groupVaultsByUnderlyingAndDeposit(vaultsRes);

      it("parses '100.0' hedging rate as a PROTECTIVE_PUT", () => {
        expect(parsedVaults.vaultsByUnderlying).toHaveProperty(
          "0xMock1.0.strategy",
          vaultsRes[0].strategy
        );
      });

      it("parses '200.0' hedging rate as a STRADDLE", () => {
        expect(parsedVaults.vaultsByUnderlying).toHaveProperty(
          "0xMock1.1.strategy",
          vaultsRes[1].strategy
        );
      });

      it("parses '100.0' hedging rate as a PROTECTIVE_PUT", () => {
        expect(parsedVaults.vaultsByUnderlying).toHaveProperty(
          "0xMock2.0.strategy",
          vaultsRes[2].strategy
        );
      });
    });
  });
});
