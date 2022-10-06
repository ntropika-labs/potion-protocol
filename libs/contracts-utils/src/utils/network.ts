import { config as dotenvConfig } from "dotenv";
import { network } from "hardhat";
import { resolve } from "path";

dotenvConfig({ path: resolve(__dirname, "../../.env") });

/**
 * Returns the network name used by hardat
 *
 * @returns {string} The network name
 *
 * @dev The network name is the vanilla version of the network, this is something like
 * "hardhat", "localhost", "ropsten" or "rinkeby", and it is the one used by the `hardhat.config.ts`
 *  and `hardhat.helpers.ts` files
 */
export function getHardhatNetworkName() {
  return network.name;
}

/**
 * Returns the network name used by the deployment configuration
 *
 * @returns {string} The network name
 *
 * @dev This network name is the moified network name, including the network suffix if it is defined
 * in the .env file. This modified network name is used to distinguish different deployments of the same
 * network, like for example the `goerli.independent` deployment
 */
export function getDeploymentsNetworkName() {
  if (process.env.NETWORK_SUFFIX) {
    return network.name + "." + process.env.NETWORK_SUFFIX;
  } else {
    return network.name;
  }
}
