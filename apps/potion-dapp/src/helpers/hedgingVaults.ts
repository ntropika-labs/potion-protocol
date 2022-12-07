import type { VaultData, VaultDataWithStrategy } from "@/types";
import { VaultStrategy, type Token } from "dapp-types";
import { useTokenList } from "@/composables/useTokenList";

function convertToVaultWithStrategy(vault: VaultData): VaultDataWithStrategy {
  let strategy = VaultStrategy.PROTECTIVE_PUT;
  const straddleHedgingRate = "200.0";

  if (straddleHedgingRate === vault.hedgingRate)
    strategy = VaultStrategy.STRADDLE;

  return { ...vault, strategy };
}

function groupVaultsByUnderlyingAndDeposit(vaults: VaultData[]) {
  const vaultsByUnderlying: {
    [underlyinAddress: string]: VaultDataWithStrategy[];
  } = {};
  const availableUnderlyings: Token[] = [];
  const personalVaults: VaultDataWithStrategy[] = [];

  for (let i = 0; i < vaults.length; i++) {
    const vault = convertToVaultWithStrategy(vaults[i]);

    let underlyingVaults = vaultsByUnderlying[vault.underlying.address];
    if (!underlyingVaults) {
      underlyingVaults = [];
      availableUnderlyings.push(useTokenList(vault.underlying.address));
    }

    underlyingVaults.push(vault);

    vaultsByUnderlying[vault.underlying.address] = underlyingVaults;

    if (vault.rounds) {
      const roundWithDeposits = vault.rounds.filter(
        (r) => r.depositTickets && r.depositTickets.length
      );

      if (roundWithDeposits.length) personalVaults.push(vault);
    }
  }

  return {
    vaultsByUnderlying,
    availableUnderlyings,
    personalVaults,
  };
}

export { groupVaultsByUnderlyingAndDeposit };
