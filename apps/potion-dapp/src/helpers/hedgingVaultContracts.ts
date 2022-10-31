import { Deployments } from "@potion-protocol/hedging-vault";
import multivault from "@potion-protocol/hedging-vault/multivault.json";
import { ethereumNetwork } from "./";

let contractsAddresses = {};
// TODO: we will need to change the format to include also the contracts for deferred deposit and withdraw
const multiVaultAddresses: Array<{
  vault: string;
  potionBuyAction: string;
  roundsInputVault?: string;
  roundsOutputVault?: string;
  swapToUSDCAction?: string;
  hedgingVaultOrchestrator?: string;
  usdc?: string;
}> = multivault.slice(); // slice it to duplicate it and update the pointer
// ASCII range for uppercase letters is [65,90]
const BASE_ASCII_INDEX = 65;
const MULTIVAULT_BASE_NAME = "localhost.multivault";
if (ethereumNetwork === "localhost.hedging") {
  let baseIndex = BASE_ASCII_INDEX;
  do {
    // get a name in the form of 'localhost.multivault-{LETTER}' where letter is in the range of [A, Z]
    const deploymentName = MULTIVAULT_BASE_NAME.concat(
      String.fromCharCode(baseIndex)
    );
    //@ts-expect-error iterator is not defined
    const deployment = Deployments[deploymentName];
    if (deployment && deployment.contracts) {
      _setContractsForVault(deployment.contracts);
    } else {
      // Exit after the first fail
      break;
    }

    baseIndex++;
  } while (baseIndex < 91);

  const localhostHedging = Deployments[ethereumNetwork].contracts;
  _setContractsForVault(localhostHedging);
  console.log("MULTI ADDR", multiVaultAddresses);
} else if (ethereumNetwork.match(/^localhost/gi)) {
  throw new Error(
    `Deployment: ${ethereumNetwork} is not supported for local development of the hedging vault`
  );
} else {
  //@ts-expect-error iterator is not defined
  contractsAddresses = Deployments[ethereumNetwork].contracts;
}

function getPotionBuyActionFromVault(vault: string): string {
  const data = multiVaultAddresses.find((mv) => mv.vault === vault);
  if (data) {
    return data.potionBuyAction;
  }
  throw `${vault} isn't a recognized vault`;
}

function getContractsFromVault(vault: string) {
  const data = multiVaultAddresses.find(
    (mv) => mv.vault === vault.toLowerCase()
  );
  if (data) {
    return data;
  }
  throw `${vault} isn't a recognized vault`;
}

function _setContractsForVault(deployment: any): void {
  const vault = deployment.InvestmentVault.address.toLowerCase();
  const data = multiVaultAddresses.find((mv) => mv.vault === vault);
  if (!data) {
    multiVaultAddresses.push({
      vault: deployment.InvestmentVault.address.toLowerCase(),
      roundsInputVault: deployment.RoundsInputVault.address.toLowerCase(),
      roundsOutputVault: deployment.RoundsOutputVault.address.toLowerCase(),
      potionBuyAction: deployment.PotionBuyAction?.address.toLowerCase(),
      swapToUSDCAction: deployment.SwapToUSDCAction?.address.toLowerCase(),
      hedgingVaultOrchestrator:
        deployment.HedgingVaultOrchestrator.address.toLowerCase(),
      usdc: deployment.USDC?.address.toLowerCase(),
    });
  }
}

export {
  contractsAddresses,
  multiVaultAddresses,
  getPotionBuyActionFromVault,
  getContractsFromVault,
};
