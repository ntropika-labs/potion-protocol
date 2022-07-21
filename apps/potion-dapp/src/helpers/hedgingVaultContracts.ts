import { Deployments } from "@potion-protocol/hedging-vault";

import { ethereumNetwork } from "./";

//@ts-expect-error iterator is not defined
export const contractsAddresses = Deployments[ethereumNetwork].contracts;
